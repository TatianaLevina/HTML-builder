const fs = require('fs');
const readline = require('node:readline');

const nameFile = '02-write-file.txt';
const streamToWrite = fs.createWriteStream(nameFile);

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Hello, Can you write down several words or phrases?');

rl.on('line', (line) => {
  if (line.match(/exit/)) {
    console.log('Goodbye!');
    rl.close();
  }
  streamToWrite.write(`${line}\n`);
});
rl.on('SIGINT', () => {
  console.log('Goodbye!');
  rl.close();
});
