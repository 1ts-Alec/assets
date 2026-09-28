// Blocks requests to third-party ad and tracking networks made by code this site doesn't control
// (ad plugins inside game runtimes, remotely hosted game scripts). Blocked scripts fail the way an
// ad blocker would make them fail, which games already handle. Load this before any other script.
(function () {
  if (window.__noAds) return;
  window.__noAds = true;
  var BLOCKED = [
    'googlesyndication.com', 'doubleclick.net', 'google-analytics.com', 'googletagmanager.com',
    'googletagservices.com', 'imasdk.googleapis.com', '2mdn.net', 'googleadservices.com',
    'adinplay.com', 'gamemonetize.com', 'gamedistribution.com', 'improvedigital.com',
    'venatusmedia.com', 'amazon-adsystem.com', 'adnxs.com', 'pubmatic.com', 'openx.net',
    'rubiconproject.com', 'criteo.com', 'criteo.net', 'liadm.com', 'atmtd.com', 'id5-sync.com',
    'scorecardresearch.com', 'playnomics.net', 'cpmstar.com', 'wgplayer.com', 'glance-cdn.com',
    'taboola.com', 'outbrain.com', 'adsafeprotected.com', 'moatads.com', 'fbrq.io',
    'mc.yandex.ru', 'facebook.net', 'facebook.com', 'saygames.io', 'bytebrew.io', 'vntsm.io',
    'mochiads.com', 'mochibot.com', 'mochitot.com', 'ngads.com', 'fliplineads.com', 'poki.com', 'poki.io',
    'gameanalytics.com'
  ];
  function blocked(url) {
    try {
      var h = new URL(String(url), document.baseURI).hostname;
      for (var i = 0; i < BLOCKED.length; i++) {
        var d = BLOCKED[i];
        if (h === d || h.slice(-d.length - 1) === '.' + d) return true;
      }
    } catch (e) {}
    return false;
  }
  function guardProp(proto, prop, replacement) {
    var desc = Object.getOwnPropertyDescriptor(proto, prop);
    if (!desc || !desc.set) return;
    Object.defineProperty(proto, prop, {
      configurable: true, enumerable: desc.enumerable,
      get: desc.get,
      set: function (v) { desc.set.call(this, blocked(v) ? replacement : v); }
    });
  }
  guardProp(HTMLScriptElement.prototype, 'src', 'about:blank');
  guardProp(HTMLIFrameElement.prototype, 'src', 'about:blank');
  guardProp(HTMLImageElement.prototype, 'src', 'data:image/gif;base64,R0lGODlhAQABAAAAACw=');
  var setAttr = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (name, value) {
    if ((name === 'src' || name === 'href') && blocked(value)) {
      value = this instanceof HTMLImageElement ? 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' : 'about:blank';
    }
    return setAttr.call(this, name, value);
  };
  if (window.fetch) {
    var origFetch = window.fetch;
    window.fetch = function (input, init) {
      var url = input && typeof input === 'object' && 'url' in input ? input.url : input;
      if (blocked(url)) return Promise.reject(new TypeError('blocked'));
      return origFetch.apply(this, arguments);
    };
  }
  var open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    if (blocked(url)) arguments[1] = 'about:blank';
    return open.apply(this, arguments);
  };
  if (navigator.sendBeacon) {
    var beacon = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = function (url, data) { return blocked(url) ? true : beacon(url, data); };
  }
})();
