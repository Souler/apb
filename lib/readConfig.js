import fs from 'fs';
import yaml from 'js-yaml';

function readConfig(configFilepath) {
  var doc = yaml.safeLoad(fs.readFileSync(configFilepath, 'utf8'));
  return {
    commands: doc.commands,
  };
}

export default readConfig;
