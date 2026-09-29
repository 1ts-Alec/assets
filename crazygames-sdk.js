// No-op CrazyGames SDK (v2/v3 API). The real SDK loads CrazyGames' ad and tracking code; this keeps
// the calls games make working without it. Ads finish immediately (rewarded ads count as watched)
// and there is no signed-in user.
(function () {
  var noop = function () {};
  var resolve = function (value) { return function () { return Promise.resolve(value); }; };
  var reject = function (code) { return function () { return Promise.reject({ code: code, message: code }); }; };
  var storage = (function () {
    try { return window.localStorage; } catch (e) { return null; }
  })();

  var sdk = {
    environment: 'crazygames',
    isQaTool: false,
    init: resolve(),
    ad: {
      isAdPlaying: false,
      requestAd: function (type, callbacks) {
        callbacks = callbacks || {};
        setTimeout(function () {
          if (callbacks.adStarted) callbacks.adStarted();
          if (callbacks.adFinished) callbacks.adFinished();
        }, 0);
        return Promise.resolve();
      },
      prefetchAd: noop,
      hasAdblock: resolve(false),
      addAdblockPopupListener: noop,
      removeAdblockPopupListener: noop
    },
    banner: {
      requestBanner: resolve(),
      requestResponsiveBanner: resolve(),
      requestOverlayBanners: noop,
      clearBanner: noop,
      clearAllBanners: noop
    },
    game: {
      id: '',
      link: location.href,
      isInstantMultiplayer: false,
      settings: { disableChat: false, muteAudio: false },
      gameplayStart: noop,
      gameplayStop: noop,
      happytime: noop,
      loadingStart: noop,
      loadingStop: noop,
      sdkGameLoadingStart: noop,
      sdkGameLoadingStop: noop,
      inviteLink: function () { return location.href; },
      showInviteButton: function () { return location.href; },
      hideInviteButton: noop,
      getInviteParam: function () { return null; },
      addSettingsChangeListener: noop,
      removeSettingsChangeListener: noop
    },
    user: {
      isUserAccountAvailable: false,
      systemInfo: {
        countryCode: 'US',
        locale: navigator.language || 'en-US',
        device: { type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop' },
        os: { name: '', version: '' },
        browser: { name: '', version: '' },
        applicationType: 'web'
      },
      getUser: resolve(null),
      getUserToken: reject('userNotAuthenticated'),
      getXsollaUserToken: reject('userNotAuthenticated'),
      showAuthPrompt: reject('userNotAuthenticated'),
      showAccountLinkPrompt: reject('userNotAuthenticated'),
      addAuthListener: noop,
      removeAuthListener: noop,
      addScore: noop,
      submitScore: noop
    },
    data: {
      getItem: function (key) { return storage ? storage.getItem(key) : null; },
      setItem: function (key, value) { try { storage && storage.setItem(key, value); } catch (e) {} },
      removeItem: function (key) { try { storage && storage.removeItem(key); } catch (e) {} },
      clear: function () { try { storage && storage.clear(); } catch (e) {} },
      syncUnityGameData: noop
    },
    analytics: { trackOrder: noop }
  };

  window.CrazyGames = window.CrazyGames || {};
  window.CrazyGames.SDK = sdk;

  // Older Unity builds call the v1 global instead.
  window.Crazygames = window.Crazygames || {
    init: noop,
    gameplayStart: noop,
    gameplayStop: noop,
    happytime: noop,
    requestAd: noop,
    requestBanners: noop,
    requestInviteUrl: noop,
    screenshotReceived: noop
  };
})();
