const QUESTIONS_PER_GAME = 10;
const QUESTION_TIME = 15;
const SCORE_PER_CORRECT = 100;
const COMBO_BONUS_STEP = 25;
const MAX_COMBO_MULTIPLIER = 3;
const SPEED_BONUS_MAX = 50;
const HIGH_SCORE_KEY = "quizGame_v002_highScore";

const state = {
  category: "all",
  questions: [],
  current: 0,
  score: 0,
  correct: 0,
  wrong: 0,
  combo: 0,
  bestCombo: 0,
  bonusScore: 0,
  timeLeft: QUESTION_TIME,
  timerId: null,
  locked: false
};

const $ = (id) => document.getElementById(id);

const screens = {
  home: $("homeScreen"),
  quiz: $("quizScreen"),
  result: $("resultScreen")
};

const categoryButtons = document.querySelectorAll(".category-btn");

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

function getHighScore() {
  return Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);
}

function updateHomeScore() {
  $("homeHighScore").textContent = getHighScore();
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function prepareQuestions() {
  let pool = state.category === "all"
    ? QUESTION_BANK
    : QUESTION_BANK.filter((q) => q.category === state.category);

  if (pool.length < QUESTIONS_PER_GAME) {
    pool = [...pool, ...QUESTION_BANK.filter((q) => !pool.includes(q))];
  }

  state.questions = shuffle(pool).slice(0, QUESTIONS_PER_GAME);
}

function startGame() {
  clearInterval(state.timerId);
  state.current = 0;
  state.score = 0;
  state.correct = 0;
  state.wrong = 0;
  state.combo = 0;
  state.bestCombo = 0;
  state.bonusScore = 0;
  state.locked = false;
  prepareQuestions();
  $("score").textContent = "0";
  updateComboDisplay();
  showScreen("quiz");
  renderQuestion();
}

function renderQuestion() {
  clearInterval(state.timerId);
  state.locked = false;
  state.timeLeft = QUESTION_TIME;

  const q = state.questions[state.current];
  $("questionNumber").textContent = `${state.current + 1}/${QUESTIONS_PER_GAME}`;
  $("questionText").textContent = q.question;
  $("categoryLabel").textContent = CATEGORY_NAMES[q.category] || "QUIZ";
  $("feedback").textContent = "";
  $("timer").textContent = state.timeLeft;
  $("timer").parentElement.classList.remove("warning");
  $("progressBar").style.width = `${((state.current) / QUESTIONS_PER_GAME) * 100}%`;
  updateComboDisplay();

  const letters = ["A", "B", "C", "D"];
  const answers = $("answers");
  answers.innerHTML = "";

  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.innerHTML = `<span class="answer-letter">${letters[index]}</span><span>${answer}</span>`;
    button.addEventListener("click", () => chooseAnswer(index, button));
    answers.appendChild(button);
  });

  startTimer();
}

function startTimer() {
  state.timerId = setInterval(() => {
    state.timeLeft--;
    $("timer").textContent = state.timeLeft;

    if (state.timeLeft <= 5) {
      $("timer").parentElement.classList.add("warning");
    }

    if (state.timeLeft <= 0) {
      clearInterval(state.timerId);
      handleTimeout();
    }
  }, 1000);
}

function disableAnswers() {
  document.querySelectorAll(".answer-btn").forEach((button) => {
    button.disabled = true;
  });
}

function getComboMultiplier() {
  if (state.combo >= 6) return MAX_COMBO_MULTIPLIER;
  if (state.combo >= 4) return 2;
  if (state.combo >= 2) return 1.5;
  return 1;
}

function calculateSpeedBonus() {
  // Trả lời càng sớm càng nhận nhiều bonus, tối đa 50 điểm.
  return Math.min(SPEED_BONUS_MAX, state.timeLeft * 4);
}

function calculateComboBonus() {
  if (state.combo < 2) return 0;
  return Math.round(COMBO_BONUS_STEP * Math.min(state.combo, 6));
}

function updateComboDisplay() {
  const comboBox = $("comboBox");
  if (!comboBox) return;

  const multiplier = getComboMultiplier();
  $("comboCount").textContent = state.combo;
  $("comboMultiplier").textContent = `x${multiplier}`;

  comboBox.classList.toggle("active", state.combo >= 2);
}

