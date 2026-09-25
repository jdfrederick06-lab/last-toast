/* =====================================================================
   KANE OIL — PRINT KIT
   Lays out the printable documents. Contains no story content itself:
   the host dashboard feeds it the decrypted story after the host logs in,
   and private/print.html feeds it story.js. You shouldn't need to edit this.
   ===================================================================== */
window.PrintKit = (function () {
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const paras = t => String(t || '').split(/\n\s*\n/).map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('');
  const HEX = `<svg class="hex" viewBox="0 0 64 64" fill="none"><path d="M32 3 57 17.5v29L32 61 7 46.5v-29z" stroke="#94701f" stroke-width="2.5"/><path d="M25 20v24M25 32l11-12M28.5 29 38 44" stroke="#94701f" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
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
.check li{list-style:none;margin-left:-14pt}
.check li::before{content:"☐  ";font-family:'Segoe UI Symbol',sans-serif}
.tags{display:grid;grid-template-columns:1fr 1fr;gap:.18in}
.qtag{border:1.5pt dashed #9aa0ab;border-radius:8pt;padding:12pt 10pt;text-align:center;break-inside:avoid;height:3.05in;display:flex;flex-direction:column;align-items:center;justify-content:center}
.qtag .brand{font:700 8pt 'Segoe UI',Arial,sans-serif;letter-spacing:.28em;color:var(--gold)}
.qtag .ttl{font:700 11pt 'Segoe UI',Arial,sans-serif;letter-spacing:.2em;margin:2pt 0 6pt}
.qtag img{width:1.75in;height:1.75in;image-rendering:pixelated}
.qtag .num{font:700 16pt Georgia,serif;margin-top:4pt}
.qtag .hint{font:8pt 'Segoe UI',Arial,sans-serif;color:var(--muted);letter-spacing:.06em}
.qtag .noqr{width:1.75in;height:1.75in;border:1px solid var(--line);display:grid;place-items:center;font:9pt 'Segoe UI',Arial,sans-serif;color:var(--red);padding:8pt}
.err{background:#fde8e8;border:1px solid var(--red);color:var(--red);padding:12pt;border-radius:6pt;font:11pt 'Segoe UI',Arial,sans-serif}
`;

  function build(S, P, opts) {
    P = P || {}; opts = opts || {};
    const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    const chars = S.characters || [], ev = S.evidence || [], show = S.show || [], rooms = S.rooms || [];
    const CH = Object.fromEntries(chars.map(c => [c.id, c])), EV = Object.fromEntries(ev.map(e => [e.id, e]));
    const nm = id => (CH[id] && CH[id].name) || id;
    const room = id => (rooms.find(r => r.id === id) || {}).name || id || '';
    const phaseT = id => { const i = show.findIndex(s => s.id === id); return i < 0 ? id : `${i + 1}. ${show[i].title}`; };
    const killer = chars.find(c => c.killer), inspector = chars.find(c => c.inspector || c.id === S.inspectorId);
    const memOf = c => c.memories || (S.memories && S.memories[c.id]) || [];
    const shortlist = killer && killer.killer ? killer.killer.shortlist || [] : [];
    const qrEv = ev.filter(e => e.qr), official = ev.filter(e => e.official);
    const tagNo = id => qrEv.findIndex(e => e.id === id) + 1;
    const FLAGS = { lockdown: 'Lockdown', killer: 'Killer Phase', voting: 'Voting', sealed: 'Seal dossiers' };
    const SC = { company: 'Company page', title: 'Title card', evidence: 'Latest evidence', wall: 'Evidence wall', voting: 'Voting screen', tally: 'Results' };
    const act = a => {
      switch (a.do) {
        case 'flag': return a.flag === 'sealed' ? (a.value ? 'Seal all dossiers' : 'Dossiers open') : `${FLAGS[a.flag]} <b>${a.value ? 'ON' : 'OFF'}</b>`;
        case 'death': return `<b>${esc(nm(a.id))}</b> dies (red alert on every screen)`;
        case 'room': return `<b>${esc(room(a.id))}</b> opens`;
        case 'deliver': return `<b>${esc((EV[a.id] || {}).title || a.id)}</b> goes to the Inspector to read aloud`;
        case 'scene': return `Projector: ${esc(SC[a.scene] || a.scene)}`;
        case 'broadcast': return `Announcement: “${esc(a.text)}”`;
        case 'verdict': return a.stage === 'reveal' ? '<b>The truth</b> is revealed on every screen' : 'You <b>name the accused</b> (top vote pre-selected)';
      }
      return esc(a.do);
    };
    const whenText = w => { w = w || {}; if (w.phase) return 'phase ' + phaseT(w.phase); if (w.evidence) return 'when “' + ((EV[w.evidence] || {}).title || w.evidence) + '” is revealed'; if (w.death) return 'when ' + nm(w.death) + ' dies'; if (w.killer) return 'at Killer Phase'; return ''; };
    const roomOpens = r => { if (r.alwaysOpen) return 'Always open'; const i = show.findIndex(st => (st.actions || []).some(a => a.do === 'room' && a.id === r.id)); return i < 0 ? 'Opened by the host' : 'Phase ' + phaseT(show[i].id); };
    const deliverAt = e => { const i = show.findIndex(st => (st.actions || []).some(a => a.do === 'deliver' && a.id === e.id)); return i < 0 ? 'Sent by the host' : 'Phase ' + phaseT(show[i].id); };
    const cover = (title, sub, conf, extra = '') => `<section class="cover">${HEX}<div class="k">Kane Oil &amp; Energy · ${esc(P.title || 'The Last Toast')}</div><h1>${esc(title)}</h1><div class="sub">${esc(sub)}</div>${conf ? `<div class="conf">${esc(conf)}</div>` : ''}<div class="meta">Printed ${esc(today)}${extra}</div></section>`;
    const part = (kicker, title) => `<h1 class="part">${esc(title)}</h1><div class="part-kicker">${esc(kicker)}</div><div class="rule"></div>`;
    const blank = t => String(t || '').replace(/\{victim3\}/g, '[the third victim]').replace(/\{accused\}/g, '[the accused]');

    /* ---------------- HOST BOOK ---------------- */
    const host = () => cover('Host Book', 'Everything you need to run the night', 'CONFIDENTIAL · HOST EYES ONLY', P.host ? ` · Host: ${esc(P.host)}` : '') +
      `<h2 style="margin-top:0">Contents</h2><ol class="toc"><li>The case at a glance</li><li>Rooms &amp; evidence placement</li><li>The night, phase by phase</li><li>Evidence files</li><li>Automatic memories</li><li>Cast list &amp; code words</li><li>Using the terminal</li><li>Checklist</li></ol>` +

      part('Part 1', 'The Case at a Glance') +
      `<div class="box red"><div class="lbl">The killer</div><p style="font-size:14pt;margin:0"><b>${esc(killer ? killer.name : '—')}</b> ${S.solution && S.solution.alias ? `<i>(${esc(S.solution.alias)})</i>` : ''}</p>${killer ? `<p class="small muted" style="margin:3pt 0 0">Code word <span class="mono">${esc(killer.code)}</span></p>` : ''}</div>
       ${inspector ? `<div class="box blue"><div class="lbl">The Inspector (played by a guest)</div><p style="margin:0"><b>${esc(inspector.name)}</b>, code word <span class="mono">${esc(inspector.code)}</span>. Undercover as a guest until the toast; their phone shows their lines and receives the official reports.</p></div>` : ''}
       ${S.solution && S.solution.summary ? `<h3>The solution</h3>${paras(S.solution.summary)}` : ''}
       <h3>Deaths</h3><table><tr><th>Victim</th><th>When</th><th>Alert text</th></tr>
       ${chars.filter(c => c.scriptedDeath).map(c => { const i = show.findIndex(st => (st.actions || []).some(a => a.do === 'death' && a.id === c.id)); return `<tr><td><b>${esc(c.name)}</b></td><td>${i < 0 ? 'Manual' : 'Phase ' + esc(phaseT(show[i].id))}</td><td>${esc(c.deathAlert || '')}</td></tr>`; }).join('')}
       <tr><td><b>Third victim</b></td><td>Chosen live by the killer during Killer Phase</td><td>${shortlist.map(t => esc(nm(t.id))).join(' · ')}</td></tr></table>
       <h3>Host notes</h3><div class="notes">${S.hostNotes || '<p class="muted">None.</p>'}</div>` +

      part('Part 2', 'Rooms & Evidence Placement') +
      `<table><tr><th>Room</th><th>Real space</th><th>Opens</th></tr>${rooms.map(r => `<tr><td><b>${esc(r.name)}</b><br><span class="muted">${esc(r.desc || '')}</span></td><td>${esc(r.place || '')}</td><td>${esc(roomOpens(r))}</td></tr>`).join('')}</table>
       <h3>Evidence tags to hide (print them from “Evidence QR Tags”)</h3>
       ${rooms.map(r => { const list = qrEv.filter(e => e.room === r.id); return list.length ? `<h4>${esc(r.name)}</h4><table><tr><th>Tag</th><th>Evidence</th><th>Where to hide it</th><th>Scannable</th></tr>${list.map(e => `<tr><td class="mono"><b>Nº ${String(tagNo(e.id)).padStart(2, '0')}</b></td><td>${esc(e.title)}</td><td>${esc(e.place || '')}</td><td>${e.after ? 'From phase ' + esc(phaseT(e.after)) : 'Once the room is open'}</td></tr>`).join('')}</table>` : ''; }).join('')}
       <h3>Official reports (no tag: they go to the Inspector's phone)</h3>
       <table><tr><th>Report</th><th>Delivered</th></tr>${official.map(e => `<tr><td>${esc(e.title)}</td><td>${esc(deliverAt(e))}</td></tr>`).join('')}</table>` +

      part('Part 3', 'The Night, Phase by Phase') +
      `<p class="muted small">Press <b>NEXT</b> on the Game tab to start each phase; everything under “When you press NEXT” happens by itself. Blue lines are what the Inspector reads (it's on their phone).</p>` +
      show.map((st, i) => {
        const mems = []; chars.forEach(c => memOf(c).forEach(m => { if (m.when && m.when.phase === st.id) mems.push(`${m.cue ? 'Cue' : 'Memory'} → ${nm(c.id)}`); }));
        return `<div class="step"><div class="step-h"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${esc(st.title)}</span><span class="tm">${esc(st.time || '')}</span></div>
        ${st.cue ? `<div class="cue"><b>YOUR CUE</b><br>${esc(st.cue).replace(/\n/g, '<br>')}</div>` : ''}
        ${(st.actions || []).length || mems.length ? `<div class="who" style="color:var(--gold)">WHEN YOU PRESS NEXT</div><ul class="acts">${(st.actions || []).map(a => `<li>${act(a)}</li>`).join('')}${mems.map(m => `<li>${esc(m)}</li>`).join('')}</ul>` : ''}
        ${st.host ? `<div class="who" style="color:var(--gold)">YOU SAY</div><div class="script">${paras(st.host)}</div>` : ''}
        ${st.inspector ? `<div class="who" style="color:var(--blue)">THE INSPECTOR SAYS</div><div class="script insp">${paras(st.inspector)}</div>` : ''}</div>`;
      }).join('') +

      part('Part 4', 'Evidence Files') +
      ev.map(e => `<div class="ev">${e.qr ? `<span class="tag gold">Tag Nº ${String(tagNo(e.id)).padStart(2, '0')} · ${esc(room(e.room))}</span>` : '<span class="tag blue">Official report</span>'}<span class="tag">${esc(e.tier || '')}</span><h3>${esc(e.title)}</h3><div class="src">${esc(e.src || '')}</div><div class="pre">${esc(e.body)}</div></div>`).join('') +

      part('Part 5', 'Automatic Memories') +
      `<p class="muted small">These appear on the player's phone by themselves. You don't send anything.</p>` +
      chars.filter(c => memOf(c).length).map(c => `<div class="box ${c.inspector ? 'blue' : 'gold'}"><div class="lbl">${esc(c.name)}</div>${memOf(c).map(m => `<p class="small"><span class="tag">${m.cue ? 'Cue' : 'Memory'} · ${esc(whenText(m.when))}</span><br>${esc(m.text)}</p>`).join('')}</div>`).join('') +

      part('Part 6', 'Cast List & Code Words') +
      `<table><tr><th>#</th><th>Character</th><th>Code word</th><th>Role in the story</th></tr>${chars.map(c => `<tr><td class="mono">${esc(c.file || '')}</td><td><b>${esc(c.name)}</b><br><span class="muted">${esc(c.occ || '')}</span></td><td class="mono"><b>${esc(c.code)}</b></td><td>${[c.inspector ? '<span class="tag blue">Inspector</span>' : '', c.killer ? '<span class="tag red">Killer</span>' : '', c.scriptedDeath ? '<span class="tag red">Scripted death</span>' : '', shortlist.some(t => t.id === c.id) ? '<span class="tag gold">Possible 3rd victim</span>' : '', c.suspect === false && !c.inspector ? '<span class="tag">Not a suspect</span>' : '', c.tier === 'ext' ? '<span class="tag">Extended cast</span>' : ''].join('')}</td></tr>`).join('')}</table>
      <p class="small muted">Master host code: <span class="mono"><b>${S.adminCode ? esc(S.adminCode) : '(the code you log in with)'}</b></span></p>` +

      part('Part 7', 'Using the Terminal') +
      `<p>Open <b>database.html</b> and log in with the host code. It locks itself after 30 minutes idle.</p>
      <table><tr><th>Tab</th><th>What it's for</th></tr>
      <tr><td><b>Game</b></td><td>The only tab you need on the night. <b>NEXT</b> starts each phase. Also: Lockdown button, announcements, rooms (open/seal by hand), the Evidence Board (see what's been found; reveal or send anything by hand), accusations, deaths.</td></tr>
      <tr><td><b>Players</b></td><td>Every character, code word and player. Access QR, Revoke / Restore, Sign out, emergency Message, Kill / Undo.</td></tr>
      <tr><td><b>Guests</b></td><td>Invite links, RSVPs, assign roles (including the Inspector), copy role texts.</td></tr>
      <tr><td><b>Tools</b></td><td>Manual switches, projector control, live invitation editor, emergency tools, activity log, hard reset.</td></tr></table>
      <h3>If something goes wrong</h3><table><tr><th>Problem</th><th>Fix</th></tr>
      <tr><td>Pressed NEXT too early or skipped a phase</td><td>Game → All phases → JUMP or RE-RUN the right one</td></tr>
      <tr><td>An evidence tag is lost or won't scan</td><td>Game → Evidence Board → REVEAL NOW</td></tr>
      <tr><td>The Inspector's phone died</td><td>Read their lines from Part 3; Evidence Board → RELEASE NOW for reports</td></tr>
      <tr><td>A room needs opening or closing</td><td>Game → Rooms → OPEN / SEAL</td></tr>
      <tr><td>A screen is stuck</td><td>Tools → FORCE REFRESH ALL</td></tr>
      <tr><td>The room is frozen</td><td>Tools → LIFT ALL</td></tr>
      <tr><td>A player is locked out</td><td>Players → RESTORE, or ACCESS QR</td></tr>
      <tr><td>A death happened by mistake</td><td>Game → Deaths → UNDO</td></tr>
      <tr><td>Total failure</td><td>Printed dossiers + read evidence aloud from Part 4</td></tr></table>` +

      part('Part 8', 'Checklist') +
      `<h3>The week before</h3><ul class="check"><li>All roles assigned (including the Inspector) and role texts sent</li><li>Real room names filled in (story.js → rooms → place)</li><li>Evidence QR tags printed and cut out</li><li>Props gathered for each tag (envelope, jacket, clutch bag, archive box…)</li><li>Two-phone test: scan a tag, NEXT through a phase, vote</li><li>Printed dossiers as a backup</li></ul>
      <h3>On the day</h3><ul class="check"><li>Firebase rules open (not locked)</li><li>Tags taped in place (Part 2)</li><li>Doors closed: Office, Archive Lounge, Study</li><li>Tools → HARD RESET</li><li>Projector: display.html unlocked, F11</li><li>Badge says LINK SECURE</li><li>Wi-Fi details posted for guests</li></ul>`;

    /* ---------------- QR TAGS ---------------- */
    const tags = () => {
      const url = e => (opts.base || '') + 'database.html#e=' + encodeURIComponent(e.qr);
      const tagHTML = e => `<div class="qtag"><div class="brand">KANE OIL &amp; ENERGY</div><div class="ttl">EVIDENCE</div>${opts.qr ? opts.qr(url(e)) : `<div class="noqr">QR codes need an internet connection. Open this from the dashboard's PRINT button.</div>`}<div class="num">Nº ${String(tagNo(e.id)).padStart(2, '0')}</div><div class="hint">Scan with your phone camera</div></div>`;
      const pages = []; for (let i = 0; i < qrEv.length; i += 6) pages.push(qrEv.slice(i, i + 6));
      return pages.map((pg, i) => `<div style="${i ? 'break-before:page' : ''}"><p class="small muted sans" style="margin:0 0 8pt">Cut along the dashed lines. Tape each tag to its object (placement key on the last page). Tags only work once their room is open.</p><div class="tags">${pg.map(tagHTML).join('')}</div></div>`).join('') +
        `<div style="break-before:page"><h2 style="margin-top:0">Placement key <span class="tag red">Host only</span></h2><table><tr><th>Tag</th><th>Evidence</th><th>Room</th><th>Where to hide it</th><th>Scannable</th></tr>${qrEv.map(e => `<tr><td class="mono"><b>Nº ${String(tagNo(e.id)).padStart(2, '0')}</b></td><td>${esc(e.title)}</td><td>${esc(room(e.room))}</td><td>${esc(e.place || '')}</td><td>${e.after ? 'From phase ' + esc(phaseT(e.after)) : 'Once the room opens'}</td></tr>`).join('')}</table>
        <p class="small muted">If a tag is damaged, you can reprint it at any time. The codes never change. Or use Game → Evidence Board → REVEAL NOW.</p></div>`;
    };

    /* ---------------- INSPECTOR'S LINES ---------------- */
    const inspectorDoc = () => cover("Inspector's Lines", inspector ? 'For ' + inspector.name : 'For the Inspector', 'FOR THE INSPECTOR ONLY') +
      `<h2 style="margin-top:0">How your night works</h2>
      <p>You arrive as an ordinary guest. Nobody knows who you are. When Alexandra Kane collapses at the toast, your phone lights up with your first lines. Step forward and take charge.</p>
      <p>From then on, every time the host moves the night forward, your phone shows <b>YOUR LINES</b> for that moment. Read them aloud, in your own words if you like. Official reports (toxicology, the coroner's file, a court record) arrive on your phone. Read them to the room, then press <b>RELEASE TO ALL</b>.</p>
      <p>Evidence hidden in the rooms is found by the guests, not you. Your job is to push them to search, question them, and make them share. You don't know who the killer is. Solve it for real.</p>
      <p class="muted small">Below are your lines, so you can rehearse. The final reveal isn't printed here: it arrives on your phone at the very end.</p>` +
      show.filter(st => st.inspector && !(st.actions || []).some(a => a.do === 'verdict' && a.stage === 'reveal')).map((st, i) =>
        `<div class="step"><div class="step-h"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${esc(st.title)}</span><span class="tm">${esc(st.time || '')}</span></div><div class="script">${paras(blank(st.inspector))}</div></div>`).join('') +
      `<div class="step"><div class="step-h"><span class="n">★</span><span class="t">The Truth</span></div><p class="muted">Your final lines arrive on your phone when the host reveals the verdict. Read them slowly.</p></div>`;

    /* ---------------- DOSSIERS ---------------- */
    const dossier = c => {
      const mems = memOf(c);
      return `<section class="dossier"><div class="dos-head"><div><div class="file">PERSONNEL FILE ${esc(c.file || '')}${c.tier === 'ext' ? ' · EXTENDED CAST' : ''}</div><h2>${esc(c.name)}</h2>
          <div>${c.inspector ? '<span class="tag blue">Inspector</span>' : ''}${c.killer ? '<span class="tag red">Killer</span>' : ''}${c.scriptedDeath ? '<span class="tag red">Scripted death</span>' : ''}${shortlist.some(t => t.id === c.id) ? '<span class="tag gold">Possible 3rd victim</span>' : ''}${c.suspect === false && !c.inspector ? '<span class="tag">Not a suspect</span>' : ''}</div></div>
          <div class="code">${esc(c.code)}</div></div>
        <div class="kv"><b>Classification</b><span>${esc(c.cls || 'SUBJECT')}${c.clsSecret ? ` <span class="muted">→ becomes “${esc(c.clsSecret)}” ${c.killer ? 'at Killer Phase' : c.inspector ? 'once they take charge' : 'after death'}</span>` : ''}</span><b>Age</b><span>${esc(c.age)}</span><b>Occupation</b><span>${esc(c.occ)}</span></div>
        ${c.sections.map(s => `<div class="sec ${s.key ? 'key' : ''} ${s.role ? 'role' : ''}"><h4>${esc(s.h)} ${s.hostOnly ? '<span class="tag red">Host only · never shown to player</span>' : ''}${s.sealed ? '<span class="tag red">Sealed until Killer Phase</span>' : ''}</h4>${paras(s.t)}
          ${s.sealed && s.sealed !== true ? `<div class="box" style="margin:3pt 0 0;padding:5pt 9pt"><span class="small muted"><b class="sans">Before Killer Phase the player only sees:</b> ${esc(s.sealed)}</span></div>` : ''}</div>`).join('')}
        ${c.killer ? `<div class="box red"><div class="lbl">Killer Phase</div><p class="small"><b>Reveal screen:</b> ${(c.killer.reveal || []).map(esc).join(' / ')}</p><p class="small" style="margin:0"><b>Can choose to kill:</b> ${(c.killer.shortlist || []).map(t => esc(nm(t.id))).join(', ')}</p></div>` : ''}
        ${c.scriptedDeath ? `<div class="box red"><div class="lbl">Death alert</div><p class="small" style="margin:0">${esc(c.deathAlert || '')}</p></div>` : ''}
        ${mems.length ? `<div class="box gold"><div class="lbl">Memories that surface automatically</div>${mems.map((m, i) => `<p class="small"><b>${i + 1}.</b> <span class="tag">${m.cue ? 'Cue' : 'Memory'} · ${esc(whenText(m.when))}</span> ${esc(m.text)}</p>`).join('')}</div>` : ''}</section>`;
    };
    const dossiers = () => cover('Character Dossiers', `All ${chars.length} personnel files, as written`, 'CONFIDENTIAL · CONTAINS SPOILERS') +
      `<h2 style="margin-top:0">Index</h2><table><tr><th>#</th><th>Character</th><th>Code word</th><th>Occupation</th></tr>${chars.map(c => `<tr><td class="mono">${esc(c.file || '')}</td><td><b>${esc(c.name)}</b></td><td class="mono">${esc(c.code)}</td><td>${esc(c.occ || '')}</td></tr>`).join('')}</table>
      <p class="small muted">Each dossier starts on a new page. Red tags show what players don't see. Gold boxes list memories that pop up on that player's phone during the game.</p>` +
      chars.map(dossier).join('');

    /* ---------------- INVITATION & RULES ---------------- */
    const D = P.display || {};
    const invite = () => cover('Invitation & Rules', 'Everything guests will read', '', ' · Safe to share: no spoilers') +
      part('Guest-facing', 'The Invitation') +
      `<p style="font-style:italic;font-size:13pt">${esc(P.inWorld || '')}</p>
       <h2 style="font:700 28pt Georgia,serif;margin:8pt 0 0">${esc(P.title || '')}</h2><p style="font:italic 14pt Georgia,serif" class="muted">${esc(P.subtitle || '')}${P.host ? ' · Hosted by ' + esc(P.host) : ''}</p>
       <table><tr><th>When</th><td>${esc(P.date || '')}${P.time ? ' · ' + esc(P.time) : ''}</td></tr><tr><th>Where</th><td>${esc(P.venue || '')}${P.address ? '<br>' + esc(P.address) : ''}</td></tr><tr><th>Dress</th><td>${esc(P.dress || '')}</td></tr><tr><th>RSVP by</th><td>${esc(P.rsvpBy || '')}</td></tr></table>
       ${P.notice ? `<div class="box gold"><div class="lbl">Announcement banner</div><p style="margin:0">${esc(P.notice)}</p></div>` : ''}
       <h3>The evening</h3>${(P.premise || []).map(p => `<p>${esc(p)}</p>`).join('')}
       <h3>What to expect</h3><ul>${(P.expect || []).map(p => `<li>${esc(p)}</li>`).join('')}</ul>
       <h3>The Kane Oil Database</h3>${(P.howItWorks || []).map((s, i) => `<p><b>${i + 1}. ${esc(s.title)}.</b> ${esc(s.text)}</p>`).join('')}` +
      part('Guest-facing', 'Rules of the Night') +
      `${P.showRules ? '' : '<p class="tag red">Currently hidden on the site</p>'}<ol>${(P.rules || []).map(r => `<li style="margin-bottom:8pt"><b>${esc(r.title)}.</b> ${esc(r.text)}</li>`).join('')}</ol>` +
      part('On the big screen', 'Projector Text') +
      `<table><tr><th>Company</th><td>${esc(D.company || '')}</td></tr><tr><th>Welcome</th><td>${esc(D.welcome || '')}<br><span class="muted">${esc(D.welcomeSub || '')}</span></td></tr><tr><th>After Alex dies</th><td>${esc(D.memoriamText || '')}<br><span class="muted">${esc(D.memoriamSub || '')}</span></td></tr><tr><th>Bulletin slides</th><td>${(D.slides || []).map(esc).join('<br>')}</td></tr></table>`;

    return { host, tags, inspector: inspectorDoc, dossiers, invite };
  }

  const LABELS = { host: 'HOST BOOK · CONFIDENTIAL', tags: 'EVIDENCE QR TAGS · CONFIDENTIAL', inspector: "INSPECTOR'S LINES", dossiers: 'CHARACTER DOSSIERS · CONFIDENTIAL', invite: 'INVITATION & RULES', all: 'PRINT PACKET · CONFIDENTIAL' };
  /** Returns { html, label, pageCSS } for 'host' | 'tags' | 'inspector' | 'dossiers' | 'invite' | 'all'.
      opts.qr(text) → <img> tag for a QR code; opts.base = site address for tag links. */
  function render(S, P, which, opts) {
    const d = build(S, P, opts);
    const html = which === 'all' ? d.host() + `<div style="break-before:page"></div>` + d.tags() + d.inspector() + d.dossiers() + d.invite() : (d[which] || d.host)();
    const label = LABELS[which] || LABELS.host;
    const pageCSS = `@page{size:Letter;margin:.7in .75in .75in;@bottom-left{content:"THE LAST TOAST · ${label}";font:7.5pt 'Segoe UI',Arial,sans-serif;letter-spacing:.14em;color:#8a8f99}@bottom-right{content:counter(page);font:9pt Georgia,serif;color:#8a8f99}}@page:first{@bottom-left{content:none}@bottom-right{content:none}}`;
    return { html, label, pageCSS };
  }
  return { CSS, render, LABELS };
})();
