// No-op Yandex Games SDK. The real SDK only works inside a yandex.ru/games frame; anywhere else every
// call fails and the page logs errors. This answers the same calls locally: ads close immediately
// (rewarded ads count as watched), the player is an unauthorized guest whose data is kept in
// localStorage, and leaderboards, payments and reviews report nothing available.
(function () {
  if (window.YaGames && window.YaGames.__stub) return;
  var noop = function () {};
  var resolve = function (value) { return function () { return Promise.resolve(value); }; };
  var later = function (fn) { setTimeout(fn, 0); };
  var DATA_KEY = 'yandex-games-stub:data:' + location.pathname;
  var STATS_KEY = 'yandex-games-stub:stats:' + location.pathname;
  function load(key) {
    try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) { return {}; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function pick(obj, keys) {
    if (!keys) return obj;
    var out = {};
    keys.forEach(function (k) { if (k in obj) out[k] = obj[k]; });
    return out;
  }
  var lang = (navigator.language || 'en').slice(0, 2);
  var mobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  var player = {
    signature: '',
    getMode: function () { return 'lite'; },
    isAuthorized: function () { return false; },
    getName: function () { return ''; },
    getPhoto: function () { return ''; },
    getUniqueID: function () { return 'local-player'; },
    getPayingStatus: function () { return 'unknown'; },
    getIDsPerGame: resolve([]),
    getData: function (keys) { return Promise.resolve(pick(load(DATA_KEY), keys)); },
    setData: function (data) { save(DATA_KEY, data || {}); return Promise.resolve(true); },
    getStats: function (keys) { return Promise.resolve(pick(load(STATS_KEY), keys)); },
    setStats: function (stats) { save(STATS_KEY, stats || {}); return Promise.resolve(true); },
    incrementStats: function (inc) {
      var stats = load(STATS_KEY);
      Object.keys(inc || {}).forEach(function (k) { stats[k] = (stats[k] || 0) + inc[k]; });
      save(STATS_KEY, stats);
      return Promise.resolve(stats);
    }
  };

  var listeners = {};
  var ysdk = {
    __stub: true,
    environment: {
      app: { id: '' },
      browser: { lang: lang },
      i18n: { lang: lang, tld: 'com' },
      payload: null
    },
    deviceInfo: {
      type: mobile ? 'mobile' : 'desktop',
      isMobile: function () { return mobile; },
      isTablet: function () { return false; },
      isDesktop: function () { return !mobile; },
      isTV: function () { return false; }
    },
    screen: {
      fullscreen: {
        STATUS_ON: 'on', STATUS_OFF: 'off', status: 'off',
        request: resolve(), exit: resolve()
      }
    },
    adv: {
      showFullscreenAdv: function (opts) {
        var cb = (opts && opts.callbacks) || {};
        later(function () {
          if (cb.onOpen) cb.onOpen();
          if (cb.onClose) cb.onClose(true);
        });
      },
      showRewardedVideo: function (opts) {
        var cb = (opts && opts.callbacks) || {};
        later(function () {
          if (cb.onOpen) cb.onOpen();
          if (cb.onRewarded) cb.onRewarded();
          if (cb.onClose) cb.onClose();
        });
      },
      showBannerAdv: resolve({ stickyAdvIsShowing: false }),
      hideBannerAdv: resolve({ stickyAdvIsShowing: false }),
      getBannerAdvStatus: resolve({ stickyAdvIsShowing: false, reason: 'ADV_IS_NOT_CONNECTED' })
    },
    auth: { openAuthDialog: function () { return Promise.reject(new Error('Authorization is not available here')); } },
    getPlayer: resolve(player),
    getStorage: function () {
      try { return Promise.resolve(window.localStorage); } catch (e) { return Promise.resolve(null); }
    },
    feedback: {
      canReview: resolve({ value: false, reason: 'UNKNOWN' }),
      requestReview: resolve({ feedbackSent: false })
    },
    getPayments: resolve({
      getCatalog: resolve([]),
      getPurchases: resolve([]),
      purchase: function () { return Promise.reject(new Error('Purchases are not available here')); },
      consumePurchase: resolve()
    }),
    getLeaderboards: resolve({
      getLeaderboardDescription: resolve({ name: '', title: {}, description: { type: 'numeric' } }),
      setLeaderboardScore: resolve(),
      getLeaderboardPlayerEntry: function () { return Promise.reject({ code: 'LEADERBOARD_PLAYER_NOT_PRESENT' }); },
      getLeaderboardEntries: resolve({ entries: [], ranges: [], userRank: 0, leaderboard: {} })
    }),
    features: {
      LoadingAPI: { ready: noop },
      GameplayAPI: { start: noop, stop: noop },
      GamesAPI: {
        getAllGames: resolve({ games: [], developerURL: '' }),
        getGameByID: resolve({ isAvailable: false })
      },
      PluginEngineDataReporterAPI: { report: noop }
    },
    shortcut: {
      canShowPrompt: resolve({ canShow: false }),
      showPrompt: resolve({ outcome: 'rejected' })
    },
    clipboard: { writeText: resolve() },
    getFlags: resolve({}),
    isAvailableMethod: resolve(false),
    serverTime: function () { return Date.now(); },
    EVENTS: {
      EXIT: 'EXIT', HISTORY_BACK: 'HISTORY_BACK',
      ACCOUNT_SELECTION_DIALOG_OPENED: 'ACCOUNT_SELECTION_DIALOG_OPENED',
      ACCOUNT_SELECTION_DIALOG_CLOSED: 'ACCOUNT_SELECTION_DIALOG_CLOSED'
    },
    on: function (name, fn) { (listeners[name] = listeners[name] || []).push(fn); return function () { ysdk.off(name, fn); }; },
    off: function (name, fn) { listeners[name] = (listeners[name] || []).filter(function (f) { return f !== fn; }); },
    onEvent: function (name, fn) { return ysdk.on(name, fn); },
    dispatchEvent: function (name) { (listeners[name] || []).forEach(function (fn) { try { fn(); } catch (e) {} }); return Promise.resolve(); }
  };

  window.YaGames = { __stub: true, init: resolve(ysdk) };
})();
