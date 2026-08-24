import crypto from "node:crypto";

const MAX_RUNS_PER_PLAYER = 10;
const MIN_ANSWER_MS = 450;
const MAX_RUN_MS = 30 * 60 * 1000;

export function createRun(playerId, questions, mode = "ranked") {
  const runId = crypto.randomUUID();
  const nonce = crypto.randomBytes(24).toString("hex");
  const now = Date.now();
  return {
    runId,
    playerId,
    nonce,
    mode,
    startedAt: now,
    expiresAt: now + MAX_RUN_MS,
    questions: questions.map(q => q.id),
    answers: [],
    score: 0,
    correct: 0,
    finished: false
  };
}

export function validateAnswer(run, question, answer, elapsedMs) {
  if (!run || run.finished) return { ok: false, error: "Run is not active" };
  if (Date.now() > run.expiresAt) return { ok: false, error: "Run expired" };
  if (!Number.isInteger(answer) || answer < 0 || answer >= question.answers.length) return { ok: false, error: "Invalid answer" };
  if (!Number.isFinite(elapsedMs) || elapsedMs < MIN_ANSWER_MS || elapsedMs > MAX_RUN_MS) return { ok: false, error: "Invalid answer timing" };
  const correct = answer === question.correct;
  const points = correct ? Math.max(100, 1000 - Math.floor(elapsedMs / 100)) : 0;
  return { ok: true, correct, points };
}

export function validateRun(run, questionCount) {
  if (!run || run.finished) return { ok: false, error: "Run is not active" };
  if (run.answers.length !== questionCount) return { ok: false, error: "Incomplete ranked run" };
  if (Date.now() > run.expiresAt) return { ok: false, error: "Run expired" };
  return { ok: true };
}

export const limits = { MAX_RUNS_PER_PLAYER, MIN_ANSWER_MS, MAX_RUN_MS };
