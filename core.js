/* =====================================================================
   KANE OIL — shared engine: live sync, encryption, UI helpers.
   You shouldn't need to edit this file.
   ===================================================================== */

/* ---------- small helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const fmtTime = ts => typeof ts === 'number' && ts > 1 ? new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'just now';
const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const initials = n => String(n).replace(/^(Dr\.|Senator|Judge)\s+/, '').replace(/"[^"]*"\s*/, '').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
function patch(el, sig, html) { if (!el) return false; if (el._sig !== sig) { el._sig = sig; el.innerHTML = html; return true; } return false; }
function setPath(obj, path, val) {
  const parts = path.split('/'); let o = obj;
  for (let i = 0; i < parts.length - 1; i++) { if (typeof o[parts[i]] !== 'object' || o[parts[i]] === null) o[parts[i]] = {}; o = o[parts[i]]; }
  const k = parts[parts.length - 1];
  if (val === null || val === undefined) delete o[k]; else o[k] = JSON.parse(JSON.stringify(val));
}
function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Failed to load ' + src)); document.head.appendChild(s); }); }
function siteBase() {
  if (CONFIG.SITE_URL) return CONFIG.SITE_URL.replace(/\/?$/, '/');
  return location.href.replace(/[#?].*$/, '').replace(/[^/]*$/, '');
}
async function copyText(t) {
  try { await navigator.clipboard.writeText(t); return true; }
  catch (e) {
    const ta = document.createElement('textarea'); ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (_) { }
    ta.remove(); return ok;
  }
}

/* ---------- per-device storage (localStorage with in-memory fallback) ---------- */
const _MEM = {};
const store = {
  k: k => 'kane:' + CONFIG.GAME_ID + ':' + k,
  get(k) { const key = this.k(k); try { const v = localStorage.getItem(key); if (v !== null) return v; } catch (e) { } return key in _MEM ? _MEM[key] : null; },
  set(k, v) { const key = this.k(k); _MEM[key] = v; try { localStorage.setItem(key, v); } catch (e) { } },
  del(k) { const key = this.k(k); delete _MEM[key]; try { localStorage.removeItem(key); } catch (e) { } }
};

/* ---------- encryption (dossiers are locked with their code words) ---------- */
const _te = new TextEncoder(), _td = new TextDecoder();
const normCode = s => String(s || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
function b64(u8) { u8 = u8 instanceof Uint8Array ? u8 : new Uint8Array(u8); let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); }
function unb64(s) { return Uint8Array.from(atob(s), c => c.charCodeAt(0)); }
const hex = u8 => Array.from(u8, b => b.toString(16).padStart(2, '0')).join('');
async function deriveFromCode(code, saltB64, iter) {
  const base = await crypto.subtle.importKey('raw', _te.encode(normCode(code)), 'PBKDF2', false, ['deriveBits']);
  const bits = new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: unb64(saltB64), iterations: iter, hash: 'SHA-256' }, base, 512));
  const key = await crypto.subtle.importKey('raw', bits.slice(0, 32), 'AES-GCM', false, ['encrypt', 'decrypt']);
  return { key, id: hex(bits.slice(32)).slice(0, 32) };
}
async function decryptJSON(key, blob) { const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(blob.iv) }, key, unb64(blob.ct)); return JSON.parse(_td.decode(pt)); }
async function encryptJSON(key, obj) { const iv = crypto.getRandomValues(new Uint8Array(12)); const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, _te.encode(JSON.stringify(obj))); return { iv: b64(iv), ct: b64(ct) }; }
/** Try a code word against the locked story. Returns the decrypted bundle, or null. */
async function unlockStory(code) {
  const L = window.STORY_LOCKED; if (!L) throw new Error('story.locked.js is missing');
  const { key, id } = await deriveFromCode(code, L.salt, L.iter);
  const blob = L.blobs[id]; if (!blob) return null;
  return decryptJSON(key, blob);
}
/** Stable key (independent of story rebuilds) for the host's private role assignments. */
async function deriveAssignKey(code) {
  const base = await crypto.subtle.importKey('raw', _te.encode(normCode(code)), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: _te.encode('kane-assign|' + CONFIG.GAME_ID), iterations: 120000, hash: 'SHA-256' }, base, 256);
  return crypto.subtle.importKey('raw', bits, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

/* ---------- live sync backends: on(cb), update({path:value}), set(path, value) ---------- */
function LocalBackend() {
  const FULL = store.k('db'); let bc = null, cbs = [], last = null;
  try { bc = new BroadcastChannel(FULL); } catch (e) { }
  const read = () => { try { return JSON.parse(store.get('db') || '{}'); } catch (e) { return {}; } };
  const emit = () => { const raw = store.get('db') || '{}'; if (raw !== last) { last = raw; let v = {}; try { v = JSON.parse(raw); } catch (e) { } cbs.forEach(cb => cb(v)); } };
  const write = s => { store.set('db', JSON.stringify(s)); if (bc) bc.postMessage(1); emit(); };
  let started = false;
  return {
    mode: 'local', connected: true, now: () => Date.now(), TS: () => Date.now(),
    on(fn) {
      cbs.push(fn);
      if (!started) { started = true; if (bc) bc.onmessage = emit; window.addEventListener('storage', e => { if (e.key === FULL) emit(); }); setInterval(emit, 1000); }
      last = null; emit();
    },
    update(paths) { const s = read(); for (const k in paths) setPath(s, k, paths[k]); write(s); return Promise.resolve(); },
    set(path, val) { const s = read(); setPath(s, path, val); write(s); return Promise.resolve(); },
    onDisconnect() { }
  };
}
async function FirebaseBackend(onConn) {
  const v = '10.12.2';
  await loadScript(`https://www.gstatic.com/firebasejs/${v}/firebase-app-compat.js`);
  await loadScript(`https://www.gstatic.com/firebasejs/${v}/firebase-database-compat.js`);
  if (!firebase.apps.length) firebase.initializeApp(CONFIG.FIREBASE);
  const db = firebase.database();
  const root = db.ref('games/' + CONFIG.GAME_ID);
  let offset = 0;
  db.ref('.info/serverTimeOffset').on('value', s => { offset = s.val() || 0; });
  const fail = e => { console.error(e); toast('SYNC ERROR', e.message || String(e), 'err'); };
  const be = {
    mode: 'firebase', connected: false, now: () => Date.now() + offset, TS: () => firebase.database.ServerValue.TIMESTAMP,
    on(fn) { root.on('value', s => fn(s.val() || {}), err => { console.error(err); toast('DATABASE ERROR', 'Permission denied. Check your Firebase rules.', 'err'); }); },
    update(p) { return root.update(p).catch(fail); },
    set(path, val) { return root.child(path).set(val).catch(fail); },
    onDisconnect(path, val) { try { root.child(path).onDisconnect().set(val); } catch (e) { } }
  };
  db.ref('.info/connected').on('value', s => { be.connected = !!s.val(); onConn && onConn(); });
  return be;
}
async function connectBackend(onConn) {
  try { return CONFIG.FIREBASE ? await FirebaseBackend(onConn) : LocalBackend(); }
  catch (e) { console.error(e); toast('LIVE LINK FAILED', 'Could not reach Firebase. Running in local mode.', 'err'); return LocalBackend(); }
}

/* ---------- game state shape ---------- */
function freshLive() {
  return { epoch: 'e' + Date.now().toString(36), flags: { lockdown: false, killer: false, voting: false }, display: { scene: 'company', ts: Date.now() } };
}
function normRoot(r) {
  r = r || {}; const s = r.live || {};
  return {
    epoch: s.epoch || '0',
    flags: Object.assign({ lockdown: false, killer: false, voting: false }, s.flags || {}),
    evidence: s.evidence || {},     // id -> {ts,title,src,body,tier}
    kill: s.kill || null,           // killer's directive: {victim, ts}
    deaths: s.deaths || {},         // host-announced deaths: id -> ts
    alert: s.alert || null,         // {id,type:'kill'|'notice',text,ts}
    display: s.display || { scene: 'company', ts: 0 },
    players: s.players || {},
    rsvps: r.rsvps || {},
    assign: r.assign || null        // encrypted role assignments (host only)
  };
}
function deathsOf(S) { const d = Object.assign({}, S.deaths); if (S.kill && S.kill.victim) d[S.kill.victim] = S.kill.ts || 1; return d; }
/** What the projector should show: lockdown > newest alert > host-chosen scene. */
function projectorState(S) {
  if (S.flags.lockdown) return { kind: 'lockdown' };
  const a = S.alert, d = S.display || {};
  if (a && (a.ts || 0) >= (d.ts || 0)) return { kind: a.type === 'kill' ? 'incident' : 'notice', alert: a };
  return { kind: d.scene || 'company', d };
}
function releasedEvidence(S) { return Object.entries(S.evidence).filter(([, e]) => e && e.title).map(([id, e]) => Object.assign({ id }, e)).sort((a, b) => (b.ts || 0) - (a.ts || 0)); }

/* ---------- toasts & modal ---------- */
(function ensureUI() {
  if (!document.getElementById('toasts')) { const t = document.createElement('div'); t.id = 'toasts'; document.body.appendChild(t); }
  if (!document.getElementById('modal')) { const m = document.createElement('div'); m.id = 'modal'; document.body.appendChild(m); }
  document.getElementById('modal').addEventListener('click', e => { if (e.target.id === 'modal' || e.target.closest('[data-close]')) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();
function toast(title, msg, kind = '', onClick) {
  const t = document.createElement('div');
  t.className = 'toast ' + kind;
  t.innerHTML = `<b>${esc(title)}</b>${msg ? esc(msg) : ''}`;
  t.onclick = () => { if (onClick) onClick(); t.remove(); };
  document.getElementById('toasts').appendChild(t);
  setTimeout(() => t.remove(), 5200);
}
function openModal(html) {
  const m = document.getElementById('modal');
  m.innerHTML = `<div class="mcard" role="dialog" aria-modal="true"><button class="iconbtn mclose" data-close>CLOSE ✕</button>${html}</div>`;
  m.classList.add('open'); m.scrollTop = 0;
}
function closeModal() { const m = document.getElementById('modal'); m.classList.remove('open'); m.innerHTML = ''; }

const LOGO = s => `<svg width="${s}" height="${s}" viewBox="0 0 64 64" fill="none" aria-hidden="true"><defs><linearGradient id="lg${s}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f5dc93"/><stop offset="1" stop-color="#b8862e"/></linearGradient></defs><path d="M32 3 57 17.5v29L32 61 7 46.5v-29z" stroke="url(#lg${s})" stroke-width="2.5"/><path d="M32 12 49 22v20L32 52 15 42V22z" stroke="rgba(90,214,255,.55)" stroke-width="1"/><path d="M25 20v24M25 32l11-12M28.5 29 38 44" stroke="url(#lg${s})" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
