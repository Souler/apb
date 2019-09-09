import { spawn } from 'child_process';
import streamToPromise from 'stream-to-promise';

function screencap() {
  const proc = spawn('adb', ['shell', 'screencap', '-p'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return proc.stdout;
}

function tap([x, y]) {
  const proc = spawn('adb', ['shell', 'input', 'tap', x, y]);
  return streamToPromise(proc);
}

export {
  screencap,
  tap,
};
