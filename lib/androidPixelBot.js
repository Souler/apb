import readConfig from './readConfig';
import commandInterpreter from './commandInterpreter';

function walkthroughCommands(commands, loop) {
  return commands.reduce(
    (chain, command) => chain.then(() => commandInterpreter(command)),
    Promise.resolve(),
  ).then(() => loop ? walkthroughCommands(commands, loop) : null);
}

async function androidPixelBot({
  configFilepath,
  loop = true,
} = {}) {
  try {
    const { commands } = readConfig(configFilepath);
    await walkthroughCommands(commands, loop);
  } catch (e) {
    console.error(e);
  }
}

export default androidPixelBot;
