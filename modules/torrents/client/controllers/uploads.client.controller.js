(function () {
  'use strict';

  angular
    .module('torrents')
    .controller('TorrentsUploadController', TorrentsUploadController);

  TorrentsUploadController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', 'MeanTorrentConfig', 'Upload', 'Notification',
    'TorrentsService', 'getStorageLangService', '$filter', 'DownloadService', 'DebugConsoleService', 'NotifycationService', 'SideOverlay'];

  function TorrentsUploadController($scope, $state, $translate, $timeout, Authentication, MeanTorrentConfig, Upload, Notification,
                                    TorrentsService, getStorageLangService, $filter, DownloadService, mtDebug, NotifycationService, SideOverlay) {
    var vm = this;
    vm.announceConfig = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;
    vm.imdbConfig = MeanTorrentConfig.meanTorrentConfig.imdbConfig;
    vm.resourcesTags = MeanTorrentConfig.meanTorrentConfig.resourcesTags;
    vm.torrentType = MeanTorrentConfig.meanTorrentConfig.torrentType;
    vm.lang = getStorageLangService.getLang();
    vm.user = Authentication.user;
    vm.progress = 0;
    vm.torrentInfo = null;
    vm.tags = [];
    vm.maker = 'NULL';
    vm.videoNfo = '';
    vm.customTorrent = {};

    /**
     * upload
     * @param dataUrl
     */
    vm.upload = function (dataUrl) {
      mtDebug.info(dataUrl);

      if (dataUrl === null || dataUrl === undefined) {
        vm.fileSelected = false;
        Notification.info({
          message: '<i class="glyphicon glyphicon-info-sign"></i> ' + $translate.instant('TORRENTS_NO_FILE_SELECTED')
        });
        return;
      }

      Upload.upload({
        url: '/api/torrents/upload',
        data: {
          newTorrentFile: dataUrl
        }
      }).then(function (response) {
        $timeout(function () {
          onSuccessItem(response);
        });
      }, function (response) {
        mtDebug.info(response);
        if (response.status > 0) onErrorItem(response);
      }, function (evt) {
        vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
    };

    /**
     * onSuccessItem
     * @param response
     */
    function onSuccessItem(response) {
      vm.fileSelected = false;
      vm.successfully = true;
      // Show success message
      mtDebug.info(response);
      vm.torrentInfo = response.data;
      Notification.success({
        message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENTS_UPLOAD_SUCCESSFULLY')
      });
    }

    /**
     * onErrorItem
     * @param response
     */
    function onErrorItem(response) {
      vm.fileSelected = false;
      vm.successfully = false;
      vm.tFile = undefined;
      // Show error message
      Notification.error({
        message: response.data,
        title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENTS_UPLOAD_FAILED')
      });
    }

    /**
     * uploadCustomTorrentCover
     * @param dataUrl
     */
    vm.uploadCustomTorrentCover = function (dataUrl) {
      mtDebug.info(dataUrl);

      if (dataUrl === null || dataUrl === undefined) {
        vm.customTorrent.fileSelected = false;
        Notification.info({
          message: '<i class="glyphicon glyphicon-info-sign"></i> ' + $translate.instant('TORRENTS_NO_FILE_SELECTED')
        });
        return;
      }

      Upload.upload({
        url: '/api/torrents/uploadTorrentCover',
        data: {
          newTorrentCoverFile: dataUrl
        }
      }).then(function (response) {
        vm.customTorrent.fileSelected = false;
        vm.customTorrent.successfully = true;
        mtDebug.info(response);
        vm.customTorrent.coverFileName = response.data.filename;
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('COVER_UPLOAD_SUCCESSFULLY')
        });
      }, function (response) {
        mtDebug.info(response);
        if (response.status > 0) {
          vm.customTorrent.fileSelected = false;
          vm.customTorrent.successfully = false;
          vm.customTorrent.coverFile = undefined;
          Notification.error({
            message: response.data,
            title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('COVER_UPLOAD_FAILED')
          });
        }
      }, function (evt) {
        vm.customTorrent.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
    };

    /**
     * uploadTorrentImage
     * @param editor
     * @param ufile
     * @param progressback
     * @param callback
     * @param errback
     */
    vm.uploadTorrentImage = function (editor, ufile, progressback, callback, errback) {
      Upload.upload({
        url: '/api/torrents/uploadTorrentImage',
        data: {
          newTorrentImageFile: ufile
        }
      }).then(function (res) {
        if (callback) {
          callback(res.data.filename);
        }
      }, function (res) {
        if (errback && res.status > 0) {
          errback(res);
        }
      }, function (evt) {
        if (progressback) {
          progressback(parseInt(100.0 * evt.loaded / evt.total, 10));
        }
      });
    };

    /**
     * onTMDBIDKeyDown
     * @param evt
     */
    vm.onTMDBIDKeyDown = function (evt) {
      if (evt.keyCode === 13) {
        $timeout(function () {
          angular.element('#btnGetTMDBInfo').triggerHandler('click');
        }, 0);
      }
    };

    /**
     * onSearchKeyDown
     * @param evt
     */
    vm.onSearchKeyDown = function (evt) {
      if (evt.keyCode === 13) {
        $timeout(function () {
          angular.element('#btnSearchFromTMDB').triggerHandler('click');
        }, 0);
      }
    };

    /**
     * onTextClick
     * @param $event
     */
    vm.onTextClick = function ($event) {
      $event.target.select();
    };

    /**
     * onTorrentTypeChanged
     */
    vm.onTorrentTypeChanged = function () {
      vm.tmdb_isloading = false;
      vm.tmdb_info_ok = undefined;

      vm.inputedEpisodesError = undefined;
      vm.inputedEpisodesOK = false;
      vm.showResourcesTag = false;

      vm.movieinfo = undefined;
      vm.tvinfo = undefined;
      vm.tmdb_id = undefined;

      vm.tags = [];
      vm.videoNfo = '';
      vm.customTorrent = {};

      vm.showVideoNfo = false;
      vm.showAgreeAndSubmit = false;
    };

    /**
     * getIncludeUploadTemplateID
     * @param st
     */
    vm.getIncludeUploadTemplateID = function (st) {
      var inc = 'default';
      angular.forEach(vm.torrentType.value, function (tc) {
        if (tc.value === st) {
          inc = tc.uploadTemplateID;
        }
      });

      return inc;
    };

    /**
     * getMovieInfo
     * @param tmdbid
     */
    vm.getMovieInfo = function (tmdbid) {
      if (tmdbid === null || tmdbid === undefined) {
        Notification.info({
          message: '<i class="glyphicon glyphicon-info-sign"></i> ' + $translate.instant('TMDB_ID_REQUIRED')
        });
        angular.element('#tmdbid').focus();
        return;
      }

      vm.tmdb_isloading = true;
      vm.tmdb_info_ok = undefined;
      TorrentsService.getTMDBMovieInfo({
        tmdbid: tmdbid,
        language: getStorageLangService.getLang()
      }, function (res) {
        vm.tmdb_info_ok = true;
        vm.tmdb_isloading = false;
        vm.showResourcesTag = true;
        vm.showVideoNfo = true;
        vm.showAgreeAndSubmit = true;
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TMDB_ID_OK')
        });

        mtDebug.info(res);
        vm.movieinfo = res;

        vm.movieinfo.release_date = $filter('date')(vm.movieinfo.release_date, 'yyyy');
      }, function (err) {
        vm.tmdb_info_ok = false;
        vm.tmdb_isloading = false;
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TMDB_ID_ERROR')
        });
        angular.element('#tmdbid').focus();
      });
    };

    /**
     * getTVInfo
     * @param tmdbid
     */
    vm.getTVInfo = function (tmdbid) {
      if (tmdbid === null || tmdbid === undefined) {
        Notification.info({
          message: '<i class="glyphicon glyphicon-info-sign"></i> ' + $translate.instant('TMDB_ID_REQUIRED')
        });
        angular.element('#tmdbid').focus();
        return;
      }

      vm.tmdb_isloading = true;
      vm.tmdb_info_ok = undefined;
      TorrentsService.getTMDBTVInfo({
        tmdbid: tmdbid,
        language: getStorageLangService.getLang()
      }, function (res) {
        vm.tmdb_info_ok = true;
        vm.tmdb_isloading = false;
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TMDB_ID_OK')
        });

        mtDebug.info(res);
        vm.tvinfo = res;
        if (parseInt(vm.tvinfo.number_of_seasons, 10) > 0) {
          vm.selectedSeasons = '1';
        }
      }, function (err) {
        vm.tmdb_info_ok = false;
        vm.tmdb_isloading = false;
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TMDB_ID_ERROR')
        });
        angular.element('#tmdbid').focus();
      });
    };

    /**
     * tvContinue
     * @param isValid
     * @returns {boolean}
     */
    vm.tvContinue = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.episodesForm');

        vm.inputedEpisodesError = true;
        return false;
      } else {
        vm.inputedEpisodesError = false;
        vm.inputedEpisodesOK = true;
        vm.showResourcesTag = true;
        vm.showVideoNfo = true;
        vm.showAgreeAndSubmit = true;
      }
    };

    /**
     * create
     */
    vm.create = function () {
      mtDebug.info(vm.torrentInfo);

      switch (vm.selectedType) {
        case 'movie':
          vm.createMovieTorrent();
          break;
        case 'tvserial':
          vm.createTVTorrent();
          break;
        case 'tvdrama':
          vm.createTVTorrent();
          break;
        default:
          vm.createCustomTorrentTorrent();
      }
    };

    /**
     * createMovieTorrent
     */
    vm.createMovieTorrent = function () {
      var l = vm.getTorrentSize();
      var t = vm.getResourceTag();

      var torrent = new TorrentsService({
        info_hash: vm.torrentInfo.info_hash,
        maker: vm.maker === 'NULL' ? undefined : vm.maker,
        torrent_filename: vm.torrentInfo.filename,
        torrent_type: 'movie',
        torrent_tags: t,
        torrent_nfo: vm.videoNfo,
        torrent_announce: vm.torrentInfo.announce,
        torrent_size: l,

        resource_detail_info: vm.movieinfo
      });

      torrent.$save(function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Torrent created successfully!'});

        $state.reload('torrents.uploads');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }

      function errorCallback(res) {
        vm.error_msg = res.data.message;
        Notification.error({message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Torrent created error!'});
      }
    };

    /**
     * createTvTorrent
     */
    vm.createTVTorrent = function () {
      var l = vm.getTorrentSize();
      var t = vm.getResourceTag();

      var torrent = new TorrentsService({
        info_hash: vm.torrentInfo.info_hash,
        maker: vm.maker === 'NULL' ? undefined : vm.maker,
        torrent_filename: vm.torrentInfo.filename,
        torrent_type: 'tvserial',
        torrent_seasons: vm.selectedSeasons,
        torrent_episodes: vm.inputedEpisodes,
        torrent_tags: t,
        torrent_nfo: vm.videoNfo,
        torrent_announce: vm.torrentInfo.announce,
        torrent_size: l,

        resource_detail_info: vm.tvinfo
      });

      torrent.$save(function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Torrent created successfully!'});

        $state.reload('torrents.uploads');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }

      function errorCallback(res) {
        vm.error_msg = res.data.message;
        Notification.error({message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Torrent created error!'});
      }
    };

    /**
     * createTvDrama
     */
    vm.createTVTorrent = function () {
      var l = vm.getTorrentSize();
      var t = vm.getResourceTag();

      var torrent = new TorrentsService({
        info_hash: vm.torrentInfo.info_hash,
        maker: vm.maker === 'NULL' ? undefined : vm.maker,
        torrent_filename: vm.torrentInfo.filename,
        torrent_type: 'tvdrama',
        torrent_seasons: vm.selectedSeasons,
        torrent_episodes: vm.inputedEpisodes,
        torrent_tags: t,
        torrent_nfo: vm.videoNfo,
        torrent_announce: vm.torrentInfo.announce,
        torrent_size: l,

        resource_detail_info: vm.tvinfo
      });

      torrent.$save(function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Torrent created successfully!'});

        $state.reload('torrents.uploads');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }

      function errorCallback(res) {
        vm.error_msg = res.data.message;
        Notification.error({message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Torrent created error!'});
      }
    };

    /**
     * createCustomTorrentTorrent
     */
    vm.createCustomTorrentTorrent = function () {
      var l = vm.getTorrentSize();
      var t = vm.getResourceTag();

      var detail_info = {
        artist: vm.customTorrent.artist || undefined,
        title: vm.customTorrent.title,
        subtitle: vm.customTorrent.subtitle,
        cover: vm.customTorrent.coverFileName,
        overview: vm.customTorrent.detail,

        vote_average: 0,
        vote_total: 0,
        vote_count: 0
      };

      mtDebug.info($scope.uImages);
      var uimg = [];
      angular.forEach($scope.uImages, function (f) {
        mtDebug.info(f);
        uimg.push(f.name);
      });

      var torrent = new TorrentsService({
        info_hash: vm.torrentInfo.info_hash,
        maker: vm.maker === 'NULL' ? undefined : vm.maker,
        torrent_filename: vm.torrentInfo.filename,
        torrent_type: vm.selectedType,
        torrent_tags: t,
        torrent_nfo: vm.videoNfo,
        torrent_announce: vm.torrentInfo.announce,
        torrent_size: l,

        resource_detail_info: detail_info,
        _uImage: uimg
      });

      mtDebug.info(torrent);

      torrent.$save(function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Torrent created successfully!'});

        $state.reload('torrents.uploads');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }

      function errorCallback(res) {
        vm.error_msg = res.data.message;
        Notification.error({message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Torrent created error!'});
      }
    };

    /**
     * getTorrentSize
     * @returns {number}
     */
    vm.getTorrentSize = function () {
      var l = 0;

      if (vm.torrentInfo.length !== undefined) {
        l = vm.torrentInfo.length;
      } else if (vm.torrentInfo.info.length !== undefined) {
        l = vm.torrentInfo.info.length;
      } else {
        angular.forEach(vm.torrentInfo.info.files, function (item) {
          l = l + item.length;
        });
      }

      return l;
    };

    /**
     * getResourceTag
     * @returns {Array}
     */
    vm.getResourceTag = function () {
      var t = [];

      angular.forEach(vm.resourcesTags.radio, function (item) {
        if (vm.tags['tag_' + item.name]) {
          t.push(vm.tags['tag_' + item.name]);
        }
      });
      angular.forEach(vm.resourcesTags.checkbox, function (item) {
        angular.forEach(item.value, function (sitem) {
          if (vm.tags['tag_' + item.name + '_' + sitem.name]) {
            t.push(sitem.name);
          }
        });
      });

      return t;
    };

    /**
     * cancel
     */
    vm.cancel = function () {
      $state.reload('torrents.uploads');
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    };

    /**
     * clearAllCondition
     */
    vm.clearAllCondition = function () {
      vm.tags = [];
    };

    /**
     * needShowNFO
     * @param t
     */
    vm.needShowNFO = function (t) {
      var sh = false;
      switch (t) {
        case 'movie':
        case 'tvserial':
        case 'tvdrama':
        case 'music':
        case 'sports':
        case 'variety':
          sh = true;
          break;
        default:
          sh = false;
      }

      return sh;
    };

    /**
     * beginSearchFromTMDB
     * @param evt
     */
    vm.beginSearchFromTMDB = function (evt) {
      vm.search = {};
      SideOverlay.open(evt, 'searchFromTMDBSlide');
    };

    /**
     * hideSearchPopup
     */
    vm.hideSearchPopup = function () {
      SideOverlay.close(null, 'searchFromTMDBSlide');
    };

    /**
     * searchFromTMDB
     */
    vm.searchFromTMDB = function () {
      vm.search.status_msg = 'LOAD_SEARCH_RESULT';
      vm.search.status = 'loading';
      vm.search.searchItems = undefined;

      mtDebug.info(vm.search.keys);

      TorrentsService.searchMovie({
        language: getStorageLangService.getLang(),
        query: vm.search.keys,
        type: vm.selectedType
      }, function (res) {
        mtDebug.info(res);

        vm.search.searchItems = res.results;
        vm.search.totalItems = res.total_results;
        vm.search.status = 'ok';
      }, function (err) {
        vm.search.status_msg = 'LOAD_SEARCH_RESULT_ERROR';
        vm.search.status = 'error';
      });
    };

    /**
     * onSelectResult
     */
    vm.onSelectResult = function () {
      vm.tmdb_id = parseInt(vm.search.sid, 10);
      SideOverlay.close(null, 'searchFromTMDBSlide');

      $timeout(function () {
        angular.element('#btnGetTMDBInfo').triggerHandler('click');
      }, 0);
    };
  }
}());
