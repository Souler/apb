import { downloadAndReturnToolPaths } from 'android-platform-tools';
import { getToolPaths } from 'android-platform-tools/src/helper';
import { spawn } from 'child_process';
import { PNG } from 'pngjs';
import streamToPromise from 'stream-to-promise';

function getAdbPath() {
  return getToolPaths()
    .then(paths => paths === null ? downloadAndReturnToolPaths() : paths)
    .then(({ adbPath }) => adbPath);
}

async function screencap() {
  const adbPath = await getAdbPath();
  const proc = spawn(adbPath, ['exec-out', 'screencap', '-p'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return new Promise((resolve, reject) => {
    proc.stdout.pipe(new PNG({ filterType: 4 }))
      .on('parsed', function () {
        resolve({
          data: this.data,
          width: this.width,
          height: this.height,
        })
      })
      .on('error', error => reject(error));
  });
}

async function tap([x, y]) {
  const adbPath = await getAdbPath();
  const proc = spawn(adbPath, ['shell', 'input', 'tap', x, y]);
  await streamToPromise(proc);
}

export default {
  screencap,
  tap,
};
