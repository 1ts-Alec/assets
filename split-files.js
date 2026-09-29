// Serves files that are too large for raw.esm.sh (about 50MB) from parts stored next to them
// (<file>.part1, <file>.part2, ...). Declare them before the game loads:
//   window.SPLIT_FILES = { 'https://raw.esm.sh/gh/owner/repo@ref/path/file.data': { parts: 5, size: 94384055 } };
// fetch() of a declared URL streams the parts back in order as a single response. A game that
// needs a URL instead can call SPLIT_FILES_URL(url), which resolves to a blob: URL of the joined file.
(function () {
  var files = window.SPLIT_FILES || {};
  var origFetch = window.fetch;
  var TYPES = { wasm: 'application/wasm', js: 'text/javascript' };

  function lookup(input) {
    var url = typeof input === 'string' ? input : input && input.url;
    if (!url) return null;
    var key = new URL(url, document.baseURI).href.split('?')[0];
    return files[key] ? { key: key, info: files[key] } : null;
  }

  function contentType(key) {
    return TYPES[key.split('.').pop()] || 'application/octet-stream';
  }

  function joined(key, info) {
    var next = 1;
    var body = new ReadableStream({
      pull: function (controller) {
        if (next > info.parts) { controller.close(); return; }
        var partUrl = key + '.part' + next++;
        return origFetch(partUrl).then(function (response) {
          if (!response.ok) throw new Error('split-files: ' + response.status + ' for ' + partUrl);
          return response.arrayBuffer();
        }).then(function (buffer) {
          controller.enqueue(new Uint8Array(buffer));
        });
      }
    });
    return new Response(body, {
      status: 200,
      headers: { 'Content-Length': String(info.size), 'Content-Type': contentType(key) }
    });
  }

  window.fetch = function (input, init) {
    var match = lookup(input);
    if (!match) return origFetch.apply(this, arguments);
    return Promise.resolve(joined(match.key, match.info));
  };

  var blobUrls = {};
  window.SPLIT_FILES_URL = function (url) {
    var match = lookup(url);
    if (!match) return Promise.resolve(url);
    if (!blobUrls[match.key]) {
      blobUrls[match.key] = joined(match.key, match.info).blob().then(function (blob) {
        return URL.createObjectURL(new Blob([blob], { type: contentType(match.key) }));
      });
    }
    return blobUrls[match.key];
  };

  // Older Unity loaders download with XMLHttpRequest: hold a matching request until the joined
  // file is ready, then open it against the blob: URL.
  var XHR = XMLHttpRequest.prototype, open = XHR.open, send = XHR.send, setHeader = XHR.setRequestHeader;
  XHR.open = function (method, url) {
    this._split = lookup(url);
    if (!this._split) return open.apply(this, arguments);
    this._splitArgs = Array.prototype.slice.call(arguments);
    this._splitHeaders = [];
  };
  XHR.setRequestHeader = function (name, value) {
    if (this._split && this._splitHeaders) { this._splitHeaders.push([name, value]); return; }
    return setHeader.apply(this, arguments);
  };
  XHR.send = function (body) {
    if (!this._split) return send.apply(this, arguments);
    var xhr = this, args = this._splitArgs, headers = this._splitHeaders;
    this._split = null; this._splitHeaders = null;
    window.SPLIT_FILES_URL(args[1]).then(function (blobUrl) {
      args[1] = blobUrl;
      open.apply(xhr, args);
      headers.forEach(function (h) { setHeader.call(xhr, h[0], h[1]); });
      send.call(xhr, body);
    });
  };
})();
