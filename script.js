const QUESTIONS_PER_GAME = 10;
const QUESTION_TIME = 15;
const SCORE_PER_CORRECT = 100;
const COMBO_BONUS_STEP = 25;
const MAX_COMBO_MULTIPLIER = 3;
const SPEED_BONUS_MAX = 50;
const XP_PER_CORRECT = 25;
const XP_PER_GAME = 20;
const XP_SPEED_BONUS = 5;
const XP_COMBO_BONUS = 5;
const XP_PER_LEVEL = 500;
const MAX_LEVEL = 100;
const HIGH_SCORE_KEY = "quizGame_v003_highScore";
const XP_KEY = "quizGame_v003_xp";

const state = {
  category: "all", mode: "classic", questions: [], current: 0, score: 0,
  correct: 0, wrong: 0, combo: 0, bestCombo: 0, bonusScore: 0,
  earnedXP: 0, speedBonus: 0, timeLeft: QUESTION_TIME, totalTimeLeft: 0,
  timerId: null, locked: false, levelBeforeGame: 1, doubleScore: false,
  shield: false, frozen: false, gameOver: false
};

const $ = id => document.getElementById(id);
const screens = {
  home: $("homeScreen"), quiz: $("quizScreen"), result: $("resultScreen"),
  leaderboard: $("leaderboardScreen"), shop: $("shopScreen"), profile: $("profileScreen")
};
const categoryButtons = document.querySelectorAll(".category-btn");

function showScreen(name) {
  Object.values(screens).forEach(s => s && s.classList.remove("active"));
  if (screens[name]) screens[name].classList.add("active");
}
function getXP() { return Number(localStorage.getItem(XP_KEY) || 0); }
function setXP(x) { localStorage.setItem(XP_KEY, String(Math.max(0, x))); }
function getLevel(x = getXP()) { return Math.min(MAX_LEVEL, Math.floor(x / XP_PER_LEVEL) + 1); }
function getLevelXP(x = getXP()) { return x % XP_PER_LEVEL; }
function getRank(l) { if (l >= 50) return "LEGEND"; if (l >= 30) return "MASTER"; if (l >= 20) return "EXPERT"; if (l >= 10) return "VETERAN"; if (l >= 5) return "SKILLED"; return "NEWCOMER"; }
function getHighScore() { return Number(localStorage.getItem(HIGH_SCORE_KEY) || 0); }
function getXPPercent(x = getXP()) { return getLevel(x) >= MAX_LEVEL ? 100 : getLevelXP(x) / XP_PER_LEVEL * 100; }

function updatePlayerUI() {
  const x = getXP(), l = getLevel(x), lx = getLevelXP(x);
  if ($("homeLevel")) $("homeLevel").textContent = l;
  if ($("homeXPText")) $("homeXPText").textContent = l >= MAX_LEVEL ? `${XP_PER_LEVEL} / ${XP_PER_LEVEL} XP` : `${lx} / ${XP_PER_LEVEL} XP`;
  if ($("homeRank")) $("homeRank").textContent = getRank(l);
  if ($("homeXPBar")) $("homeXPBar").style.width = `${getXPPercent(x)}%`;
  if ($("homeHighScore")) $("homeHighScore").textContent = getHighScore();
  if (typeof renderAchievements === "function") renderAchievements();
  if (typeof renderShop === "function") renderShop();
  renderV2Home();
}
function updateQuizPlayerUI() {
  if ($("quizLevel")) $("quizLevel").textContent = getLevel();
  if ($("quizMode")) $("quizMode").textContent = getGameModeConfig(state.mode).name.toUpperCase();
}
function shuffle(a) { const c = [...a]; for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; } return c; }
function seededShuffle(a, seed) { const c = [...a]; let s = seed >>> 0; for (let i = c.length - 1; i > 0; i--) { s = (s * 1664525 + 1013904223) >>> 0; const j = s % (i + 1); [c[i], c[j]] = [c[j], c[i]]; } return c; }

