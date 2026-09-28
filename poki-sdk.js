// No-op PokiSDK. The real SDK loads Poki's ad and tracking core; this keeps the API games call
// (so they still start and run) without showing ads. Rewarded breaks resolve true so reward
// buttons keep working without an ad.
(function () {
  if (window.PokiSDK && window.PokiSDK.__stub) return;
  var noop = function () {};
  var resolved = function () { return Promise.resolve(); };
  var sdk = {
    __stub: true,
    init: resolved,
    initWithVideoHB: resolved,
    commercialBreak: resolved,
    rewardedBreak: function () { return Promise.resolve(true); },
    displayAd: noop,
    destroyAd: noop,
    gameLoadingStart: noop,
    gameLoadingProgress: noop,
    gameLoadingFinished: noop,
    gameplayStart: noop,
    gameplayStop: noop,
    happyTime: noop,
    customEvent: noop,
    setDebug: noop,
    setLogging: noop,
    setPlayerAge: noop,
    setVolume: noop,
    togglePlayerAdvertisingConsent: noop,
    enableEventTracking: noop,
    logError: noop,
    captureError: noop,
    sendHighscore: noop,
    measure: noop,
    movePill: noop,
    isAdBlocked: function () { return false; },
    getLanguage: function () { return (navigator.language || 'en').slice(0, 2); },
    getURLParam: function (name) { return new URLSearchParams(location.search).get(name) || ''; },
    shareableURL: function () { return Promise.resolve(location.href); },
    getLeaderboard: function () { return Promise.resolve([]); },
    openExternalLink: function (url) { window.open(url, '_blank'); }
  };
  // Any method not listed above: do nothing and return a resolved promise.
  window.PokiSDK = typeof Proxy === 'function'
    ? new Proxy(sdk, { get: function (t, k) { return k in t ? t[k] : resolved; } })
    : sdk;
})();
