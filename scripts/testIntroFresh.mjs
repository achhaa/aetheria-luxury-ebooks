import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-motion-'));
const proc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9345',
  '--disable-gpu',
  '--no-sandbox',
  '--no-first-run',
  '--disable-extensions',
  '--user-data-dir=' + tempDir
]);

await new Promise((r) => setTimeout(r, 2000));
try {
  // Create a clean new tab pointing to storefront
  const newTabRes = await fetch('http://127.0.0.1:9345/json/new?http://localhost:5173/', { method: 'PUT' });
  const target = await newTabRes.json();
  console.log('Target type:', target.type, 'URL:', target.url);

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res) => (ws.onopen = res));

  ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
  ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));

  // Set prefers-reduced-motion to no-preference
  ws.send(JSON.stringify({
    id: 3,
    method: 'Emulation.setEmulatedMedia',
    params: {
      features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }]
    }
  }));

  // Clear sessionStorage and reload
  ws.send(JSON.stringify({
    id: 4,
    method: 'Runtime.evaluate',
    params: {
      expression: 'sessionStorage.clear(); location.reload();',
      returnByValue: true
    }
  }));

  await new Promise((r) => setTimeout(r, 1500));

  ws.send(JSON.stringify({
    id: 5,
    method: 'Runtime.evaluate',
    params: {
      expression: `({
        url: window.location.href,
        hasRoot: Boolean(document.getElementById('root')),
        rootHtmlLen: document.getElementById('root')?.innerHTML.length,
        hasSkipBtn: Boolean(document.querySelector('button[aria-label="Skip cinematic introduction"]')),
        skipBtnText: document.querySelector('button[aria-label="Skip cinematic introduction"]')?.innerText,
        hasDialog: Boolean(document.querySelector('[role="dialog"]')),
        dialogLabel: document.querySelector('[role="dialog"]')?.getAttribute('aria-label'),
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      })`,
      returnByValue: true
    }
  }));

  const result = await new Promise((res) => {
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.id === 5) res(d.result.result.value);
    };
  });

  console.log('Fresh Session Result:', result);

  // Now test clicking Skip Intro!
  if (result.hasSkipBtn) {
    ws.send(JSON.stringify({
      id: 6,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          document.querySelector('button[aria-label="Skip cinematic introduction"]').click();
          return true;
        })()`,
        returnByValue: true
      }
    }));
    await new Promise((r) => setTimeout(r, 1400));

    ws.send(JSON.stringify({
      id: 7,
      method: 'Runtime.evaluate',
      params: {
        expression: `({
          sessionStorageIntro: sessionStorage.getItem('aetheria_intro_shown'),
          hasSkipBtnAfter: Boolean(document.querySelector('button[aria-label="Skip cinematic introduction"]')),
          hasDialogAfter: Boolean(document.querySelector('[role="dialog"]'))
        })`,
        returnByValue: true
      }
    }));

    const skipResult = await new Promise((res) => {
      ws.onmessage = (e) => {
        const d = JSON.parse(e.data);
        if (d.id === 7) res(d.result.result.value);
      };
    });

    console.log('After Skip Click (post-animation):', skipResult);

    // Test reload
    ws.send(JSON.stringify({
      id: 8,
      method: 'Runtime.evaluate',
      params: {
        expression: 'location.reload()',
        returnByValue: true
      }
    }));
    await new Promise((r) => setTimeout(r, 1500));

    ws.send(JSON.stringify({
      id: 9,
      method: 'Runtime.evaluate',
      params: {
        expression: `({
          sessionStorageIntroOnReload: sessionStorage.getItem('aetheria_intro_shown'),
          hasSkipBtnOnReload: Boolean(document.querySelector('button[aria-label="Skip cinematic introduction"]')),
          hasDialogOnReload: Boolean(document.querySelector('[role="dialog"]'))
        })`,
        returnByValue: true
      }
    }));

    const reloadResult = await new Promise((res) => {
      ws.onmessage = (e) => {
        const d = JSON.parse(e.data);
        if (d.id === 9) res(d.result.result.value);
      };
    });

    console.log('After Page Reload:', reloadResult);
  }

  ws.close();
} finally {
  proc.kill('SIGKILL');
}
