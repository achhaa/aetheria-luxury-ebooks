import fs from 'fs';

const c = fs.readFileSync('netlog_click.json', 'utf-8');
const lines = c.split('\n');

let foundBinary = 0;
let foundText = 0;

for (const line of lines) {
  if (line.includes('"opcode":2') && line.includes('"bytes"')) {
    foundBinary++;
  }
  if (line.includes('"opcode":1') && line.includes('"bytes"')) {
    foundText++;
  }
}
console.log('Binary frames with bytes:', foundBinary);
console.log('Text frames with bytes:', foundText);
