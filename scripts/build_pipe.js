const fs = require('fs');

fs.copyFileSync('./package.json', './dist/package.json');
fs.mkdirSync('./dist/envs');
fs.copyFileSync('./envs/.prod.env', './dist/envs/.prod.env');