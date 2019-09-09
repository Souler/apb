import 'longjohn';
import androidPixelBot from './androidPixelBot';

function apbCli() {
  const configFilepath = process.argv[2];
  return androidPixelBot({
    configFilepath,
    loop: true,
  });
}

export default apbCli;
apbCli();