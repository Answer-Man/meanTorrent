'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  Maker = mongoose.model('Maker'),
  Rating = mongoose.model('Rating'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  traceLogCreate = require(path.resolve('./config/lib/tracelog')).create;

var traceConfig = config.meanTorrentConfig.trace;
var mtDebug = require(path.resolve('./config/lib/debug'));

/**
 * Create an maker
 */
exports.create = function (req, res) {
  if (req.user.isOper) {
    var user = req.model;
    var maker = new Maker(req.body);

    maker.user = user._id;
    maker.members.push(user._id);

    mtDebug.debugRed(maker);

    maker.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        //save user`s maker
        user.makers.push(maker);
        user.save(function (err) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(user);
          }
        });

        //create trace log
        traceLogCreate(req, traceConfig.action.OperCreateMakerGroup, {
          user: user._id,
          name: maker.name
        });
      }
    });
  } else {
    return res.status(403).json({
      message: 'ERROR: User is not authorized'
    });
  }
};

/**
 * Show the current maker
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var maker = req.maker ? req.maker.toJSON() : {};

  maker.isCurrentUserOwner = !!(req.user && maker.user && maker.user._id.toString() === req.user._id.toString());

  res.json(maker);
};

/**
 * Update an maker
 */
exports.update = function (req, res) {
  var maker = req.maker;

  maker.name = req.body.name;
  maker.desc = req.body.desc;

  maker.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(maker);
    }
  });
};

/**
 * Delete an maker
 */
exports.delete = function (req, res) {
  var maker = req.maker;

  maker.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(maker);
    }
  });
};

/**
 * List of makers
 */
exports.list = function (req, res) {
  Maker.find()
    .sort('-torrent_count')
    .populate('user', 'username displayName profileImageURL isVip')
    .populate('members', 'username displayName profileImageURL isVip')
    .exec(function (err, makers) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(makers);
      }
    });
};

/**
 * rating
 * @param req
 * @param res
 */
exports.rating = function (req, res) {
  var user = req.user;
  var exist = false;
  var maker = req.maker;
  var rat = new Rating();
  rat.user = req.user;
  rat.vote = req.query.vote;

  mtDebug.debugGreen(rat);
  //check if already exist
  exist = false;
  maker._ratings.forEach(function (r) {
    if (r.user._id.equals(user._id)) {
      exist = true;
    }
  });
  if (exist) {
    return res.status(422).send({
      message: 'ALREADY_RATING'
    });
  } else {
    maker._ratings.push(rat);
    maker.vote_count = parseInt(maker.vote_count, 10) + 1;
    maker.vote_total = parseInt(maker.vote_total, 10) + rat.vote;
    maker.vote_average = Math.floor((maker.vote_total / maker.vote_count) * 10) / 10;
    mtDebug.debugGreen(maker);

    maker.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(maker);
      }
    });
  }
};

/**
 * addMember
 * @param req
 * @param res
 */
exports.addMember = function (req, res) {
  var maker = req.maker;
  var mu = req.nameuser;

  var om = [];
  maker.members.forEach(function (m) {
    om.push(m._id.toString());
  });

  if (om.indexOf(mu._id.toString()) >= 0) {
    return res.status(422).send({
      message: 'username "' + mu.username + '" already exist!'
    });
  } else {
    maker.members.push(mu);
    maker.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(maker);

        //save user`s maker
        if (!mu.makers) {
          mu.makers = [];
        }
        mu.makers.push(maker);
        mu.save();
      }
    });
  }
};

/**
 * removeMember
 * @param req
 * @param res
 * @returns {*}
 */
exports.removeMember = function (req, res) {
  var maker = req.maker;
  var mu = req.nameuser;

  var om = [];
  maker.members.forEach(function (m) {
    om.push(m._id.toString());
  });

  if (om.indexOf(mu._id.toString()) < 0) {
    return res.status(422).send({
      message: 'username "' + mu.username + '" not exist!'
    });
  } else {
    maker.members.splice(om.indexOf(mu._id.toString()), 1);
    maker.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(maker);

        //save user`s maker
        if (mu.makers) {
          if (mu.makers.indexOf(maker._id) >= 0) {
            mu.makers.splice(mu.makers.indexOf(maker._id), 1);
            mu.save();
          }
        }
      }
    });
  }
};

/**
 * Maker middleware
 */
exports.makerByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Maker is invalid'
    });
  }

  Maker.findById(id)
    .populate('user', 'username displayName profileImageURL isVip')
    .populate('members', 'username displayName profileImageURL isVip')
    .populate('_ratings.user', 'username displayName profileImageURL isVip uploaded downloaded')
    .exec(function (err, maker) {
      if (err) {
        return next(err);
      } else if (!maker) {
        return res.status(404).send({
          message: 'No maker with that identifier has been found'
        });
      }
      req.maker = maker;
      next();
    });
};