function prepareQuestions() {
  const cfg = getGameModeConfig(state.mode);
  let pool = state.category === "all" ? QUESTION_BANK : QUESTION_BANK.filter(q => q.category === state.category);
  if (pool.length < cfg.questions) pool = [...pool, ...QUESTION_BANK.filter(q => !pool.includes(q))];
  if (state.mode === "daily") {
    const key = Number(getTodayKey().replaceAll("-", ""));
    state.questions = seededShuffle(pool, key).slice(0, Math.min(cfg.questions, pool.length));
  } else state.questions = shuffle(pool).slice(0, Math.min(cfg.questions, pool.length));
}

function renderModes() {
  const grid = $("modeGrid");
  if (!grid) return;
  grid.innerHTML = Object.entries(GAME_MODES).map(([id, cfg]) => `<button class="mode-card ${id === state.mode ? "selected" : ""}" data-mode="${id}"><span class="mode-icon">${cfg.icon}</span><strong>${cfg.name}</strong><small>${cfg.description}</small></button>`).join("");
  grid.querySelectorAll("[data-mode]").forEach(b => b.addEventListener("click", () => { state.mode = b.dataset.mode; renderModes(); updateModeRules(); }));
}
function updateModeRules() {
  const cfg = getGameModeConfig(state.mode);
  if ($("selectedModeLabel")) $("selectedModeLabel").textContent = cfg.name;
  if ($("rulesQuestions")) $("rulesQuestions").textContent = cfg.totalTime ? "∞" : cfg.questions;
  if ($("rulesTime")) $("rulesTime").textContent = cfg.totalTime ? `${cfg.totalTime}s` : `${cfg.time}s`;
  if ($("rulesMultiplier")) $("rulesMultiplier").textContent = `x${cfg.scoreMultiplier}`;
}
function renderV2Home() {
  if (typeof ensureDailyData !== "function") return;
  const data = ensureDailyData(), q = getDailyQuest();
  if ($("dailyStreak")) $("dailyStreak").textContent = `📅 Streak ${data.daily.streak}`;
  const checks = [q.progress.games >= q.targets.games, q.progress.correct >= q.targets.correct, q.progress.combo >= q.targets.combo, q.progress.score >= q.targets.score];
  if ($("questStatus")) $("questStatus").textContent = `${checks.filter(Boolean).length}/4`;
  if ($("questList")) $("questList").innerHTML = [`🎮 ${Math.min(q.progress.games, q.targets.games)}/${q.targets.games} ván`, `✅ ${Math.min(q.progress.correct, q.targets.correct)}/${q.targets.correct} câu đúng`, `🔥 ${Math.min(q.progress.combo, q.targets.combo)}/${q.targets.combo} combo`, `💯 ${Math.min(q.progress.score, q.targets.score)}/${q.targets.score} điểm`].map((t, i) => `<div class="quest-row ${checks[i] ? "done" : ""}"><span>${t}</span><b>${checks[i] ? "✓" : ""}</b></div>`).join("");
  const claim = $("claimQuestBtn");
  if (claim) { claim.disabled = !checks.every(Boolean) || q.claimed; claim.textContent = q.claimed ? "✅ ĐÃ NHẬN THƯỞNG" : "🎁 NHẬN THƯỞNG"; }
}

function startGame() {
  clearInterval(state.timerId);
  const cfg = getGameModeConfig(state.mode);
  state.current = 0; state.score = 0; state.correct = 0; state.wrong = 0; state.combo = 0; state.bestCombo = 0;
  state.bonusScore = 0; state.earnedXP = 0; state.speedBonus = 0; state.locked = false; state.gameOver = false;
  state.doubleScore = false; state.shield = false; state.frozen = false; state.levelBeforeGame = getLevel();
  state.totalTimeLeft = cfg.totalTime || 0;
  prepareQuestions();
  $("score").textContent = "0";
  updateQuizPlayerUI(); updateComboDisplay(); updatePowerupUI();
  showScreen("quiz"); renderQuestion();
}

