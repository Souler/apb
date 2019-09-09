import { PNG } from 'pngjs';
import * as ADB from './adb';

function coordinateToIndex(image, [x, y]) {
  return (image.width * y + x) << 2;
}

function readPixelColor(image, pixelPos) {
  const pixelIndex = coordinateToIndex(image, pixelPos);
  return [0, 1, 2, 3]
    .map(i => image.data[pixelIndex + i])
    .slice(0, -1) // Skip the alpha channel
    .map(v => Number(v).toString(16).padStart(2, '0'))
    .join('')
    .padStart(7, '#');
}

function screencapDeviceAndParse(pngParserOptions = { filterType: 4 }) {
  return new Promise((resolve, reject) => {
    ADB.screencap().pipe(new PNG(pngParserOptions))
      .on('parsed', function () { resolve(this) })
      .on('error', error => reject(error));
  });
}

function saveDebugInfo(stream, indexes) {
  indexes.forEach(idx => {
    stream.data[idx] = 255;
    stream.data[idx + 1] = 0;
    stream.data[idx + 2] = 255;
  });
  const fs = require('fs');
  stream.pack().pipe(fs.createWriteStream(`./${Date.now()}.png`));
}

async function readDevicePixelColors(coordinates = []) {
  const image = await screencapDeviceAndParse();
  const colors = coordinates.map(coord => readPixelColor(image, coord));
  return colors;
}

export default readDevicePixelColors;
