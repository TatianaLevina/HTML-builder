const fs = require('fs');
const path = require('path');

const nameFile = 'text.txt';
const absolutePath = path.join(__dirname, nameFile);
const stream = fs.createReadStream(absolutePath);
stream.on('readable', () => {
  console.log(`readable: ${stream.read()}`);
});
stream.on('end', () => {
  console.log('end');
});
