(() => {
  "use strict";
  const DATA_KEY = "quizGame_v500_online";
  const CONFIG_KEY = "quizGame_v500_config";
  const OWNER_ID = "97a6d561-9c6e-45fd-959e-6ccb00674187";

  function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; }
  }
  function state() {
    return { data: read(DATA_KEY, {}), config: read(CONFIG_KEY, {}) };
  }
  async function api(path, options = {}) {
    const { data, config } = state();
    if (!config.apiBase) throw new Error("No online backend configured");
    if (!data.token) throw new Error("Login required");
    const response = await fetch(config.apiBase.replace(/\/$/, "") + path, {
      ...options,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.token}`, ...(options.headers || {}) }
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || `HTTP ${response.status}`);
    return body;
  }

  function style() {
    if (document.getElementById("ownerPanelStyle")) return;
    const css = document.createElement("style");
    css.id = "ownerPanelStyle";
    css.textContent = `#ownerPanelOverlay{position:fixed;inset:0;z-index:12000;background:rgba(0,0,0,.82);display:none;align-items:center;justify-content:center;padding:20px}#ownerPanelOverlay.open{display:flex}.owner-panel{width:min(980px,100%);max-height:92vh;overflow:auto;background:#08121f;color:#eef6ff;border:1px solid #7f5cff;border-radius:22px;padding:24px;box-shadow:0 30px 100px rgba(0,0,0,.65)}.owner-head{display:flex;justify-content:space-between;align-items:center}.owner-head button{background:transparent;border:0;color:#fff;font-size:25px;cursor:pointer}.owner-badge{display:inline-block;padding:6px 10px;border-radius:999px;background:#5c3fc7;font-size:11px;font-weight:800}.owner-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin:18px 0}.owner-card{background:#0e2035;border:1px solid #284665;border-radius:16px;padding:16px}.owner-card strong{display:block;font-size:25px;margin-top:6px}.owner-card span{font-size:12px;opacity:.7}.owner-actions{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.owner-actions input{min-width:230px;flex:1;padding:11px;border-radius:10px;border:1px solid #31516f;background:#07111f;color:#fff}.owner-actions button{padding:11px 14px;border-radius:10px;border:1px solid #536c87;background:#142a42;color:#fff;cursor:pointer}.owner-actions .danger{border-color:#9a4141}.owner-notice{padding:12px;border-radius:12px;background:#111e30;font-size:13px;line-height:1.5}.owner-error{color:#ff9f9f;min-height:20px;margin-top:10px}.owner-table{width:100%;border-collapse:collapse;margin-top:12px;font-size:12px}.owner-table th,.owner-table td{text-align:left;padding:8px;border-bottom:1px solid #233b52}`;
    document.head.appendChild(css);
  }

  function build() {
    if (document.getElementById("ownerPanelBtn")) return;
    style();
    const actions = document.querySelector("#homeScreen .home-actions");
    if (!actions) return;
    const button = document.createElement("button");
    button.id = "ownerPanelBtn";
    button.className = "shop-open-btn";
    button.textContent = "👑 OWNER";
    button.style.display = "none";
    actions.appendChild(button);

    const overlay = document.createElement("div");
    overlay.id = "ownerPanelOverlay";
    overlay.innerHTML = `<div class="owner-panel"><div class="owner-head"><div><span class="owner-badge">OWNER ONLY</span><h2>👑 OWNER CONTROL CENTER</h2><p>Server-authorized controls for the single registered Owner account.</p></div><button id="ownerClose">✕</button></div><div class="owner-notice">🔒 Owner access is verified by the backend. The client-side button is only a launcher and does not grant permissions.</div><div id="ownerError" class="owner-error"></div><div class="owner-grid" id="ownerStats"></div><h3>📢 GLOBAL ANNOUNCEMENT</h3><div class="owner-actions"><input id="ownerAnnouncement" maxlength="240" placeholder="Announcement to all players"><button id="ownerAnnounce">SEND</button></div><h3>🎁 PLAYER REWARD</h3><div class="owner-actions"><input id="ownerPlayerId" placeholder="Player ID"><input id="ownerXP" type="number" min="0" placeholder="XP"><input id="ownerCoins" type="number" min="0" placeholder="Coins"><button id="ownerReward">GIVE</button></div><h3>👥 PLAYERS</h3><div id="ownerPlayers"></div></div>`;
    document.body.appendChild(overlay);

    async function refresh() {
      const error = document.getElementById("ownerError");
      error.textContent = "";
      try {
        const dashboard = await api("/api/owner/dashboard");
        const players = await api("/api/owner/players");
        document.getElementById("ownerStats").innerHTML = Object.entries(dashboard.statistics).map(([key, value]) => `<div class="owner-card"><span>${key.toUpperCase()}</span><strong>${value}</strong></div>`).join("");
        document.getElementById("ownerPlayers").innerHTML = `<table class="owner-table"><thead><tr><th>Username</th><th>Player ID</th><th>XP</th><th>Coins</th><th>Games</th></tr></thead><tbody>${players.players.map(p => `<tr><td>${escapeHtml(p.username)}</td><td>${escapeHtml(p.playerId)}</td><td>${p.xp}</td><td>${p.coins}</td><td>${p.games}</td></tr>`).join("")}</tbody></table>`;
      } catch (errorValue) {
        error.textContent = errorValue.message || "Owner request failed";
      }
    }

    document.getElementById("ownerClose").onclick = () => overlay.classList.remove("open");
    button.onclick = async () => { overlay.classList.add("open"); await refresh(); };
    document.getElementById("ownerAnnounce").onclick = async () => {
      const message = document.getElementById("ownerAnnouncement").value.trim();
      if (!message) return;
      try { await api("/api/owner/announce", { method: "POST", body: JSON.stringify({ message }) }); document.getElementById("ownerAnnouncement").value = ""; await refresh(); }
      catch (error) { document.getElementById("ownerError").textContent = error.message; }
    };
    document.getElementById("ownerReward").onclick = async () => {
      const playerId = document.getElementById("ownerPlayerId").value.trim();
      const xp = Number(document.getElementById("ownerXP").value) || 0;
      const coins = Number(document.getElementById("ownerCoins").value) || 0;
      try { await api(`/api/owner/players/${encodeURIComponent(playerId)}/reward`, { method: "POST", body: JSON.stringify({ xp, coins }) }); await refresh(); }
      catch (error) { document.getElementById("ownerError").textContent = error.message; }
    };

    function updateVisibility() {
      const { data } = state();
      button.style.display = data.playerId === OWNER_ID && data.token ? "inline-block" : "none";
    }
    function escapeHtml(value) { return String(value).replace(/[&<>"']/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[character])); }
    setInterval(updateVisibility, 1000);
    updateVisibility();
  }

  const boot = setInterval(() => {
    if (document.readyState !== "loading") { clearInterval(boot); build(); }
  }, 100);
})();
