// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function() {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"1LeZo":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "0bfee61524d7001e2e61c486f9285138";
// @flow
/*global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE*/
/*::
import type {
HMRAsset,
HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
(string): mixed;
cache: {|[string]: ParcelModule|};
hotData: mixed;
Module: any;
parent: ?ParcelRequire;
isParcelRequire: true;
modules: {|[string]: [Function, {|[string]: string|}]|};
HMR_BUNDLE_ID: string;
root: ParcelRequire;
}
interface ParcelModule {
hot: {|
data: mixed,
accept(cb: (Function) => void): void,
dispose(cb: (mixed) => void): void,
// accept(deps: Array<string> | string, cb: (Function) => void): void,
// decline(): void,
_acceptCallbacks: Array<(Function) => void>,
_disposeCallbacks: Array<(mixed) => void>,
|};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
*/
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || (function () {}));
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets, /*: {|[string]: boolean|}*/
acceptedAssets, /*: {|[string]: boolean|}*/
/*: {|[string]: boolean|}*/
assetsToAccept;
function getHostname() {
  return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
  return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = getHostname();
  var port = getPort();
  var protocol = HMR_SECURE || location.protocol == 'https:' && !(/localhost|127.0.0.1|0.0.0.0/).test(hostname) ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
  // $FlowFixMe
  ws.onmessage = function (event) /*: {data: string, ...}*/
  {
    checkedAssets = {
      /*: {|[string]: boolean|}*/
    };
    acceptedAssets = {
      /*: {|[string]: boolean|}*/
    };
    assetsToAccept = [];
    var data = /*: HMRMessage*/
    JSON.parse(event.data);
    if (data.type === 'update') {
      // Remove error overlay if there is one
      removeErrorOverlay();
      let assets = data.assets.filter(asset => asset.envHash === HMR_ENV_HASH);
      // Handle HMR Update
      var handled = false;
      assets.forEach(asset => {
        var didAccept = asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
        if (didAccept) {
          handled = true;
        }
      });
      if (handled) {
        console.clear();
        assets.forEach(function (asset) {
          hmrApply(module.bundle.root, asset);
        });
        for (var i = 0; i < assetsToAccept.length; i++) {
          var id = assetsToAccept[i][1];
          if (!acceptedAssets[id]) {
            hmrAcceptRun(assetsToAccept[i][0], id);
          }
        }
      } else {
        window.location.reload();
      }
    }
    if (data.type === 'error') {
      // Log parcel errors to console
      for (let ansiDiagnostic of data.diagnostics.ansi) {
        let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
        console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
      }
      // Render the fancy html overlay
      removeErrorOverlay();
      var overlay = createErrorOverlay(data.diagnostics.html);
      // $FlowFixMe
      document.body.appendChild(overlay);
    }
  };
  ws.onerror = function (e) {
    console.error(e.message);
  };
  ws.onclose = function (e) {
    if (undefined !== 'test') {
      console.warn('[parcel] 🚨 Connection to the HMR server was lost');
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
    console.log('[parcel] ✨ Error resolved');
  }
}
function createErrorOverlay(diagnostics) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
  for (let diagnostic of diagnostics) {
    let stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
    errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>
          ${stack}
        </pre>
        <div>
          ${diagnostic.hints.map(hint => '<div>' + hint + '</div>').join('')}
        </div>
      </div>
    `;
  }
  errorHTML += '</div>';
  overlay.innerHTML = errorHTML;
  return overlay;
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]>*/
{
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push([bundle, k]);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    if (link.parentNode !== null) {
      // $FlowFixMe
      link.parentNode.removeChild(link);
    }
  };
  newLink.setAttribute('href', // $FlowFixMe
  link.getAttribute('href').split('?')[0] + '?' + Date.now());
  // $FlowFixMe
  link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }
  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      // $FlowFixMe[incompatible-type]
      var href = /*: string*/
      links[i].getAttribute('href');
      var hostname = getHostname();
      var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
      var absolute = (/^https?:\/\//i).test(href) && href.indexOf(window.location.origin) !== 0 && !servedFromHMRServer;
      if (!absolute) {
        updateLink(links[i]);
      }
    }
    cssTimeout = null;
  }, 50);
}
function hmrApply(bundle, /*: ParcelRequire*/
asset) /*:  HMRAsset*/
{
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (asset.type === 'css') {
    reloadCSS();
    return;
  }
  let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
  if (deps) {
    var fn = new Function('require', 'module', 'exports', asset.output);
    modules[asset.id] = [fn, deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, /*: ParcelRequire*/
id, /*: ParcelRequire*/
/*: string*/
depsByBundle) /*: ?{ [string]: { [string]: string } }*/
{
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
    // If we reached the root bundle without finding where the asset should go,
    // there's nothing to do. Mark as "accepted" so we don't reload the page.
    if (!bundle.parent) {
      return true;
    }
    return hmrAcceptCheck(bundle.parent, id, depsByBundle);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(module.bundle.root, id).some(function (v) {
    return hmrAcceptCheck(v[0], v[1], null);
  });
}
function hmrAcceptRun(bundle, /*: ParcelRequire*/
id) /*: string*/
{
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached && cached.hot) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      var assetsToAlsoAccept = cb(function () {
        return getParents(module.bundle.root, id);
      });
      if (assetsToAlsoAccept && assetsToAccept.length) {
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
      }
    });
  }
  acceptedAssets[id] = true;
}

},{}],"23gUJ":[function(require,module,exports) {
var scale = 0.5;
var enableSave = false;
var frameTotalX = 5;
var frameTotalY = 5;
var frameTotal = frameTotalX * frameTotalY;
var frameRate = 10;
var captureVideo = true;
// captuere video or difference image
const PIXEL_SCORE_THRESHOLD = 85;
const IMAGE_SCORE_THRESHOLD = 1;
var version = document.getElementById('version');
version.innerHTML = Date.now().toString();
var info = document.getElementById('info');
var checkComposite = false;
var frameIndex = 0;
var weightedMaxPixel = 0;
var weightedMaxImage = 0;
var constraints = {
  audio: false,
  video: {
    width: 640,
    height: 480
  }
};
navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
function getOrCreateCanvas(id, width, height, append = false) {
  var canvas = document.getElementById(id);
  if (!canvas) {
    canvas = document.createElement('canvas');
    if (append) {
      document.body.appendChild(canvas);
    }
  }
  canvas.width = width;
  canvas.height = height;
  var context = canvas.getContext('2d');
  return {
    canvas,
    context
  };
}
var video = document.getElementById('video');
function success(stream) {
  video.srcObject = stream;
}
function error(error) {
  console.log(error);
}
function download(filename, url) {
  const element = document.createElement('a');
  element.setAttribute('href', url);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
function resetFrames() {
  frameIndex = 0;
  targetContext.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
}
var resetButton = document.getElementById('reset');
resetButton.addEventListener('click', () => {
  resetFrames();
});
var clearButton = document.getElementById('clear');
clearButton.addEventListener('click', () => {
  sampleCanvas.context.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
});
const rgba = (data, i) => {
  return {
    r: data[i + 0],
    g: data[i + 1],
    b: data[i + 2],
    a: data[i + 3]
  };
};
var applyButton = document.getElementById('apply');
applyButton.addEventListener('click', () => {
  const {canvas, context} = sampleCanvas;
  const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
  for (let i = 0; i < data.length; i += 4) {
    const {r, g, b, a} = rgba(data, i);
    if (r == 0 && g == 0 && b == 0 && (a == 255 || a == 0)) {
      data[i + 0] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 255;
    } else {
      data[i + 0] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    }
  }
  maskContext.putImageData(new ImageData(data, canvas.width), 0, 0);
});
function dateStamp() {
  var d = new Date();
  return `${d.getFullYear()}${d.getMonth()}${d.getDay()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}`;
}
var captureInput = document.getElementById('capture');
captureInput.addEventListener('change', () => {
  const {checked} = captureInput;
  captureVideo = checked;
});
captureInput.checked = captureVideo;
var recordInput = document.getElementById('record');
recordInput.addEventListener('change', () => {
  const {checked} = recordInput;
  enableSave = checked;
});
recordInput.checked = enableSave;
var sampleButton = document.getElementById('sample');
var sampleCanvas = getOrCreateCanvas('sample-canvas', constraints.video.width * scale | 0, constraints.video.height * scale | 0);
sampleButton.addEventListener('click', () => {
  const {context, canvas} = sampleCanvas;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
});
var saveButton = document.getElementById('save');
saveButton.addEventListener('click', () => {
  const {canvas} = sampleCanvas;
  var url = canvas.toDataURL('image/png');
  download(`sample-${dateStamp()}.png`, url);
});
let mouseDown = false;
sampleCanvas.canvas.addEventListener('mousedown', event => {
  mouseDown = true;
});
sampleCanvas.canvas.addEventListener('mouseup', event => {
  mouseDown = false;
});
sampleCanvas.canvas.addEventListener('mousemove', event => {
  if (mouseDown) {
    const {clientX, clientY} = event;
    const {context, canvas} = sampleCanvas;
    const {offsetLeft, offsetTop} = canvas;
    const x = clientX - offsetLeft;
    const y = clientY - offsetTop;
    const radius = 20;
    context.beginPath();
    context.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
    context.fillStyle = '#000f';
    context.fill();
  }
});
var input = document.getElementById('upload');
input.addEventListener('change', () => {
  var files = input.files;
  if (files) {
    var file = files[0];
    var reader = new FileReader();
    var img = new Image();
    const {context} = sampleCanvas;
    img.onload = () => {
      context.clearRect(0, 0, compositeCanvas.width, compositeCanvas.height);
      context.drawImage(img, 0, 0, compositeCanvas.width, compositeCanvas.height);
    };
    reader.readAsDataURL(file);
    reader.onload = function () {
      if (reader.readyState == FileReader.DONE) {
        img.src = reader.result;
      }
    };
  }
});
var {canvas: compositeCanvas, context: compositeContext} = getOrCreateCanvas('composite', constraints.video.width * scale | 0, constraints.video.height * scale | 0);
var {canvas: maskCanvas, context: maskContext} = getOrCreateCanvas('mask', compositeCanvas.width, compositeCanvas.height);
// maskContext.fillStyle = '#000';
maskContext.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
var {canvas: targetCanvas, context: targetContext} = getOrCreateCanvas('target', compositeCanvas.width * frameTotalX, compositeCanvas.height * frameTotalY);
var ready = false;
setTimeout(() => {
  ready = true;
}, 2000);
setInterval(capture, 1000 / frameRate);
function capture() {
  if (!ready) return;
  var {width, height} = compositeCanvas;
  if (!checkComposite) {
    compositeContext.fillStyle = '#000';
    compositeContext.fillRect(0, 0, width, height);
  }
  compositeContext.globalCompositeOperation = 'difference';
  compositeContext.drawImage(video, 0, 0, width, height);
  compositeContext.globalCompositeOperation = 'source-over';
  compositeContext.drawImage(maskCanvas, 0, 0, width, height);
  if (checkComposite) {
    var imageScore = 0;
    var maxPixel = 0;
    var imageData = compositeContext.getImageData(0, 0, width, height).data;
    for (var i = 0; i < imageData.length; i += 4) {
      var r = imageData[i + 0];
      var g = imageData[i + 1];
      var b = imageData[i + 2];
      var pixelScore = (r + g + b) / 3 | 0;
      maxPixel = Math.max(pixelScore, maxPixel);
      if (pixelScore >= PIXEL_SCORE_THRESHOLD) {
        imageScore += 1;
      }
    }
    weightedMaxPixel = Math.max(maxPixel, weightedMaxPixel);
    weightedMaxPixel += 0.2 * (maxPixel - weightedMaxPixel);
    weightedMaxImage = Math.max(imageScore, weightedMaxImage);
    weightedMaxImage += 0.05 * (imageScore - weightedMaxImage);
    info.innerHTML = weightedMaxPixel.toFixed(0) + ' ' + weightedMaxImage.toFixed(0);
    if (imageScore >= IMAGE_SCORE_THRESHOLD) {
      console.log('Motion: ', imageScore, maxPixel);
      var x = frameIndex % frameTotalX | 0;
      var y = frameIndex / frameTotalX | 0;
      var d = new Date();
      targetContext.clearRect(x * width, y * height, width, height);
      if (captureVideo) {
        targetContext.drawImage(video, x * width, y * height, width, height);
      } else {
        targetContext.drawImage(compositeCanvas, x * width, y * height, width, height);
      }
      targetContext.fillStyle = '#0f0';
      targetContext.textAlign = 'left';
      targetContext.textBaseline = 'top';
      targetContext.fillText(d.toLocaleDateString() + d.toLocaleTimeString(), x * width + 10, y * height + 10);
      targetContext.fillText(maxPixel.toFixed(0), x * width + 10, y * height + 25);
      targetContext.fillText(imageScore.toFixed(0), x * width + 10, y * height + 40);
      if (enableSave && frameIndex == frameTotal - 1) {
        var url = targetCanvas.toDataURL('image/png');
        download(`clips-${dateStamp()}.png`, url);
      }
      frameIndex = (frameIndex + 1) % frameTotal;
    } else {
      console.log('None: ', imageScore, maxPixel);
    }
  }
  checkComposite = !checkComposite;
}

},{}]},["1LeZo","23gUJ"], "23gUJ", "parcelRequire427e")

//# sourceMappingURL=index.f9285138.js.map
