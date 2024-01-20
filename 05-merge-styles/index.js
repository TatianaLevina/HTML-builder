const fs = require('fs');
const path = require('path');
const readline = require('node:readline');

const streamToWrite = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
);
fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      if (file.isFile() && path.extname(`${file.name}`) === '.css') {
        let rl = readline.createInterface({
          input: fs.createReadStream(path.join(__dirname, 'styles', file.name)),
        });
        rl.on('line', (line) => {
          streamToWrite.write(`${line}\n`);
        });
      }
    });
  },
);
