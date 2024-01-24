const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

function copyTree(srcPath, dstPath) {
  let statP = fsp.stat(srcPath);
  statP
    .then(async (srcStats) => {
      if (srcStats.isDirectory()) {
        await fsp.mkdir(dstPath, { recursive: true });
        return fsp.readdir(srcPath);
      } else {
        fs.copyFile(srcPath, dstPath, (err) => {
          if (err) {
            console.log(`Failed to copy "${srcPath}" -> "${dstPath}"`);
          }
        });
      }
    })
    .then(async (srcContent) => {
      if (srcContent === undefined) {
        return;
      }
      for (let name of srcContent) {
        copyTree(path.join(srcPath, name), path.join(dstPath, name));
      }
    });
}

function syncDirs(srcPath, dstPath) {
  fsp.rm(dstPath, { force: true, recursive: true }).then(async () => {
    copyTree(srcPath, dstPath);
  });
}

const srcPath = path.join(__dirname, 'files');
const dstPath = path.join(__dirname, 'files-copy');
syncDirs(srcPath, dstPath);
