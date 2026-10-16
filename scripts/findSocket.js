import fs from 'fs';

const c = fs.readFileSync('netlog_click.json', 'utf-8');
const lines = c.split('\n');

for (const line of lines) {
  if (line.includes('api.msedgeservices.com') && line.includes('CONNECT')) {
    console.log(line);
  }
}
