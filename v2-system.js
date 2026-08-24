const V2_SAVE_KEY = "quizGame_v200_save";
const V2_SAVE_VERSION = 2;

const GAME_MODES = {
  classic: { name: "Classic", icon: "🎯", description: "10 câu • 15 giây/câu", questions: 10, time: 15, scoreMultiplier: 1, lives: 0 },
  hard: { name: "Hard Mode", icon: "💀", description: "10 câu • 12 giây/câu • điểm x1.5", questions: 10, time: 12, scoreMultiplier: 1.5, lives: 0 },
  survival: { name: "Survival", icon: "🛡️", description: "Sai 1 câu = kết thúc ván", questions: 20, time: 10, scoreMultiplier: 1.25, lives: 1 },
  combo: { name: "Combo Rush", icon: "🔥", description: "12 câu • combo là trọng tâm", questions: 12, time: 10, scoreMultiplier: 1.1, lives: 0 },
  timeattack: { name: "Time Attack", icon: "⏱️", description: "60 giây • trả lời càng nhiều càng tốt", questions: 30, time: 0, totalTime: 60, scoreMultiplier: 1, lives: 0 },
  daily: { name: "Daily Challenge", icon: "📅", description: "Thử thách đặc biệt mỗi ngày", questions: 10, time: 15, scoreMultiplier: 1.25, lives: 0, daily: true }
};

const DEFAULT_V2_SAVE = {
  version: V2_SAVE_VERSION,
  powerups: { fifty: 2, freeze: 1, double: 1, shield: 1, reroll: 2 },
  theme: "dark",
  modeStats: {},
  daily: { date: "", completed: false, claimed: false, streak: 0 },
  quests: { date: "", progress: { games: 0, correct: 0, combo: 0, score: 0 }, claimed: false }
};

function loadV2Save() {
  try {
    const raw = JSON.parse(localStorage.getItem(V2_SAVE_KEY) || "null");
    const merged = { ...DEFAULT_V2_SAVE, ...(raw || {}) };
    merged.powerups = { ...DEFAULT_V2_SAVE.powerups, ...(raw && raw.powerups || {}) };
    merged.daily = { ...DEFAULT_V2_SAVE.daily, ...(raw && raw.daily || {}) };
    merged.quests = { ...DEFAULT_V2_SAVE.quests, ...(raw && raw.quests || {}) };
    merged.quests.progress = { ...DEFAULT_V2_SAVE.quests.progress, ...(raw && raw.quests && raw.quests.progress || {}) };
    return merged;
  } catch (e) { return JSON.parse(JSON.stringify(DEFAULT_V2_SAVE)); }
}

function saveV2Save(data) {
  data.version = V2_SAVE_VERSION;
  localStorage.setItem(V2_SAVE_KEY, JSON.stringify(data));
}

function getV2Save() { return loadV2Save(); }
function updateV2Save(mutator) { const data = loadV2Save(); mutator(data); saveV2Save(data); return data; }
function getGameModeConfig(mode) { return GAME_MODES[mode] || GAME_MODES.classic; }
function getTodayKey() { return new Date().toISOString().slice(0, 10); }

function ensureDailyData() {
  const today = getTodayKey();
  const data = loadV2Save();
  if (data.daily.date !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    data.daily = { date: today, completed: false, claimed: false, streak: data.daily.date === yesterday ? data.daily.streak : 0 };
    data.quests = { date: today, progress: { games: 0, correct: 0, combo: 0, score: 0 }, claimed: false };
    saveV2Save(data);
  }
  return data;
}

function getDailyQuest() {
  ensureDailyData();
  const data = loadV2Save();
  return {
    targets: { games: 2, correct: 15, combo: 5, score: 1000 },
    progress: data.quests.progress,
    claimed: data.quests.claimed,
    date: data.quests.date
  };
}

function recordV2Game(result) {
  const data = ensureDailyData();
  const mode = result.mode || "classic";
  data.modeStats[mode] = data.modeStats[mode] || { games: 0, score: 0, bestScore: 0, correct: 0 };
  const stats = data.modeStats[mode];
  stats.games++;
  stats.score += Number(result.score || 0);
  stats.bestScore = Math.max(stats.bestScore, Number(result.score || 0));
  stats.correct += Number(result.correct || 0);
  data.quests.progress.games += 1;
  data.quests.progress.correct += Number(result.correct || 0);
  data.quests.progress.combo = Math.max(data.quests.progress.combo, Number(result.bestCombo || 0));
  data.quests.progress.score += Number(result.score || 0);
  if (result.mode === "daily") data.daily.completed = true;
  saveV2Save(data);
}

function useV2Powerup(type) {
  const data = loadV2Save();
  if (!data.powerups[type] || data.powerups[type] <= 0) return false;
  data.powerups[type]--;
  saveV2Save(data);
  return true;
}

function grantV2Powerup(type, amount = 1) {
  updateV2Save(data => { data.powerups[type] = (data.powerups[type] || 0) + amount; });
}

function getPowerupCounts() { return loadV2Save().powerups; }

function claimDailyQuest() {
  const data = ensureDailyData();
  const p = data.quests.progress;
  const complete = p.games >= 2 && p.correct >= 15 && p.combo >= 5 && p.score >= 1000;
  if (!complete || data.quests.claimed) return false;
  data.quests.claimed = true;
  data.daily.streak++;
  data.powerups.double++;
  data.powerups.freeze++;
  saveV2Save(data);
  if (typeof grantXP === "function") grantXP(100);
  if (typeof getCoins === "function" && typeof setCoins === "function") setCoins(getCoins() + 100);
  return true;
}

function getTheme() { return loadV2Save().theme || "dark"; }
function setTheme(theme) { if (["dark", "light", "ocean", "forest", "inferno", "royal", "neon"].includes(theme)) updateV2Save(d => d.theme = theme); }
function applyV2Theme() { document.documentElement.dataset.theme = getTheme(); }

document.addEventListener("DOMContentLoaded", applyV2Theme);