function renderQuestion() {
  clearInterval(state.timerId);
  state.locked = false;
  const cfg = getGameModeConfig(state.mode), q = state.questions[state.current];
  if (!q) return finishGame();
  state.timeLeft = cfg.time || state.timeLeft || QUESTION_TIME;
  $("questionNumber").textContent = `${state.current + 1}/${cfg.totalTime ? "∞" : cfg.questions}`;
  $("questionText").textContent = q.question;
  $("categoryLabel").textContent = CATEGORY_NAMES[q.category] || "QUIZ";
  $("feedback").textContent = "";
  $("timer").textContent = cfg.totalTime ? state.totalTimeLeft : state.timeLeft;
  $("timer").parentElement.classList.remove("warning");
  $("progressBar").style.width = cfg.totalTime ? `${Math.min(100, (60 - state.totalTimeLeft) / 60 * 100)}%` : `${state.current / cfg.questions * 100}%`;
  updateComboDisplay(); updateQuizPlayerUI(); updatePowerupUI();
  const letters = ["A", "B", "C", "D"], answers = $("answers"); answers.innerHTML = "";
  q.answers.forEach((a, i) => { const b = document.createElement("button"); b.className = "answer-btn"; b.innerHTML = `<span class="answer-letter">${letters[i]}</span><span>${a}</span>`; b.addEventListener("click", () => chooseAnswer(i, b)); answers.appendChild(b); });
  if (cfg.totalTime) startTotalTimer(); else startQuestionTimer();
}
function startQuestionTimer() { state.timerId = setInterval(() => { state.timeLeft--; $("timer").textContent = state.timeLeft; if (state.timeLeft <= 5) $("timer").parentElement.classList.add("warning"); if (state.timeLeft <= 0) { clearInterval(state.timerId); handleTimeout(); } }, 1000); }
function startTotalTimer() { state.timerId = setInterval(() => { state.totalTimeLeft--; $("timer").textContent = state.totalTimeLeft; if (state.totalTimeLeft <= 10) $("timer").parentElement.classList.add("warning"); if (state.totalTimeLeft <= 0) { clearInterval(state.timerId); state.gameOver = true; finishGame(); } }, 1000); }
function disableAnswers() { document.querySelectorAll(".answer-btn").forEach(b => b.disabled = true); }
function getComboMultiplier() { if (state.combo >= 6) return 3; if (state.combo >= 4) return 2; if (state.combo >= 2) return 1.5; return 1; }
function calculateSpeedBonus() { return Math.min(SPEED_BONUS_MAX, state.timeLeft * 4); }
function calculateComboBonus() { return state.combo < 2 ? 0 : Math.round(COMBO_BONUS_STEP * Math.min(state.combo, 6)); }
function updateComboDisplay() { if ($("comboCount")) $("comboCount").textContent = state.combo; if ($("comboMultiplier")) $("comboMultiplier").textContent = `x${getComboMultiplier()}`; }
function addScore(base, speed, combo) { const mode = getGameModeConfig(state.mode), m = getComboMultiplier() * mode.scoreMultiplier * (state.doubleScore ? 2 : 1), multiplied = Math.round(base * m), gained = multiplied + speed + combo; state.score += gained; state.bonusScore += speed + combo + Math.max(0, multiplied - base); state.speedBonus = Math.max(state.speedBonus, speed); state.doubleScore = false; $("score").textContent = state.score; return { gained, multiplier: m }; }
function grantXP(amount) { const old = getXP(), next = Math.min(MAX_LEVEL * XP_PER_LEVEL - 1, old + amount); setXP(next); state.earnedXP += next - old; return getLevel(next); }
function advanceQuestion() { setTimeout(() => { state.current++; const cfg = getGameModeConfig(state.mode); if (state.current >= state.questions.length || (!cfg.totalTime && state.current >= cfg.questions)) finishGame(); else renderQuestion(); }, 850); }

