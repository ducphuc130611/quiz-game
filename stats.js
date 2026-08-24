const STATS_KEY = "quizGame_v102_stats";

const DEFAULT_STATS = {
  games: 0,
  totalQuestions: 0,
  totalCorrect: 0,
  totalScore: 0,
  bestScore: 0,
  bestAccuracy: 0,
  bestCombo: 0,
  bestSpeedBonus: 0
};

function getLifetimeStats() {
  try {
    return { ...DEFAULT_STATS, ...JSON.parse(localStorage.getItem(STATS_KEY) || "{}") };
  } catch (e) {
    return { ...DEFAULT_STATS };
  }
}

function saveLifetimeStats(stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function recordLifetimeStats() {
  const s = getLifetimeStats();
  const accuracy = QUESTIONS_PER_GAME > 0
    ? Math.round((state.correct / QUESTIONS_PER_GAME) * 100)
    : 0;

  s.games++;
  s.totalQuestions += QUESTIONS_PER_GAME;
  s.totalCorrect += state.correct;
  s.totalScore += state.score;
  s.bestScore = Math.max(s.bestScore, state.score);
  s.bestAccuracy = Math.max(s.bestAccuracy, accuracy);
  s.bestCombo = Math.max(s.bestCombo, state.bestCombo);
  s.bestSpeedBonus = Math.max(s.bestSpeedBonus, state.speedBonus);
  saveLifetimeStats(s);
  renderLifetimeStats();
}

function renderLifetimeStats() {
  const s = getLifetimeStats();
  const totalAccuracy = s.totalQuestions
    ? Math.round((s.totalCorrect / s.totalQuestions) * 100)
    : 0;

  const map = {
    statsGames: s.games,
    statsQuestions: s.totalQuestions,
    statsCorrect: s.totalCorrect,
    statsAccuracy: `${totalAccuracy}%`,
    statsTotalScore: s.totalScore,
    statsBestScore: s.bestScore,
    statsBestAccuracy: `${s.bestAccuracy}%`,
    statsBestCombo: s.bestCombo,
    statsBestSpeed: s.bestSpeedBonus
  };

  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

function injectStatsStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .lifetime-stats{margin-top:22px;padding:18px;border:1px solid rgba(255,255,255,.09);border-radius:18px;background:rgba(110,168,255,.05)}
    .lifetime-stats h3{margin:0 0 12px;font-size:.9rem;letter-spacing:1px}
    .lifetime-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}
    .lifetime-stat{padding:12px 8px;text-align:center;border-radius:12px;background:#0b192b;border:1px solid rgba(255,255,255,.07)}
    .lifetime-stat strong{display:block;font-size:1.15rem}
    .lifetime-stat span{display:block;margin-top:4px;color:#9eacc0;font-size:.62rem;letter-spacing:.5px}
    @media(max-width:620px){.lifetime-grid{grid-template-columns:1fr 1fr}}
  `;
  document.head.appendChild(style);
}

function injectStatsPanel() {
  const profileCard = document.querySelector(".profile-card");
  if (!profileCard || document.getElementById("lifetimeStats")) return;

  const panel = document.createElement("div");
  panel.id = "lifetimeStats";
  panel.className = "lifetime-stats";
  panel.innerHTML = `
    <h3>📊 THỐNG KÊ TRỌN ĐỜI</h3>
    <div class="lifetime-grid">
      <div class="lifetime-stat"><strong id="statsGames">0</strong><span>VÁN CHƠI</span></div>
      <div class="lifetime-stat"><strong id="statsQuestions">0</strong><span>CÂU ĐÃ TRẢ LỜI</span></div>
      <div class="lifetime-stat"><strong id="statsCorrect">0</strong><span>CÂU ĐÚNG</span></div>
      <div class="lifetime-stat"><strong id="statsAccuracy">0%</strong><span>CHÍNH XÁC</span></div>
      <div class="lifetime-stat"><strong id="statsTotalScore">0</strong><span>TỔNG ĐIỂM</span></div>
      <div class="lifetime-stat"><strong id="statsBestScore">0</strong><span>ĐIỂM CAO NHẤT</span></div>
      <div class="lifetime-stat"><strong id="statsBestAccuracy">0%</strong><span>BEST ACCURACY</span></div>
      <div class="lifetime-stat"><strong id="statsBestCombo">0</strong><span>BEST COMBO</span></div>
      <div class="lifetime-stat"><strong id="statsBestSpeed">0</strong><span>BEST SPEED BONUS</span></div>
    </div>`;
  profileCard.insertBefore(panel, profileCard.querySelector(".profile-section"));
}

const originalFinishGame = window.finishGame;
if (typeof originalFinishGame === "function") {
  window.finishGame = function () {
    originalFinishGame();
    recordLifetimeStats();
  };
}

document.addEventListener("DOMContentLoaded", () => {
  injectStatsStyles();
  injectStatsPanel();
  renderLifetimeStats();
});
