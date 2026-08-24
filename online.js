/* ============================================================
   QUIZ GAME v5.0.0 — ONLINE FOUNDATION
   Account identity, cloud adapter, sync queue and online-ready UI.
   GitHub Pages remains fully playable without a backend.
   ============================================================ */
(() => {
  "use strict";

  const KEY = "quizGame_v500_online";
  const CONFIG_KEY = "quizGame_v500_config";
  const defaultData = () => ({
    version: 1,
    playerId: crypto?.randomUUID ? crypto.randomUUID() : "guest-" + Date.now().toString(36),
    username: "Player",
    createdAt: new Date().toISOString(),
    lastSync: null,
    pending: [],
    connected: false
  });

  let data;
  try { data = { ...defaultData(), ...JSON.parse(localStorage.getItem(KEY) || "{}") }; }
  catch { data = defaultData(); }
  if (!data.playerId) data.playerId = defaultData().playerId;

  const config = (() => {
    try { return { apiBase: "", ...JSON.parse(localStorage.getItem(CONFIG_KEY) || "{}") }; }
    catch { return { apiBase: "" }; }
  })();

  function save() { localStorage.setItem(KEY, JSON.stringify(data)); }
  function esc(v) { return String(v).replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }

  function identityFromProfile() {
    try {
      const p = JSON.parse(localStorage.getItem("quizGame_profile") || "{}");
      if (p.name && p.name !== "Player") data.username = String(p.name).slice(0, 16);
    } catch {}
  }

  async function request(path, options = {}) {
    if (!config.apiBase) throw new Error("No online backend configured");
    const res = await fetch(config.apiBase.replace(/\/$/, "") + path, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) }
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json().catch(() => ({}));
  }

  async function sync() {
    identityFromProfile();
    save();
    if (!config.apiBase) { data.connected = false; save(); render(); return false; }
    try {
      const result = await request("/players/sync", { method: "POST", body: JSON.stringify({
        playerId: data.playerId,
        username: data.username,
        pending: data.pending
      }) });
      data.pending = [];
      data.lastSync = new Date().toISOString();
      data.connected = true;
      if (result.username) data.username = result.username;
      save(); render();
      return true;
    } catch {
      data.connected = false;
      save(); render();
      return false;
    }
  }

  function queue(type, payload) {
    data.pending.push({ id: Date.now() + Math.random(), type, payload, at: new Date().toISOString() });
    data.pending = data.pending.slice(-100);
    save();
  }

  function build() {
    if (document.getElementById("onlineBtn")) return;
    const actions = document.querySelector("#homeScreen .home-actions");
    if (!actions) return;
    const button = document.createElement("button");
    button.id = "onlineBtn";
    button.className = "shop-open-btn online-btn";
    button.textContent = "🌐 ONLINE";
    actions.appendChild(button);

    const overlay = document.createElement("div");
    overlay.id = "onlineOverlay";
    overlay.innerHTML = `<div class="online-panel">
      <header><div><div class="version">ONLINE • v5.0.0</div><h2>🌐 ONLINE HUB</h2></div><button id="onlineClose">✕</button></header>
      <div class="online-status" id="onlineStatus"></div>
      <div class="online-id"><span>PLAYER ID</span><code id="onlinePlayerId"></code><button id="copyPlayerId">COPY</button></div>
      <div class="online-form"><label>USERNAME<input id="onlineUsername" maxlength="16"></label><button id="saveOnlineProfile" class="primary-btn">💾 SAVE IDENTITY</button></div>
      <div class="online-actions"><button id="syncOnline" class="primary-btn">☁️ SYNC NOW</button><button id="exportOnline" class="secondary-btn">📦 EXPORT ONLINE PROFILE</button></div>
      <div class="online-notice"><strong>ONLINE FOUNDATION</strong><p>Cloud synchronization is optional. The game remains fully playable offline. Configure an API endpoint later to enable shared accounts, global leaderboards and multiplayer services.</p></div>
      <div class="online-queue"><span>PENDING SYNC</span><strong id="onlinePending">0</strong></div>
    </div>`;
    document.body.appendChild(overlay);

    button.onclick = () => { identityFromProfile(); render(); overlay.classList.add("open"); };
    document.getElementById("onlineClose").onclick = () => overlay.classList.remove("open");
    document.getElementById("syncOnline").onclick = async () => {
      const ok = await sync();
      toast(ok ? "☁️ Cloud sync complete" : "📡 Offline mode — sync queued");
    };
    document.getElementById("saveOnlineProfile").onclick = () => {
      const name = document.getElementById("onlineUsername").value.trim();
      if (name) data.username = name.slice(0, 16);
      queue("identity", { username: data.username }); save(); render(); toast("👤 Online identity saved");
    };
    document.getElementById("copyPlayerId").onclick = async () => { try { await navigator.clipboard.writeText(data.playerId); toast("📋 Player ID copied"); } catch {} };
    document.getElementById("exportOnline").onclick = () => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "quiz-game-online-profile.json"; a.click(); URL.revokeObjectURL(a.href);
    };
    render();
  }

  function render() {
    const id = document.getElementById("onlinePlayerId");
    if (!id) return;
    identityFromProfile();
    id.textContent = data.playerId;
    document.getElementById("onlineUsername").value = data.username;
    document.getElementById("onlinePending").textContent = data.pending.length;
    document.getElementById("onlineStatus").innerHTML = data.connected ? "🟢 CONNECTED" : (config.apiBase ? "🟠 OFFLINE / RETRY AVAILABLE" : "⚪ OFFLINE-FIRST MODE");
  }

  function toast(message) {
    let e = document.getElementById("onlineToast");
    if (!e) { e = document.createElement("div"); e.id = "onlineToast"; document.body.appendChild(e); }
    e.textContent = message; e.classList.add("show"); clearTimeout(e._t); e._t = setTimeout(() => e.classList.remove("show"), 2600);
  }

  window.QuizOnline = {
    get data() { return data; },
    sync,
    queue,
    configure(apiBase) { config.apiBase = String(apiBase || "").trim(); localStorage.setItem(CONFIG_KEY, JSON.stringify(config)); render(); },
    isConfigured: () => Boolean(config.apiBase)
  };

  identityFromProfile(); save();
  const boot = setInterval(() => { if (document.readyState !== "loading") { clearInterval(boot); build(); } }, 100);
})();