function chooseAnswer(index, selected) {
  if (state.locked) return;
  state.locked = true; clearInterval(state.timerId); disableAnswers();
  const q = state.questions[state.current], buttons = document.querySelectorAll(".answer-btn");
  if (index === q.correct) {
    selected.classList.add("correct"); state.correct++; state.combo++; state.bestCombo = Math.max(state.bestCombo, state.combo);
    const speed = getGameModeConfig(state.mode).totalTime ? Math.min(50, Math.ceil(state.totalTimeLeft / 2)) : calculateSpeedBonus();
    const combo = calculateComboBonus(), r = addScore(SCORE_PER_CORRECT, speed, combo);
    let xp = XP_PER_CORRECT; if (speed >= 30) xp += XP_SPEED_BONUS; if (state.combo >= 3) xp += XP_COMBO_BONUS; if (state.mode === "hard" || state.mode === "survival") xp += 5; grantXP(xp);
    let text = `✓ Chính xác! +${r.gained} điểm • +${xp} XP`; if (r.multiplier > 1) text += ` • x${r.multiplier}`; if (speed) text += ` • Tốc độ +${speed}`; if (combo) text += ` • Combo +${combo}`;
    $("feedback").textContent = text;
  } else {
    selected.classList.add("wrong"); buttons[q.correct].classList.add("correct");
    if (state.shield) { state.shield = false; $("feedback").textContent = `🛡️ Khiên đã bảo vệ bạn! Combo ${state.combo} được giữ.`; }
    else { state.wrong++; state.combo = 0; $("feedback").textContent = `✗ Sai! Combo bị reset. Đáp án đúng: ${q.answers[q.correct]}`; if (getGameModeConfig(state.mode).lives) state.gameOver = true; }
  }
  updateComboDisplay(); updateQuizPlayerUI(); updatePowerupUI();
  if (state.gameOver) setTimeout(finishGame, 900); else advanceQuestion();
}
function handleTimeout() {
  if (state.locked) return;
  state.locked = true; disableAnswers();
  const q = state.questions[state.current], b = document.querySelectorAll(".answer-btn"); if (b[q.correct]) b[q.correct].classList.add("correct");
  if (state.shield) { state.shield = false; $("feedback").textContent = "🛡️ Khiên đã bảo vệ bạn khỏi hết giờ!"; updatePowerupUI(); advanceQuestion(); return; }
  state.wrong++; state.combo = 0; if (getGameModeConfig(state.mode).lives) state.gameOver = true;
  $("feedback").textContent = `⏰ Hết giờ! Combo bị reset. Đáp án: ${q.answers[q.correct]}`; updateComboDisplay();
  if (state.gameOver) setTimeout(finishGame, 900); else advanceQuestion();
}

function updatePowerupUI() {
  if (typeof getPowerupCounts !== "function") return;
  const p = getPowerupCounts(); ["fifty", "freeze", "double", "shield", "reroll"].forEach(k => { const el = $("pu" + k.charAt(0).toUpperCase() + k.slice(1)); if (el) el.textContent = p[k] || 0; });
  document.querySelectorAll(".powerup-btn").forEach(b => b.disabled = state.locked || !(p[b.dataset.powerup] > 0));
}
function usePowerup(type) {
  if (state.locked || !useV2Powerup(type)) return;
  if (type === "fifty") {
    const q = state.questions[state.current]; const wrong = [...document.querySelectorAll(".answer-btn")].filter((_, i) => i !== q.correct); shuffle(wrong).slice(0, 2).forEach(b => { b.disabled = true; b.style.opacity = ".25"; });
  } else if (type === "freeze") {
    clearInterval(state.timerId); state.frozen = true; $("feedback").textContent = "⏸️ Thời gian đóng băng 5 giây!"; setTimeout(() => { if (!state.locked && !state.gameOver) { state.frozen = false; const cfg = getGameModeConfig(state.mode); cfg.totalTime ? startTotalTimer() : startQuestionTimer(); $("feedback").textContent = ""; } }, 5000);
  } else if (type === "double") { state.doubleScore = true; $("feedback").textContent = "✖️ Câu trả lời đúng tiếp theo sẽ được nhân đôi!"; }
  else if (type === "shield") { state.shield = true; $("feedback").textContent = "🛡️ Khiên đã kích hoạt: bảo vệ một lần sai/hết giờ."; }
  else if (type === "reroll") { const used = new Set(state.questions); const pool = QUESTION_BANK.filter(q => !used.has(q)); if (pool.length) state.questions[state.current] = shuffle(pool)[0]; renderQuestion(); return; }
  updatePowerupUI();
}

