'use strict';

module.exports = {
  meanTorrentConfig: {
    /**
     * @app
     *
     * App & site settings
     * NOTE: you can change these value at anytime if you understand it
     *
     * @domain:                 site domain
     * @showDemoWarningPopup:   if is demo site, show warning popup whene home is opened for the first time.
     * @cronTimeZone:           timezone of cron
     * @showDebugLog:           if true, will console.log all debug info at server side and client side. when your site is prod env, please change this
     *                          value to false, then console.log info is not output
     */
    app: {
      name: 'CHD.im',
      domain: 'http://chd.im:3000',
      showDemoWarningPopup: true,
      cronTimeZone: 'Asia/Shanghai',
      showDebugLog: true
    },

    /**
     * @backup
     *
     * @enable:     if true, meanTorrent will backup mongo db database data with a named '/module/core/client/backup/*.tar'
     *              at midnight every day.
     * @dir:        backup files path
     */
    backup: {
      enable: true,
      dir: './modules/backup/client/backup/'
    },

    /**
     * @language
     *
     * Multilingual support settings
     *
     * @name:   language name
     * @index:  list index in menu
     * @class:  flag icon class, can find flag icon at '/public/lib/flag-icon-css/flags'
     * @title:  language title show in menu item
     *
     */
    language: [
      {name: 'en', index: 0, class: 'flag-icon-gb', title: 'English'},
      {name: 'zh', index: 1, class: 'flag-icon-cn', title: '中文'}
    ],

    /**
     * @announce
     *
     * tracker server announce settings
     * NOTE: you can change these value at anytime if you understand it
     *
     * @url:                    announce url, download client will request this url to report uploads and downloads data
     * @comment:                used in admin tools, auto replace torrent make group info with this setting
     * @announceInterval:       interval of twice announce request
     * @announcePrefix:         prefix of torrent file name, is will auto add when user download the torrent files
     * @admin:                  site admin mail address
     * @baseUrl:                torrent announce url base url, system will check it when user upload torrent file
     * @clientBlackListUrl:     forbidden download client list url, user can view this list to check forbidden client software
     * @privateTorrentCmsMode:  meanTorrent default tracker server mode is private (value true), the tracker server only accept private mode.
     *                          but, you can set this value to false to make a public torrent cms web site without tracker server and announce function.
     *                          if this value is false(public mode), server can scrape all torrent status from owner tracker server
     */
    announce: {
      url: 'http://chd.im:3000/announce',
      comment: 'meanTorrent group',
      announceInterval: 60 * 1000,
      announcePrefix: '{CHD.im}.',
      admin: 'admin@chd.im',
      baseUrl: 'http://chd.im:3000',
      clientBlackListUrl: '/about/black',
      privateTorrentCmsMode: true
    },

    /**
     * @scrapeTorrentsStatus
     *
     * This option used only when public cms mode (announce.privateTorrentCmsMode = false),
     * This defines the timing of scrape torrent status from other tracker server
     * NOTE: you can change these value at anytime if you understand it
     *
     * @scrapeInterval:     scrape interval with torrent last_scrape, Avoid frequent scrape, unit in hours
     * @onTorrentUpload:    scrape status at server side when the torrent uploaded by a user (= init the status info)
     * @onTorrentInHome:    scrape each torrent status at client side when load into home page (= update the status info)
     * @onTorrentInList:    scrape each torrent status at client side when load into torrent list page (= update the status info)
     *                      if too more items list in one page, this will make efficiency very low
     * @onTorrentInDetail:  scrape current torrent status at client side when load torrent detail info,
     *                      if onTorrentInHome and onTorrentInList is true, this value recommend to false
     */
    scrapeTorrentStatus: {
      scrapeInterval: 2,
      onTorrentUpload: true,
      onTorrentInHome: true,
      onTorrentInList: true,
      onTorrentInDetail: false
    },

    /**
     * @ircAnnounce
     *
     * IRC announce server settings
     * NOTE: you can change these value at anytime if you understand it
     *
     * @enable:             enable irc announce
     * @debug:              debug mode, more info will log out by console
     * @server:             IRC server address
     * @port:               IRC server port
     * @nick:               IRC announce user nick name, needed with IRC protocol
     * @userName:           IRC announce user username, needed with IRC protocol
     * @realName:           IRC announce user realName, needed with IRC protocol
     * @channel:            IRC announce channel name, the message will send to the appointed channel
     * @defaultMsgFormat:   the default announce message format
     * @tvserialMsgFormat:  the custom announce message format of tv serial type torrent
     * @showErrors:         log and show error info when some error happened
     * @autoRejoin:         auto rejoin into the channel when some event happened cause user part the announce channel
     * @autoConnect:        auto connect & reconnect to IRC server when disconnect from IRC server
     * @retryCount:         reconnect retry times
     * @retryDelay:         reconnect retry delay time, unit in millisecond
     * @encoding:           IRC announce message encoding, default to 'UTF-8'
     */
    ircAnnounce: {
      enable: true,
      debug: false,
      server: 'chd.im',
      port: 16667,
      nick: 'chdAnnounce',
      userName: 'meanTorrent',
      realName: 'IRC announce client',
      channel: '#chdAnnounce',
      defaultMsgFormat: '%s upload - torrent: %s, type: %s, size: %d, sale: %s, at %s',
      tvserialMsgFormat: '%s upload - torrent: %s, type: %s, size: %d, seasons: %d, episodes: %s, sale: %s, at %s',
      showErrors: true,
      autoRejoin: true,
      autoConnect: true,
      retryCount: 86400,
      retryDelay: 5000,
      encoding: 'UTF-8'
    },

    /**
     * @sign
     *
     * user register settings
     * NOTE: you can change these value at anytime if you understand it
     *
     * @openSignup:                 set whether open the signup, if true, the user can signup(register) by herself,
     *                              if you create a private web site, and only accept invite to join, please set it to false.
     * @signUpActiveTokenExpires:   sign up account active expires time setting.
     * @allowSocialSignin:          meanTorrent can accept social account to signin, like google, twitter, facebook etc.
     *                              if you do not want them to login, please set it to false
     * @showMenuHeaderForGuest:     set whether show menu header for guest user(not sign in)
     * @showDemoSignMessage:        if true, will show demo sign in message in sign in page, if your site is not demo site, please set it to false
     */
    sign: {
      openSignup: true,
      signUpActiveTokenExpires: 60 * 60 * 1000 * 24,
      allowSocialSignin: false,
      showMenuHeaderForGuest: true,
      showDemoSignMessage: true
    },

    /**
     * @invite
     *
     * invite settings when sign.openSignup is false
     * NOTE: you can change these value at anytime if you understand it
     *
     * @openInvite:     if true, then any user can invite friends to join us, if false, only admin/oper can send invite mail
     * @scoreExchange:  if any user can send invite mail, the user must used score number to exchange an invite send qualifications, if the user has no
     *                  enough score, then can not send invite mail too.
     * @expires:        if user exchange an invite send qualifications, then must send it out within the expiration time
     *                  if user received an invite mail, must signin(register) within the expiration time
     *                  if exceed the expiration time, the invite send qualifications will invalid and user also can not signin(register).
     */
    invite: {
      openInvite: true,
      scoreExchange: 10000,
      expires: 60 * 60 * 1000 * 24
    },

    /**
     * @score
     *
     * score system settings
     *
     * @levelStep:        value of each level step, default 500
     * @action:           score change action list
     *        @name:      action name
     *        @value:     action score value
     *        @enable:    action enable status, if false, system will not change user`s score at this action
     * @thumbsUpScore:    thumbs up score setting
     *        @torrent:   thumbs up of torrent score change value
     *        @topic:     thumbs up of forum topic/reply score change value
     */
    score: {
      levelStep: 500,
      action: {
        signEveryday: {name: 'signEveryday', value: 10, enable: true},
        uploadTorrent: {name: 'uploadTorrent', value: 50, enable: true},
        uploadTorrentBeDeleted: {name: 'uploadTorrentBeDeleted', value: -50, enable: true},
        uploadTorrentBeRecommend: {name: 'uploadTorrentBeRecommend', value: 10, enable: true},
        uploadSubtitle: {name: 'uploadSubtitle', value: 20, enable: true},
        uploadSubtitleBeDeleted: {name: 'uploadSubtitleBeDeleted', value: -20, enable: true},

        seedAnnounce: {
          name: 'seedAnnounce',
          additionSize: 1024 * 1024 * 1024 * 10,  //10G
          perlSize: 1024 * 1024 * 1024,   //1G
          value: 5,
          enable: true
        }
      },
      thumbsUpScore: {
        torrent: 10,
        topic: 10
      }
    },

    /**
     * @messages
     *
     * site message settings
     *
     * @type:                   messages type
     *        @name:            name of messages type, used in $translate
     *        @value:           messages type value list
     *                @name:    type name
     *                @value:   type value
     * @checkUnreadInterval:    set check unread message interval, default 2 minutes
     *
     * NOTE: the first value 'user' cannot be deleted
     */
    messages: {
      type: {
        name: 'TYPE',
        value: [
          {name: 'USER', value: 'user'},
          {name: 'SYSTEM', value: 'system'},
          {name: 'ADVERT', value: 'advert'},
          {name: 'NOTICE', value: 'notice'}
        ]
      },
      checkUnreadInterval: 60 * 1000 * 2
    },

    /**
     * @trace
     *
     * system trace logs settings
     *
     * @action:         trace action list
     *        @name:    action name
     *        @enable:  action enable status, if false, system will not to trace log this action
     */
    trace: {
      action: {
        AdminUpdateUserRole: {name: 'AdminUpdateUserRole', enable: true},
        AdminUpdateUserStatus: {name: 'AdminUpdateUserStatus', enable: true},
        AdminUpdateUserScore: {name: 'AdminUpdateUserScore', enable: true},
        AdminUpdateUserUploaded: {name: 'AdminUpdateUserUploaded', enable: true},
        AdminUpdateUserDownloaded: {name: 'AdminUpdateUserDownloaded', enable: true},
        AdminUpdateUserVIPData: {name: 'AdminUpdateUserVIPData', enable: true},
        AdminUserDelete: {name: 'AdminUserDelete', enable: true},
        AdminUserEdit: {name: 'AdminUserEdit', enable: true},
        userPasswordReset: {name: 'userPasswordReset', enable: true},
        userSignUp: {name: 'userSignUp', enable: true},

        AdminTorrentDelete: {name: 'AdminTorrentDelete', enable: true},
        AdminTorrentSetSaleType: {name: 'AdminTorrentSetSaleType', enable: true},
        AdminTorrentSetRecommendLevel: {name: 'AdminTorrentSetRecommendLevel', enable: true},
        AdminCollectionSetRecommendLevel: {name: 'AdminCollectionSetRecommendLevel', enable: true},
        AdminTorrentSetReviewedStatus: {name: 'AdminTorrentSetReviewedStatus', enable: true},
        OperCreateMakerGroup: {name: 'OperCreateMakerGroup', enable: true},
        OperCreateCollection: {name: 'OperCreateCollection', enable: true},
        OperDeleteBackupFiles: {name: 'OperDeleteBackupFiles', enable: true},

        userInvitationExchange: {name: 'userInvitationExchange', enable: true},
        adminRemoveHnrWarning: {name: 'adminRemoveHnrWarning', enable: true},
        userRemoveHnrWarning: {name: 'userRemoveHnrWarning', enable: true},
        userSendInvitation: {name: 'userSendInvitation', enable: true},
        adminSendOfficialInvitation: {name: 'adminSendOfficialInvitation', enable: true},

        userAnnounceData: {name: 'userAnnounceData', enable: true},
        userScoreChange: {name: 'userScoreChange', enable: true},

        forumDeleteTopic: {name: 'forumDeleteTopic', enable: true},
        forumDeleteReply: {name: 'forumDeleteReply', enable: true}
      }
    },

    /**
     * @torrentType
     *
     * torrent type settings
     * if you need more torrent type, please add at here and config it, the system will add new type everywhere automatic
     * NOTE: don`t change these value if you can not understand it
     *
     * @name:   TYPE, do not change it
     * @value:  configure settings value of torrent type
     *
     *        @enable:            enable this type
     *        @name:              name of type, used by $translate at TORRENT_TYPE_LABEL, will show translate result as torrent tag in torrent list
     *        @value:             value of type, torrent type value in model, will write this value into mongodb and query torrents by this value
     *        @title:             title of type, used by $translate at MENU_TORRENTS_SUB, will show translate result in header submenu item
     *        @divider:           divider status of submenu item
     *        @position:          position of submenu item(ordered index)
     *        @state:             angular state of torrent type, this state value used in module route config
     *        @url:               window location url of type
     *        @pageTitle:         the page title string, used by translate at PAGETITLE
     *        @uploadTemplateID:  view templateID in upload torrent page, when selected type is changed, then include the template by this id,
     *                            all the template html is in file: modules/torrents/client/views/uploads-torrents.client.view.html
     *        @showTopListInHome: setting whether show the TOP list in site home page, if false, don`t show
     *                            the 'other' type torrent always not show in home page
     *
     * if you add a config json item, please add translate string:
     *        MENU_TORRENTS_SUB
     *        TORRENT_TYPE_LABEL
     *        PAGETITLE.*
     */
    torrentType: {
      name: 'TYPE',
      value: [
        {
          enable: true,
          name: 'MOVIE',
          value: 'movie',
          title: 'MENU_TORRENTS_SUB.MOVIE',
          divider: false,
          position: 1,
          state: 'torrents.movie',
          url: '/movie',
          pageTitle: 'MOVIE_LIST',
          uploadTemplateID: 'movie',
          showTopListInHome: true
        },
        {
          enable: true,
          name: 'TVSERIAL',
          value: 'tvserial',
          title: 'MENU_TORRENTS_SUB.TVSERIAL',
          divider: false,
          position: 2,
          state: 'torrents.tvserial',
          url: '/tv',
          pageTitle: 'TV_LIST',
          uploadTemplateID: 'tvserial',
          showTopListInHome: true
        },
        {
          enable: true,
          name: 'MUSIC',
          value: 'music',
          title: 'MENU_TORRENTS_SUB.MUSIC',
          divider: true,
          position: 3,
          state: 'torrents.music',
          url: '/music',
          pageTitle: 'MUSIC_LIST',
          uploadTemplateID: 'music',
          showTopListInHome: true
        },
        {
          enable: true,
          name: 'SPORTS',
          value: 'sports',
          title: 'MENU_TORRENTS_SUB.SPORTS',
          divider: false,
          position: 4,
          state: 'torrents.sports',
          url: '/sports',
          pageTitle: 'SPORTS_LIST',
          uploadTemplateID: 'default',
          showTopListInHome: true
        },
        {
          enable: true,
          name: 'VARIETY',
          value: 'variety',
          title: 'MENU_TORRENTS_SUB.VARIETY',
          divider: false,
          position: 5,
          state: 'torrents.variety',
          url: '/variety',
          pageTitle: 'VARIETY_LIST',
          uploadTemplateID: 'default',
          showTopListInHome: true
        },
        {
          enable: true,
          name: 'PICTURE',
          value: 'picture',
          title: 'MENU_TORRENTS_SUB.PICTURE',
          divider: false,
          position: 6,
          state: 'torrents.picture',
          url: '/picture',
          pageTitle: 'PICTURE_LIST',
          uploadTemplateID: 'default',
          showTopListInHome: true
        },
        {
          enable: true,
          name: 'GAME',
          value: 'game',
          title: 'MENU_TORRENTS_SUB.GAME',
          divider: true,
          position: 7,
          state: 'torrents.game',
          url: '/game',
          pageTitle: 'GAME_LIST',
          uploadTemplateID: 'default',
          showTopListInHome: true
        },
        {
          enable: true,
          name: 'SOFTWARE',
          value: 'software',
          title: 'MENU_TORRENTS_SUB.SOFTWARE',
          divider: false,
          position: 8,
          state: 'torrents.software',
          url: '/software',
          pageTitle: 'SOFTWARE_LIST',
          uploadTemplateID: 'default',
          showTopListInHome: true
        },
        {
          enable: true,
          name: 'EBOOK',
          value: 'ebook',
          title: 'MENU_TORRENTS_SUB.EBOOK',
          divider: false,
          position: 9,
          state: 'torrents.ebook',
          url: '/ebook',
          pageTitle: 'EBOOK_LIST',
          uploadTemplateID: 'default',
          showTopListInHome: true
        },
        {
          enable: true,
          name: 'OTHER',
          value: 'other',
          title: 'MENU_TORRENTS_SUB.OTHER',
          divider: true,
          position: 10,
          state: 'torrents.other',
          url: '/other',
          pageTitle: 'OTHER_LIST',
          uploadTemplateID: 'default',
          showTopListInHome: false
        },
        {
          enable: true,
          name: 'TVDRAMA',
          value: 'tvdrama',
          title: 'MENU_TORRENTS_SUB.TVDRAMA',
          divider: false,
          position: 11,
          state: 'torrents.tvdrama',
          url: '/tvdrama',
          pageTitle: 'TV_DRAMA',
          uploadTemplateID: 'tvdrama',
          showTopListInHome: true
        }
      ]
    },

    /**
     * @torrentStatus
     *
     * the torrent status settings
     * NOTE: don`t change these value if you can not understand it
     *
     * @name:   do not change it
     * @value:  value of status
     *
     *        @name:  name of status level, used by $translate at TORRENT_RECOMMEND_LEVEL_ITEM, will show translate result in torrent admin list
     *        @value: value of status level, will write this value into mongodb and query(search) torrents by this value
     */
    torrentStatus: {
      name: 'STATUS',
      value: [
        {name: 'NEW', value: 'new'},
        {name: 'REVIEWED', value: 'reviewed'},
        {name: 'DELETED', value: 'deleted'}
      ]
    },

    /**
     * @torrentRecommendLevel
     *
     * the torrent recommend level settings
     * NOTE: don`t change these value if you can not understand it
     *
     * @name:   do not change it
     * @value:  value of recommend level
     *
     *        @name:  name of recommend level, used by $translate at TORRENT_RECOMMEND_LEVEL_ITEM, will show translate result as torrent tag in torrent list
     *        @value: value of recommend level, will write this value into mongodb and query(search) torrents by this value
     */
    torrentRecommendLevel: {
      name: 'RECOMMENDLEVEL',
      value: [
        {name: 'LEVEL0', value: 'none'},
        {name: 'LEVEL1', value: 'level1'},
        {name: 'LEVEL2', value: 'level2'},
        {name: 'LEVEL3', value: 'level3'}
      ]
    },

    /**
     * @hitAndRun
     *
     * settings of Hit & Run system, system will auto update the warning status and number of user when client announce to tracker server
     * when admin/oper changed the torrent h&r prop to false, system will auto remove all warning and number of user
     * when admin/oper to delete a h&r torrent, system will auto remove all warning and number of user
     * NOTE: you can change these value at anytime if you understand it
     *
     * @condition:                          the condition of HnR warning, user must meet one of them before you receive the warning
     *        @seedTime:                    torrent seed time, unit of day, default to 7 days
     *        @ratio:                       seed ratio, default to 1.5
     * @forbiddenDownloadMinWarningNumber:  when user get this number of warning, then can not to download any torrents, but can continue download the warning status torrent
     * @scoreToRemoveWarning:               if user has any warning, user can remove one warning by score number, if the user has not enough score, user still can remove these
     *                                      warning by donate the VIP class.
     * @checkWaringInterval:                set check warning number interval, default 2 minutes
     */
    hitAndRun: {
      condition: {
        seedTime: 24 * 60 * 60 * 1000 * 7,
        ratio: 1.5
      },
      forbiddenDownloadMinWarningNumber: 3,
      scoreToRemoveWarning: 10000,
      checkWaringInterval: 60 * 1000 * 2
    },

    /**
     * @userStatus
     *
     * user account status setting
     * NOTE: don`t change these value if you can not understand it

     * @name:         name of status, used in $translate
     * @value:        values of user status
     *      @name:    status name
     *      @value:   status value
     *
     * banned user is banned from server, can not download any torrent and can not logon chat room
     * inactive user can not sign in, need active from email verify link
     */
    userStatus: {
      name: 'STATUS',
      value: [
        {name: 'NORMAL', value: 'normal'},
        {name: 'BANNED', value: 'banned'},
        {name: 'INACTIVE', value: 'inactive'}
      ]
    },

    /**
     * @userRoles
     *
     * user roles settings
     * NOTE: don`t change these value if you can not understand it
     *
     * user:  normal user role
     * oper:  operator user role
     * admin: admin user role, admin include oper
     */
    userRoles: ['user', 'oper', 'admin'],

    /**
     * @clientBlackList
     *
     * download client black list
     * all the list client can not announce or get any data
     *
     * @name:  client software name
     */
    clientBlackList: [
      {name: 'Transmission/2.93', type: 'client'},
      {name: 'Mozilla', type: 'browser'},
      {name: 'AppleWebKit', type: 'browser'},
      {name: 'Safari', type: 'browser'},
      {name: 'Chrome', type: 'browser'},
      {name: 'Lynx', type: 'browser'},
      {name: 'Opera', type: 'browser'}
    ],

    /**
     * @torrentSalesType
     *
     * torrent sale type setting
     *
     * @name:         name of torrent sale type, used in $translate
     * @value:        sale type value list
     *        @name:  sale item name
     *        @desc:  sale item desc
     * @expires:      sales expires time setting, this time is calc by torrent size, like: each GBit size add expires time one hour,
     *                if torrent size is 40G, then the sales expires time is set to 40 hours automatic
     */
    torrentSalesType: {
      name: 'SALESTYPE',
      value: [
        {name: 'U1/FREE', desc: 'Upload * 1, Download Free'},
        {name: 'U1/D.3', desc: 'Upload * 1, Download * 0.3'},
        {name: 'U1/D.5', desc: 'Upload * 1, Download * 0.5'},
        {name: 'U1/D.8', desc: 'Upload * 1, Download * 0.8'},
        {name: 'U1/D1', desc: 'Upload * 1, Download * 1'},
        {name: 'U2/FREE', desc: 'Upload * 2, Download Free'},
        {name: 'U2/D.3', desc: 'Upload * 2, Download * 0.3'},
        {name: 'U2/D.5', desc: 'Upload * 2, Download * 0.5'},
        {name: 'U2/D.8', desc: 'Upload * 2, Download * 0.8'},
        {name: 'U2/D1', desc: 'Upload * 2, Download * 1'},
        {name: 'U3/FREE', desc: 'Upload * 3, Download Free'},
        {name: 'U3/D.3', desc: 'Upload * 3, Download * 0.3'},
        {name: 'U3/D.5', desc: 'Upload * 3, Download * 0.5'},
        {name: 'U3/D.8', desc: 'Upload * 3, Download * 0.8'},
        {name: 'U3/D1', desc: 'Upload * 3, Download * 1'}
      ],
      expires: {size: 1024 * 1024 * 1024, time: 60 * 60 * 1000}
    },

    /**
     * @torrentSalesValue
     *
     * torrent sales settings
     *
     * @global:       number value of @torrentSalesType, like 'U2/Free' etc, this value priority torrent @torrentSalesType
     * @vip:          vip sale settings
     *        @Ur:    upload ratio, like 1.25 is upload scaling plus 25%
     *        @Dr:    download ratio
     */
    torrentSalesValue: {
      global: undefined,
      vip: {
        Ur: 1.25,
        Dr: 0
      }
    },

    /**
     * @chat
     *
     * chat settings
     * NOTE: you can change these value at anytime if you understand it
     *
     * @ban:               banned user settings
     *        @expires:    banned expires time setting, in this time, user cannot connect chat server
     */
    chat: {
      ban: {
        expires: 60 * 60 * 1000 * 1
      }
    },

    /**
     * @tmdbConfig
     *
     * movie info web www.themoviedb.com settings
     *
     * @tmdbHome:                 TMDB website home link url
     * @tmdbMovieLinkUrl:         linked url, link to movie detail info page, system get movie detail info from here
     * @tmdbTvserialLinkUrl:      linked url, link to tv serial detail info page, system get tv serial detail info from here
     * @key:                      access key fro TMDB, when u first install and runing this system, please register a key from TMDB and replace here
     * @backdropImgBaseUrl:       image link url
     * @backdropImgBaseUrl_300:   image link url
     * @backdropImgBaseUrl_780:   image link url
     * @posterImgBaseUrl:         image link url
     * @posterListBaseUrl:        image link url
     * @castImgBaseUrl:           image link url
     */
    tmdbConfig: {
      tmdbHome: 'https://www.themoviedb.org',
      tmdbMovieLinkUrl: 'https://www.themoviedb.org/movie/',
      tmdbTvserialLinkUrl: 'https://www.themoviedb.org/tv/',
      key: '7888f0042a366f63289ff571b68b7ce0',
      backdropImgBaseUrl: 'http://image.tmdb.org/t/p/w1280',
      backdropImgBaseUrl_300: 'http://image.tmdb.org/t/p/w300',
      backdropImgBaseUrl_780: 'http://image.tmdb.org/t/p/w780',
      posterImgBaseUrl: 'http://image.tmdb.org/t/p/w500',
      posterListBaseUrl: 'http://image.tmdb.org/t/p/w92',
      castImgBaseUrl: 'http://image.tmdb.org/t/p/w132_and_h132_bestv2'
    },

    /**
     * @imdbConfig
     *
     * movie info web www.imdb.com settings
     *
     * @imdbLinkUrl: linked url, will nav to imdb website
     */
    imdbConfig: {
      imdbLinkUrl: 'http://www.imdb.com/title/'
    },

    /**
     * @voteTitle
     *
     * vote title string settings
     *
     * @imdb:   imdb vote label string
     * @mt:     meanTorrent system vote label string
     */
    voteTitle: {
      imdb: 'IMDB',
      mt: 'CHD'
    },

    /**
     * @forumsConfig
     *
     * forums configure settings
     * here is only configure the forum category, if you want to add some sub discussion area, please into admin menu -> forums configure
     * NOTE: you can change these value at anytime if you understand it
     *
     * @category:               forums category
     *        @name:            name of forum category, for a new item, please add a translate string at 'FORUMS->CATEGORY'
     *        @value:           value of forum category
     *        @index:           list order index of forum category
     *        @roles:           limit access for user type
     *        @isVip:           set whether is only for VIP user
     * @showThumbsUpUserList:   if true, will show thumbs up users list at eof of topic content or reply content
     * @showUserSignature:      if true, will show user signature info in forum
     */
    forumsConfig: {
      category: [
        {name: 'AFFAIRS', value: 'affairs', index: 0, isOper: false, isVip: false},
        {name: 'DISCUSS', value: 'discuss', index: 1, isOper: false, isVip: false},
        {name: 'BUSINESS', value: 'business', index: 2, isOper: false, isVip: false},
        {name: 'VIP', value: 'vip', index: 3, isOper: false, isVip: true},
        {name: 'ADMINISTRATION', value: 'Administration', index: 4, isOper: true, isVip: false}
      ],
      showThumbsUpUserList: true,
      showUserSignature: true
    },

    /**
     * @itemsPerPage
     *
     * items number in per list page settings
     * NOTE: you can change these value at anytime if you understand it
     *
     * @topicsPerPage:            forum topic list page settings
     * @repliesPerPage:           forum topic replies list page settings
     * @topicsSearchPerPage:      forum topic search list page settings
     * @torrentsPerPage:          torrents list page settings
     * @torrentsCommentsPerPage:  torrent comments list settings
     * @tracesPerPage:            system traces log list page settings
     * @adminUserListPerPage:     admin manage users list page settings
     * @collectionsListPerPage:   movie collections list page settings
     * @backupFilesListPerPage:   system backup files list page settings
     * @torrentPeersListPerPage:  torrent detail seeder & leecher users list page settings
     */
    itemsPerPage: {
      topicsPerPage: 10,
      repliesPerPage: 10,
      topicsSearchPerPage: 10,
      torrentsPerPage: 15,
      torrentsCommentsPerPage: 10,
      makeGroupTorrentsPerPage: 10,
      tracesPerPage: 30,
      adminUserListPerPage: 15,
      collectionsListPerPage: 6,
      backupFilesListPerPage: 15,
      torrentPeersListPerPage: 15,
      homeOrderTorrentListPerType: 9,
      homeNewestTorrentListPerType: 14
    },

    /**
     * @resourcesTags
     *
     * resources search tags settings, can configure more tags of torrentType at here
     *
     * @radio:                single selection tags
     * @checkbox:             multiple selection tags
     *        @name:          tag type name, used in $translate -> RESOURCESTAGS
     *        @cats:          value of @torrentType, torrents filter(search) will used by this value
     *        @value:         sub tags value list
     *                @name:  sub tag name
     *                @icon:  sub tag icon file path
     */
    resourcesTags: {
      radio: [
        {
          name: 'MUSIC_SUB_CAT',
          cats: ['music'],
          value: [
            {name: 'CD', icon: ''},
            {name: 'MTV', icon: ''}
          ]
        },
        {
          name: 'TYPE',
          cats: ['movie', 'tvserial', 'tvdrama'],
          value: [
            {name: 'BLU_RAY', icon: ''},
            {name: 'REMUX', icon: ''},
            {name: 'WEB_DL', icon: ''},
            {name: 'ENCODE', icon: ''}
          ]
        },
        {
          name: 'RESOLUTION',
          cats: ['movie', 'tvserial', 'music', 'sports', 'variety', 'tvdrama'],
          value: [
            {name: 'S4K', icon: ''},
            {name: 'S1080P', icon: ''},
            {name: 'S1080I', icon: ''},
            {name: 'S720P', icon: ''}
          ]
        },
        {
          name: 'VIDEO',
          cats: ['movie', 'tvserial', 'music', 'sports', 'variety', 'tvdrama'],
          value: [
            {name: 'AVC', icon: ''},
            {name: 'X265', icon: ''},
            {name: 'X264', icon: ''}
          ]
        },
        {
          name: 'AUDIO',
          cats: ['movie', 'tvserial', 'music', 'sports', 'variety', 'tvdrama'],
          value: [
            {name: 'AAC', icon: ''},
            {name: 'AC3', icon: ''},
            {name: 'LPCM', icon: ''},
            {name: 'DTS', icon: ''},
            {name: 'DTS_HD', icon: ''},
            {name: 'ATMOS_TRUEHD', icon: ''}
          ]
        },
        {
          name: 'AUDIOFORMATS',
          cats: ['music'],
          value: [
            {name: 'WAV', icon: ''},
            {name: 'FLAC', icon: ''},
            {name: 'APE', icon: ''}
          ]
        },
        {
          name: 'CHANNEL',
          cats: ['movie', 'tvserial', 'music', 'sports', 'variety', 'tvdrama'],
          value: [
            {name: 'C20', icon: ''},
            {name: 'C51', icon: ''},
            {name: 'C71', icon: ''}
          ]
        },
        {
          name: 'THREED',
          cats: ['movie'],
          value: [
            {name: 'T3D', icon: ''},
            {name: 'T2D', icon: ''},
            {name: 'T2D_3D', icon: ''}
          ]
        },
        {
          name: 'MOVIE_SUB_CAT',
          cats: ['movie', 'tvserial', 'tvdrama'],
          value: [
            {name: 'CARTOON', icon: ''},
            {name: 'DOCUMENTARY', icon: ''}
          ]
        },
        {
          name: 'SPORTS_SUB_CAT',
          cats: ['sports'],
          value: [
            {name: 'FOOTBALL', icon: ''},
            {name: 'BASKETBALL', icon: ''},
            {name: 'RUGBY', icon: ''},
            {name: 'TENNIS', icon: ''},
            {name: 'BOXING', icon: ''},
            {name: 'SNOOKER', icon: ''},
            {name: 'F1', icon: ''}
          ]
        },
        {
          name: 'REGION',
          cats: ['movie', 'tvserial', 'music', 'sports', 'variety', 'tvdrama'],
          value: [
            {name: 'USA', icon: ''},
            {name: 'CHINA', icon: ''},
            {name: 'JAPAN', icon: ''},
            {name: 'KOREA', icon: ''},
            {name: 'INDIA', icon: ''},
            {name: 'ARAB', icon: ''}
          ]
        },
        {
          name: 'PLATFORM',
          cats: ['software', 'game'],
          value: [
            {name: 'WINDOWS', icon: ''},
            {name: 'MACOS', icon: ''},
            {name: 'LINUX', icon: ''},
            {name: 'IOS', icon: ''},
            {name: 'ANDROID', icon: ''},
            {name: 'CAR', icon: ''}
          ]
        },
        {
          name: 'SOFT_SUB_CAT',
          cats: ['software'],
          value: [
            {name: 'OS', icon: ''},
            {name: 'OFFICE', icon: ''},
            {name: 'TOOLS', icon: ''},
            {name: 'MEDIA', icon: ''},
            {name: 'DEVELOPMENT_IDE', icon: ''},
            {name: 'MAP', icon: ''}
          ]
        },
        {
          name: 'PICTURE_SUB_CAT',
          cats: ['picture'],
          value: [
            {name: 'SCENERY', icon: ''},
            {name: 'FASHION', icon: ''},
            {name: 'SPORTS', icon: ''},
            {name: 'ART_PORTRAIT', icon: ''}
          ]
        },
        {
          name: 'EBOOK_FORMAT',
          cats: ['ebook'],
          value: [
            {name: 'PDF', icon: ''},
            {name: 'WDL', icon: ''},
            {name: 'ABM', icon: ''},
            {name: 'CEB', icon: ''},
            {name: 'PDG', icon: ''},
            {name: 'CHM', icon: ''},
            {name: 'TXT', icon: ''}
          ]
        },
        {
          name: 'EBOOK_SUB_CAT',
          cats: ['ebook'],
          value: [
            {name: 'PROGRAMMING', icon: ''},
            {name: 'COMPUTER', icon: ''},
            {name: 'MAGAZINE', icon: ''},
            {name: 'STORY', icon: ''},
            {name: 'BIOGRAPHY', icon: ''}
          ]
        }
      ],
      checkbox: [
        {
          name: 'MODIFY',
          cats: ['movie', 'tvserial', 'sports', 'variety', 'tvdrama'],
          value: [
            {name: 'DIY', icon: ''},
            {name: 'GUOPEI', icon: ''},
            {name: 'ZHONGZI', icon: ''}
          ]
        },
        {
          name: 'RANKING',
          cats: ['movie', 'tvserial', 'tvdrama'],
          value: [
            {name: 'IMDB_TOP100', icon: ''},
            {name: 'IMDB_TOP250', icon: ''},
            {name: 'DOUBAN_TOP100', icon: ''},
            {name: 'DOUBAN_TOP250', icon: ''}
          ]
        }
      ]
    }
  }
};
