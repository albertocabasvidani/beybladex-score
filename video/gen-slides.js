const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaRobot, FaMicrophoneAlt, FaMobileAlt, FaGithub,
  FaGooglePlay, FaKey, FaGlobeEurope,
  FaAd, FaShoppingCart, FaInfoCircle, FaPiggyBank,
} = require("react-icons/fa");

// Palette
const BG = "0B1226";        // sfondo midnight navy
const CARD = "16203F";      // card
const CARDLINE = "2A3A6B";  // bordo card
const CYAN = "2BD9E5";      // accento principale
const CYANDARK = "0E3A44";  // cerchio icone
const WHITE = "F4F7FF";
const MUTED = "AEBDE0";
const GOLD = "F5C84C";      // accento numeri/denaro

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
  const icons = {};
  const defs = {
    robot: FaRobot, mic: FaMicrophoneAlt, phone: FaMobileAlt, github: FaGithub,
    play: FaGooglePlay, key: FaKey, globe: FaGlobeEurope,
    ad: FaAd, cart: FaShoppingCart, info: FaInfoCircle, piggy: FaPiggyBank,
  };
  for (const [name, comp] of Object.entries(defs)) {
    icons[name] = await iconToBase64Png(comp, "#" + CYAN);
  }
  icons.piggyGold = await iconToBase64Png(FaPiggyBank, "#" + GOLD);

  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Alberto Cabas Vidani";
  pres.title = "Un'app con l'AI: strumenti, costi e metodo";

  function baseSlide(kicker, title) {
    const s = pres.addSlide();
    s.background = { color: BG };
    s.addText(kicker, {
      x: 0.7, y: 0.38, w: 8.6, h: 0.3, margin: 0,
      fontFace: BODY, fontSize: 11, color: CYAN, charSpacing: 3, bold: true,
    });
    s.addText(title, {
      x: 0.7, y: 0.68, w: 8.6, h: 0.62, margin: 0,
      fontFace: HEAD, fontSize: 30, color: WHITE,
    });
    return s;
  }

  function toolCard(s, { x, y, w, h, icon, name, desc }) {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w, h, rectRadius: 0.08,
      fill: { color: CARD }, line: { color: CARDLINE, width: 0.75 },
    });
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.25, y: y + 0.25, w: 0.52, h: 0.52, fill: { color: CYANDARK },
    });
    s.addImage({ data: icon, x: x + 0.38, y: y + 0.38, w: 0.26, h: 0.26 });
    s.addText(name, {
      x: x + 0.95, y: y + 0.27, w: w - 1.15, h: 0.5, margin: 0, valign: "middle",
      fontFace: BODY, fontSize: 15, bold: true, color: WHITE,
    });
    s.addText(desc, {
      x: x + 0.25, y: y + 0.88, w: w - 0.5, h: h - 1.0, margin: 0, valign: "top",
      fontFace: BODY, fontSize: 11, color: MUTED, lineSpacingMultiple: 1.15,
    });
  }

  // ---------- Slide 1: copertina ----------
  {
    const s = pres.addSlide();
    s.background = { color: BG };
    // anelli decorativi (trottola stilizzata) a destra
    s.addShape(pres.shapes.OVAL, { x: 6.4, y: 0.9, w: 3.4, h: 3.4, fill: { color: BG, transparency: 100 }, line: { color: CYAN, width: 1.5, transparency: 70 } });
    s.addShape(pres.shapes.OVAL, { x: 6.8, y: 1.3, w: 2.6, h: 2.6, fill: { color: BG, transparency: 100 }, line: { color: CYAN, width: 1.5, transparency: 45 } });
    s.addShape(pres.shapes.OVAL, { x: 7.2, y: 1.7, w: 1.8, h: 1.8, fill: { color: BG, transparency: 100 }, line: { color: CYAN, width: 2, transparency: 15 } });
    s.addShape(pres.shapes.OVAL, { x: 7.95, y: 2.45, w: 0.3, h: 0.3, fill: { color: CYAN } });

    s.addText("LA STORIA DI BEYBLADE SCORE", {
      x: 0.7, y: 1.0, w: 6.0, h: 0.32, margin: 0,
      fontFace: BODY, fontSize: 12, color: CYAN, charSpacing: 3, bold: true,
    });
    s.addText([
      { text: "Un'app sul Play Store.", options: { breakLine: true } },
      { text: "Zero righe di codice.", options: { color: CYAN } },
    ], {
      x: 0.7, y: 1.35, w: 6.3, h: 1.7, margin: 0,
      fontFace: HEAD, fontSize: 34, color: WHITE, lineSpacingMultiple: 1.1,
    });
    s.addText("Strumenti, costi e metodo per creare un prodotto vero con l'AI", {
      x: 0.7, y: 3.15, w: 5.9, h: 0.5, margin: 0,
      fontFace: BODY, fontSize: 15, color: MUTED,
    });

    const stats = [
      ["0", "righe scritte a mano"],
      ["17", "versioni rilasciate"],
      ["1 mese", "dall'idea al Play Store"],
    ];
    stats.forEach(([num, label], i) => {
      const x = 0.7 + i * 2.95;
      s.addText(num, { x, y: 4.35, w: 2.7, h: 0.55, margin: 0, fontFace: HEAD, fontSize: 26, color: GOLD });
      s.addText(label, { x, y: 4.92, w: 2.7, h: 0.3, margin: 0, fontFace: BODY, fontSize: 11.5, color: MUTED });
    });
  }

  // ---------- Slide 2: strumenti di creazione ----------
  {
    const s = baseSlide("GLI STRUMENTI · 1 DI 3", "Creazione");
    const cards = [
      { icon: icons.robot, name: "Claude Code", desc: "Il costruttore. Scrive codice, interfaccia, script e testi: tu descrivi in italiano, lui realizza e corregge." },
      { icon: icons.mic, name: "ElevenLabs", desc: "Le voci dell'app. Il countdown vocale «3, 2, 1» è generato dall'AI, in italiano e in inglese." },
      { icon: icons.phone, name: "Emulatore Android", desc: "Un telefono virtuale sul PC. L'AI ci installa l'app, la prova da sola e verifica le modifiche." },
      { icon: icons.github, name: "GitHub", desc: "L'archivio del progetto. Ogni versione salvata, ogni modifica documentata e reversibile." },
    ];
    const pos = [
      { x: 0.7, y: 1.6 }, { x: 5.15, y: 1.6 },
      { x: 0.7, y: 3.5 }, { x: 5.15, y: 3.5 },
    ];
    cards.forEach((c, i) => toolCard(s, { ...pos[i], w: 4.15, h: 1.72, ...c }));
  }

  // ---------- Slide 3: strumenti di pubblicazione ----------
  {
    const s = baseSlide("GLI STRUMENTI · 2 DI 3", "Pubblicazione");
    const cards = [
      { icon: icons.play, name: "Google Play Console", desc: "La porta verso gli utenti Android: caricamento dell'app, revisione di Google, distribuzione in tutto il mondo, statistiche." },
      { icon: icons.key, name: "Expo EAS", desc: "La firma digitale dell'app: certifica che ogni aggiornamento arriva davvero dall'autore originale." },
      { icon: icons.globe, name: "GitHub Pages", desc: "La versione web gratuita: stessa app, dentro il browser, senza installare nulla. Online in un click." },
    ];
    cards.forEach((c, i) => {
      const x = 0.7 + i * 2.95;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y: 1.6, w: 2.73, h: 2.65, rectRadius: 0.08,
        fill: { color: CARD }, line: { color: CARDLINE, width: 0.75 },
      });
      s.addShape(pres.shapes.OVAL, { x: x + 0.25, y: 1.85, w: 0.52, h: 0.52, fill: { color: CYANDARK } });
      s.addImage({ data: c.icon, x: x + 0.38, y: 1.98, w: 0.26, h: 0.26 });
      s.addText(c.name, { x: x + 0.25, y: 2.5, w: 2.23, h: 0.65, margin: 0, valign: "top", fontFace: BODY, fontSize: 14.5, bold: true, color: WHITE });
      s.addText(c.desc, { x: x + 0.25, y: 3.12, w: 2.23, h: 1.0, margin: 0, valign: "top", fontFace: BODY, fontSize: 10.5, color: MUTED, lineSpacingMultiple: 1.15 });
    });
    s.addText("Un solo progetto, due piattaforme: Android e web.", {
      x: 0.7, y: 4.6, w: 8.6, h: 0.45, margin: 0, align: "center", valign: "middle",
      fontFace: BODY, fontSize: 13, italic: true, color: CYAN,
    });
  }

  // ---------- Slide 4: strumenti di monetizzazione ----------
  {
    const s = baseSlide("GLI STRUMENTI · 3 DI 3", "Monetizzazione");
    toolCard(s, {
      x: 0.7, y: 1.55, w: 4.15, h: 1.95, icon: icons.ad, name: "Google AdMob",
      desc: "Banner pubblicitari a fine partita. Si attiva gratis: Google vende gli spazi e gira la quota dei ricavi all'autore.",
    });
    toolCard(s, {
      x: 5.15, y: 1.55, w: 4.15, h: 1.95, icon: icons.cart, name: "RevenueCat",
      desc: "Gestisce l'acquisto in-app «Rimuovi pubblicità». Gratuito fino a 2.500 $ al mese di incassi.",
    });
    // modello freemium: 3 passi
    const steps = ["Scarichi gratis", "Vedi la pubblicità", "Un acquisto la toglie per sempre"];
    steps.forEach((t, i) => {
      const x = 0.7 + i * 3.0;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y: 4.0, w: 2.6, h: 0.85, rectRadius: 0.08,
        fill: { color: CYANDARK }, line: { color: CYAN, width: 0.75 },
      });
      s.addText(t, { x: x + 0.12, y: 4.0, w: 2.36, h: 0.85, margin: 0, align: "center", valign: "middle", fontFace: BODY, fontSize: 11.5, bold: true, color: WHITE, lineSpacingMultiple: 1.1 });
      if (i < 2) {
        s.addText("→", { x: x + 2.6, y: 4.0, w: 0.4, h: 0.85, margin: 0, align: "center", valign: "middle", fontFace: BODY, fontSize: 18, color: CYAN });
      }
    });
    s.addText("Il modello freemium", { x: 0.7, y: 3.62, w: 8.6, h: 0.3, margin: 0, fontFace: BODY, fontSize: 11, color: MUTED, charSpacing: 2, bold: true });
  }

  // ---------- Slide 5: costi ----------
  {
    const s = baseSlide("IL BUDGET", "Quanto costa davvero");
    const rows = [
      ["Claude (abbonamento)", "Il vero costo di sviluppo: l'AI che costruisce tutto", "20 €/mese"],
      ["Google Play Console", "Account sviluppatore una tantum, vale per tutte le app future", "25 $"],
      ["Tutto il resto", "GitHub, Expo, emulatore, AdMob, RevenueCat", "0 €"],
    ];
    rows.forEach(([name, sub, price], i) => {
      const y = 1.55 + i * 0.95;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 0.7, y, w: 5.4, h: 0.82, rectRadius: 0.06,
        fill: { color: CARD }, line: { color: CARDLINE, width: 0.75 },
      });
      s.addText(name, { x: 0.95, y: y + 0.1, w: 3.4, h: 0.32, margin: 0, fontFace: BODY, fontSize: 13, bold: true, color: WHITE });
      s.addText(sub, { x: 0.95, y: y + 0.42, w: 3.5, h: 0.32, margin: 0, fontFace: BODY, fontSize: 9.5, color: MUTED });
      s.addText(price, { x: 4.35, y, w: 1.55, h: 0.82, margin: 0, align: "right", valign: "middle", fontFace: HEAD, fontSize: 13, color: GOLD });
    });
    // callout totale
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 6.4, y: 1.55, w: 2.9, h: 2.72, rectRadius: 0.08,
      fill: { color: CARD }, line: { color: GOLD, width: 1.25 },
    });
    s.addImage({ data: icons.piggyGold, x: 7.55, y: 1.85, w: 0.6, h: 0.6 });
    s.addText("< 50 €", { x: 6.5, y: 2.55, w: 2.7, h: 0.75, margin: 0, align: "center", fontFace: HEAD, fontSize: 36, color: GOLD });
    s.addText("per mettere la tua prima app sul Play Store", { x: 6.7, y: 3.35, w: 2.3, h: 0.7, margin: 0, align: "center", fontFace: BODY, fontSize: 11.5, color: MUTED, lineSpacingMultiple: 1.15 });
    // nota ElevenLabs
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.7, y: 4.55, w: 8.6, h: 0.62, rectRadius: 0.06,
      fill: { color: CYANDARK }, line: { color: CYAN, width: 0.5 },
    });
    s.addImage({ data: icons.info, x: 0.92, y: 4.74, w: 0.24, h: 0.24 });
    s.addText([
      { text: "Caso a parte: ElevenLabs. ", options: { bold: true, color: WHITE } },
      { text: "Solo se vuoi voci AI nell'app — gratis per iniziare, poi da ~5 $/mese.", options: { color: MUTED } },
    ], { x: 1.3, y: 4.55, w: 7.85, h: 0.62, margin: 0, valign: "middle", fontFace: BODY, fontSize: 11.5 });
  }

  // ---------- Slide 6: metodo, prima release ----------
  {
    const s = baseSlide("IL METODO · DALL'IDEA AL LANCIO", "La prima release");
    const steps = [
      ["Parti dal problema", "Un utente preciso, un bisogno reale, la funzione minima che lo risolve."],
      ["Descrivi all'AI", "Brief in linguaggio naturale: cosa deve fare, non come. Le tecnologie le sceglie lei."],
      ["Ottieni un prototipo", "Una versione da toccare subito, anche imperfetta. Prima web, poi mobile."],
      ["Itera a parole", "Usa l'app, descrivi cosa non va, l'AI corregge. Ripeti finché ti convince."],
      ["Prepara il lancio", "Nome, icona, privacy policy, scheda store: li scrive l'AI, li approvi tu."],
      ["Pubblica", "Firma digitale, caricamento, revisione di Google. Poi sei online nel mondo."],
    ];
    steps.forEach(([name, desc], i) => {
      const col = i % 3, row = Math.floor(i / 3);
      const x = 0.7 + col * 2.95;
      const y = 1.5 + row * 1.95;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y, w: 2.73, h: 1.8, rectRadius: 0.08,
        fill: { color: CARD }, line: { color: CARDLINE, width: 0.75 },
      });
      s.addText("0" + (i + 1), { x: x + 0.22, y: y + 0.14, w: 0.8, h: 0.42, margin: 0, fontFace: HEAD, fontSize: 19, color: CYAN });
      s.addText(name, { x: x + 0.22, y: y + 0.58, w: 2.3, h: 0.32, margin: 0, fontFace: BODY, fontSize: 13, bold: true, color: WHITE });
      s.addText(desc, { x: x + 0.22, y: y + 0.92, w: 2.3, h: 0.8, margin: 0, valign: "top", fontFace: BODY, fontSize: 10, color: MUTED, lineSpacingMultiple: 1.12 });
    });
  }

  // ---------- Slide 7: metodo, aggiornamenti ----------
  {
    const s = baseSlide("IL METODO · DOPO IL LANCIO", "Gli aggiornamenti");
    const steps = [
      ["Ascolta", "Recensioni, statistiche, uso reale: decidono i dati, non le supposizioni."],
      ["Scegli una cosa", "Una sola modifica per versione: piccola, chiara, verificabile."],
      ["Implementa e prova", "L'AI sviluppa e testa sull'emulatore; tu validi sul telefono vero."],
      ["Rilascia spesso", "Versioni frequenti: 17 in quattro mesi. Ogni release è un esperimento."],
    ];
    steps.forEach(([name, desc], i) => {
      const x = 0.7 + i * 2.23;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y: 1.55, w: 2.03, h: 2.55, rectRadius: 0.08,
        fill: { color: CARD }, line: { color: CARDLINE, width: 0.75 },
      });
      s.addShape(pres.shapes.OVAL, { x: x + 0.2, y: 1.78, w: 0.46, h: 0.46, fill: { color: CYANDARK }, line: { color: CYAN, width: 0.75 } });
      s.addText(String(i + 1), { x: x + 0.2, y: 1.78, w: 0.46, h: 0.46, margin: 0, align: "center", valign: "middle", fontFace: HEAD, fontSize: 14, color: CYAN });
      s.addText(name, { x: x + 0.2, y: 2.38, w: 1.66, h: 0.62, margin: 0, valign: "top", fontFace: BODY, fontSize: 12.5, bold: true, color: WHITE, lineSpacingMultiple: 1.05 });
      s.addText(desc, { x: x + 0.2, y: 3.0, w: 1.66, h: 1.0, margin: 0, valign: "top", fontFace: BODY, fontSize: 9.5, color: MUTED, lineSpacingMultiple: 1.12 });
      if (i < 3) {
        s.addText("→", { x: x + 2.03, y: 2.6, w: 0.2, h: 0.4, margin: 0, align: "center", valign: "middle", fontFace: BODY, fontSize: 12, color: CYAN });
      }
    });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.7, y: 4.45, w: 8.6, h: 0.72, rectRadius: 0.06,
      fill: { color: CYANDARK }, line: { color: CYAN, width: 0.5 },
    });
    s.addText([
      { text: "↻  Si ricomincia da «Ascolta». ", options: { bold: true, color: WHITE } },
      { text: "E la routine si automatizza: build, test e pubblicazione diventano script che l'AI scrive una volta sola.", options: { color: MUTED } },
    ], { x: 1.0, y: 4.45, w: 8.0, h: 0.72, margin: 0, valign: "middle", fontFace: BODY, fontSize: 12 });
  }

  await pres.writeFile({ fileName: "slide-video-ai.pptx" });
  console.log("DONE slide-video-ai.pptx");
}

main().catch((e) => { console.error(e); process.exit(1); });
