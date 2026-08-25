/* ============================================================
   QUIZ GAME v6.1.0 — ARENA SEASONS
   Seasonal competitive layer for the v6 Arena system.
   Tracks wins, rating, points, seasonal level, rewards and history.
   Works offline and observes the v6 Arena local save automatically.
   ============================================================ */
(() => {
  "use strict";

  const KEY = "quizGame_v610_seasons";
  const ARENA_KEY = "quizGame_v600_arena";
  const DAY = () => new Date().toISOString().slice(0, 10);
  const SEASON_MS = 28 * 24 * 60 * 60 * 1000;

  const SEASONS = [
    { id: "S1", name: "RISING STARS", theme: "The first Arena season", start: "2026-08-01" },
    { id: "S2", name: "WORLD OF QUIZ", theme: "Global knowledge battle", start: "2026-08-29" },
    { id: "S3", name: "MASTER MINDS", theme: "Only the sharpest survive", start: "2026-09-26" },
    { id: "S4", name: "CHAMPIONS", theme: "The road to v7", start: "2026-10-24" }
  ];

  const REWARDS = [
    [2, "🪙", "+100 Coins"],
    [4, "🎟️", "+250 Battle Pass XP"],
    [6, "🏆", "Season Trophy"],
    [8, "💎", "+500 Coins"],
    [10, "👑", "Season Champion Badge"]
  ];

  const defaults = () => ({
    version: 1,
    seasonId: currentSeason().id,
    points: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    matches: 0,
    bestRating: 1000,
    level: 1,
    claimed: [],
    history: [],
    lastSeenDay: DAY()
  });

  function currentSeason() {
    const now = Date.now();
    let active = SEASONS[0];
    for (const season of SEASONS) {
      const t = Date.parse(season.start + "T00:00:00Z");
      if (!Number.isNaN(t) && t <= now) active = season;
    }
    return active;
  }

  function seasonEnds(season) {
    const next = SEASONS.find(s => Date.parse(s.start + "T00:00:00Z") > Date.parse(season.start + "T00:00:00Z"));
    return next ? Date.parse(next.start + "T00:00:00Z") : Date.parse(season.start + "T00:00:00Z") + SEASON_MS;
  }

  function load() {
    try { return { ...defaults(), ...JSON.parse(localStorage.getItem(KEY) || "{}") }; }
    catch { return defaults(); }
  }

  let data = load();
  const active = currentSeason();
  if (data.seasonId !== active.id) {
    data = { ...defaults(), seasonId: active.id };
    save();
  }

  function save() { localStorage.setItem(KEY, JSON.stringify(data)); }
  function levelFor(points) { return Math.max(1, Math.min(50, Math.floor(points / 250) + 1)); }
  function toast(message) {
    let e = document.getElementById("v61Toast");
    if (!e) { e = document.createElement("div"); e.id = "v61Toast"; document.body.appendChild(e); }
    e.textContent = message; e.classList.add("show");
    clearTimeout(e._timer); e._timer = setTimeout(() => e.classList.remove("show"), 2600);
  }

  function recordMatch(match) {
    if (!match || !match.result || !match.bot) return;
    const signature = [match.date, match.bot, match.score, match.botScore, match.result].join("|");
    if (data.history.some(x => x.signature === signature)) return;

    data.matches++;
    if (match.result === "WIN") { data.wins++; data.points += 100; }
    else if (match.result === "DRAW") { data.draws++; data.points += 35; }
    else { data.losses++; data.points += 15; }
    data.bestRating = Math.max(data.bestRating, Number(match.rating) || 0);
    data.history.unshift({ ...match, signature, season: data.seasonId });
    data.history = data.history.slice(0, 50);

    const oldLevel = data.level;
    data.level = levelFor(data.points);
    save();
    if (data.level > oldLevel) toast(`🌟 SEASON LEVEL ${data.level}!`);
    renderSeasonBadge();
  }

  function scanArena() {
    try {
      const arena = JSON.parse(localStorage.getItem(ARENA_KEY) || "{}");
      const history = Array.isArray(arena.history) ? arena.history : [];
      history.forEach(recordMatch);
    } catch {}
  }

  function claim(level) {
    const reward = REWARDS.find(x => x[0] === level);
    if (!reward || data.level < level || data.claimed.includes(level)) return;
    data.claimed.push(level);
    save();
    toast(`${reward[1]} SEASON REWARD: ${reward[2]}`);
    render("rewards");
  }

  function build() {
    if (document.getElementById("v61Btn")) return;
    const home = document.querySelector("#homeScreen .home-actions") || document.querySelector("#homeScreen");
    if (!home) return;
    const button = document.createElement("button");
    button.id = "v61Btn"; button.className = "shop-open-btn v61-season-btn"; button.textContent = "🏟️ ARENA SEASONS";
    home.appendChild(button);

    const overlay = document.createElement("div");
    overlay.id = "v61Overlay";
    overlay.innerHTML = `<div class="v61-panel"><header><div><div class="v61-kicker">MAJOR CONTENT • v6.1.0</div><h2>🏟️ ARENA SEASONS</h2></div><button id="v61Close">✕</button></header><div class="v61-season-hero"><span id="v61SeasonName"></span><strong id="v61SeasonLevel"></strong><small id="v61SeasonTimer"></small></div><nav><button data-tab="overview">OVERVIEW</button><button data-tab="rewards">REWARDS</button><button data-tab="history">SEASON HISTORY</button></nav><main id="v61Content"></main></div>`;
    document.body.appendChild(overlay);
    button.onclick = () => { scanArena(); render("overview"); overlay.classList.add("open"); };
    overlay.querySelector("#v61Close").onclick = () => overlay.classList.remove("open");
    overlay.addEventListener("click", e => { if (e.target === overlay) overlay.classList.remove("open"); });
    overlay.querySelectorAll("nav button").forEach(b => b.onclick = () => render(b.dataset.tab));
    renderSeasonBadge();
  }

  function renderSeasonBadge() {
    const name = document.getElementById("v61SeasonName");
    if (!name) return;
    const season = currentSeason();
    const level = document.getElementById("v61SeasonLevel");
    const timer = document.getElementById("v61SeasonTimer");
    name.textContent = `${season.id} • ${season.name}`;
    level.textContent = `LEVEL ${data.level} • ${data.points} POINTS`;
    const left = Math.max(0, seasonEnds(season) - Date.now());
    timer.textContent = `${Math.ceil(left / 86400000)} DAYS REMAINING • ${season.theme}`;
  }

  function render(tab) {
    scanArena();
    const e = document.getElementById("v61Content"); if (!e) return;
    renderSeasonBadge();
    if (tab === "overview") {
      const next = data.level >= 50 ? 0 : data.level * 250 - data.points;
      e.innerHTML = `<div class="v61-stats"><div><b>${data.points}</b><span>SEASON POINTS</span></div><div><b>${data.wins}</b><span>WINS</span></div><div><b>${data.losses}</b><span>LOSSES</span></div><div><b>${data.bestRating}</b><span>BEST RATING</span></div></div><div class="v61-progress"><div><span>SEASON LEVEL ${data.level}/50</span><span>${next ? next + " pts to next level" : "MAX LEVEL"}</span></div><i style="width:${Math.min(100, ((data.points % 250) / 250) * 100)}%"></i></div><h3>🔥 SEASON OBJECTIVES</h3><ul class="v61-objectives"><li class="${data.matches >= 5 ? "done" : ""}">Play 5 Arena matches</li><li class="${data.wins >= 3 ? "done" : ""}">Win 3 Arena matches</li><li class="${data.bestRating >= 1200 ? "done" : ""}">Reach 1200 rating</li><li class="${data.level >= 10 ? "done" : ""}">Reach Season Level 10</li></ul>`;
    } else if (tab === "rewards") {
      e.innerHTML = `<h3>🎁 SEASON REWARDS</h3><div class="v61-rewards">${REWARDS.map(r => `<div class="v61-reward ${data.level >= r[0] ? "unlocked" : "locked"}"><b>${r[1]}</b><span>LEVEL ${r[0]}<small>${r[2]}</small></span><button data-level="${r[0]}" ${data.level < r[0] || data.claimed.includes(r[0]) ? "disabled" : ""}>${data.claimed.includes(r[0]) ? "CLAIMED" : data.level >= r[0] ? "CLAIM" : "LOCKED"}</button></div>`).join("")}</div>`;
      e.querySelectorAll("[data-level]").forEach(b => b.onclick = () => claim(Number(b.dataset.level)));
    } else {
      const rows = data.history.filter(x => x.season === data.seasonId);
      e.innerHTML = `<h3>📜 ${data.seasonId} MATCH HISTORY</h3><div class="v61-history">${rows.length ? rows.map(x => `<div><strong>${x.result === "WIN" ? "🏆" : x.result === "DRAW" ? "🤝" : "💥"} ${x.result}</strong><span>${x.bot} • ${x.score}-${x.botScore}</span><b>+${x.result === "WIN" ? 100 : x.result === "DRAW" ? 35 : 15}</b></div>`).join("") : "<p>No seasonal matches yet.</p>"}</div>`;
    }
  }

  const originalSetItem = localStorage.setItem.bind(localStorage);
  localStorage.setItem = function(key, value) {
    originalSetItem(key, value);
    if (key === ARENA_KEY) setTimeout(() => scanArena(), 0);
  };

  const style = document.createElement("style");
  style.textContent = `#v61Overlay{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.84);display:none;align-items:center;justify-content:center;padding:18px}#v61Overlay.open{display:flex}.v61-panel{width:min(920px,96vw);max-height:92vh;overflow:auto;background:#10131c;border:1px solid #4a536c;border-radius:22px;padding:22px;color:#f5f7ff;box-shadow:0 30px 100px #000}.v61-panel header{display:flex;justify-content:space-between;align-items:center}.v61-panel header button{background:none;border:0;color:#fff;font-size:24px;cursor:pointer}.v61-kicker{font-size:11px;letter-spacing:2px;opacity:.65}.v61-season-hero{margin:18px 0;padding:25px;text-align:center;border-radius:18px;background:linear-gradient(135deg,#20263a,#3a294b)}.v61-season-hero span,.v61-season-hero small{display:block;opacity:.75}.v61-season-hero strong{display:block;font-size:32px;margin:7px}.v61-panel nav{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}.v61-panel nav button,.v61-reward button{border:1px solid #424b64;background:#181d29;color:#fff;border-radius:10px;padding:10px 13px;cursor:pointer}.v61-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.v61-stats div{padding:16px;background:#181d29;border-radius:14px;text-align:center}.v61-stats b,.v61-stats span{display:block}.v61-stats span{font-size:10px;opacity:.65;margin-top:5px}.v61-progress{margin:18px 0;padding:16px;background:#181d29;border-radius:14px}.v61-progress>div{display:flex;justify-content:space-between;font-size:12px;margin-bottom:10px}.v61-progress i{display:block;height:10px;border-radius:8px;background:#8291b5}.v61-objectives{padding:0;list-style:none;display:grid;gap:8px}.v61-objectives li{padding:13px;background:#181d29;border-radius:10px}.v61-objectives li.done{text-decoration:line-through;opacity:.55}.v61-rewards{display:grid;gap:10px}.v61-reward{display:flex;align-items:center;gap:14px;padding:14px;background:#181d29;border-radius:13px}.v61-reward>b{font-size:28px}.v61-reward span{flex:1}.v61-reward small{display:block;opacity:.65;margin-top:3px}.v61-reward.locked{opacity:.55}.v61-history{display:grid;gap:8px}.v61-history div{display:grid;grid-template-columns:1fr 1fr auto;gap:10px;padding:13px;background:#181d29;border-radius:10px}.v61-history b{font-weight:700}.v61Toast,#v61Toast{position:fixed;left:50%;bottom:28px;transform:translate(-50%,20px);opacity:0;z-index:11000;background:#202638;color:#fff;border:1px solid #56627f;padding:12px 18px;border-radius:12px;transition:.2s}#v61Toast.show{opacity:1;transform:translate(-50%,0)}@media(max-width:700px){.v61-stats{grid-template-columns:repeat(2,1fr)}.v61-history div{grid-template-columns:1fr}.v61-reward{align-items:flex-start;flex-wrap:wrap}}`;
  document.head.appendChild(style);

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