function finishGame() {
  if (state._finished) return; state._finished = true; clearInterval(state.timerId);
  const cfg = getGameModeConfig(state.mode), total = state.correct + state.wrong, accuracy = total ? Math.round(state.correct / total * 100) : 0;
  const oldHigh = getHighScore(), isRecord = state.score > oldHigh; grantXP(XP_PER_GAME);
  if (isRecord) localStorage.setItem(HIGH_SCORE_KEY, String(state.score));
  const xp = getXP(), level = getLevel(xp), levelUp = level > state.levelBeforeGame;
  const gamesPlayed = typeof incrementGamesPlayed === "function" ? incrementGamesPlayed() : 0;
  const newly = typeof evaluateAchievements === "function" ? evaluateAchievements({ correct: state.correct, bestCombo: state.bestCombo, score: state.score, speedBonus: state.speedBonus, earnedXP: state.earnedXP, level, gamesPlayed }) : [];
  if (typeof addLeaderboardScore === "function") { const profile = typeof getProfile === "function" ? getProfile() : { name: "Player" }; addLeaderboardScore(profile.name, state.score, state.category, state.correct, accuracy); }
  if (typeof recordV2Game === "function") recordV2Game({ mode: state.mode, score: state.score, correct: state.correct, bestCombo: state.bestCombo });
  $("finalScore").textContent = state.score; $("correctCount").textContent = state.correct; $("wrongCount").textContent = state.wrong; $("accuracy").textContent = `${accuracy}%`; $("bestCombo").textContent = state.bestCombo; $("earnedXP").textContent = `+${state.earnedXP}`;
  $("resultLevel").textContent = level; $("resultXPText").textContent = level >= MAX_LEVEL ? `${XP_PER_LEVEL} / ${XP_PER_LEVEL} XP` : `${getLevelXP(xp)} / ${XP_PER_LEVEL} XP`; $("resultRank").textContent = getRank(level); $("resultXPBar").style.width = `${getXPPercent(xp)}%`;
  $("levelUpMessage").innerHTML = levelUp ? `🎉 <strong>LEVEL UP!</strong> Bạn đã lên Level ${level}!` : `⭐ Cấp hiện tại: <strong>${level}</strong> • ${cfg.name}`;
  $("recordMessage").textContent = isRecord && state.score > 0 ? "🎉 Kỷ lục mới!" : `Kỷ lục: ${Math.max(oldHigh, state.score)} điểm`;
  $("resultMessage").textContent = state.mode === "survival" && state.gameOver ? "💀 Survival kết thúc! Hãy thử lại để phá kỷ lục." : accuracy === 100 ? "Hoàn hảo! Bạn không bỏ lỡ câu nào." : accuracy >= 70 ? "Rất tốt! Hãy thử mode khó hơn." : "Tiếp tục luyện tập và chinh phục Quiz Game!";
  const unlockBox = $("achievementUnlocks"); unlockBox.innerHTML = newly.length ? `<strong>🏆 Thành tích mới!</strong><div>${newly.map(a => `<span>${a.icon} ${a.name}</span>`).join("")}</div>` : "";
  state._finished = false; updatePlayerUI(); showScreen("result");
}

function setupV2() {
  state.mode = "classic"; renderModes(); updateModeRules(); renderV2Home();
  $("claimQuestBtn")?.addEventListener("click", () => { if (claimDailyQuest()) { alert("🎉 Daily Quest hoàn thành! +100 XP, +100 Coins, nhận thêm Power-ups."); updatePlayerUI(); } });
  document.querySelectorAll(".powerup-btn").forEach(b => b.addEventListener("click", () => usePowerup(b.dataset.powerup)));
}

categoryButtons.forEach(b => b.addEventListener("click", () => { categoryButtons.forEach(x => x.classList.remove("selected")); b.classList.add("selected"); state.category = b.dataset.category; }));
$("startBtn").addEventListener("click", startGame); $("playAgainBtn").addEventListener("click", startGame);
$("homeBtn").addEventListener("click", () => { clearInterval(state.timerId); updatePlayerUI(); showScreen("home"); });
$("leaderboardBtn").addEventListener("click", () => { if (typeof renderLeaderboard === "function") renderLeaderboard(); showScreen("leaderboard"); });
$("closeLeaderboardBtn").addEventListener("click", () => showScreen("home"));

setupV2(); updatePlayerUI();
