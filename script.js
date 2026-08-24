const QUESTIONS_PER_GAME = 10;
const QUESTION_TIME = 15;
const SCORE_PER_CORRECT = 100;
const HIGH_SCORE_KEY = "quizGame_v001_highScore";

const state = {
  category: "all",
  questions: [],
  current: 0,
  score: 0,
  correct: 0,
  wrong: 0,
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

  // Đảm bảo có đủ câu hỏi bằng cách lấy thêm từ ngân hàng chung nếu cần.
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
  state.locked = false;
  prepareQuestions();
  $("score").textContent = "0";
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
    state.score += SCORE_PER_CORRECT;
    $("score").textContent = state.score;
    $("feedback").textContent = "✓ Chính xác!";
  } else {
    selectedButton.classList.add("wrong");
    buttons[q.correct].classList.add("correct");
    state.wrong++;
    $("feedback").textContent = `✗ Sai! Đáp án đúng: ${q.answers[q.correct]}`;
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
  $("feedback").textContent = `⏰ Hết giờ! Đáp án: ${q.answers[q.correct]}`;

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
  }, 900);
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
  $("recordMessage").textContent = isRecord && state.score > 0 ? "🎉 Kỷ lục mới!" : `Kỷ lục: ${Math.max(oldHighScore, state.score)} điểm`;

  if (accuracy === 100) {
    $("resultMessage").textContent = "Hoàn hảo! Bạn không bỏ lỡ câu nào.";
  } else if (accuracy >= 70) {
    $("resultMessage").textContent = "Rất tốt! Kiến thức của bạn khá vững.";
  } else if (accuracy >= 50) {
    $("resultMessage").textContent = "Không tệ! Hãy thử lại để phá kỷ lục.";
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
