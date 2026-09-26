/* =====================================================================
   KANE OIL — PRINT KIT
   Lays out every printable document. Contains no story content itself:
   the host dashboard feeds it the decrypted story after the host logs in,
   and private/print.html feeds it story.js. You shouldn't need to edit this.
   ===================================================================== */
window.PrintKit = (function () {
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const paras = t => String(t || '').split(/\n\s*\n/).map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('');
  const lines = t => esc(t).replace(/\n/g, '<br>');
  const initials = n => String(n).replace(/^(Dr\.|Senator|Judge|Inspector)\s+/, '').replace(/"[^"]*"\s*/, '').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const HEX = `<svg class="hex" viewBox="0 0 64 64" fill="none"><path d="M32 3 57 17.5v29L32 61 7 46.5v-29z" stroke="#94701f" stroke-width="2.5"/><path d="M25 20v24M25 32l11-12M28.5 29 38 44" stroke="#94701f" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const LOGOSM = (c = '#94701f') => `<svg viewBox="0 0 64 64" fill="none" style="width:100%;height:100%"><path d="M32 3 57 17.5v29L32 61 7 46.5v-29z" stroke="${c}" stroke-width="3"/><path d="M25 20v24M25 32l11-12M28.5 29 38 44" stroke="${c}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Special+Elite&family=Caveat:wght@500;700&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500&display=swap" rel="stylesheet">`;
  const CSS = `
:root{--ink:#1b1d22;--muted:#5b6170;--gold:#94701f;--gold-l:#f3ead3;--red:#a3202f;--red-l:#f8e3e6;--blue:#1f4f8f;--blue-l:#e4ecf7;--line:#d9dbe1}
*{box-sizing:border-box}
html{background:#e9eaee}
body{margin:0;color:var(--ink);font:11pt/1.55 Georgia,'Times New Roman',serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.sheet{background:#fff;max-width:8.5in;margin:24px auto;padding:.75in;box-shadow:0 4px 24px rgba(0,0,0,.15)}
.toolbar{position:sticky;top:0;z-index:5;background:#101828;color:#fff;font:13px/1.4 'Segoe UI',system-ui,sans-serif;display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:10px 16px}
.toolbar b{letter-spacing:.14em;color:#f3d990;margin-right:8px}
.toolbar a,.toolbar button{color:#fff;background:#243049;border:1px solid #3b4a6b;border-radius:8px;padding:7px 12px;text-decoration:none;font:inherit;cursor:pointer}
.toolbar a.on{background:#94701f;border-color:#f3d990}
.toolbar .sp{flex:1}
@media print{html{background:#fff}.toolbar{display:none}.sheet{box-shadow:none;margin:0;padding:0;max-width:none}}
h1,h2,h3,h4,.sans{font-family:'Segoe UI',Arial,Helvetica,sans-serif}
h1.part{font-size:22pt;letter-spacing:.06em;margin:0 0 4pt;break-before:page;padding-top:4pt}
.part-kicker{font:600 9pt 'Segoe UI',Arial,sans-serif;letter-spacing:.24em;color:var(--gold);text-transform:uppercase}
.rule{height:2px;background:linear-gradient(90deg,var(--gold),transparent);margin:6pt 0 16pt}
h2{font-size:14pt;margin:18pt 0 6pt;break-after:avoid}
h3{font-size:12pt;margin:14pt 0 4pt;break-after:avoid}
h4{font-size:9pt;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin:12pt 0 3pt;break-after:avoid}
p{margin:0 0 7pt}
ul.tight{margin:2pt 0 8pt;padding-left:16pt}ul.tight li{margin-bottom:3pt}
.muted{color:var(--muted)}.small{font-size:9.5pt}
.tag{display:inline-block;font:700 7.5pt 'Segoe UI',Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;border:1px solid var(--line);border-radius:4px;padding:1pt 5pt;margin-right:4pt;vertical-align:1pt;color:var(--muted)}
.tag.red{border-color:var(--red);color:var(--red);background:var(--red-l)}
.tag.gold{border-color:var(--gold);color:var(--gold);background:var(--gold-l)}
.tag.blue{border-color:var(--blue);color:var(--blue);background:var(--blue-l)}
.box{border:1px solid var(--line);border-radius:6pt;padding:9pt 11pt;margin:8pt 0;break-inside:avoid}
.box.gold{border-color:var(--gold);background:var(--gold-l)}
.box.red{border-color:var(--red);background:var(--red-l)}
.box.blue{border-color:var(--blue);background:var(--blue-l)}
.box .lbl{font:700 8pt 'Segoe UI',Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;margin-bottom:3pt}
.box.gold .lbl{color:var(--gold)}.box.red .lbl{color:var(--red)}.box.blue .lbl{color:var(--blue)}
.script{font-size:12.5pt;line-height:1.6;border-left:3pt solid var(--gold);padding:2pt 0 2pt 12pt;margin:6pt 0 10pt}
.script.insp{border-left-color:var(--blue);font-size:11pt;color:#2a3140}
.script p{margin:0 0 8pt}
.cue{font:10pt/1.5 'Segoe UI',Arial,sans-serif;color:#2a3140;background:#f4f6f9;border-radius:6pt;padding:8pt 10pt;margin:6pt 0}
.cue b{font-size:8pt;letter-spacing:.18em;color:var(--blue)}
.who{font:700 8pt 'Segoe UI',Arial,sans-serif;letter-spacing:.18em;margin-top:8pt}
.acts{font:9.5pt/1.5 'Segoe UI',Arial,sans-serif;margin:4pt 0 0;padding-left:16pt}
.step{border-top:1px solid var(--line);padding-top:8pt;margin-top:14pt}
.step-h{display:flex;gap:10pt;align-items:baseline;break-after:avoid}
.step-h .n{font:700 20pt 'Segoe UI',Arial,sans-serif;color:var(--gold);min-width:28pt}
.step-h .t{font:700 13pt 'Segoe UI',Arial,sans-serif}
.step-h .tm{font:600 9pt 'Segoe UI',Arial,sans-serif;color:var(--blue);letter-spacing:.1em}
table{width:100%;border-collapse:collapse;font:9.5pt/1.4 'Segoe UI',Arial,sans-serif;margin:6pt 0 12pt}
th{text-align:left;font-size:8pt;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);border-bottom:1.5pt solid var(--ink);padding:4pt 6pt}
td{border-bottom:1px solid var(--line);padding:5pt 6pt;vertical-align:top}
tr{break-inside:avoid}
.mono{font-family:Consolas,'Courier New',monospace;letter-spacing:.06em}
.cover{min-height:9.2in;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;break-after:page}
.cover .k{font:600 10pt 'Segoe UI',Arial,sans-serif;letter-spacing:.34em;color:var(--gold);text-transform:uppercase}
.cover h1{font:700 44pt Georgia,serif;margin:14pt 0 4pt;letter-spacing:.02em}
.cover .sub{font:italic 17pt Georgia,serif;color:var(--muted)}
.cover .conf{margin-top:34pt;font:700 10pt 'Segoe UI',Arial,sans-serif;letter-spacing:.24em;color:var(--red);border:1.5pt solid var(--red);padding:6pt 14pt;border-radius:4pt}
.cover .meta{margin-top:22pt;font:9.5pt 'Segoe UI',Arial,sans-serif;color:var(--muted)}
.hex{width:70pt;height:70pt;margin-bottom:10pt}
.toc{columns:2;column-gap:24pt;font:10.5pt/1.9 'Segoe UI',Arial,sans-serif;padding-left:18pt}
.dossier{break-before:page}
.dos-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12pt;border-bottom:2pt solid var(--ink);padding-bottom:8pt;margin-bottom:8pt}
.dos-head h2{margin:2pt 0 2pt;font-size:19pt}
.dos-head .file{font:700 8.5pt 'Segoe UI',Arial,sans-serif;letter-spacing:.2em;color:var(--muted)}
.dos-head .code{font:700 13pt Consolas,monospace;letter-spacing:.14em;color:var(--gold);border:1.5pt solid var(--gold);border-radius:4pt;padding:3pt 8pt;white-space:nowrap}
.kv{display:grid;grid-template-columns:1.1in 1fr;gap:2pt 10pt;font:9.5pt/1.5 'Segoe UI',Arial,sans-serif;margin-bottom:6pt}
.kv b{color:var(--muted);font-weight:600}
.sec{margin:0 0 7pt;break-inside:avoid-page}
.sec h4{margin-top:9pt}
.sec.key{background:var(--gold-l);border-radius:5pt;padding:4pt 9pt 6pt;margin:8pt -9pt}
.sec.role p{font-style:italic;color:#3a3f4b}
.ev{break-inside:avoid;border:1px solid var(--line);border-radius:6pt;padding:10pt 12pt;margin:10pt 0}
.ev h3{margin:2pt 0 2pt}
.ev .src{font:italic 9.5pt Georgia,serif;color:var(--muted);margin-bottom:6pt}
.pre{white-space:pre-line}
.notes ul{padding-left:16pt}.notes li{margin-bottom:5pt}
.check li{list-style:none;margin-left:-14pt;margin-bottom:3pt}
.check li::before{content:"☐  ";font-family:'Segoe UI Symbol',sans-serif}
.room-card{border:1.5pt solid var(--gold);border-radius:8pt;padding:12pt 14pt;margin:14pt 0;break-inside:auto}
.room-card h3{margin:0 0 2pt;font-size:15pt}
.room-card .where{font:600 9pt 'Segoe UI',Arial,sans-serif;color:var(--blue);letter-spacing:.08em;margin-bottom:6pt}
/* tags */
.tags{display:grid;grid-template-columns:1fr 1fr;gap:.18in}
.qtag{border:1.5pt dashed #9aa0ab;border-radius:8pt;padding:12pt 10pt;text-align:center;break-inside:avoid;height:3.05in;display:flex;flex-direction:column;align-items:center;justify-content:center}
.qtag .brand{font:700 8pt 'Segoe UI',Arial,sans-serif;letter-spacing:.28em;color:var(--gold)}
.qtag .ttl{font:700 11pt 'Segoe UI',Arial,sans-serif;letter-spacing:.2em;margin:2pt 0 6pt}
.qtag img{width:1.75in;height:1.75in;image-rendering:pixelated}
.qtag .num{font:700 16pt Georgia,serif;margin-top:4pt}
.qtag .hint{font:8pt 'Segoe UI',Arial,sans-serif;color:var(--muted);letter-spacing:.06em}
.noqr{width:1.3in;height:1.3in;border:1px solid var(--line);display:grid;place-items:center;font:8pt 'Segoe UI',Arial,sans-serif;color:var(--red);padding:6pt;text-align:center}
/* badges: 3 x 4 in, 6 per page */
@page badges{size:Letter;margin:.3in .25in}
.badges{page:badges;display:grid;grid-template-columns:3.9in 3.9in;grid-auto-rows:2.95in;gap:.14in .12in;justify-content:center}
.badge{border:1px dashed #b9bdc6;border-radius:6pt;overflow:hidden;display:flex;flex-direction:column;break-inside:avoid;background:#fff}
.badge .top{background:#0c1220;color:#f3d990;padding:7pt 10pt;display:flex;align-items:center;gap:8pt}
.badge .top .lg{width:22pt;height:22pt;flex:none}
.badge .top b{font:700 8.5pt 'Segoe UI',Arial,sans-serif;letter-spacing:.24em;display:block}
.badge .top small{font:600 6.5pt 'Segoe UI',Arial,sans-serif;letter-spacing:.2em;color:#9fb0cc;display:block}
.badge .mid{flex:1;display:flex;flex-direction:column;justify-content:center;padding:6pt 14pt;text-align:center}
.badge .hello{font:700 7.5pt 'Segoe UI',Arial,sans-serif;letter-spacing:.3em;color:var(--gold)}
.badge .nm{font:700 22pt/1.08 'Cormorant Garamond',Georgia,serif;margin:3pt 0 2pt}
.badge .ttl{font:9pt/1.3 'Segoe UI',Arial,sans-serif;color:#3a3f4b}
.badge .bot{border-top:3pt solid var(--gold);padding:4pt 10pt;display:flex;justify-content:space-between;font:600 7pt 'Segoe UI',Arial,sans-serif;letter-spacing:.14em;color:var(--muted);text-transform:uppercase}
.badge.host .top{background:#94701f;color:#fff}.badge.host .bot{border-top-color:#0c1220}
.badge.blank .nm{border-bottom:1pt solid #9aa0ab;height:28pt;margin:8pt 10pt 4pt}
/* signs: one per landscape page */
@page sign{size:Letter landscape;margin:.4in}
.sign{page:sign;break-after:page;height:7.6in;border:3pt solid #0c1220;border-radius:10pt;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:.4in;position:relative;background:#fff}
.sign::before{content:"";position:absolute;inset:8pt;border:1pt solid var(--gold);border-radius:6pt;pointer-events:none}
.sign .lg{width:.9in;height:.9in;margin-bottom:10pt}
.sign .k{font:700 12pt 'Segoe UI',Arial,sans-serif;letter-spacing:.34em;color:var(--gold);text-transform:uppercase}
.sign .big{font:700 58pt/1.02 'Cormorant Garamond',Georgia,serif;margin:10pt 0 6pt}
.sign .mid{font:600 22pt/1.3 'Segoe UI',Arial,sans-serif;color:#2a3140}
.sign .sm{font:14pt/1.4 'Segoe UI',Arial,sans-serif;color:var(--muted);margin-top:14pt;max-width:8in}
.sign.dark{background:#0c1220;color:#fff}.sign.dark .mid{color:#e8eefa}.sign.dark .sm{color:#9fb0cc}
.sign.sealed{background:repeating-linear-gradient(-45deg,#fff 0 40pt,#fbe7ea 40pt 80pt);border-color:var(--red)}
.sign.sealed::before{border-color:var(--red)}
.sign.sealed .big{color:var(--red);font-family:'Segoe UI',Arial,sans-serif;letter-spacing:.12em;font-size:64pt}
.sign .arrow{font:700 120pt/1 'Segoe UI',Arial,sans-serif;color:var(--gold);margin:-10pt 0 0}
.sign .qr img{width:1.6in;height:1.6in;image-rendering:pixelated}
/* evidence props: one per page */
.prop{break-before:page;min-height:9.3in;position:relative;padding:.35in .4in;border:1px solid #d8d2c2}
.prop .qr{position:absolute;right:.25in;bottom:.25in;text-align:center;font:700 7pt 'Segoe UI',Arial,sans-serif;letter-spacing:.16em;color:#666}
.prop .qr img{width:.95in;height:.95in;image-rendering:pixelated;display:block;margin-bottom:2pt}
.prop .hand{font-family:'Caveat',cursive;color:#1d3a8a}
.prop.legal{background:#fbf7ec;font-family:'Cormorant Garamond',Georgia,serif;font-size:14pt;line-height:1.55}
.prop.legal .firm{text-align:center;font:700 13pt 'Cormorant Garamond',Georgia,serif;letter-spacing:.3em;border-bottom:1.5pt double #333;padding-bottom:6pt;margin-bottom:14pt}
.prop.legal .draft{position:absolute;top:40%;left:10%;right:10%;text-align:center;font:700 70pt 'Segoe UI',Arial,sans-serif;color:rgba(163,32,47,.12);transform:rotate(-22deg);letter-spacing:.1em;pointer-events:none}
.prop.legal .hand{position:absolute;left:.7in;bottom:1.35in;width:4.2in;font-size:21pt;transform:rotate(-3deg)}
.prop.memo,.prop.termsheet{font:12pt/1.6 'Segoe UI',Arial,sans-serif}
.prop .lh{display:flex;align-items:center;gap:12pt;border-bottom:2.5pt solid #0c1220;padding-bottom:8pt;margin-bottom:16pt}
.prop .lh .lg{width:.6in;height:.6in}
.prop .lh b{font:700 15pt 'Segoe UI',Arial,sans-serif;letter-spacing:.2em;display:block}
.prop .lh small{font:600 8.5pt 'Segoe UI',Arial,sans-serif;letter-spacing:.24em;color:var(--red)}
.prop .sticky{position:absolute;right:.6in;top:3.2in;width:2.4in;height:2.1in;background:#fff27a;box-shadow:2pt 3pt 6pt rgba(0,0,0,.2);transform:rotate(3deg);display:grid;place-items:center;text-align:center;padding:10pt;font-size:24pt}
.prop.termsheet .hand{position:absolute;left:4.4in;top:4.4in;font-size:22pt;transform:rotate(-6deg)}
.prop.log{background:#f5f5f0;font:11pt/1.5 Consolas,'Courier New',monospace}
.prop.log table{font:10.5pt Consolas,'Courier New',monospace}
.prop.log th{font-size:8pt}
.prop.ledger{background:#f7f6ee;font:11pt Consolas,'Courier New',monospace}
.prop.ledger table{font:10.5pt Consolas,'Courier New',monospace;background:repeating-linear-gradient(#f7f6ee 0 22pt,#dfe8d8 22pt 23pt)}
.prop.ledger td.tk,.prop.ledger th.tk{width:16pt;padding:0 2pt;font:20pt/1 'Segoe Script','Bradley Hand',cursive;color:#6b6b6b;text-align:center}
.prop.handwritten{background:#fdfcf7;clip-path:polygon(0 0,100% 0,100% 88%,94% 91%,87% 87%,79% 92%,71% 88%,63% 93%,55% 88%,47% 92%,39% 87%,31% 92%,23% 88%,15% 93%,7% 88%,0 91%);border:0;background-image:repeating-linear-gradient(#fdfcf7 0 31pt,#b8cbe6 31pt 32pt)}
.prop.handwritten .hand{font-size:25pt;line-height:32pt;padding-top:28pt;padding-right:1.2in}
.prop.handwritten .qr{top:.3in;bottom:auto}
.prop.handwritten .hand s{color:#6a7fb4}
.prop.typed{background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font:18pt/1.8 'Special Elite',Consolas,monospace;text-align:center}
.prop.photo{background:#fff}
.prop.photo .print{width:5.2in;margin:.3in auto 0;border:12pt solid #f4efe3;box-shadow:0 2pt 10pt rgba(0,0,0,.25)}
.prop.photo .back{width:5.2in;height:3.4in;margin:.5in auto 0;border:1pt dashed #999;display:grid;place-items:center;font-size:30pt;background:#f7f4ec}
.prop.photo .fold{text-align:center;font:9pt 'Segoe UI',Arial,sans-serif;color:#888;margin-top:6pt}
.prop.official{font:11.5pt/1.6 Georgia,serif}
.prop.official .seal{display:flex;gap:14pt;align-items:center;border-bottom:1.5pt solid #333;padding-bottom:10pt;margin-bottom:16pt}
.prop.official .seal .round{width:.8in;height:.8in;border-radius:50%;border:2pt solid #333;display:grid;place-items:center;font:700 8pt 'Segoe UI',Arial,sans-serif;text-align:center;letter-spacing:.1em}
.prop.official .seal b{font:700 14pt 'Segoe UI',Arial,sans-serif;letter-spacing:.14em;display:block}
.prop.photo .back .qr{position:absolute;right:8pt;bottom:8pt;top:auto;left:auto;transform:scale(.72);transform-origin:bottom right}
.prop.official .stampx{position:absolute;right:.55in;top:.62in;border:2.5pt solid var(--red);color:var(--red);font:700 13pt 'Segoe UI',Arial,sans-serif;letter-spacing:.2em;padding:4pt 10pt;transform:rotate(-8deg)}
.err{background:#fde8e8;border:1px solid var(--red);color:var(--red);padding:12pt;border-radius:6pt;font:11pt 'Segoe UI',Arial,sans-serif}
`;

  // A simple sepia "site crew" photograph drawn in SVG, so the prop needs no image files.
  const PHOTO_SVG = `<svg viewBox="0 0 500 320" style="display:block;width:100%;filter:sepia(.85) contrast(.9)"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9d3c4"/><stop offset="1" stop-color="#b9ae96"/></linearGradient></defs>
    <rect width="500" height="320" fill="url(#sky)"/><rect y="230" width="500" height="90" fill="#8f8468"/>
    <g fill="#5b5140" opacity=".85"><path d="M40 230 70 60h8l30 170z"/><path d="M52 150h44M58 110h32M47 190h54" stroke="#5b5140" stroke-width="3"/><rect x="380" y="175" width="90" height="55"/><rect x="392" y="150" width="50" height="28"/></g>
    <g fill="#3b3428"><circle cx="175" cy="118" r="17"/><path d="M150 230c0-55 8-92 25-92s25 37 25 92z"/><circle cx="240" cy="112" r="19"/><path d="M212 230c0-60 9-100 28-100s28 40 28 100z"/><circle cx="305" cy="116" r="17"/><path d="M280 230c0-56 8-94 25-94s25 38 25 94z"/><circle cx="352" cy="138" r="13"/><path d="M334 230c0-45 6-76 18-76s18 31 18 76z"/></g>
    <rect x="0" y="0" width="500" height="320" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="18"/></svg>`;

  function build(S, P, opts) {
    P = P || {}; opts = opts || {};
    const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    const chars = S.characters || [], ev = S.evidence || [], show = S.show || [], rooms = S.rooms || [], hints = S.hints || [];
    const CH = Object.fromEntries(chars.map(c => [c.id, c])), EV = Object.fromEntries(ev.map(e => [e.id, e]));
    const DIR = (() => { const d = S.directory; if (Array.isArray(d)) return Object.fromEntries(d.map(x => [x.id, x])); return d || {}; })();
    const nm = id => (CH[id] && CH[id].name) || id;
    const room = id => (rooms.find(r => r.id === id) || {}).name || id || '';
    const phaseT = id => { const i = show.findIndex(s => s.id === id); return i < 0 ? id : `${i + 1}. ${show[i].title}`; };
    const killer = chars.find(c => c.killer), inspector = chars.find(c => c.inspector || c.id === S.inspectorId);
    const memOf = c => c.memories || (S.memories && S.memories[c.id]) || [];
    const shortlist = killer && killer.killer ? killer.killer.shortlist || [] : [];
    const qrEv = ev.filter(e => e.qr), official = ev.filter(e => e.official);
    const tagNo = id => qrEv.findIndex(e => e.id === id) + 1;
    const tagNum = id => 'Nº ' + String(tagNo(id)).padStart(2, '0');
    const qrFor = (e, cls) => opts.qr ? opts.qr((opts.base || '') + 'database.html#e=' + encodeURIComponent(e.qr)) : `<div class="noqr ${cls || ''}">QR codes need an internet connection. Print from the dashboard.</div>`;
    const hosted = [P.host ? 'Hosted by ' + P.host : '', P.sponsor ? 'Sponsored by ' + P.sponsor : ''].filter(Boolean).join(' · ');
    const FLAGS = { lockdown: 'Lockdown', killer: 'Strike window', killerKnows: 'Killer learns the truth', voting: 'Voting', sealed: 'Seal dossiers', hints: 'Hint voting' };
    const SC = { company: 'Company page', title: 'Title card', evidence: 'Latest evidence', wall: 'Evidence wall', voting: 'Voting screen', tally: 'Results' };
    const act = a => {
      switch (a.do) {
        case 'flag': return a.flag === 'sealed' ? (a.value ? 'Seal all dossiers' : 'Dossiers open') : a.flag === 'killerKnows' ? (a.value ? 'The killer learns the truth (their phone only)' : 'Killer knowledge hidden') : a.flag === 'killer' ? (a.value ? 'The killer may now choose a third victim' : 'Strike window closed') : `${FLAGS[a.flag] || a.flag} <b>${a.value ? 'ON' : 'OFF'}</b>`;
        case 'death': return `<b>${esc(nm(a.id))}</b> dies (red alert on every screen)`;
        case 'room': return `<b>${esc(room(a.id))}</b> opens`;
        case 'deliver': return `<b>${esc((EV[a.id] || {}).title || a.id)}</b> goes to the Inspector to read aloud`;
        case 'scene': return `Projector: ${esc(SC[a.scene] || a.scene)}`;
        case 'broadcast': return `Announcement: “${esc(a.text)}”`;
        case 'verdict': return a.stage === 'reveal' ? '<b>The truth</b> is revealed on every screen' : 'You <b>name the accused</b>';
      }
      return esc(a.do);
    };
    const whenText = w => { w = w || {}; if (w.phase) return 'phase ' + phaseT(w.phase); if (w.evidence) return 'when “' + ((EV[w.evidence] || {}).title || w.evidence) + '” is revealed'; if (w.death) return 'when ' + nm(w.death) + ' dies'; if (w.killer) return 'when the killer learns the truth'; return ''; };
    const roomOpens = r => { if (r.alwaysOpen) return 'Always open'; const i = show.findIndex(st => (st.actions || []).some(a => a.do === 'room' && a.id === r.id)); return i < 0 ? 'Opened by the host' : `${show[i].time} · ${show[i].title}`; };
    const deliverAt = e => { const i = show.findIndex(st => (st.actions || []).some(a => a.do === 'deliver' && a.id === e.id)); return i < 0 ? 'Sent by the host' : `${show[i].time} · ${show[i].title}`; };
    const cover = (title, sub, conf, extra = '') => `<section class="cover">${HEX}<div class="k">Kane Oil &amp; Energy · ${esc(P.title || 'The Last Toast')}</div><h1>${esc(title)}</h1><div class="sub">${esc(sub)}</div>${conf ? `<div class="conf">${esc(conf)}</div>` : ''}<div class="meta">${hosted ? esc(hosted) + '<br>' : ''}Printed ${esc(today)}${extra}</div></section>`;
    const part = (kicker, title) => `<h1 class="part">${esc(title)}</h1><div class="part-kicker">${esc(kicker)}</div><div class="rule"></div>`;
    const blank = t => String(t || '').replace(/\{victim3\}/g, '[the third victim]').replace(/\{accused\}/g, '[the accused]');
    const list = arr => `<ul class="tight">${(arr || []).map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;

    /* ---------------- HOST BOOK ---------------- */
    const host = () => cover('Host Book', 'Everything you need to run the night', 'CONFIDENTIAL · HOST EYES ONLY') +
      `<h2 style="margin-top:0">Contents</h2><ol class="toc"><li>The case at a glance</li><li>The schedule</li><li>Setting the stage</li><li>Evidence placement</li><li>The night, phase by phase</li><li>Evidence files</li><li>Memories &amp; hints</li><li>Cast &amp; code words</li><li>Using the terminal</li><li>Checklists</li></ol>` +

      part('Part 1', 'The Case at a Glance') +
      `<div class="box red"><div class="lbl">The killer</div><p style="font-size:14pt;margin:0"><b>${esc(killer ? killer.name : '—')}</b> ${S.solution && S.solution.alias ? `<i>(${esc(S.solution.alias)})</i>` : ''}</p>${killer ? `<p class="small muted" style="margin:3pt 0 0">Code word <span class="mono">${esc(killer.code)}</span> · learns the truth on their phone when doors open, so they're surprised at the party and have an hour to plan the toast.</p>` : ''}</div>
       ${inspector ? `<div class="box blue"><div class="lbl">The Inspector (played by a guest)</div><p style="margin:0"><b>${esc(inspector.name)}</b>, code word <span class="mono">${esc(inspector.code)}</span>. Undercover as a guest until the toast; their phone shows their lines and receives the official reports.</p></div>` : ''}
       ${S.solution && S.solution.summary ? `<h3>The solution</h3>${paras(S.solution.summary)}` : ''}
       <h3>Deaths</h3><table><tr><th>Victim</th><th>When</th><th>Alert text</th></tr>
       ${chars.filter(c => c.scriptedDeath).map(c => { const i = show.findIndex(st => (st.actions || []).some(a => a.do === 'death' && a.id === c.id)); return `<tr><td><b>${esc(c.name)}</b></td><td>${i < 0 ? 'Manual' : esc(show[i].time + ' · ' + show[i].title)}</td><td>${esc(c.deathAlert || '')}</td></tr>`; }).join('')}
       <tr><td><b>Third victim</b></td><td>Chosen live by the killer once the strike window opens</td><td>${shortlist.map(t => esc(nm(t.id))).join(' · ')}</td></tr></table>
       <p class="small muted">Give early victims (Alex, Gordon) a backup role in the Guests tab. When they die, their phone switches them to it automatically.</p>
       <h3>Host notes</h3><div class="notes">${S.hostNotes || '<p class="muted">None.</p>'}</div>` +

      part('Part 2', 'The Schedule') +
      `<p>${esc(P.date || '')}${P.time ? ' · ' + esc(P.time) : ''}${hosted ? ' · ' + esc(hosted) : ''}</p>
      <table><tr><th>Time</th><th>Phase</th><th>What happens</th></tr>${show.map((st, i) => `<tr><td class="mono" style="white-space:nowrap"><b>${esc(st.time || '')}</b></td><td><b>${i + 1}. ${esc(st.title)}</b>${st.skippable ? '<br><span class="tag">Skippable if late</span>' : ''}</td><td>${(st.actions || []).map(act).join(' · ') || '<span class="muted">No automatic actions</span>'}</td></tr>`).join('')}</table>
      <div class="box gold"><div class="lbl">Running late?</div><p style="margin:0">Phases marked <b>Skippable</b> can be skipped with Game → All phases → JUMP. The Inspector can say those lines in the next phase instead. Check your hall's <b>quiet hours</b> with your hall director: the curtain call is planned for about 11:40 PM.</p></div>` +

      part('Part 3', 'Setting the Stage') +
      `<h3>Timeline</h3>
      <table><tr><th>When</th><th>Task</th></tr>
      <tr><td><b>3–4 weeks before</b></td><td>Book the four spaces through Residence Life. Confirm quiet hours, capacity and decoration rules. Send the invitation.</td></tr>
      <tr><td><b>2 weeks before</b></td><td>Close RSVPs. Assign roles (must-cast first, then the Inspector). Send role texts. Start gathering props (shopping list below).</td></tr>
      <tr><td><b>1 week before</b></td><td>Fill in the real room names in story.js and rebuild. Print the tags, props, badges and signs. Test-scan a tag on your phone.</td></tr>
      <tr><td><b>2 days before</b></td><td>Two-phone rehearsal with your co-host: NEXT through a few phases, scan a tag, cast a vote. Brief the Inspector, Alex and Gordon on their big moments.</td></tr>
      <tr><td><b>5:30 PM</b></td><td>Start setup: Gala Hall first (biggest job), then the Archive Lounge, Alex's Office, Gordon's Study.</td></tr>
      <tr><td><b>7:00 PM</b></td><td>Place every tag and prop. Test-scan each one. Hang SEALED signs, close the doors. Projector on.</td></tr>
      <tr><td><b>7:30 PM</b></td><td>Tools → HARD RESET. Hosts in costume. Name badges and a pen at the door. Music on.</td></tr>
      <tr><td><b>After the party</b></td><td>Take down every tag, sign and piece of tape. Leave the rooms as you found them. Export a backup, then delete the RSVPs.</td></tr></table>
      <h3>Shopping list</h3>
      <table><tr><th>For</th><th>Items</th></tr>
      <tr><td><b>Gala Hall</b></td><td>Black tablecloths, gold runners, battery LED candles, warm string lights, gold/black/white balloons, plastic flutes and coupes, sparkling cider or ginger ale, place-card holders, an easel or frame for Richard Kane's portrait, a white sheet, CAUTION tape, a cork board or poster board, push pins</td></tr>
      <tr><td><b>Alex's Office</b></td><td>Desk lamp, dark blazer, envelope, manila folder, desk mat, chess set, 2 picture frames, a tray of cheap watches (or printed pictures)</td></tr>
      <tr><td><b>Archive Lounge</b></td><td>Clipboard, toy walkie-talkie, lanyard, flashlight, 3–4 banker's boxes, a binder, a photo album or large envelope, old newspapers</td></tr>
      <tr><td><b>Gordon's Study</b></td><td>Desk lamp, rocks glass, empty bottle, golf club, boxing gloves, cigar box, pillow and blanket for Gordon</td></tr>
      <tr><td><b>Everywhere</b></td><td>Painter's tape (never regular tape on walls), 40 badge holders (3×4 in), power strip and chargers, a speaker for music, a laptop and projector with HDMI</td></tr></table>
      <h3>Residence Life–friendly rules</h3>
      <ul class="tight"><li>No open flames: LED candles only.</li><li>Painter's tape only, and never on fire doors, exit signs, alarms, sprinklers or extinguishers.</li><li>Keep hallways and exits completely clear. Signs go on walls, not across doorways.</li><li>Alcohol-free: the "champagne" is sparkling cider.</li><li>If a dorm room belongs to a resident, get their written permission and put their belongings away first.</li><li>Keep music at a volume that respects neighbors and quiet hours.</li><li>Leave every space exactly as you found it.</li></ul>
      <h3>How to hide evidence well</h3>
      <ul class="tight"><li><b>Hide it where people naturally look</b>: drawers, pockets, bags, boxes and binders. Never behind heavy furniture or up high.</li><li><b>Aim for 1–3 minutes to find each one.</b> Players should feel clever, not frustrated.</li><li><b>Put the tag on the paper prop itself</b> (the Evidence Props printout already has the QR code on it) so the object and the evidence feel like one thing.</li><li><b>Leave a trail</b>: a drawer open an inch, a pocket with paper sticking out, a box lid askew.</li><li><b>One tag per object</b>, and never on anything that belongs to the building.</li><li><b>Test-scan every tag</b> after placing it: logged in as host, your phone shows "✓ This tag works."</li><li><b>Photograph each hiding spot</b> so you (or your co-host) can put things back if they get moved.</li><li>Keep a spare printed set of tags in your pocket. If one goes missing: Game → Evidence Board → REVEAL NOW.</li></ul>
      <h3>Signs</h3>
      <ul class="tight"><li>Welcome sign at the building entrance, and arrows at every turn on the way to the Gala Hall.</li><li>A door sign on each of the four spaces.</li><li>A red SEALED sign on the Office, Lounge and Study doors until their phase opens them. Take each SEALED sign down when that room opens.</li><li>Coat check, charging station, "How to scan evidence" and Investigation Board signs in the Gala Hall.</li><li>A "Private event in progress" sign on hallway doors near dorm rooms.</li></ul>` +
      rooms.map(r => { const g = r.guide || {}; return `<div class="room-card"><h3>${esc(r.name)}</h3><div class="where">${esc(r.place || '')} · ${esc(roomOpens(r))}</div>
        ${g.purpose ? `<p>${esc(g.purpose)}</p>` : ''}
        ${g.layout ? `<h4>Layout</h4>${list(g.layout)}` : ''}${g.decor ? `<h4>Decorating</h4>${list(g.decor)}` : ''}${g.props ? `<h4>Props</h4>${list(g.props)}` : ''}${g.hide ? `<h4>Hiding the evidence</h4>${list(g.hide)}` : ''}${g.atmosphere ? `<h4>Atmosphere</h4>${list(g.atmosphere)}` : ''}</div>`; }).join('') +

      part('Part 4', 'Evidence Placement') +
      `${rooms.map(r => { const l = qrEv.filter(e => e.room === r.id); return l.length ? `<h4>${esc(r.name)}</h4><table><tr><th>Tag</th><th>Evidence</th><th>Where to hide it</th><th>Scannable</th></tr>${l.map(e => `<tr><td class="mono"><b>${tagNum(e.id)}</b></td><td>${esc(e.title)}</td><td>${esc(e.place || '')}</td><td>${e.after ? 'From ' + esc(phaseT(e.after)) : 'Once the room opens'}</td></tr>`).join('')}</table>` : ''; }).join('')}
       <h3>Official reports (no tag: they go to the Inspector's phone)</h3>
       <table><tr><th>Report</th><th>Delivered</th></tr>${official.map(e => `<tr><td>${esc(e.title)}</td><td>${esc(deliverAt(e))}</td></tr>`).join('')}</table>
       <p class="small muted">Optional: print the official reports from Evidence Props and hand the paper copy to the Inspector to read from.</p>` +

      part('Part 5', 'The Night, Phase by Phase') +
      `<p class="muted small">Press and hold <b>START</b> on the Game tab to begin each phase; everything under "When it starts" happens by itself. Blue lines are what the Inspector reads (it's on their phone).</p>` +
      show.map((st, i) => {
        const mems = []; chars.forEach(c => memOf(c).forEach(m => { if (m.when && m.when.phase === st.id) mems.push(`${m.cue ? 'Cue' : 'Memory'} → ${nm(c.id)}`); }));
        return `<div class="step"><div class="step-h"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${esc(st.title)}</span><span class="tm">${esc(st.time || '')}${st.skippable ? ' · SKIPPABLE' : ''}</span></div>
        ${st.cue ? `<div class="cue"><b>YOUR CUE</b><br>${esc(st.cue).replace(/\n/g, '<br>')}</div>` : ''}
        ${(st.actions || []).length || mems.length ? `<div class="who" style="color:var(--gold)">WHEN IT STARTS</div><ul class="acts">${(st.actions || []).map(a => `<li>${act(a)}</li>`).join('')}${mems.map(m => `<li>${esc(m)}</li>`).join('')}</ul>` : ''}
        ${st.host ? `<div class="who" style="color:var(--gold)">YOU SAY</div><div class="script">${paras(st.host)}</div>` : ''}
        ${st.script ? `<div class="who" style="color:var(--red)">${esc(st.scriptTitle || 'SCRIPT')}</div><div class="script">${paras(st.script)}</div>` : ''}
        ${st.inspector ? `<div class="who" style="color:var(--blue)">THE INSPECTOR SAYS</div><div class="script insp">${paras(st.inspector)}</div>` : ''}</div>`;
      }).join('') +

      part('Part 6', 'Evidence Files') +
      ev.map(e => `<div class="ev">${e.qr ? `<span class="tag gold">Tag ${tagNum(e.id)} · ${esc(room(e.room))}</span>` : '<span class="tag blue">Official report</span>'}<span class="tag">${esc(e.tier || '')}</span><h3>${esc(e.title)}</h3><div class="src">${esc(e.src || '')}</div><div class="pre">${esc(e.body)}</div></div>`).join('') +

      part('Part 7', 'Memories & Hints') +
      `<p class="muted small">Memories appear on the player's phone by themselves. You don't send anything.</p>` +
      chars.filter(c => memOf(c).length).map(c => `<div class="box ${c.inspector ? 'blue' : c.killer ? 'red' : 'gold'}"><div class="lbl">${esc(c.name)}</div>${memOf(c).map(m => `<p class="small"><span class="tag">${m.cue ? 'Cue' : 'Memory'} · ${esc(whenText(m.when))}</span><br>${esc(m.text)}</p>`).join('')}</div>`).join('') +
      `<h3>Hints (unlocked by player vote)</h3><p class="small muted">Switch on Hint Voting in the Game tab. When more than half of the living players who are online vote yes, the next hint appears on every phone and the projector. You can also press GIVE NOW.</p><ol>${hints.map(h => `<li style="margin-bottom:5pt">${esc(h)}</li>`).join('')}</ol>` +

      part('Part 8', 'Cast & Code Words') +
      `<table><tr><th>#</th><th>Character</th><th>Code word</th><th>Role in the story</th></tr>${chars.map(c => `<tr><td class="mono">${esc(c.file || '')}</td><td><b>${esc(c.name)}</b><br><span class="muted">${esc(c.occ || '')}</span></td><td class="mono"><b>${esc(c.code)}</b></td><td>${[c.mustCast ? '<span class="tag red">★ Must cast</span>' : '', c.inspector ? '<span class="tag blue">Inspector</span>' : '', c.killer ? '<span class="tag red">Killer</span>' : '', c.scriptedDeath ? '<span class="tag red">Scripted death</span>' : '', shortlist.some(t => t.id === c.id) ? '<span class="tag gold">Possible 3rd victim</span>' : '', c.tier === 'ext' ? '<span class="tag">Extended cast</span>' : ''].join('')}</td></tr>`).join('')}</table>
      <p class="small muted">Master host code: <span class="mono"><b>${S.adminCode ? esc(S.adminCode) : '(the code you log in with)'}</b></span></p>` +

      part('Part 9', 'Using the Terminal') +
      `<p>Open <b>database.html</b> and log in with the host code. It locks itself after 30 minutes idle. Give your co-host the code too, so one of you can run the tech while the other hosts.</p>
      <table><tr><th>Tab</th><th>What it's for</th></tr>
      <tr><td><b>Game</b></td><td>The only tab you need on the night. The bar at the bottom shows what's next: <b>press and hold START</b>. Also: the must-cast warning, Lockdown, announcements, hint voting, rooms, the Evidence Board, accusations, deaths and backup roles.</td></tr>
      <tr><td><b>Players</b></td><td>Every character, code word and player. Access QR, Revoke / Restore, Sign out, emergency Message, Kill / Undo.</td></tr>
      <tr><td><b>Guests</b></td><td>Invite links, RSVPs, assign roles (★ must-cast first), add backup roles, copy role texts.</td></tr>
      <tr><td><b>Tools</b></td><td>Manual switches, projector control, live invitation editor, emergency tools, activity log, hard reset.</td></tr></table>
      <h3>If something goes wrong</h3><table><tr><th>Problem</th><th>Fix</th></tr>
      <tr><td>Started a phase too early or skipped one</td><td>Game → All phases → JUMP or RE-RUN</td></tr>
      <tr><td>An evidence tag is lost or won't scan</td><td>Game → Evidence Board → REVEAL NOW</td></tr>
      <tr><td>The Inspector's phone died</td><td>Read their lines from Part 5; Evidence Board → RELEASE NOW for reports</td></tr>
      <tr><td>A room needs opening or closing</td><td>Game → Rooms → OPEN / SEAL</td></tr>
      <tr><td>The room is stuck on the mystery</td><td>Game → Hint Voting on, or GIVE NOW</td></tr>
      <tr><td>A screen is stuck</td><td>Tools → FORCE REFRESH ALL</td></tr>
      <tr><td>The room is frozen</td><td>Tools → LIFT ALL</td></tr>
      <tr><td>A player is locked out</td><td>Players → RESTORE, or ACCESS QR</td></tr>
      <tr><td>A death happened by mistake</td><td>Game → Deaths → UNDO</td></tr>
      <tr><td>Total failure</td><td>Printed dossiers + read evidence aloud from Part 6</td></tr></table>` +

      part('Part 10', 'Checklists') +
      `<h3>The week before</h3><ul class="check"><li>All ★ must-cast roles filled, then the Inspector</li><li>Backup roles set for Alex's and Gordon's players</li><li>Role texts sent (Guests tab shows "ROLE SENT")</li><li>Real room names filled in and story rebuilt</li><li>Tags, props, badges, signs and Host Book printed</li><li>Props bought (shopping list, Part 3)</li><li>Rehearsal with your co-host</li><li>Spaces confirmed with Residence Life</li></ul>
      <h3>On the day</h3><ul class="check"><li>Firebase rules open (not locked)</li><li>Rooms set up and decorated (Part 3)</li><li>Tags and props placed and test-scanned (Part 4)</li><li>SEALED signs up, doors closed</li><li>Tools → HARD RESET</li><li>Projector: display.html unlocked, F11, clicked once for sound</li><li>Badge says LINK SECURE</li><li>Name badges, badge holders and a pen at the door</li><li>Wi-Fi details posted, charging station live</li><li>This book, open to Part 5</li></ul>`;

    /* ---------------- QR TAGS ---------------- */
    const tags = () => {
      const tagHTML = e => `<div class="qtag"><div class="brand">KANE OIL &amp; ENERGY</div><div class="ttl">EVIDENCE</div>${qrFor(e)}<div class="num">${tagNum(e.id)}</div><div class="hint">Scan with your phone camera</div></div>`;
      const pages = []; for (let i = 0; i < qrEv.length; i += 6) pages.push(qrEv.slice(i, i + 6));
      return pages.map((pg, i) => `<div style="${i ? 'break-before:page' : ''}"><p class="small muted sans" style="margin:0 0 8pt">Cut along the dashed lines. Use these if a prop is too small to print on, or as spares. The Evidence Props already have these codes printed on them.</p><div class="tags">${pg.map(tagHTML).join('')}</div></div>`).join('') +
        `<div style="break-before:page"><h2 style="margin-top:0">Placement key <span class="tag red">Host only</span></h2><table><tr><th>Tag</th><th>Evidence</th><th>Room</th><th>Where to hide it</th><th>Scannable</th></tr>${qrEv.map(e => `<tr><td class="mono"><b>${tagNum(e.id)}</b></td><td>${esc(e.title)}</td><td>${esc(room(e.room))}</td><td>${esc(e.place || '')}</td><td>${e.after ? 'From ' + esc(phaseT(e.after)) : 'Once the room opens'}</td></tr>`).join('')}</table>
        <p class="small muted">The codes never change, so you can reprint a damaged tag at any time.</p></div>`;
    };

    /* ---------------- EVIDENCE PROPS ---------------- */
    const propQR = e => e.qr ? `<div class="qr">${qrFor(e)}EVIDENCE ${tagNum(e.id)}</div>` : '';
    const LH = (title, sub) => `<div class="lh"><div class="lg">${LOGOSM('#0c1220')}</div><div><b>${esc(title)}</b><small>${esc(sub)}</small></div></div>`;
    const propPage = e => {
      const text = e.propText || e.body, note = e.propNote || '';
      switch (e.prop) {
        case 'legal': return `<section class="prop legal"><div class="firm">BENNETT &amp; ASSOCIATES · ATTORNEYS AT LAW</div><div class="draft">DRAFT</div>${paras(text)}${note ? `<div class="hand">${esc(note)}</div>` : ''}${propQR(e)}</section>`;
        case 'memo': return `<section class="prop memo">${LH('KANE OIL & ENERGY', 'INTERNAL MEMORANDUM · PRIVILEGED & CONFIDENTIAL')}${paras(text)}${note ? `<div class="sticky hand">${esc(note)}</div>` : ''}${propQR(e)}</section>`;
        case 'termsheet': return `<section class="prop termsheet"><div class="lh"><div><b>VELEZ ENERGY HOLDINGS</b><small>CONFIDENTIAL DRAFT · TERM SHEET · NOT AN OFFER</small></div></div><h3 class="sans" style="margin-top:0">Proposed Acquisition of Kane Oil Gulf Assets</h3>${paras(text)}${note ? `<div class="hand">${esc(note)}</div>` : ''}${propQR(e)}</section>`;
        case 'log': { const rows = text.split('\n').filter(Boolean).map(l => l.split('|').map(s => s.trim())); return `<section class="prop log">${LH('KANE ESTATE SECURITY', 'MOVEMENT LOG · EAST WING · TONIGHT')}<table><tr><th>Time</th><th>Location</th><th>Event</th><th>Init.</th></tr>${rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table><p class="small">Incident report filed: ☐ Yes &nbsp; ☒ No</p><p style="margin-top:30pt">Supervisor: <span class="hand" style="font-size:20pt">M. Reid</span></p>${propQR(e)}</section>`; }
        case 'ledger': { const rows = text.split('\n').filter(Boolean).map(l => l.split('|').map(s => s.trim())), nt = (note.match(/✓/g) || []).length; return `<section class="prop ledger">${LH('ACCOUNTS PAYABLE', "KANE OIL & ENERGY · LEDGER · RICHARD KANE'S FINAL YEAR · RECOVERED")}<table><tr><th class="tk"></th><th>Date</th><th>Payee</th><th>Coded as</th><th>Amount</th><th>Approved</th></tr>${rows.map((r, i) => `<tr><td class="tk">${i < nt ? '✓' : ''}</td>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table><p class="small" style="margin-top:20pt">Invoices on file: NONE · Work orders on file: NONE</p>${propQR(e)}</section>`; }
        case 'handwritten': return `<section class="prop handwritten"><div class="hand">${lines(text)}</div>${propQR(e)}</section>`;
        case 'typed': return `<section class="prop typed"><div>${paras(text)}</div>${propQR(e)}</section>`;
        case 'photo': return `<section class="prop photo"><div class="print">${PHOTO_SVG}</div><div class="fold">✂ cut out the photograph · fold along the dashed line so the caption is on the back</div><div class="back hand" style="position:relative">${esc(text)}${propQR(e)}</div></section>`;
        case 'official': default: return `<section class="prop official"><div class="seal"><div class="round">STATE<br>OF<br>RECORD</div><div><b>${esc(String(e.src || '').split('·')[0].trim().toUpperCase())}</b><span class="small muted">${esc(e.src || '')}</span></div></div><div class="stampx">OFFICIAL</div><h2 class="sans" style="margin-top:0">${esc(e.title)}</h2>${paras(text)}${propQR(e)}</section>`;
      }
    };
    const props = () => `<section class="cover" style="min-height:auto;padding:20pt 0">${HEX}<div class="k">Kane Oil &amp; Energy · Evidence Props</div><h1 style="font-size:34pt">Evidence Props</h1><div class="sub">One page per piece of evidence</div></section>
      <div class="box gold"><div class="lbl">How to use these <span class="tag red">Host only · don't leave this page out</span></div>
      <ul class="tight"><li>Each hidden-evidence page already has its <b>QR code printed in the corner</b>. Put the page where the Host Book says, and scanning it reveals the evidence on the phone.</li>
      <li><b>Will draft:</b> fold in thirds, into the "H. Bennett" envelope. <b>Speech notes:</b> cut along the torn edge, crumple slightly, into the blazer pocket. <b>Ledger:</b> into the Accounts Payable binder. <b>Security log:</b> on the clipboard. <b>Photograph:</b> cut out and fold so the caption is on the back, into the album. <b>Confession:</b> fold once, on Gordon's desk. <b>Memo:</b> in the PRIVILEGED folder. <b>Term sheet:</b> fold into the clutch bag.</li>
      <li>Official reports have no QR code: they're paper copies for the Inspector to read from (optional).</li>
      <li>Printing on cream or ivory paper for the legal documents makes them look expensive.</li></ul></div>` + ev.map(propPage).join('');

    /* ---------------- NAME BADGES ---------------- */
    const badges = () => {
      const players = opts.players || {};
      const hostNames = String(P.host || '').replace(/^RAs?\s+/i, '').split(/\s*&\s*|\s*,\s*|\s+and\s+/i).filter(Boolean);
      const badge = (name, title, foot1, foot2, cls = '') => `<div class="badge ${cls}"><div class="top"><div class="lg">${LOGOSM(cls === 'host' ? '#ffffff' : '#f3d990')}</div><div><b>KANE OIL &amp; ENERGY</b><small>${esc((P.title || 'The Last Toast').toUpperCase())} · ANNUAL GALA</small></div></div>
        <div class="mid"><div class="hello">${cls === 'host' ? 'YOUR HOST' : 'HELLO, I AM'}</div><div class="nm">${esc(name)}</div><div class="ttl">${esc(title)}</div></div><div class="bot"><span>${esc(foot1 || '')}</span><span>${esc(foot2 || '')}</span></div></div>`;
      const cards = [];
      hostNames.forEach(h => cards.push(badge(h, 'Event Host · Resident Assistant', P.sponsor ? 'Sponsored by ' + P.sponsor : '', '', 'host')));
      chars.forEach(c => { const d = DIR[c.id] || {}; cards.push(badge(d.name || c.name, d.title || c.occ || '', d.group || '', players[c.id] ? 'Played by ' + players[c.id] : '')); });
      for (let i = 0; i < 4; i++) cards.push(`<div class="badge blank"><div class="top"><div class="lg">${LOGOSM('#f3d990')}</div><div><b>KANE OIL &amp; ENERGY</b><small>ANNUAL GALA</small></div></div><div class="mid"><div class="hello">HELLO, I AM</div><div class="nm"></div><div class="ttl">&nbsp;</div></div><div class="bot"><span>Guest</span><span></span></div></div>`);
      return `<div class="badges">${cards.join('')}</div>`;
    };

    /* ---------------- SIGNS ---------------- */
    const signs = () => {
      const sign = (cls, k, big, mid, sm, extra = '') => `<section class="sign ${cls}"><div class="lg">${LOGOSM(cls === 'dark' ? '#f3d990' : '#94701f')}</div><div class="k">${k}</div><div class="big">${big}</div>${mid ? `<div class="mid">${mid}</div>` : ''}${extra}${sm ? `<div class="sm">${sm}</div>` : ''}</section>`;
      const gala = rooms.find(r => r.alwaysOpen) || rooms[0] || { name: 'The Gala Hall' };
      const out = [];
      out.push(sign('dark', 'Kane Oil &amp; Energy · Annual Gala', esc(P.title || 'The Last Toast'), esc(P.subtitle || 'A Murder Mystery Evening'), `${esc(hosted)}<br>${esc(P.date || '')}${P.time ? ' · ' + esc(P.time) : ''}`));
      out.push(sign('', 'This way to the gala', esc(gala.name), '', '', `<div class="arrow">→</div>`));
      out.push(sign('', 'This way to the gala', esc(gala.name), '', '', `<div class="arrow">←</div>`));
      rooms.forEach(r => out.push(sign(r.alwaysOpen ? 'dark' : '', esc(r.sign || 'Kane Oil & Energy'), esc(r.name), '', esc(r.alwaysOpen ? 'Welcome. Find the Investigation Board, the coat check and the charging station inside.' : (r.desc || 'Private.')))));
      rooms.filter(r => !r.alwaysOpen).forEach(r => out.push(sign('sealed', 'Kane Oil Security', 'SEALED', esc(r.name), 'Do not enter until the Kane Oil Database on your phone shows this room as <b>OPEN</b>.')));
      out.push(sign('', 'Kane Oil &amp; Energy', 'Evidence Tags', 'Found a Kane Oil evidence tag?', 'Scan it with your phone camera, then log in if asked. You decide whether to reveal it to everyone or keep it for now. <b>Please leave the tag where you found it.</b>'));
      out.push(sign('', 'Kane Oil &amp; Energy', 'The Investigation Board', 'Pin revealed evidence here', 'Found something? Once it\'s revealed, add a copy to the board so everyone can connect the dots.'));
      out.push(sign('', 'Kane Oil &amp; Energy', 'Coat Check', '', 'Please leave coats and bags here. Kane Oil & Energy is not responsible for anything you find in them.'));
      out.push(sign('', 'Kane Oil &amp; Energy', 'Charging Station', 'Keep your terminal alive', 'Your phone is your dossier, your evidence scanner and your vote. Charge it here.'));
      out.push(sign('', 'Guest Wi-Fi', 'Wi-Fi', '', '<span style="font-size:20pt;line-height:2">Network: ______________________<br>Password: ______________________</span><br>Then open the Kane Oil Database from your role text.'));
      out.push(sign('dark', 'Private event in progress', esc(P.title || 'The Last Toast'), 'A Kane Oil murder mystery', `${esc(hosted)}. Please keep hallway noise down. Thank you!`));
      return out.join('');
    };

    /* ---------------- INSPECTOR'S LINES ---------------- */
    const inspectorDoc = () => cover("Inspector's Lines", inspector ? 'For ' + inspector.name : 'For the Inspector', 'FOR THE INSPECTOR ONLY') +
      `<h2 style="margin-top:0">How your night works</h2>
      <p>You arrive as an ordinary guest. Nobody knows who you are. When Alexandra Kane collapses at the toast, your phone lights up with your first lines. Step forward and take charge. Lockdowns never block your screen.</p>
      <p>From then on, every time the host moves the night forward, your phone shows <b>YOUR LINES</b> for that moment. Read them aloud, in your own words if you like. Official reports (toxicology, the coroner's file, a court record) arrive on your phone. Read them to the room, then press <b>RELEASE TO ALL</b>.</p>
      <p>Evidence hidden in the rooms is found by the guests, not you. Your job is to push them to search, question them, and make them share. If the vote ties at the end, you decide. You don't know who the killer is. Solve it for real.</p>
      <p class="muted small">Below are your lines, so you can rehearse. The final reveal isn't printed here: it arrives on your phone at the very end.</p>` +
      show.filter(st => st.inspector && !(st.actions || []).some(a => a.do === 'verdict' && a.stage === 'reveal')).map((st, i) =>
        `<div class="step"><div class="step-h"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${esc(st.title)}</span><span class="tm">${esc(st.time || '')}</span></div><div class="script">${paras(blank(st.inspector))}</div></div>`).join('') +
      `<div class="step"><div class="step-h"><span class="n">★</span><span class="t">The Truth</span></div><p class="muted">Your final lines arrive on your phone when the host reveals the verdict. Read them slowly.</p></div>`;

    /* ---------------- DOSSIERS ---------------- */
    const dossier = c => {
      const mems = memOf(c), d = DIR[c.id];
      return `<section class="dossier"><div class="dos-head"><div><div class="file">PERSONNEL FILE ${esc(c.file || '')}${c.tier === 'ext' ? ' · EXTENDED CAST' : ''}</div><h2>${esc(c.name)}</h2>
          <div>${c.mustCast ? '<span class="tag red">★ Must cast</span>' : ''}${c.inspector ? '<span class="tag blue">Inspector</span>' : ''}${c.killer ? '<span class="tag red">Killer</span>' : ''}${c.scriptedDeath ? '<span class="tag red">Scripted death</span>' : ''}${shortlist.some(t => t.id === c.id) ? '<span class="tag gold">Possible 3rd victim</span>' : ''}</div></div>
          <div class="code">${esc(c.code)}</div></div>
        <div class="kv"><b>Classification</b><span>${esc(c.cls || 'SUBJECT')}${c.clsSecret ? ` <span class="muted">→ becomes “${esc(c.clsSecret)}” ${c.killer ? 'when they learn the truth' : c.inspector ? 'once they take charge' : 'after death'}</span>` : ''}</span><b>Age</b><span>${esc(c.age)}</span><b>Occupation</b><span>${esc(c.occ)}</span>${d ? `<b>Who's Who</b><span>${esc(d.name || c.name)} · ${esc(d.title || c.occ)} · <i>${esc(d.blurb || '')}</i></span>` : ''}</div>
        ${c.sections.map(s => `<div class="sec ${s.key ? 'key' : ''} ${s.role ? 'role' : ''}"><h4>${esc(s.h)} ${s.hostOnly ? '<span class="tag red">Host only · never shown to player</span>' : ''}${s.sealed ? '<span class="tag red">Sealed until the killer learns the truth</span>' : ''}</h4>${paras(s.t)}
          ${s.sealed && s.sealed !== true ? `<div class="box" style="margin:3pt 0 0;padding:5pt 9pt"><span class="small muted"><b class="sans">Until then the player only sees:</b> ${esc(s.sealed)}</span></div>` : ''}</div>`).join('')}
        ${c.killer ? `<div class="box red"><div class="lbl">The killer's reveal</div><p class="small"><b>Reveal screen:</b> ${(c.killer.reveal || []).map(esc).join(' / ')}</p><p class="small" style="margin:0"><b>Can choose to kill:</b> ${(c.killer.shortlist || []).map(t => esc(nm(t.id))).join(', ')}</p></div>` : ''}
        ${c.scriptedDeath ? `<div class="box red"><div class="lbl">Death alert</div><p class="small" style="margin:0">${esc(c.deathAlert || '')}</p></div>` : ''}
        ${mems.length ? `<div class="box gold"><div class="lbl">Memories that surface automatically</div>${mems.map((m, i) => `<p class="small"><b>${i + 1}.</b> <span class="tag">${m.cue ? 'Cue' : 'Memory'} · ${esc(whenText(m.when))}</span> ${esc(m.text)}</p>`).join('')}</div>` : ''}</section>`;
    };
    const dossiers = () => cover('Character Dossiers', `All ${chars.length} personnel files, as written`, 'CONFIDENTIAL · CONTAINS SPOILERS') +
      `<h2 style="margin-top:0">Index</h2><table><tr><th>#</th><th>Character</th><th>Code word</th><th>Occupation</th></tr>${chars.map(c => `<tr><td class="mono">${esc(c.file || '')}</td><td><b>${esc(c.name)}</b>${c.mustCast ? ' <span class="tag red">★</span>' : ''}</td><td class="mono">${esc(c.code)}</td><td>${esc(c.occ || '')}</td></tr>`).join('')}</table>
      <p class="small muted">Each dossier starts on a new page. Red tags show what players don't see. Gold boxes list memories that pop up on that player's phone during the game.</p>` +
      chars.map(dossier).join('');

    /* ---------------- INVITATION & RULES ---------------- */
    const D = P.display || {};
    const invite = () => cover('Invitation & Rules', 'Everything guests will read', '', ' · Safe to share: no spoilers') +
      part('Guest-facing', 'The Invitation') +
      `<p style="font-style:italic;font-size:13pt">${esc(P.inWorld || '')}</p>
       <h2 style="font:700 28pt Georgia,serif;margin:8pt 0 0">${esc(P.title || '')}</h2><p style="font:italic 14pt Georgia,serif" class="muted">${esc(P.subtitle || '')}${hosted ? ' · ' + esc(hosted) : ''}</p>
       <table><tr><th>When</th><td>${esc(P.date || '')}${P.time ? ' · ' + esc(P.time) : ''}</td></tr><tr><th>Where</th><td>${esc(P.venue || '')}${P.address ? '<br>' + esc(P.address) : ''}</td></tr><tr><th>Dress</th><td>${esc(P.dress || '')}</td></tr><tr><th>RSVP by</th><td>${esc(P.rsvpBy || '')}</td></tr></table>
       ${P.notice ? `<div class="box gold"><div class="lbl">Announcement banner</div><p style="margin:0">${esc(P.notice)}</p></div>` : ''}
       <h3>The evening</h3>${(P.premise || []).map(p => `<p>${esc(p)}</p>`).join('')}
       <h3>What to expect</h3><ul>${(P.expect || []).map(p => `<li>${esc(p)}</li>`).join('')}</ul>
       <h3>The Kane Oil Database</h3>${(P.howItWorks || []).map((s, i) => `<p><b>${i + 1}. ${esc(s.title)}.</b> ${esc(s.text)}</p>`).join('')}` +
      part('Guest-facing', 'Rules of the Night') +
      `${P.showRules ? '' : '<p class="tag red">Currently hidden on the site</p>'}<ol>${(P.rules || []).map(r => `<li style="margin-bottom:8pt"><b>${esc(r.title)}.</b> ${esc(r.text)}</li>`).join('')}</ol>` +
      part('On the big screen', 'Projector Text') +
      `<table><tr><th>Company</th><td>${esc(D.company || '')}</td></tr><tr><th>Welcome</th><td>${esc(D.welcome || '')}<br><span class="muted">${esc(D.welcomeSub || '')}</span></td></tr><tr><th>After Alex dies</th><td>${esc(D.memoriamText || '')}<br><span class="muted">${esc(D.memoriamSub || '')}</span></td></tr><tr><th>Bulletin slides</th><td>${(D.slides || []).map(esc).join('<br>')}</td></tr></table>`;

    /* ---------------- ALEX'S TOAST CARD (big print, for Alex to hold) ---------------- */
    const toast = () => {
      const st = show.find(x => x.script);
      if (!st) return '<p>No toast script in story.js.</p>';
      return `<section style="font:13.5pt/1.45 Georgia,serif;max-width:6.6in;margin:0 auto">
        <p class="sans" style="font-size:8.5pt;letter-spacing:.2em;color:var(--muted);margin:0">FOR ALEXANDRA KANE'S PLAYER ONLY · ABOUT 9:00 PM</p>
        <h2 style="font:italic 24pt Georgia,serif;margin:4pt 0 10pt">The Toast</h2>
        ${String(st.script).split(/\n\s*\n/).map(p => /^\(.*\)$/s.test(p.trim()) ? `<p style="font:italic 10.5pt/1.4 'Segoe UI',Arial,sans-serif;color:#a3202f;margin:0 0 9pt">${esc(p.trim())}</p>` : `<p style="margin:0 0 9pt">${esc(p.trim())}</p>`).join('')}
      </section>`;
    };

    return { host, tags, props, badges, signs, inspector: inspectorDoc, dossiers, invite, toast };
  }

  const LABELS = { host: 'HOST BOOK · CONFIDENTIAL', tags: 'EVIDENCE QR TAGS · CONFIDENTIAL', props: 'EVIDENCE PROPS · CONFIDENTIAL', badges: 'NAME BADGES', signs: 'SIGNS', inspector: "INSPECTOR'S LINES", toast: "ALEX'S TOAST CARD", dossiers: 'CHARACTER DOSSIERS · CONFIDENTIAL', invite: 'INVITATION & RULES', all: 'PRINT PACKET · CONFIDENTIAL' };
  /** Returns { html, label, pageCSS } for any key in LABELS.
      opts.qr(text) → <img> tag for a QR code; opts.base = site address; opts.players = {charId: guest name}. */
  function render(S, P, which, opts) {
    const d = build(S, P, opts);
    const order = ['host', 'tags', 'props', 'badges', 'signs', 'inspector', 'toast', 'dossiers', 'invite'];
    const html = which === 'all' ? order.map((k, i) => (i ? '<div style="break-before:page"></div>' : '') + d[k]()).join('') : (d[which] || d.host)();
    const label = LABELS[which] || LABELS.host;
    const pageCSS = `@page{size:Letter;margin:.7in .75in .75in;@bottom-left{content:"THE LAST TOAST · ${label}";font:7.5pt 'Segoe UI',Arial,sans-serif;letter-spacing:.14em;color:#8a8f99}@bottom-right{content:counter(page);font:9pt Georgia,serif;color:#8a8f99}}@page:first{@bottom-left{content:none}@bottom-right{content:none}}`;
    return { html, label, pageCSS };
  }
  return { CSS, FONTS, render, LABELS };
})();
