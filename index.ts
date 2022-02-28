const compositeScale = 0.25;
const targetScale = 0.25;
const frameTotalX = 25;
const frameTotalY = 1;
const frameTotal = frameTotalX * frameTotalY;
const frameRate = 10;
const videoWidth = 800;
const videoHeight = 400;

const PIXEL_SCORE_THRESHOLD = 85;
const IMAGE_SCORE_THRESHOLD = 1;

const version = document.getElementById('version') as HTMLDivElement;
version.innerHTML = Date.now().toString();

const info = document.getElementById('info') as HTMLDivElement;

let captureVideo = true; // captuere video or difference image
let enableSave = false;
let checkComposite = false;
let frameIndex = 0;
let weightedMaxPixel = 0;
let weightedMaxImage = 0;

const constraints = {
  audio: false,
  video: { width: videoWidth, height: videoHeight },
};
navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);

function getOrCreateCanvas(id, width, height, append = false) {
  let canvas = document.getElementById(id) as HTMLCanvasElement;

  if (!canvas) {
    canvas = document.createElement('canvas');

    if (append) {
      document.body.appendChild(canvas);
    }
  }

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');

  return {
    canvas,
    context,
  };
}

const video = document.getElementById('video') as HTMLVideoElement;

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

const resetButton = document.getElementById('reset') as HTMLButtonElement;
resetButton.addEventListener('click', () => {
  resetFrames();
});

const clearButton = document.getElementById('clear') as HTMLButtonElement;
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

const applyButton = document.getElementById('apply') as HTMLButtonElement;
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
  const d = new Date();
  return `${d.getFullYear()}${d.getMonth()}${d.getDay()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}`;
}

const captureInput = document.getElementById('capture') as HTMLInputElement;
captureInput.addEventListener('change', () => {
  const { checked } = captureInput;
  captureVideo = checked;
});
captureInput.checked = captureVideo;

const recordInput = document.getElementById('record') as HTMLInputElement;
recordInput.addEventListener('change', () => {
  const { checked } = recordInput;
  enableSave = checked;
});
recordInput.checked = enableSave;

const sampleButton = document.getElementById('sample') as HTMLButtonElement;
const sampleCanvas = getOrCreateCanvas(
  'sample-canvas',
  (videoWidth * compositeScale) | 0,
  (videoHeight * compositeScale) | 0
);
sampleButton.addEventListener('click', () => {
  const { context, canvas } = sampleCanvas;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
});

const saveButton = document.getElementById('save') as HTMLButtonElement;
saveButton.addEventListener('click', () => {
  const { canvas } = sampleCanvas;
  const url = canvas.toDataURL('image/png');
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

const input = document.getElementById('upload') as HTMLInputElement;
input.addEventListener('change', () => {
  const files = input.files;

  if (files) {
    const file = files[0];

    const reader = new FileReader();
    const img = new Image();

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

const { canvas: compositeCanvas, context: compositeContext } = getOrCreateCanvas(
  'composite',
  (videoWidth * compositeScale) | 0,
  (videoHeight * compositeScale) | 0
);

const { canvas: maskCanvas, context: maskContext } = getOrCreateCanvas(
  'mask',
  compositeCanvas.width,
  compositeCanvas.height
);

// maskContext.fillStyle = '#000';
maskContext.clearRect(0, 0, maskCanvas.width, maskCanvas.height);

const { canvas: targetCanvas, context: targetContext } = getOrCreateCanvas(
  'target',
  videoWidth * targetScale * frameTotalX,
  videoHeight * targetScale * frameTotalY
);

let ready = false;
setTimeout(() => {
  ready = true;
}, 2000);

setInterval(capture, 1000 / frameRate);

function capture() {
  if (!ready) return;

  const width = (targetCanvas.width / frameTotalX) | 0;
  const height = (targetCanvas.height / frameTotalY) | 0;

  if (!checkComposite) {
    compositeContext.fillStyle = '#000';
    compositeContext.fillRect(0, 0, compositeCanvas.width, compositeCanvas.height);
  }

  compositeContext.globalCompositeOperation = 'difference';
  compositeContext.drawImage(video, 0, 0, compositeCanvas.width, compositeCanvas.height);

  compositeContext.globalCompositeOperation = 'source-over';
  compositeContext.drawImage(maskCanvas, 0, 0, compositeCanvas.width, compositeCanvas.height);

  if (checkComposite) {
    let imageScore = 0;
    let maxPixel = 0;

    const imageData = compositeContext.getImageData(0, 0, compositeCanvas.width, compositeCanvas.height).data;

    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i + 0];
      const g = imageData[i + 1];
      const b = imageData[i + 2];

      const pixelScore = ((r + g + b) / 3) | 0;

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

      if (frameIndex >= frameTotal) {
        frameIndex = 0;
        targetContext.clearRect(0,0, targetCanvas.width, targetCanvas.height);
      }

      const x = frameIndex % frameTotalX | 0;
      const y = (frameIndex / frameTotalX) | 0;
      const d = new Date();

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
        const url = targetCanvas.toDataURL('image/png');
        download(`clips-${dateStamp()}.png`, url);
      }

      frameIndex += 1;
    } else {
      console.log('None: ', imageScore, maxPixel);
    }
  }

  checkComposite = !checkComposite;
}
