import chalk from 'chalk';
import log from './logger';
import adb from './adb';
import readDevicePixelColors from './readDevicePixelColors';
import { arrayEqual } from './utils';

async function waitFor(screenPixelsSpec) {
  const { name, pixels } = screenPixelsSpec;
  const coords = pixels.map(pixelSpec => pixelSpec.pos);
  const colors = pixels.map(pixelSpec => pixelSpec.color);
  const devicePixelColors = await readDevicePixelColors(coords);
  const equal = arrayEqual(colors, devicePixelColors);
  log.debug(
    chalk.magenta(`[wait_for]`),
    `${name}`,
    chalk.gray(`[${colors.map(color => chalk.hex(color)(color)).join(',')}]`),
    'vs',
    chalk.gray(`[${devicePixelColors.map(color => chalk.hex(color)(color)).join(',')}]`),
    equal ? chalk.green('ok') : chalk.red('ko')
  );
  return equal ? null : waitFor(screenPixelsSpec);
}

async function tap(pos) {
  log.debug(chalk.cyan(`[tap]`), chalk.gray('tapping at'), pos[0], pos[1]);
  await adb.tap(pos);
  log.debug(chalk.cyan(`[tap]`), chalk.gray('tapped at'), pos[0], pos[1]);
}

async function delay(ms) {
  log.debug(chalk.cyan(`[delay]`), ms, chalk.gray('starting...'));
  await new Promise(resolve => setTimeout(resolve, ms));
  log.debug(chalk.cyan(`[delay]`), ms, chalk.gray('done'));
}

async function commands(nestedCommands, interpreter) {
  await nestedCommands.reduce(
    (chain, command) => chain.then(() => interpreter(command)),
    Promise.resolve(),
  );
}

function commandInterpreter(command) {
  const type = Object.keys(command)[0];
  switch(type) {
    case 'wait_for':
      return waitFor(command.wait_for);
    case 'tap':
      return tap(command.tap);
    case 'delay':
      return delay(command.delay);
    case 'commands':
      return commands(command.commands, commandInterpreter);
    default:
      throw new Error(`unkown command type ${type}`);
  }
}

export default commandInterpreter;
