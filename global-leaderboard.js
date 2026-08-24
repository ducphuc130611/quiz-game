/* ============================================================
   QUIZ GAME v5.5.0 — GLOBAL LEADERBOARD UI
   Public global ranking, seasons and authenticated player rank.
   ============================================================ */
(() => {
  "use strict";
  const CONFIG_KEY = "quizGame_v500_config";
  const ONLINE_KEY = "quizGame_v500_online";
  const getConfig = () => { try { return { apiBase: "", ...JSON.parse(localStorage.getItem(CONFIG_KEY) || "{}") }; } catch { return { apiBase: "" }; } };
  const getOnline = () => { try { return JSON.parse(localStorage.getItem(ONLINE_KEY) || "{}"); } catch { return {}; } };

  async function request(path) {
    const config = getConfig();
    if (!config.apiBase) throw new Error("No online backend configured");
    const headers = {};
    const online = getOnline();
    if (online.token) headers.Authorization = "Bearer " + online.token;
    const response = await fetch(config.apiBase.replace(/\/$/, "") + path, { headers });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || `HTTP ${response.status}`);
    return body;
  }

  function installStyle() {
    if (document.getElementById("globalLeaderboardStyle")) return;
    const style = document.createElement("style");
    style.id = "globalLeaderboardStyle";
    style.textContent = `#globalLeaderboardOverlay{position:fixed;inset:0;background:rgba(0,0,0,.76);display:none;align-items:center;justify-content:center;z-index:10001;padding:20px}.gl-panel{width:min(820px,100%);max-height:90vh;overflow:auto;background:#091522;color:#edf7ff;border:1px solid #34556f;border-radius:22px;padding:24px;box-shadow:0 25px 90px rgba(0,0,0,.55)}.gl-head{display:flex;justify-content:space-between;align-items:flex-start;gap:15px}.gl-close{border:0;background:transparent;color:#fff;font-size:25px;cursor:pointer}.gl-controls{display:flex;gap:10px;flex-wrap:wrap;margin:16px 0}.gl-controls select{padding:10px;border-radius:10px;background:#07111d;color:#fff;border:1px solid #34556f}.gl-table{width:100%;border-collapse:collapse}.gl-table th,.gl-table td{padding:10px 8px;border-bottom:1px solid #20384c;text-align:left;font-size:13px}.gl-table th{opacity:.7;font-size:11px;text-transform:uppercase}.gl-rank{font-weight:800}.gl-me{background:rgba(85,214,138,.1)}.gl-empty{padding:30px;text-align:center;opacity:.7}.gl-pages{display:flex;justify-content:center;gap:10px;margin-top:16px}.gl-pages button{padding:9px 14px;border-radius:9px;border:1px solid #34556f;background:#10263a;color:#fff;cursor:pointer}.gl-pages button:disabled{opacity:.35}.gl-summary{display:flex;gap:12px;flex-wrap:wrap;margin:12px 0}.gl-card{background:#10263a;border:1px solid #29465d;border-radius:12px;padding:10px 13px}.gl-card span{display:block;font-size:10px;opacity:.65}.gl-card strong{font-size:16px}`;
    document.head.appendChild(style);
  }

  function build() {
    if (document.getElementById("globalLeaderboardBtn")) return;
    const actions = document.querySelector("#homeScreen .home-actions");
    if (!actions) return;
    installStyle();
    const button = document.createElement("button");
    button.id = "globalLeaderboardBtn";
    button.className = "shop-open-btn";
    button.textContent = "🌍 GLOBAL LEADERBOARD";
    actions.appendChild(button);
    const overlay = document.createElement("div");
    overlay.id = "globalLeaderboardOverlay";
    overlay.innerHTML = `<div class="gl-panel"><div class="gl-head"><div><div class="version">ONLINE • v5.5.0</div><h2>🌍 GLOBAL LEADERBOARD</h2><p style="opacity:.7;font-size:13px">Public worldwide ranking powered by the online server.</p></div><button class="gl-close" id="glClose">✕</button></div><div class="gl-controls"><select id="glSeason"><option value="all">🌎 All-time</option></select><button class="primary-btn" id="glRefresh">🔄 REFRESH</button></div><div class="gl-summary"><div class="gl-card"><span>PLAYERS</span><strong id="glPlayers">—</strong></div><div class="gl-card"><span>YOUR RANK</span><strong id="glMyRank">—</strong></div></div><div id="glTable"></div><div class="gl-pages"><button id="glPrev">← PREVIOUS</button><button id="glNext">NEXT →</button></div></div>`;
    document.body.appendChild(overlay);
    let offset = 0;
    const limit = 25;
    const table = document.getElementById("glTable");
    const season = document.getElementById("glSeason");
    const players = document.getElementById("glPlayers");
    const myRank = document.getElementById("glMyRank");
    const prev = document.getElementById("glPrev");
    const next = document.getElementById("glNext");

    async function loadSeasons() {
      try {
        const data = await request("/leaderboard/seasons");
        season.innerHTML = data.seasons.map(value => `<option value="${String(value).replace(/"/g, "&quot;")}">${value === "all" ? "🌎 All-time" : "🏆 " + value}</option>`).join("");
      } catch {}
    }

    async function load() {
      table.innerHTML = `<div class="gl-empty">Loading global ranking…</div>`;
      try {
        const value = encodeURIComponent(season.value || "all");
        const data = await request(`/leaderboard/global?season=${value}&limit=${limit}&offset=${offset}`);
        players.textContent = data.totalPlayers;
        table.innerHTML = data.leaderboard.length ? `<table class="gl-table"><thead><tr><th>#</th><th>Player</th><th>Score</th><th>Best</th><th>Games</th><th>Accuracy</th></tr></thead><tbody>${data.leaderboard.map(row => `<tr><td class="gl-rank">${row.rank}</td><td>${escapeHtml(row.username)}</td><td>${row.score.toLocaleString()}</td><td>${row.bestScore.toLocaleString()}</td><td>${row.games}</td><td>${row.accuracy}%</td></tr>`).join("")}</tbody></table>` : `<div class="gl-empty">No ranked players yet.</div>`;
        prev.disabled = offset === 0;
        next.disabled = offset + limit >= data.totalPlayers;
        const online = getOnline();
        if (online.token) {
          try {
            const mine = await request(`/leaderboard/me?season=${value}`);
            myRank.textContent = mine.player ? `#${mine.player.rank}` : "—";
          } catch { myRank.textContent = "—"; }
        } else myRank.textContent = "Login";
      } catch (error) {
        table.innerHTML = `<div class="gl-empty">📡 ${escapeHtml(error.message || "Unable to load leaderboard")}</div>`;
        players.textContent = "—"; myRank.textContent = "—"; prev.disabled = true; next.disabled = true;
      }
    }

    function escapeHtml(value) { return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }
    button.onclick = async () => { offset = 0; overlay.style.display = "flex"; await loadSeasons(); await load(); };
    document.getElementById("glClose").onclick = () => { overlay.style.display = "none"; };
    document.getElementById("glRefresh").onclick = () => { offset = 0; load(); };
    season.onchange = () => { offset = 0; load(); };
    prev.onclick = () => { offset = Math.max(0, offset - limit); load(); };
    next.onclick = () => { offset += limit; load(); };
  }

  const boot = setInterval(() => {
    if (document.readyState !== "loading") { clearInterval(boot); build(); }
  }, 100);
})();