function addScore(baseScore, speedBonus, comboBonus) {
  const multiplier = getComboMultiplier();
  const multipliedBase = Math.round(baseScore * multiplier);
  const gained = multipliedBase + speedBonus + comboBonus;

  state.score += gained;
  state.bonusScore += speedBonus + comboBonus + (multipliedBase - baseScore);
  $("score").textContent = state.score;

  return { gained, multiplier, multipliedBase };
}

function chooseAnswer(index, selectedButton) {
  if (state.locked) return;
  state.locked = true;
  clearInterval(state.timerId);
  disableAnswers();

  const q = state.questions[state.current];
  const buttons = document.querySelectorAll(".answer-btn");

  if (index === q.correct) {
    selectedButton.classList.add("correct");
    state.correct++;
    state.combo++;
    state.bestCombo = Math.max(state.bestCombo, state.combo);

    const speedBonus = calculateSpeedBonus();
    const comboBonus = calculateComboBonus();
    const result = addScore(SCORE_PER_CORRECT, speedBonus, comboBonus);

    let bonusText = `+${result.gained} điểm`;
    if (result.multiplier > 1) bonusText += ` • Combo x${result.multiplier}`;
    if (speedBonus > 0) bonusText += ` • Tốc độ +${speedBonus}`;
    if (comboBonus > 0) bonusText += ` • Combo bonus +${comboBonus}`;

    $("feedback").textContent = `✓ Chính xác! ${bonusText}`;
    updateComboDisplay();
  } else {
    selectedButton.classList.add("wrong");
    buttons[q.correct].classList.add("correct");
    state.wrong++;
    state.combo = 0;
    updateComboDisplay();
    $("feedback").textContent = `✗ Sai! Combo bị reset. Đáp án đúng: ${q.answers[q.correct]}`;
  }

  nextQuestionAfterDelay();
}

function handleTimeout() {
  if (state.locked) return;
  state.locked = true;
  disableAnswers();

  const q = state.questions[state.current];
  const buttons = document.querySelectorAll(".answer-btn");
  buttons[q.correct].classList.add("correct");
  state.wrong++;
  state.combo = 0;
  updateComboDisplay();
  $("feedback").textContent = `⏰ Hết giờ! Combo bị reset. Đáp án: ${q.answers[q.correct]}`;

  nextQuestionAfterDelay();
}

function nextQuestionAfterDelay() {
  setTimeout(() => {
    state.current++;
    if (state.current >= QUESTIONS_PER_GAME) {
      finishGame();
    } else {
      renderQuestion();
    }
  }, 1100);
}

function finishGame() {
  clearInterval(state.timerId);
  $("progressBar").style.width = "100%";

  const accuracy = Math.round((state.correct / QUESTIONS_PER_GAME) * 100);
  const oldHighScore = getHighScore();
  const isRecord = state.score > oldHighScore;

  if (isRecord) {
    localStorage.setItem(HIGH_SCORE_KEY, String(state.score));
  }

  $("finalScore").textContent = state.score;
  $("correctCount").textContent = state.correct;
  $("wrongCount").textContent = state.wrong;
  $("accuracy").textContent = `${accuracy}%`;
  $("bestCombo").textContent = state.bestCombo;
  $("bonusScore").textContent = `+${state.bonusScore}`;
  $("recordMessage").textContent = isRecord && state.score > 0
    ? "🎉 Kỷ lục mới!"
    : `Kỷ lục: ${Math.max(oldHighScore, state.score)} điểm`;

  if (accuracy === 100) {
    $("resultMessage").textContent = "Hoàn hảo! Bạn không bỏ lỡ câu nào.";
  } else if (accuracy >= 70) {
    $("resultMessage").textContent = "Rất tốt! Hãy giữ combo để kiếm nhiều điểm hơn.";
  } else if (accuracy >= 50) {
    $("resultMessage").textContent = "Không tệ! Thử tăng combo và trả lời nhanh hơn.";
  } else {
    $("resultMessage").textContent = "Hãy luyện tập thêm và chinh phục quiz nhé!";
  }

  showScreen("result");
  updateHomeScore();
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryButtons.forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");
    state.category = button.dataset.category;
  });
});

$("startBtn").addEventListener("click", startGame);
$("playAgainBtn").addEventListener("click", startGame);
$("homeBtn").addEventListener("click", () => {
  clearInterval(state.timerId);
  updateHomeScore();
  showScreen("home");
});

updateHomeScore();
