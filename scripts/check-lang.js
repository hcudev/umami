const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const messages = require('../lang/en-US.json');
const ignore = require('./lang-ignore.json');

const dir = path.resolve(__dirname, '../lang');
const files = fs.readdirSync(dir);
const keys = Object.keys(messages).sort();

files.forEach(file => {
  if (file !== 'en-US.json') {
    const lang = require(`../lang/${file}`);
    const id = file.replace('.json', '');

    console.log(chalk.yellowBright(`\n## ${file}`));
    let count = 0;
    keys.forEach(key => {
      const orig = messages[key];
      const check = lang[key];
      const ignored = ignore[id]?.includes(key);

      if (!ignored && (!check || check === orig)) {
        console.log(chalk.redBright('*'), chalk.greenBright(`${key}:`), orig);
        count++;
      }
    });

    if (count === 0) {
      console.log('**👍 Complete!**');
    }
  }
});
