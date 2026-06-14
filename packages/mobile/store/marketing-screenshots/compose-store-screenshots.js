// Compone gli screenshot di marketing per il Play Store (1920x1080, 16:9) a partire
// dagli screenshot grezzi catturati dall'emulatore (cartella ./source).
// Sopra ogni screenshot aggiunge una caption "story-flow" su sfondo brand.
// Crop della nav bar Android: sorgente 2400x1080, area usabile 2274px.
//
// Uso:  node compose-store-screenshots.js en   (oppure: it)
// Output: ./en-1.png ... en-5.png  /  it-1.png ... it-5.png
// Dipendenze: puppeteer-core globale (npm i -g puppeteer-core) + Chrome di sistema.

const path = require('path');
const fs = require('fs');
const puppeteer = require(path.join(
  process.env.APPDATA || 'C:/Users/cinqu/AppData/Roaming',
  'npm/node_modules', 'puppeteer-core'
));

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SHOTS = path.join(__dirname, 'source');   // screenshot grezzi dall'emulatore
const OUT = __dirname;                           // output nella cartella corrente

// crop nav bar: sorgente 2400x1080, area usabile 2274px di larghezza
// div W=1580 -> H = 1580*1080/2274 = 750 ; background-size width = 1580*2400/2274 = 1667
const W = 1580, H = 750, BG = 1667;

const SETS = {
  en: [
    { src: '01-match.png',    over: 'BEYBLADE X SCORE',    title: 'The scoreboard for real Beyblade X battles', sub: 'Spin · Burst · Over · Xtreme — one tap each' },
    { src: '00-initial.png',  over: 'OFFICIAL SCORING',     title: 'All 4 finish types, built in',               sub: 'Spin 1 · Burst 2 · Over 2 · Xtreme 3' },
    { src: '02-victory.png',  over: 'WIN TRACKING',         title: 'Celebrate every win',                         sub: 'Session victories with animated overlays' },
    { src: '04-settings.png', over: 'YOUR RULES',           title: 'Set your own win score',                      sub: 'Win score 3–999 · optional foul limit' },
    { src: '06-info.png',     over: 'MADE FOR BLADERS',     title: 'Easy for every blader',                       sub: 'Built-in 3·2·1 voice countdown · works offline' },
  ],
  it: [
    { src: '01-match.png',    over: 'BEYBLADE X SCORE',     title: 'Il tabellone per le vere battle Beyblade X', sub: 'Spin · Burst · Over · Xtreme — un tap' },
    { src: '00-initial.png',  over: 'PUNTEGGIO UFFICIALE',  title: 'Tutti e 4 i finish, integrati',             sub: 'Spin 1 · Burst 2 · Over 2 · Xtreme 3' },
    { src: '02-victory.png',  over: 'CONTEGGIO VITTORIE',   title: 'Festeggia ogni vittoria',                   sub: 'Vittorie di sessione con animazioni' },
    { src: '04-settings.png', over: 'LE TUE REGOLE',        title: 'Imposta il punteggio vittoria',             sub: 'Punteggio 3–999 · limite falli opzionale' },
    { src: '06-info.png',     over: 'PER OGNI BLADER',      title: 'Facile per ogni blader',                    sub: 'Countdown vocale 3·2·1 · funziona offline' },
  ],
};

function html(item) {
  const b64 = fs.readFileSync(path.join(SHOTS, item.src)).toString('base64');
  const src = 'data:image/png;base64,' + b64;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif}
  html,body{width:1920px;height:1080px;overflow:hidden}
  .stage{width:1920px;height:1080px;position:relative;
    background:radial-gradient(1200px 700px at 50% -10%, #1d4ed8 0%, rgba(29,78,216,0) 55%), linear-gradient(160deg,#0b1220 0%,#111f3a 50%,#0a0f1c 100%);
    display:flex;flex-direction:column;align-items:center}
  .cap{padding:54px 80px 0;text-align:center}
  .over{color:#7dd3fc;font-size:26px;font-weight:700;letter-spacing:4px;text-transform:uppercase;margin-bottom:14px}
  .title{color:#fff;font-size:62px;font-weight:800;line-height:1.05;letter-spacing:-0.5px;text-shadow:0 2px 18px rgba(0,0,0,.45)}
  .sub{color:#cbd5e1;font-size:30px;font-weight:500;margin-top:16px}
  .shotwrap{margin-top:34px;border-radius:22px;overflow:hidden;
    box-shadow:0 30px 70px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.08);}
  .shot{width:${W}px;height:${H}px;background-image:url('${src}');
    background-repeat:no-repeat;background-position:left top;background-size:${BG}px auto}
  </style></head><body>
  <div class="stage">
    <div class="cap">
      <div class="over">${item.over}</div>
      <div class="title">${item.title}</div>
      <div class="sub">${item.sub}</div>
    </div>
    <div class="shotwrap"><div class="shot"></div></div>
  </div></body></html>`;
}

(async () => {
  const lang = process.argv[2] || 'en';
  const items = SETS[lang];
  if (!items) { console.error('lingua non valida, usa: en | it'); process.exit(1); }
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  for (let i = 0; i < items.length; i++) {
    await page.setContent(html(items[i]), { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 500));
    const outFile = path.join(OUT, `${lang}-${i + 1}.png`);
    await page.screenshot({ path: outFile, type: 'png', clip: { x: 0, y: 0, width: 1920, height: 1080 } });
    console.log('saved', outFile);
  }
  await browser.close();
})();
