const LEADERBOARD_KEY = "quizGame_v007_leaderboard";
const LEADERBOARD_LIMIT = 10;

function getLeaderboard() {
  try {
    const data = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

function saveLeaderboard(entries) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries.slice(0, LEADERBOARD_LIMIT)));
}

function addLeaderboardScore(name, score, category, correct, accuracy) {
  const entries = getLeaderboard();
  entries.push({
    name: (name || "Player").slice(0, 16),
    score: Math.max(0, Number(score) || 0),
    category: category || "all",
    correct: Number(correct) || 0,
    accuracy: Number(accuracy) || 0,
    date: new Date().toLocaleDateString("vi-VN")
  });
  entries.sort((a, b) => b.score - a.score || b.accuracy - a.accuracy);
  saveLeaderboard(entries);
  return entries;
}

function renderLeaderboard() {
  const list = document.getElementById("leaderboardList");
  const count = document.getElementById("leaderboardCount");
  if (!list) return;

  const entries = getLeaderboard();
  if (count) count.textContent = `${entries.length}/${LEADERBOARD_LIMIT}`;

  if (!entries.length) {
    list.innerHTML = `<div class="leaderboard-empty">🏆 Chưa có kỷ lục nào.<br>Hãy chơi một ván để ghi tên!</div>`;
    return;
  }

  const medals = ["🥇", "🥈", "🥉"];
  list.innerHTML = entries.map((entry, index) => `
    <div class="leaderboard-row">
      <strong class="leaderboard-rank">${medals[index] || `#${index + 1}`}</strong>
      <div class="leaderboard-player"><strong>${escapeLeaderboardHTML(entry.name)}</strong><small>${entry.date} • ${entry.correct}/10 đúng</small></div>
      <strong class="leaderboard-score">${entry.score}</strong>
    </div>
  `).join("");
}

function escapeLeaderboardHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
