(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsTopicController', ForumsTopicController);

  ForumsTopicController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'MeanTorrentConfig', 'ForumsService', 'ScoreLevelService', '$timeout', 'NotifycationService',
    'marked', 'ModalConfirmService', '$stateParams', 'TopicsService', 'localStorageService', '$compile', 'RepliesService'];

  function ForumsTopicController($scope, $state, $translate, Authentication, MeanTorrentConfig, ForumsService, ScoreLevelService, $timeout, NotifycationService,
                                 marked, ModalConfirmService, $stateParams, TopicsService, localStorageService, $compile, RepliesService) {
    var vm = this;
    vm.forumsConfig = MeanTorrentConfig.meanTorrentConfig.forumsConfig;
    vm.user = Authentication.user;
    vm.forumPath = [];

    /**
     * If user is not signed in then redirect back home
     */
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

    /**
     * init
     */
    vm.init = function () {
      // get forum info by state params
      ForumsService.get({
        forumId: $stateParams.forumId
      }, function (item) {
        vm.forum = item;

        vm.forumPath.splice(0, 0, {name: vm.forum.name, state: 'forums.view', params: {forumId: vm.forum._id}});
      });

      // get topics
      TopicsService.get({
        forumId: $stateParams.forumId,
        topicId: $stateParams.topicId
      }, function (topic) {
        console.log(topic);
        vm.topic = topic;

        vm.forumPath.push({name: topic.title, state: undefined});
      });

    };

    /**
     * getTopicContent
     * @param t
     * @returns {*}
     */
    vm.getTopicContent = function (t) {
      if (t) {
        return marked(t.content, {sanitize: true});
      }
    };

    /**
     * getUserScoreLevel
     * @param u
     * @returns {*|l}
     */
    vm.getUserScoreLevel = function (u) {
      var s = ScoreLevelService.getScoreLevelJson(vm.user.score);
      return s.currLevel;
    };

    /**
     * isTopicOwner
     * @param t
     * @returns {boolean}
     */
    vm.isOwner = function (t) {
      if (t) {
        if (t.user._id.str === vm.user._id) {
          return true;
        } else {
          return false;
        }
      }
    };

    /**
     * canEditTopic
     * @param t
     * @returns {boolean}
     */
    vm.canEdit = function (t) {
      if (t) {
        if (vm.isOwner(t) || vm.user.isOper) {
          return true;
        } else {
          return false;
        }
      }
    };

    /**
     * beginEditTopic
     * @param t
     */
    vm.beginEditTopic = function (t) {
      var el = $('#' + t._id);

      el.markdown({
        autofocus: true,
        savable: true,
        hideable: true,
        iconlibrary: 'fa',
        resize: 'vertical',
        language: localStorageService.get('storage_user_lang'),
        fullscreen: {enable: false},
        onSave: function (e) {
          if (e.isDirty()) {
            //save content
            t.content = e.getContent();
            t.$update(function (res) {
              vm.topic = res;
              NotifycationService.showSuccessNotify('FORUMS.TOPIC_EDIT_SUCCESSFULLY');
            }, function (res) {
              NotifycationService.showErrorNotify(res.data.message, 'FORUMS.TOPIC_EDIT_FAILED');
            });

            e.$options.hideable = true;
            e.blur();
          } else {
            e.$options.hideable = true;
            e.blur();
          }
        },
        onChange: function (e) {
          e.$options.hideable = false;
        },
        onShow: function (e) {
          e.setContent(t.content);

          $('.md-footer').addClass('text-right');
          $('.md-footer')[0].childNodes[0].innerText = $translate.instant('FORUMS.BTN_SAVE');

          var cbtn = angular.element('<button class="btn btn-success margin-left-10">' + $translate.instant('FORUMS.BTN_CANCEL') + '</button>');
          cbtn.bind('click', function (evt) {
            e.$options.hideable = true;
            e.blur();
          });
          $('.md-footer').append(cbtn);
          $compile($('.md-footer').contents())($scope);
        }
      });
    };

    /**
     * beginDeleteTopic
     * @param t
     */
    vm.beginDeleteTopic = function (t) {
      var modalOptions = {
        closeButtonText: $translate.instant('FORUMS.DELETE_TOPIC_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('FORUMS.DELETE_TOPIC_CONFIRM_OK'),
        headerText: $translate.instant('FORUMS.DELETE_TOPIC_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('FORUMS.DELETE_TOPIC_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          vm.topic.$remove(function (res) {
            NotifycationService.showSuccessNotify('FORUMS.DELETE_TOPIC_SUCCESSFULLY');
            $state.go('forums.view', {forumId: vm.forum._id});
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'FORUMS.DELETE_TOPIC_FAILED');
          });
        });
    };

    /**
     * beginDeleteReply
     * @param reply
     */
    vm.beginDeleteReply = function (reply) {
      var modalOptions = {
        closeButtonText: $translate.instant('FORUMS.DELETE_TOPIC_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('FORUMS.DELETE_TOPIC_CONFIRM_OK'),
        headerText: $translate.instant('FORUMS.DELETE_REPLY_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('FORUMS.DELETE_REPLY_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          RepliesService.remove({
            forumId: vm.forum._id,
            topicId: vm.topic._id,
            replyId: reply._id
          }, function (res) {
            vm.topic = res;
            NotifycationService.showSuccessNotify('FORUMS.DELETE_REPLY_SUCCESSFULLY');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'FORUMS.DELETE_REPLY_FAILED');
          });
        });
    };

    /**
     * beginPostReply
     */
    vm.beginPostReply = function () {
      vm.scrollToReply = true;
      $('#postReplyContent').focus();
      $timeout(function () {
        vm.scrollToReply = false;
      }, 500);
    };

    /**
     * postReply
     * @param isValid
     * @returns {boolean}
     */
    vm.postReply = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.replyForm');
        return false;
      }

      var reply = new RepliesService(vm.postReplyFields);
      reply.forum = vm.forum._id;
      reply.topic = vm.topic._id;

      reply.$save(function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        vm.postReplyFields = {};
        vm.topic = res;
        $scope.$broadcast('show-errors-reset', 'vm.replyForm');
        NotifycationService.showSuccessNotify('FORUMS.POST_REPLY_SUCCESSFULLY');
      }

      function errorCallback(res) {
        NotifycationService.showErrorNotify(res.data.message, 'FORUMS.POST_REPLY_FAILED');
      }
    };
  }
}());
