const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const readline = require('node:readline');

async function readFileContent(filepath) {
  return new Promise((resolve, reject) => {
    let rl = readline.createInterface({
      input: fs.createReadStream(filepath),
    });
    let content = [];
    rl.on('line', (line) => {
      content.push(line);
    });
    rl.on('error', (e) => {
      reject(e);
    });
    rl.on('close', () => {
      resolve(content);
    });
  });
}

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) throw err;
  console.log('Directory created successfully!');
});
const streamToWrite = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'index.html'),
);
let templateFileContent = readFileContent(
  path.join(__dirname, 'template.html'),
);
templateFileContent.then(
  async (templateLines) => {
    for (let line of templateLines) {
      if (line.match('{{header}}')) {
        let headerLines = await readFileContent(
          path.join(__dirname, 'components', 'header.html'),
        );
        line = line.replace('{{header}}', headerLines.join('\n'));
      }
      if (line.match('{{articles}}')) {
        let articlesLines = await readFileContent(
          path.join(__dirname, 'components', 'articles.html'),
        );
        line = line.replace('{{articles}}', articlesLines.join('\n'));
      }
      if (line.match('{{footer}}')) {
        let footerLines = await readFileContent(
          path.join(__dirname, 'components', 'footer.html'),
        );
        line = line.replace('{{footer}}', footerLines.join('\n'));
      }
      streamToWrite.write(`${line}\n`);
    }
  },
  () => {
    console.log('Failed to read template file content');
  },
);

const streamToWriteStyle = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'style.css'),
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
          streamToWriteStyle.write(`${line}\n`);
        });
      }
    });
  },
);

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

copyTree(
  path.join(__dirname, 'assets'),
  path.join(__dirname, 'project-dist', 'assets'),
);
