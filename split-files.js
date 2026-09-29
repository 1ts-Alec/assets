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

  window.SPLIT_FILES_URL = function (url) {
    var match = lookup(url);
    if (!match) return Promise.resolve(url);
    return joined(match.key, match.info).blob().then(function (blob) {
      return URL.createObjectURL(new Blob([blob], { type: contentType(match.key) }));
    });
  };
})();
