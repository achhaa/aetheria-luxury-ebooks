import http from 'http';
import { exec } from 'child_process';
import path from 'path';

const netlogPath = 'C:\\Users\\DELL\\Downloads\\aetheria-luxury-ebooks\\netlog.json';

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html><body>
      <script>
        window.speechSynthesis.onvoiceschanged = () => {
          const voices = window.speechSynthesis.getVoices();
          const voice = voices.find(v => v.name.includes('Christopher') && v.name.includes('Natural'));
          const utt = new SpeechSynthesisUtterance("Testing speech.");
          if (voice) utt.voice = voice;
          window.speechSynthesis.speak(utt);
        };
      </script>
      </body></html>
    `);
    return;
  }
  res.writeHead(404);
  res.end();
});

server.listen(3002, () => {
  console.log('Server started on 3002, launching Edge with net-log...');
  exec(`"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" --headless=new --no-sandbox --log-net-log="${netlogPath}" --net-log-capture-mode=Everything http://localhost:3002/`);
  
  setTimeout(() => {
    console.log('Stopping...');
    exec(`powershell -Command "Stop-Process -Name msedge -Force -ErrorAction SilentlyContinue"`);
    server.close();
    process.exit(0);
  }, 5000);
});
