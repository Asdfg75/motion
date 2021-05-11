var scale = 0.5;
var enableSave = false;
var frameTotalX = 5;
var frameTotalY = 5;
var frameTotal = frameTotalX * frameTotalY;
var frameRate = 10;
var captureVideo = true; // captuere video or difference image

const PIXEL_SCORE_THRESHOLD = 85;
const IMAGE_SCORE_THRESHOLD = 1;

var version = document.getElementById('version') as HTMLDivElement;
version.innerHTML = Date.now().toString();

var info = document.getElementById('info') as HTMLDivElement;

var checkComposite = false;
var frameIndex = 0;
var weightedMaxPixel = 0;
var weightedMaxImage = 0;

var constraints = {
  audio: false,
  video: { width: 640, height: 480 },
};
navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);

function getOrCreateCanvas(id, width, height, append = false) {
  var canvas = document.getElementById(id) as HTMLCanvasElement;

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
    context,
  };
}

var video = document.getElementById('video') as HTMLVideoElement;

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

var resetButton = document.getElementById('reset') as HTMLButtonElement;
resetButton.addEventListener('click', () => {
  resetFrames();
});

var clearButton = document.getElementById('clear') as HTMLButtonElement;
clearButton.addEventListener('click', () => {
  sampleCanvas.context.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
});

const rgba = (data: Uint8ClampedArray, i) => {
  return {
    r: data[i + 0],
    g: data[i + 1],
    b: data[i + 2],
    a: data[i + 3],
  };
};

var applyButton = document.getElementById('apply') as HTMLButtonElement;
applyButton.addEventListener('click', () => {
  const { canvas, context } = sampleCanvas;
  const data = context.getImageData(0, 0, canvas.width, canvas.height).data;

  for (let i = 0; i < data.length; i += 4) {
    const { r, g, b, a } = rgba(data, i);

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

var captureInput = document.getElementById('capture') as HTMLInputElement;
captureInput.addEventListener('change', () => {
  const { checked } = captureInput;
  captureVideo = checked;
});
captureInput.checked = captureVideo;

var recordInput = document.getElementById('record') as HTMLInputElement;
recordInput.addEventListener('change', () => {
  const { checked } = recordInput;
  enableSave = checked;
});
recordInput.checked = enableSave;

var sampleButton = document.getElementById('sample') as HTMLButtonElement;
var sampleCanvas = getOrCreateCanvas(
  'sample-canvas',
  (constraints.video.width * scale) | 0,
  (constraints.video.height * scale) | 0
);
sampleButton.addEventListener('click', () => {
  const { context, canvas } = sampleCanvas;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
});

var saveButton = document.getElementById('save') as HTMLButtonElement;
saveButton.addEventListener('click', () => {
  const { canvas } = sampleCanvas;
  var url = canvas.toDataURL('image/png');
  download(`sample-${dateStamp()}.png`, url);
});

let mouseDown = false;
sampleCanvas.canvas.addEventListener('mousedown', (event) => {
  mouseDown = true;
});

sampleCanvas.canvas.addEventListener('mouseup', (event) => {
  mouseDown = false;
});

sampleCanvas.canvas.addEventListener('mousemove', (event) => {
  if (mouseDown) {
    const { clientX, clientY } = event;
    const { context, canvas } = sampleCanvas;
    const { offsetLeft, offsetTop } = canvas;

    const x = clientX - offsetLeft;
    const y = clientY - offsetTop;

    const radius = 20;

    context.beginPath();
    context.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
    context.fillStyle = '#000f';
    context.fill();
  }
});

var input = document.getElementById('upload') as HTMLInputElement;
input.addEventListener('change', () => {
  var files = input.files;

  if (files) {
    var file = files[0];

    var reader = new FileReader();
    var img = new Image();

    const { context } = sampleCanvas;

    img.onload = () => {
      context.clearRect(0, 0, compositeCanvas.width, compositeCanvas.height);
      context.drawImage(img, 0, 0, compositeCanvas.width, compositeCanvas.height);
    };

    reader.readAsDataURL(file);
    reader.onload = function () {
      if (reader.readyState == FileReader.DONE) {
        img.src = reader.result as string;
      }
    };
  }
});

var { canvas: compositeCanvas, context: compositeContext } = getOrCreateCanvas(
  'composite',
  (constraints.video.width * scale) | 0,
  (constraints.video.height * scale) | 0
);

var { canvas: maskCanvas, context: maskContext } = getOrCreateCanvas(
  'mask',
  compositeCanvas.width,
  compositeCanvas.height
);

// maskContext.fillStyle = '#000';
maskContext.clearRect(0, 0, maskCanvas.width, maskCanvas.height);

var { canvas: targetCanvas, context: targetContext } = getOrCreateCanvas(
  'target',
  compositeCanvas.width * frameTotalX,
  compositeCanvas.height * frameTotalY
);

var ready = false;
setTimeout(() => {
  ready = true;
}, 2000);

setInterval(capture, 1000 / frameRate);

function capture() {
  if (!ready) return;

  var { width, height } = compositeCanvas;

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

      var pixelScore = ((r + g + b) / 3) | 0;

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
      var y = (frameIndex / frameTotalX) | 0;
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
