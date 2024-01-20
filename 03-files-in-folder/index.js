const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const nameFile = 'secret-folder';
const absolutePath = path.join(__dirname, nameFile);

fs.readdir(absolutePath, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach(async (file) => {
    if (file.isFile()) {
      const stat = await fsPromises.stat(path.join(absolutePath, file.name));
      const fileSize = stat.size / 1024;
      console.log(
        `${path.basename(
          `${file.name}`,
          path.extname(`${file.name}`),
        )} - ${path.extname(`${file.name}`)} - ${fileSize}kb`,
      );
    }
  });
});
