const fs = require('fs');
const path = require('path');

const nameFile = 'files-copy';
const absolutePath = path.join(__dirname, nameFile);

fs.mkdir(absolutePath, { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Directory created successfully!');
});

fs.readdir(path.join(__dirname, 'files'), (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    fs.copyFile(
      path.join(__dirname, 'files', file),
      path.join(__dirname, nameFile, file),
      (err) => {
        if (err) {
          return console.error(err);
        }
        console.log('File was copied!');
      },
    );
  });
});
