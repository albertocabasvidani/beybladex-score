const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaRobot, FaMobileAlt, FaGithub, FaGooglePlay, FaKey, FaGlobeEurope,
  FaAd, FaShoppingCart, FaCoins,
  FaBullseye, FaComments, FaCube, FaSyncAlt, FaClipboardCheck, FaRocket,
  FaRegCommentDots, FaHandPointer, FaProjectDiagram, FaCode, FaCloudUploadAlt,
  FaVial, FaChrome, FaUsb, FaStore, FaBalanceScale, FaSearchDollar, FaBookOpen,
  FaEye, FaBolt, FaLayerGroup, FaCogs, FaExclamationTriangle, FaShieldAlt,
} = require("react-icons/fa");

// Palette
const BG = "0B1226";
const CARD = "16203F";
const CARDLINE = "2A3A6B";
const CYAN = "2BD9E5";
const CYANDARK = "0E3A44";
const WHITE = "F4F7FF";
const MUTED = "AEBDE0";
const GOLD = "F5C84C";

const HEAD = "Arial Black";
const BODY = "Arial";

function renderIconSvg(IconComponent, color, size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}
async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

async function main() {
  const defs = {
    robot: FaRobot, phone: FaMobileAlt, github: FaGithub, play: FaGooglePlay,
    key: FaKey, globe: FaGlobeEurope, ad: FaAd, cart: FaShoppingCart,
    bullseye: FaBullseye, comments: FaComments, cube: FaCube, sync: FaSyncAlt,
    clipboard: FaClipboardCheck, rocket: FaRocket, listen: FaRegCommentDots,
    pick: FaHandPointer, plan: FaProjectDiagram, code: FaCode, upload: FaCloudUploadAlt,
    vial: FaVial, chrome: FaChrome, usb: FaUsb, store: FaStore,
    scale: FaBalanceScale, dollar: FaSearchDollar, book: FaBookOpen,
    eye: FaEye, bolt: FaBolt, layers: FaLayerGroup, cogs: FaCogs,
    warning: FaExclamationTriangle, shield: FaShieldAlt,
  };
  const I = {};
  for (const [name, comp] of Object.entries(defs)) {
    I[name] = await iconToBase64Png(comp, "#" + CYAN);
  }
  I.coinsGold = await iconToBase64Png(FaCoins, "#" + GOLD);

  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Alberto Cabas Vidani";
  pres.title = "Un'app con l'AI: strumenti, costi e metodo";

  function baseSlide(kicker, title) {
    const s = pres.addSlide();
    s.background = { color: BG };
    s.addText(kicker, {
      x: 0.7, y: 0.4, w: 9.0, h: 0.3, margin: 0,
      fontFace: BODY, fontSize: 11, color: CYAN, charSpacing: 2, bold: true,
    });
    s.addText(title, {
      x: 0.7, y: 0.7, w: 8.6, h: 0.62, margin: 0,
      fontFace: HEAD, fontSize: 30, color: WHITE,
    });
    return s;
  }
  function panel(s, x, y, w, h, accent) {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w, h, rectRadius: 0.08,
      fill: { color: CARD }, line: { color: accent || CARDLINE, width: accent ? 1.1 : 0.75 },
    });
  }
  function iconCircle(s, x, y, d, icon, ring) {
    s.addShape(pres.shapes.OVAL, {
      x, y, w: d, h: d, fill: { color: CYANDARK },
      line: ring ? { color: CYAN, width: 0.75 } : { color: CYANDARK, width: 0 },
    });
    const pad = d * 0.27;
    s.addImage({ data: icon, x: x + pad, y: y + pad, w: d - 2 * pad, h: d - 2 * pad });
  }
  // card with icon top-left, number top-right, title + desc below
  function stepCard(s, { x, y, w, h, icon, num, name, desc }) {
    panel(s, x, y, w, h);
    iconCircle(s, x + 0.22, y + 0.2, 0.5, icon);
    if (num) {
      s.addText(num, { x: x + w - 0.72, y: y + 0.24, w: 0.5, h: 0.34, margin: 0, align: "right", valign: "middle", fontFace: HEAD, fontSize: 13, color: CYAN });
    }
    s.addText(name, { x: x + 0.22, y: y + 0.78, w: w - 0.44, h: 0.34, margin: 0, valign: "middle", fontFace: BODY, fontSize: 13, bold: true, color: WHITE });
    s.addText(desc, { x: x + 0.22, y: y + 1.12, w: w - 0.44, h: h - 1.24, margin: 0, valign: "top", fontFace: BODY, fontSize: 10, color: MUTED, lineSpacingMultiple: 1.12 });
  }
  // wide card: icon-left header, desc below
  function wideCard(s, { x, y, w, h, icon, name, desc, accent }) {
    panel(s, x, y, w, h, accent);
    iconCircle(s, x + 0.25, y + 0.25, 0.55, icon);
    s.addText(name, { x: x + 0.95, y: y + 0.25, w: w - 1.15, h: 0.55, margin: 0, valign: "middle", fontFace: BODY, fontSize: 15, bold: true, color: WHITE });
    s.addText(desc, { x: x + 0.25, y: y + 0.92, w: w - 0.5, h: h - 1.05, margin: 0, valign: "top", fontFace: BODY, fontSize: 11.5, color: MUTED, lineSpacingMultiple: 1.18 });
  }
  function stepDots(s, idx, total) {
    const y = 4.95, x0 = 1.1, x1 = 8.9, span = x1 - x0;
    const gap = total > 1 ? span / (total - 1) : 0;
    s.addShape(pres.shapes.LINE, { x: x0, y, w: span, h: 0, line: { color: CARDLINE, width: 1 } });
    for (let i = 0; i < total; i++) {
      const cx = x0 + i * gap, cur = i === idx, d = cur ? 0.3 : 0.17;
      s.addShape(pres.shapes.OVAL, { x: cx - d / 2, y: y - d / 2, w: d, h: d, fill: { color: cur ? CYAN : CARD }, line: { color: cur ? CYAN : CARDLINE, width: cur ? 0 : 1 } });
      s.addText(String(i + 1), { x: cx - 0.3, y: y + 0.16, w: 0.6, h: 0.25, margin: 0, align: "center", fontFace: BODY, fontSize: 10, color: cur ? CYAN : MUTED, bold: cur });
    }
  }
  function stepSlide(sectionKicker, idx, total, step) {
    const s = pres.addSlide();
    s.background = { color: BG };
    s.addText(sectionKicker + " · PASSO " + (idx + 1) + " DI " + total, {
      x: 0.72, y: 0.55, w: 8.5, h: 0.3, margin: 0,
      fontFace: BODY, fontSize: 12, color: CYAN, charSpacing: 2, bold: true,
    });
    s.addText(step.name, { x: 0.7, y: 1.0, w: 5.6, h: 1.0, margin: 0, valign: "top", fontFace: HEAD, fontSize: 36, color: WHITE });
    s.addText(step.desc, { x: 0.72, y: 2.35, w: 5.5, h: 1.9, margin: 0, valign: "top", fontFace: BODY, fontSize: 17, color: MUTED, lineSpacingMultiple: 1.45 });
    panel(s, 6.55, 1.45, 2.5, 2.5, CYAN);
    iconCircle(s, 7.0, 1.9, 1.6, step.icon, true);
    stepDots(s, idx, total);
    return s;
  }
  function noteSlide(kicker, title, intro, cardA, cardB, footer) {
    const s = baseSlide(kicker, title);
    s.addText(intro, { x: 0.72, y: 1.3, w: 8.5, h: 0.34, margin: 0, fontFace: BODY, fontSize: 13.5, italic: true, color: MUTED });
    wideCard(s, { x: 0.7, y: 1.9, w: 4.15, h: 2.4, ...cardA });
    wideCard(s, { x: 5.15, y: 1.9, w: 4.15, h: 2.4, ...cardB });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 4.55, w: 8.6, h: 0.62, rectRadius: 0.06, fill: { color: CYANDARK }, line: { color: CYAN, width: 0.5 } });
    s.addText(footer, { x: 0.9, y: 4.55, w: 8.2, h: 0.62, margin: 0, align: "center", valign: "middle", fontFace: BODY, fontSize: 12.5, color: WHITE });
    return s;
  }
  function listSlide(kicker, title, subtitle, items) {
    const s = baseSlide(kicker, title);
    s.addText(subtitle, { x: 0.72, y: 1.3, w: 8.5, h: 0.3, margin: 0, fontFace: BODY, fontSize: 13, italic: true, color: MUTED });
    const startY = 1.85, endY = 5.25, n = items.length, step = (endY - startY) / n;
    items.forEach((it, i) => {
      const y = startY + i * step;
      s.addText("0" + (i + 1), { x: 0.95, y, w: 0.75, h: step - 0.06, margin: 0, valign: "middle", fontFace: HEAD, fontSize: 22, color: CYAN });
      s.addText(it, { x: 1.8, y, w: 7.3, h: step - 0.06, margin: 0, valign: "middle", fontFace: BODY, fontSize: 19, color: WHITE });
      if (i < n - 1) s.addShape(pres.shapes.LINE, { x: 1.8, y: y + step - 0.04, w: 7.2, h: 0, line: { color: CARDLINE, width: 0.75 } });
    });
    return s;
  }

  // ---------- 1. Copertina ----------
  {
    const s = pres.addSlide();
    s.background = { color: BG };
    s.addShape(pres.shapes.OVAL, { x: 6.4, y: 0.9, w: 3.4, h: 3.4, fill: { color: BG, transparency: 100 }, line: { color: CYAN, width: 1.5, transparency: 70 } });
    s.addShape(pres.shapes.OVAL, { x: 6.8, y: 1.3, w: 2.6, h: 2.6, fill: { color: BG, transparency: 100 }, line: { color: CYAN, width: 1.5, transparency: 45 } });
    s.addShape(pres.shapes.OVAL, { x: 7.2, y: 1.7, w: 1.8, h: 1.8, fill: { color: BG, transparency: 100 }, line: { color: CYAN, width: 2, transparency: 15 } });
    s.addShape(pres.shapes.OVAL, { x: 7.95, y: 2.45, w: 0.3, h: 0.3, fill: { color: CYAN } });
    s.addText("LA STORIA DI BEYBLADE SCORE", { x: 0.7, y: 1.0, w: 6.0, h: 0.32, margin: 0, fontFace: BODY, fontSize: 12, color: CYAN, charSpacing: 3, bold: true });
    s.addText([
      { text: "Un'app sul Play Store.", options: { breakLine: true } },
      { text: "Zero righe di codice.", options: { color: CYAN } },
    ], { x: 0.7, y: 1.35, w: 6.3, h: 1.7, margin: 0, fontFace: HEAD, fontSize: 34, color: WHITE, lineSpacingMultiple: 1.1 });
    s.addText("Strumenti, costi e metodo per creare un prodotto vero con l'AI", { x: 0.7, y: 3.15, w: 5.9, h: 0.5, margin: 0, fontFace: BODY, fontSize: 15, color: MUTED });
    const stats = [["0", "righe scritte a mano"], ["17", "versioni rilasciate"], ["1 mese", "dall'idea al Play Store"]];
    stats.forEach(([num, label], i) => {
      const x = 0.7 + i * 2.95;
      s.addText(num, { x, y: 4.35, w: 2.7, h: 0.55, margin: 0, fontFace: HEAD, fontSize: 26, color: GOLD });
      s.addText(label, { x, y: 4.92, w: 2.7, h: 0.3, margin: 0, fontFace: BODY, fontSize: 11.5, color: MUTED });
    });
  }

  // ---------- 2. Strumenti · Creazione (3 card) ----------
  {
    const s = baseSlide("GLI STRUMENTI · 1 DI 3", "Creazione");
    const cards = [
      { icon: I.robot, name: "Claude Code", desc: "Il costruttore. Scrive codice, interfaccia, script e testi: tu descrivi in italiano, lui realizza e corregge." },
      { icon: I.phone, name: "Emulatore Android", desc: "Un telefono virtuale sul PC. L'AI ci installa l'app, la prova da sola e verifica le modifiche." },
      { icon: I.github, name: "GitHub", desc: "L'archivio del progetto. Ogni versione salvata, ogni modifica documentata e reversibile." },
    ];
    cards.forEach((c, i) => {
      const x = 0.7 + i * 2.95;
      panel(s, x, 1.7, 2.73, 2.65);
      iconCircle(s, x + 0.25, 1.95, 0.55, c.icon);
      s.addText(c.name, { x: x + 0.25, y: 2.62, w: 2.23, h: 0.55, margin: 0, valign: "top", fontFace: BODY, fontSize: 15, bold: true, color: WHITE });
      s.addText(c.desc, { x: x + 0.25, y: 3.2, w: 2.23, h: 1.0, margin: 0, valign: "top", fontFace: BODY, fontSize: 11, color: MUTED, lineSpacingMultiple: 1.18 });
    });
    s.addText("Pochi strumenti, tutti guidati a parole.", { x: 0.7, y: 4.65, w: 8.6, h: 0.45, margin: 0, align: "center", valign: "middle", fontFace: BODY, fontSize: 13, italic: true, color: CYAN });
  }

  // ---------- 3. Strumenti · Pubblicazione ----------
  {
    const s = baseSlide("GLI STRUMENTI · 2 DI 3", "Pubblicazione");
    const cards = [
      { icon: I.play, name: "Google Play Console", desc: "La porta verso gli utenti Android: caricamento dell'app, revisione di Google, distribuzione in tutto il mondo, statistiche." },
      { icon: I.key, name: "Expo EAS", desc: "La firma digitale dell'app: certifica che ogni aggiornamento arriva davvero dall'autore originale." },
      { icon: I.globe, name: "GitHub Pages", desc: "La versione web gratuita: stessa app, dentro il browser, senza installare nulla. Online in un click." },
    ];
    cards.forEach((c, i) => {
      const x = 0.7 + i * 2.95;
      panel(s, x, 1.6, 2.73, 2.65);
      iconCircle(s, x + 0.25, 1.85, 0.55, c.icon);
      s.addText(c.name, { x: x + 0.25, y: 2.5, w: 2.23, h: 0.65, margin: 0, valign: "top", fontFace: BODY, fontSize: 14.5, bold: true, color: WHITE });
      s.addText(c.desc, { x: x + 0.25, y: 3.12, w: 2.23, h: 1.0, margin: 0, valign: "top", fontFace: BODY, fontSize: 10.5, color: MUTED, lineSpacingMultiple: 1.15 });
    });
    s.addText("Un solo progetto, due piattaforme: Android e web.", { x: 0.7, y: 4.6, w: 8.6, h: 0.45, margin: 0, align: "center", valign: "middle", fontFace: BODY, fontSize: 13, italic: true, color: CYAN });
  }

  // ---------- 4. Strumenti · Monetizzazione ----------
  {
    const s = baseSlide("GLI STRUMENTI · 3 DI 3", "Monetizzazione");
    wideCard(s, { x: 0.7, y: 1.55, w: 4.15, h: 1.95, icon: I.ad, name: "Google AdMob", desc: "Banner pubblicitari a fine partita. Si attiva gratis: Google vende gli spazi e gira la quota dei ricavi all'autore." });
    wideCard(s, { x: 5.15, y: 1.55, w: 4.15, h: 1.95, icon: I.cart, name: "RevenueCat", desc: "Gestisce l'acquisto in-app «Rimuovi pubblicità». Gratuito fino a 2.500 $ al mese di incassi." });
    const steps = ["Scarichi gratis", "Vedi la pubblicità", "Un acquisto la toglie per sempre"];
    s.addText("Il modello freemium", { x: 0.7, y: 3.62, w: 8.6, h: 0.3, margin: 0, fontFace: BODY, fontSize: 11, color: MUTED, charSpacing: 2, bold: true });
    steps.forEach((t, i) => {
      const x = 0.7 + i * 3.0;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 4.0, w: 2.6, h: 0.85, rectRadius: 0.08, fill: { color: CYANDARK }, line: { color: CYAN, width: 0.75 } });
      s.addText(t, { x: x + 0.12, y: 4.0, w: 2.36, h: 0.85, margin: 0, align: "center", valign: "middle", fontFace: BODY, fontSize: 11.5, bold: true, color: WHITE, lineSpacingMultiple: 1.1 });
      if (i < 2) s.addText("→", { x: x + 2.6, y: 4.0, w: 0.4, h: 0.85, margin: 0, align: "center", valign: "middle", fontFace: BODY, fontSize: 16, color: CYAN });
    });
  }

  // ---------- 5. Costi ----------
  {
    const s = baseSlide("IL BUDGET", "Quanto costa davvero");
    const rows = [
      ["Claude (abbonamento)", "Il vero costo di sviluppo: l'AI che costruisce tutto", "20–100 €/mese"],
      ["Google Play Console", "Account sviluppatore una tantum, vale per tutte le app future", "25 €"],
      ["Tutto il resto", "GitHub, Expo, emulatore, AdMob, RevenueCat", "0 €"],
    ];
    rows.forEach(([name, sub, price], i) => {
      const y = 1.65 + i * 1.0;
      panel(s, 0.7, y, 8.6, 0.86);
      s.addText(name, { x: 0.95, y: y + 0.13, w: 5.4, h: 0.34, margin: 0, fontFace: BODY, fontSize: 14, bold: true, color: WHITE });
      s.addText(sub, { x: 0.95, y: y + 0.47, w: 5.6, h: 0.3, margin: 0, fontFace: BODY, fontSize: 10.5, color: MUTED });
      s.addText(price, { x: 6.5, y, w: 2.6, h: 0.86, margin: 0, align: "right", valign: "middle", fontFace: HEAD, fontSize: 17, color: GOLD });
    });
    s.addText("Nessun team, nessun budget di sviluppo: un abbonamento all'AI e un account sviluppatore.", { x: 0.7, y: 4.85, w: 8.6, h: 0.45, margin: 0, align: "center", valign: "middle", fontFace: BODY, fontSize: 13, italic: true, color: CYAN });
  }

  // ---------- 6. Prima release · lista ----------
  listSlide("IL METODO · DALL'IDEA AL LANCIO", "La prima release", "I passi, in breve", [
    "Parti dal problema", "Descrivi all'AI", "Ottieni un prototipo",
    "Itera a parole", "Prepara il lancio", "Pubblica",
  ]);

  // ---------- 7-12. Prima release · un passo per slide ----------
  {
    const steps = [
      { icon: I.bullseye, name: "Parti dal problema", desc: "Un utente preciso, un bisogno reale, la funzione minima che lo risolve. Senza un problema vero, nessuno strumento serve." },
      { icon: I.comments, name: "Descrivi all'AI", desc: "Un brief in linguaggio naturale: cosa deve fare l'app, non come. Le tecnologie giuste le sceglie l'AI." },
      { icon: I.cube, name: "Ottieni un prototipo", desc: "Una versione da toccare subito, anche imperfetta. Prima la web app, poi quella mobile: vederla funzionare cambia tutto." },
      { icon: I.sync, name: "Itera a parole", desc: "Usa l'app, descrivi cosa non va, l'AI corregge. Ripeti finché ti convince: è qui che il prodotto prende forma." },
      { icon: I.clipboard, name: "Prepara il lancio", desc: "Nome, icona, privacy policy, scheda dello store: li scrive l'AI, tu li leggi e li approvi." },
      { icon: I.rocket, name: "Pubblica", desc: "Firma digitale, caricamento, revisione di Google. Poi la tua app è online, in mano a chiunque nel mondo." },
    ];
    steps.forEach((st, i) => stepSlide("LA PRIMA RELEASE", i, steps.length, st));
  }

  // ---------- 8. Aggiornamenti · lista ----------
  listSlide("IL METODO · DOPO IL LANCIO", "Gli aggiornamenti", "I passi, in breve", [
    "Ascolta", "Scegli una cosa", "Pianifica", "Implementa e prova", "Rilascia spesso",
  ]);

  // ---------- 14-18. Aggiornamenti · un passo per slide (con Pianifica) ----------
  {
    const steps = [
      { icon: I.listen, name: "Ascolta", desc: "Recensioni, statistiche, uso reale: a decidere sono i dati, non le supposizioni." },
      { icon: I.pick, name: "Scegli una cosa", desc: "Una sola modifica per versione: piccola, chiara, verificabile. Un cambiamento alla volta." },
      { icon: I.plan, name: "Pianifica", desc: "Architettura, strumenti, costi: prima di toccare il codice, l'AI ti aiuta a decidere come farla." },
      { icon: I.code, name: "Implementa e prova", desc: "L'AI sviluppa la modifica e la testa; tu la validi sul telefono vero prima di rilasciare." },
      { icon: I.upload, name: "Rilascia spesso", desc: "Versioni frequenti: 17 in quattro mesi. Ogni release è un piccolo esperimento sul campo." },
    ];
    steps.forEach((st, i) => stepSlide("GLI AGGIORNAMENTI", i, steps.length, st));
  }

  // ---------- 10. Chiedilo a Claude Code · intro ----------
  {
    const s = baseSlide("IL MOLTIPLICATORE", "Chiedilo a Claude Code");
    s.addText([
      { text: "Ogni passo del processo può essere ", options: {} },
      { text: "informato", options: { color: CYAN, bold: true } },
      { text: " — o, meglio ancora, ", options: {} },
      { text: "realizzato", options: { color: CYAN, bold: true } },
      { text: " — direttamente da Claude Code.", options: {} },
    ], { x: 0.72, y: 1.55, w: 8.5, h: 1.0, margin: 0, fontFace: BODY, fontSize: 18, color: WHITE, lineSpacingMultiple: 1.3 });
    const phases = [
      { icon: I.plan, name: "Pianifica", sub: "decide come farla" },
      { icon: I.code, name: "Implementa", sub: "la costruisce" },
      { icon: I.vial, name: "Testa", sub: "la verifica" },
    ];
    phases.forEach((p, i) => {
      const x = 0.7 + i * 2.95;
      panel(s, x, 3.1, 2.73, 1.85, CYAN);
      iconCircle(s, x + 1.1, 3.35, 0.55, p.icon, true);
      s.addText(p.name, { x, y: 4.05, w: 2.73, h: 0.4, margin: 0, align: "center", fontFace: BODY, fontSize: 16, bold: true, color: WHITE });
      s.addText(p.sub, { x, y: 4.45, w: 2.73, h: 0.35, margin: 0, align: "center", fontFace: BODY, fontSize: 12, color: MUTED });
    });
  }

  // ---------- 11. Pianifica ----------
  {
    const s = baseSlide("CHIEDILO A CLAUDE CODE · 1 · PIANIFICA", "Pianifica");
    s.addText("Prima di scrivere una riga di codice, Claude Code è il tuo consulente.", { x: 0.72, y: 1.3, w: 8.5, h: 0.32, margin: 0, fontFace: BODY, fontSize: 13.5, italic: true, color: MUTED });
    const caps = [
      { icon: I.plan, name: "Architettura", desc: "come strutturare l'app e i suoi pezzi" },
      { icon: I.cube, name: "Strumenti", desc: "quali librerie e servizi conviene usare" },
      { icon: I.scale, name: "Alternative", desc: "confronta più soluzioni e ti spiega i compromessi" },
      { icon: I.dollar, name: "Costi", desc: "stima la spesa prima di iniziare" },
      { icon: I.store, name: "Mercato", desc: "ricerche su concorrenti e domanda reale" },
    ];
    const startY = 1.85, step = 0.66;
    caps.forEach((c, i) => {
      const y = startY + i * step;
      iconCircle(s, 0.85, y + 0.05, 0.5, c.icon);
      s.addText([
        { text: c.name + "  ", options: { bold: true, color: WHITE } },
        { text: "— " + c.desc, options: { color: MUTED } },
      ], { x: 1.55, y, w: 7.6, h: 0.6, margin: 0, valign: "middle", fontFace: BODY, fontSize: 14.5 });
      if (i < caps.length - 1) s.addShape(pres.shapes.LINE, { x: 1.55, y: y + step - 0.05, w: 7.55, h: 0, line: { color: CARDLINE, width: 0.5 } });
    });
  }

  // ---------- 12. Implementa ----------
  {
    const s = baseSlide("CHIEDILO A CLAUDE CODE · 2 · IMPLEMENTA", "Implementa");
    s.addText("Non solo codice: anche tutte le istruzioni per arrivare in fondo.", { x: 0.72, y: 1.3, w: 8.5, h: 0.32, margin: 0, fontFace: BODY, fontSize: 13.5, italic: true, color: MUTED });
    wideCard(s, { x: 0.7, y: 1.85, w: 4.15, h: 2.7, icon: I.code, name: "Scrive il codice", desc: "L'app, gli script di build, i testi dello store. Tu descrivi cosa vuoi, lui costruisce e corregge finché funziona." });
    wideCard(s, { x: 5.15, y: 1.85, w: 4.15, h: 2.7, icon: I.book, name: "Ti guida passo-passo", desc: "Come aprire l'account sviluppatore, configurare i servizi, firmare e caricare l'app. Le guide operative, non solo il codice." });
    s.addText("Resti tu al comando: leggi, capisci, approvi.", { x: 0.7, y: 4.75, w: 8.6, h: 0.4, margin: 0, align: "center", valign: "middle", fontFace: BODY, fontSize: 13, italic: true, color: CYAN });
  }

  // ---------- 13. Testa ----------
  {
    const s = baseSlide("CHIEDILO A CLAUDE CODE · 3 · TESTA", "Testa");
    s.addText("Fino al 90% dei test li fa Claude da solo — in due modi.", { x: 0.72, y: 1.3, w: 8.5, h: 0.32, margin: 0, fontFace: BODY, fontSize: 13.5, italic: true, color: MUTED });
    wideCard(s, { x: 0.7, y: 1.85, w: 4.15, h: 2.55, icon: I.chrome, name: "Nel browser", desc: "Claude crea una web app identica alla tua app Android e la prova lui stesso, con Claude in Chrome, direttamente nel tuo browser." });
    wideCard(s, { x: 5.15, y: 1.85, w: 4.15, h: 2.55, icon: I.usb, name: "Sul telefono", desc: "Colleghi il telefono via USB e gli dai accesso con ADB (o l'equivalente Apple). Fa screenshot, tocca i punti giusti, verifica i risultati e valuta anche i video." });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 4.6, w: 8.6, h: 0.6, rectRadius: 0.06, fill: { color: CYANDARK }, line: { color: CYAN, width: 0.5 } });
    s.addText("Ti spiega anche come autorizzare l'accesso al telefono, passo per passo.", { x: 0.9, y: 4.6, w: 8.2, h: 0.6, margin: 0, align: "center", valign: "middle", fontFace: BODY, fontSize: 12.5, color: WHITE });
  }

  // ---------- Da tenere a mente · intro ----------
  {
    const s = baseSlide("DA TENERE A MENTE", "Tre accortezze trasversali");
    s.addText([
      { text: "Non sono fasi in sequenza: sono ", options: {} },
      { text: "abitudini", options: { color: CYAN, bold: true } },
      { text: " valide a ogni modifica, che ti risparmiano tempo e brutte sorprese.", options: {} },
    ], { x: 0.72, y: 1.55, w: 8.5, h: 1.0, margin: 0, fontFace: BODY, fontSize: 18, color: WHITE, lineSpacingMultiple: 1.3 });
    const items = [
      { icon: I.vial, name: "Testa sempre", sub: "doppia verifica" },
      { icon: I.cogs, name: "Occhio alla build", sub: "tempo e CPU" },
      { icon: I.book, name: "Leggi le regole", sub: "dello store" },
    ];
    items.forEach((p, i) => {
      const x = 0.7 + i * 2.95;
      panel(s, x, 3.1, 2.73, 1.85, CYAN);
      iconCircle(s, x + 1.1, 3.35, 0.55, p.icon, true);
      s.addText(p.name, { x, y: 4.05, w: 2.73, h: 0.4, margin: 0, align: "center", fontFace: BODY, fontSize: 16, bold: true, color: WHITE });
      s.addText(p.sub, { x, y: 4.45, w: 2.73, h: 0.35, margin: 0, align: "center", fontFace: BODY, fontSize: 12, color: MUTED });
    });
  }

  // ---------- Da tenere a mente · 1 · Testa sempre ----------
  noteSlide(
    "DA TENERE A MENTE · 1 · TESTA SEMPRE", "Testa sempre",
    "Niente va online senza una verifica doppia.",
    { icon: I.robot, name: "Fallo provare a Claude", desc: "Ogni volta che finalizzi una modifica, almeno un test automatico: Claude installa l'app, la prova e verifica che funzioni." },
    { icon: I.eye, name: "Dai l'occhiata finale", desc: "Poi sempre un controllo umano, tuo, prima di pubblicare. L'ultimo sguardo lo dai tu." },
    "Una modifica finalizzata = un test di Claude + un'occhiata tua, ogni volta."
  );

  // ---------- Da tenere a mente · 2 · Occhio alla build ----------
  noteSlide(
    "DA TENERE A MENTE · 2 · OCCHIO ALLA BUILD", "Occhio alla compilazione",
    "Compilare l'app costa minuti e CPU: trattala come una risorsa preziosa.",
    { icon: I.bolt, name: "Build ottimizzata", desc: "Chiedi a Claude la compilazione più adatta all'uso: la versione di test si genera molto più in fretta di quella per lo store." },
    { icon: I.layers, name: "Solo quando serve", desc: "Accorpa le modifiche e compila una volta sola. Ricompilare per ogni micro-cambiamento è tempo buttato." },
    "Su un computer normale una build può prendere 10 minuti e rallentare tutto."
  );

  // ---------- Da tenere a mente · 3 · Leggi le regole ----------
  noteSlide(
    "DA TENERE A MENTE · 3 · LE REGOLE DELLO STORE", "Leggi le regole dello store",
    "Gli store hanno regole che cambiano nel tempo — e non riguardano solo il codice.",
    { icon: I.book, name: "Falle leggere a Claude", desc: "Requisiti su come scrivere il codice, come compilare, su icona, testi, permessi e privacy: falle leggere bene prima di iniziare." },
    { icon: I.warning, name: "Un dettaglio può bloccarti", desc: "A volte basta un'icona o un testo fuori regola per dover ricompilare e ricaricare tutto, anche col codice perfetto." },
    "Le regole di pubblicazione cambiano: ricontrollale a ogni release importante."
  );

  await pres.writeFile({ fileName: "slide-video-ai.pptx" });
  console.log("DONE slide-video-ai.pptx");
}

main().catch((e) => { console.error(e); process.exit(1); });
