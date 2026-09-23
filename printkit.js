/* =====================================================================
   KANE OIL — PRINT KIT
   Lays out the Host Book, Character Dossiers and Invitation & Rules for
   printing. Contains no story content itself: the host dashboard feeds it
   the decrypted story after the host logs in, and private/print.html feeds
   it story.js. You shouldn't need to edit this file.
   ===================================================================== */
window.PrintKit = (function () {
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const paras = t => String(t || '').split(/\n\s*\n/).map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('');
  const HEX = `<svg class="hex" viewBox="0 0 64 64" fill="none"><path d="M32 3 57 17.5v29L32 61 7 46.5v-29z" stroke="#94701f" stroke-width="2.5"/><path d="M25 20v24M25 32l11-12M28.5 29 38 44" stroke="#94701f" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const CSS = `:root{--ink:#1b1d22;--muted:#5b6170;--gold:#94701f;--gold-l:#f3ead3;--red:#a3202f;--red-l:#f8e3e6;--blue:#1f4f8f;--blue-l:#e4ecf7;--line:#d9dbe1}
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
h1.part{font-size:22pt;letter-spacing:.06em;margin:0 0 4pt;color:var(--ink);break-before:page;padding-top:4pt}
.part-kicker{font:600 9pt 'Segoe UI',Arial,sans-serif;letter-spacing:.24em;color:var(--gold);text-transform:uppercase}
.rule{height:2px;background:linear-gradient(90deg,var(--gold),transparent);margin:6pt 0 16pt}
h2{font-size:14pt;margin:18pt 0 6pt;break-after:avoid}
h3{font-size:12pt;margin:14pt 0 4pt;break-after:avoid}
h4{font-size:9pt;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin:12pt 0 3pt;break-after:avoid}
p{margin:0 0 7pt}
.muted{color:var(--muted)}
.small{font-size:9.5pt}
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
.script p{margin:0 0 8pt}
.cue{font:10pt/1.5 'Segoe UI',Arial,sans-serif;color:#2a3140;background:#f4f6f9;border-radius:6pt;padding:8pt 10pt;margin:6pt 0}
.cue b{font-size:8pt;letter-spacing:.18em;color:var(--blue)}
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
.err{background:#fde8e8;border:1px solid var(--red);color:var(--red);padding:12pt;border-radius:6pt;font:11pt 'Segoe UI',Arial,sans-serif}
`;

  function build(S, P) {
    P = P || {};
    const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const chars = S.characters || [], ev = S.evidence || [], facts = S.facts || {}, show = S.show || [];
  const CH = Object.fromEntries(chars.map(c => [c.id, c])), EV = Object.fromEntries(ev.map(e => [e.id, e]));
  const nm = id => (CH[id] && CH[id].name) || id;
  const killer = chars.find(c => c.killer);
  const FLAGS = { lockdown: 'Lockdown', killer: 'Killer Phase', voting: 'Voting', sealed: 'Seal dossiers' };
  const SC = { company: 'Company page', title: 'Title card', evidence: 'Latest evidence', wall: 'Evidence wall', voting: 'Voting screen', tally: 'Results' };
  const act = a => {
    switch (a.do) {
      case 'flag': return a.flag === 'sealed' ? (a.value ? 'Seal all dossiers' : 'Open dossiers') : `${FLAGS[a.flag]} <b>${a.value ? 'ON' : 'OFF'}</b>`;
      case 'death': return `Announce death: <b>${esc(nm(a.id))}</b>`;
      case 'evidence': return `Push evidence: <b>${esc((EV[a.id] || {}).title || a.id)}</b>`;
      case 'scene': return `Projector: ${esc(SC[a.scene] || a.scene)}`;
      case 'broadcast': return `Broadcast: “${esc(a.text)}”`;
      case 'message': return `Private message to <b>${esc(nm(a.to))}</b>: fact ${(a.fact || 0) + 1}`;
      case 'verdict': return a.stage === 'reveal' ? '<b>Reveal the truth</b> (Final Verdict)' : '<b>Name the accused</b> (Final Verdict)';
    }
    return esc(a.do);
  };
  const cover = (title, sub, conf, extra = '') => `<section class="cover">${HEX}<div class="k">Kane Oil &amp; Energy · ${esc(P.title || 'The Last Toast')}</div><h1>${esc(title)}</h1><div class="sub">${esc(sub)}</div>${conf ? `<div class="conf">${esc(conf)}</div>` : ''}<div class="meta">Printed ${esc(today)}${extra}</div></section>`;
  const part = (kicker, title) => `<h1 class="part">${esc(title)}</h1><div class="part-kicker">${esc(kicker)}</div><div class="rule"></div>`;

  /* ---------------- HOST BOOK ---------------- */
  const shortlist = killer && killer.killer ? killer.killer.shortlist || [] : [];
  const host = () => cover('Host Book', 'Everything you need to run the night', 'CONFIDENTIAL · HOST EYES ONLY', ` · Host: ${esc(P.host || '')}`) +
    `<h2 style="margin-top:0">Contents</h2><ol class="toc"><li>The case at a glance</li><li>Run of show &amp; scripts</li><li>Evidence files</li><li>Private facts to send</li><li>Cast list &amp; code words</li><li>Using the Master Control Terminal</li><li>Party-night checklist</li></ol>` +

    part('Part 1', 'The Case at a Glance') +
    `<div class="box red"><div class="lbl">The killer</div><p style="font-size:14pt;margin:0"><b>${esc(killer ? killer.name : '—')}</b> ${S.solution && S.solution.alias ? `<i>(${esc(S.solution.alias)})</i>` : ''}</p>${killer ? `<p class="small muted" style="margin:3pt 0 0">Code word <span class="mono">${esc(killer.code)}</span></p>` : ''}</div>
     ${S.solution && S.solution.summary ? `<h3>The solution (as shown on every screen at the reveal)</h3>${paras(S.solution.summary)}` : ''}
     <h3>Deaths</h3><table><tr><th>Victim</th><th>How it happens</th><th>Alert text</th></tr>
     ${chars.filter(c => c.scriptedDeath).map(c => `<tr><td><b>${esc(c.name)}</b></td><td>You press “Announce death”</td><td>${esc(c.deathAlert || '')}</td></tr>`).join('')}
     <tr><td><b>Third victim</b></td><td>Chosen live by the killer once you turn on Killer Phase</td><td>${shortlist.map(t => esc(nm(t.id))).join(' · ')}</td></tr></table>
     ${shortlist.length ? `<h3>The killer's shortlist</h3><table><tr><th>Target</th><th>Why (as the killer sees it)</th></tr>${shortlist.map(t => `<tr><td><b>${esc(nm(t.id))}</b></td><td>${esc(t.why)}</td></tr>`).join('')}</table>` : ''}
     <h3>Host notes</h3><div class="notes">${S.hostNotes || '<p class="muted">None.</p>'}</div>` +

    part('Part 2', 'Run of Show & Scripts') +
    `<p class="muted small">Read the gold-lined text aloud. The grey boxes are your stage directions. Each “Do” item is a one-tap button in the Run of Show tab. {victim3} and {accused} are filled in automatically on screen.</p>` +
    show.map((st, i) => `<div class="step"><div class="step-h"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${esc(st.title)}</span><span class="tm">${esc(st.time || '')}</span></div>
      ${st.cue ? `<div class="cue"><b>CUE</b><br>${esc(st.cue).replace(/\n/g, '<br>')}</div>` : ''}
      ${st.script ? `<div class="script">${paras(st.script)}</div>` : ''}
      ${(st.actions || []).length ? `<div class="sans small" style="font-weight:700;letter-spacing:.14em;color:var(--blue);margin-top:4pt">DO</div><ol class="acts">${st.actions.map(a => `<li>${act(a)}</li>`).join('')}</ol>` : ''}</div>`).join('') +

    part('Part 3', 'Evidence Files') +
    `<p class="muted small">In suggested release order. Push each from the Live game tab or from its Run of Show step.</p>` +
    ev.map((e, i) => `<div class="ev"><span class="tag ${e.tier === 'Red herring' ? '' : 'gold'}">${esc(e.tier || '')}</span><span class="tag">#${i + 1} · id: ${esc(e.id)}</span><h3>${esc(e.title)}</h3><div class="src">${esc(e.src || '')}</div><div class="pre">${esc(e.body)}</div></div>`).join('') +

    part('Part 4', 'Private Facts to Send') +
    `<p class="muted small">Sent from Cast &amp; access → MESSAGE, or from a Run of Show step. They arrive as an encrypted “Incoming Transmission” on that player's phone only.</p>` +
    Object.entries(facts).map(([id, list]) => `<div class="box blue"><div class="lbl">${esc(nm(id))}</div>${list.map((f, i) => `<p><b class="sans small">FACT ${i + 1}.</b> ${esc(f)}</p>`).join('')}</div>`).join('') +

    part('Part 5', 'Cast List & Code Words') +
    `<table><tr><th>#</th><th>Character</th><th>Code word</th><th>Role in the story</th></tr>${chars.map(c => `<tr><td class="mono">${esc(c.file || '')}</td><td><b>${esc(c.name)}</b><br><span class="muted">${esc(c.occ || '')}</span></td><td class="mono"><b>${esc(c.code)}</b></td><td>${[c.killer ? '<span class="tag red">Killer</span>' : '', c.scriptedDeath ? '<span class="tag red">Scripted death</span>' : '', shortlist.some(t => t.id === c.id) ? '<span class="tag gold">Possible 3rd victim</span>' : '', c.suspect === false ? '<span class="tag">Not a suspect</span>' : '', c.tier === 'ext' ? '<span class="tag">Extended cast</span>' : ''].join('')}</td></tr>`).join('')}</table>
    <p class="small muted">Master host code: <span class="mono"><b>${S.adminCode ? esc(S.adminCode) : '(the code you log in with)'}</b></span></p>` +

    part('Part 6', 'Using the Master Control Terminal') +
    `<p>Open <b>database.html</b> and log in with the host code. The terminal locks itself after 30 minutes idle, or when you close the tab.</p>
    <table><tr><th>Tab</th><th>What it's for</th></tr>
    <tr><td><b>Run of show</b></td><td>Every beat of the night: cue, script, one-tap actions, “Mark done.” TELEPROMPTER mode for reading at full size (arrow keys move between steps).</td></tr>
    <tr><td><b>Live game</b></td><td>Lockdown · Killer Phase · Voting · Seal dossiers. Deaths &amp; the killer's strike (with Undo). Evidence push / retract. Broadcast notices. Final Verdict. Live tally. Roster.</td></tr>
    <tr><td><b>Cast &amp; access</b></td><td>Every character, code word and player. MESSAGE (private), ACCESS QR (logs a phone straight in), REVOKE / RESTORE, SIGN OUT, CLEAR VOTE, KILL / UNDO.</td></tr>
    <tr><td><b>Projector</b></td><td>Choose the big-screen scene. Lockdown, deaths, broadcasts and the verdict take over the screen automatically. The projector page needs the host code once per tab.</td></tr>
    <tr><td><b>Guests</b></td><td>Invite links &amp; QR codes, RSVPs, assign roles, COPY ROLE TEXT (marks “sent”).</td></tr>
    <tr><td><b>System</b></td><td>Live page editor (change the invitation instantly). Emergency tools. Activity log.</td></tr></table>
    <h3>If something goes wrong</h3><table><tr><th>Problem</th><th>Fix</th></tr>
    <tr><td>A screen is stuck or out of date</td><td>System → FORCE REFRESH ALL</td></tr>
    <tr><td>The room is frozen / alert won't go away</td><td>System → LIFT ALL</td></tr>
    <tr><td>A player is locked out</td><td>System → RESTORE ALL ACCESS, or Cast → RESTORE / ACCESS QR</td></tr>
    <tr><td>Someone's phone is logged in as the wrong person</td><td>Cast → SIGN OUT on that character, then ACCESS QR for the right one</td></tr>
    <tr><td>A death or kill happened by mistake</td><td>Live game → UNDO next to it</td></tr>
    <tr><td>Voting went wrong</td><td>System → CLEAR VOTES (also clears the verdict)</td></tr>
    <tr><td>Wi-Fi drops</td><td>Phones reconnect by themselves. Badge shows RECONNECTING until they do.</td></tr>
    <tr><td>Total failure</td><td>Use the printed dossiers and read evidence aloud from this book</td></tr></table>` +

    part('Part 7', 'Party-Night Checklist') +
    `<h3>The week before</h3><ul class="check"><li>All roles assigned and role texts sent (Guests tab)</li><li>Two-phone test: lockdown, evidence, message, vote</li><li>Projector laptop tested with display.html</li><li>Printed dossiers as a backup</li></ul>
    <h3>On the day</h3><ul class="check"><li>Firebase rules open (not locked)</li><li>System → HARD RESET</li><li>Projector: display.html unlocked, F11, Title card</li><li>Badge says LINK SECURE on your laptop</li><li>Wi-Fi name &amp; password posted for guests</li><li>Inspector costume: coat, notebook, badge</li><li>This book, open to Part 2</li></ul>`;

  /* ---------------- DOSSIERS ---------------- */
  const dossier = c => {
    const f = facts[c.id] || [];
    return `<section class="dossier"><div class="dos-head"><div><div class="file">PERSONNEL FILE ${esc(c.file || '')}${c.tier === 'ext' ? ' · EXTENDED CAST' : ''}</div><h2>${esc(c.name)}</h2>
        <div>${c.killer ? '<span class="tag red">Killer</span>' : ''}${c.scriptedDeath ? '<span class="tag red">Scripted death</span>' : ''}${shortlist.some(t => t.id === c.id) ? '<span class="tag gold">Possible 3rd victim</span>' : ''}${c.suspect === false ? '<span class="tag">Not a suspect</span>' : ''}</div></div>
        <div class="code">${esc(c.code)}</div></div>
      <div class="kv"><b>Classification</b><span>${esc(c.cls || 'SUBJECT')}${c.clsSecret ? ` <span class="muted">→ becomes “${esc(c.clsSecret)}” ${c.killer ? 'at Killer Phase' : 'after death'}</span>` : ''}</span><b>Age</b><span>${esc(c.age)}</span><b>Occupation</b><span>${esc(c.occ)}</span></div>
      ${c.sections.map(s => `<div class="sec ${s.key ? 'key' : ''} ${s.role ? 'role' : ''}"><h4>${esc(s.h)} ${s.hostOnly ? '<span class="tag red">Host only · never shown to player</span>' : ''}${s.sealed ? '<span class="tag red">Sealed until Killer Phase</span>' : ''}</h4>${paras(s.t)}
        ${s.sealed && s.sealed !== true ? `<div class="box" style="margin:3pt 0 0;padding:5pt 9pt"><span class="small muted"><b class="sans">Before Killer Phase the player only sees:</b> ${esc(s.sealed)}</span></div>` : ''}</div>`).join('')}
      ${c.killer ? `<div class="box red"><div class="lbl">Killer Phase</div><p class="small"><b>Reveal screen:</b> ${(c.killer.reveal || []).map(esc).join(' / ')}</p><p class="small" style="margin:0"><b>Can choose to kill:</b> ${(c.killer.shortlist || []).map(t => esc(nm(t.id))).join(', ')}</p></div>` : ''}
      ${c.scriptedDeath ? `<div class="box red"><div class="lbl">Death alert (sent when you announce it)</div><p class="small" style="margin:0">${esc(c.deathAlert || '')}</p></div>` : ''}
      ${f.length ? `<div class="box blue"><div class="lbl">Private facts you can send this player</div>${f.map((x, i) => `<p class="small"><b>${i + 1}.</b> ${esc(x)}</p>`).join('')}</div>` : ''}</section>`;
  };
  const dossiers = () => cover('Character Dossiers', `All ${chars.length} personnel files, as written`, 'CONFIDENTIAL · CONTAINS SPOILERS') +
    `<h2 style="margin-top:0">Index</h2><table><tr><th>#</th><th>Character</th><th>Code word</th><th>Occupation</th></tr>${chars.map(c => `<tr><td class="mono">${esc(c.file || '')}</td><td><b>${esc(c.name)}</b></td><td class="mono">${esc(c.code)}</td><td>${esc(c.occ || '')}</td></tr>`).join('')}</table>
    <p class="small muted">Each dossier starts on a new page. Red tags show what players do <i>not</i> see (host-only sections and anything sealed until Killer Phase). Blue boxes are facts you can send privately during the game.</p>` +
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
     <h3>The Kane Oil Database</h3>${(P.howItWorks || []).map((s, i) => `<p><b>${i + 1}. ${esc(s.title)}.</b> ${esc(s.text)}</p>`).join('')}
     <h3>RSVP form asks for</h3><p class="small">Name · Attending (yes / maybe / no) · Plus-one and their name · Preferred role size · Dietary needs · A note for the host</p>
     <h3>Invitation message (from the dashboard)</h3><div class="box"><p class="pre small" style="margin:0">You're invited to ${esc((P.title || '').toUpperCase())}: ${esc(P.subtitle || '')}, hosted by ${esc(P.host || '')}.

${esc(P.date || '')}${P.time ? ', ' + esc(P.time) : ''}
${esc(P.venue || '')}

All the details, and your RSVP, are here: [your site link]

Please RSVP by ${esc(P.rsvpBy || '')}. Roles and secret code words go out after that.</p></div>` +
    part('Guest-facing', 'Rules of the Night') +
    `${P.showRules ? '' : '<p class="tag red">Currently hidden on the site (showRules: false)</p>'}<ol>${(P.rules || []).map(r => `<li style="margin-bottom:8pt"><b>${esc(r.title)}.</b> ${esc(r.text)}</li>`).join('')}</ol>` +
    part('On the big screen', 'Projector Text') +
    `<table><tr><th>Company name</th><td>${esc(D.company || '')}</td></tr><tr><th>Welcome</th><td>${esc(D.welcome || '')}<br><span class="muted">${esc(D.welcomeSub || '')}</span></td></tr><tr><th>After Alex dies</th><td>${esc(D.memoriamText || '')}<br><span class="muted">${esc(D.memoriamSub || '')}</span></td></tr><tr><th>Bulletin slides</th><td>${(D.slides || []).map(esc).join('<br>')}</td></tr><tr><th>Stock ticker</th><td class="mono">${(D.tickers || []).map(t => esc(t[0])).join(' · ')}</td></tr></table>`;

    return { host, dossiers, invite };
  }

  const LABELS = { host: 'HOST BOOK · CONFIDENTIAL', dossiers: 'CHARACTER DOSSIERS · CONFIDENTIAL', invite: 'INVITATION & RULES', all: 'PRINT PACKET · CONFIDENTIAL' };
  /** Returns { html, label, pageCSS } for 'host' | 'dossiers' | 'invite' | 'all'. */
  function render(S, P, which) {
    const d = build(S, P);
    const html = which === 'all' ? d.host() + d.dossiers() + d.invite() : (d[which] || d.host)();
    const label = LABELS[which] || LABELS.host;
    const pageCSS = `@page{size:Letter;margin:.7in .75in .75in;@bottom-left{content:"THE LAST TOAST · ${label}";font:7.5pt 'Segoe UI',Arial,sans-serif;letter-spacing:.14em;color:#8a8f99}@bottom-right{content:counter(page);font:9pt Georgia,serif;color:#8a8f99}}@page:first{@bottom-left{content:none}@bottom-right{content:none}}`;
    return { html, label, pageCSS };
  }
  return { CSS, render, LABELS };
})();