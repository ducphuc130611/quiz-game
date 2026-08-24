/* ============================================================
   QUIZ GAME v5.6.0 — SERVER-AUTHORITATIVE RANKED CLIENT
   Ranked answers are validated by the online server.
   ============================================================ */
(() => {
  "use strict";
  const CONFIG_KEY = "quizGame_v500_config";
  let run = null;
  let current = 0;
  let questionStarted = 0;
  let locked = false;

  const apiBase = () => {
    try { return String(JSON.parse(localStorage.getItem(CONFIG_KEY) || "{}").apiBase || "").replace(/\/$/, ""); }
    catch { return ""; }
  };
  const token = () => {
    try { return JSON.parse(localStorage.getItem("quizGame_v500_online") || "{}").token || ""; }
    catch { return ""; }
  };
  async function request(path, options = {}) {
    const base = apiBase();
    const auth = token();
    if (!base || !auth) throw new Error("Hãy đăng nhập và cấu hình Online Backend trước.");
    const headers = { "Content-Type": "application/json", ...(options.headers || {}), Authorization: `Bearer ${auth}` };
    const response = await fetch(base + path, { ...options, headers });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || `HTTP ${response.status}`);
    return body;
  }

  function style() {
    if (document.getElementById("ranked560Style")) return;
    const s = document.createElement("style");
    s.id = "ranked560Style";
    s.textContent = `#ranked560Overlay{position:fixed;inset:0;z-index:12000;background:rgba(2,8,18,.94);display:none;align-items:center;justify-content:center;padding:20px}#ranked560Overlay.open{display:flex}.ranked560Panel{width:min(760px,100%);max-height:92vh;overflow:auto;background:#0b1728;color:#eef6ff;border:1px solid #31516f;border-radius:24px;padding:26px;box-shadow:0 30px 100px rgba(0,0,0,.65)}.ranked560Top{display:flex;justify-content:space-between;gap:15px;align-items:center}.ranked560Top button{background:transparent;color:#fff;border:0;font-size:25px;cursor:pointer}.ranked560Badge{display:inline-block;padding:6px 10px;border-radius:999px;background:#172c45;font-size:11px;letter-spacing:.08em}.ranked560Meta{display:flex;justify-content:space-between;gap:12px;margin:18px 0;padding:12px;border-radius:14px;background:#07111f}.ranked560Question{font-size:clamp(20px,4vw,30px);line-height:1.35;margin:25px 0}.ranked560Answers{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ranked560Answer{padding:16px;border:1px solid #31516f;border-radius:14px;background:#10243a;color:#fff;text-align:left;cursor:pointer;font-size:15px}.ranked560Answer:hover{border-color:#76b7ff}.ranked560Answer:disabled{opacity:.55;cursor:not-allowed}.ranked560Progress{height:8px;background:#14263a;border-radius:99px;overflow:hidden}.ranked560Progress>div{height:100%;background:#76b7ff;width:0;transition:.2s}.ranked560Msg{min-height:24px;margin:15px 0;color:#a9c9e8}.ranked560Result{text-align:center;padding:25px}.ranked560Score{font-size:48px;font-weight:800;margin:15px}.ranked560Error{color:#ff9b9b}.ranked560Start{margin-top:15px;width:100%}@media(max-width:560px){.ranked560Answers{grid-template-columns:1fr}.ranked560Panel{padding:18px}}`;
    document.head.appendChild(s);
  }

  function build() {
    if (document.getElementById("rankedOnlineBtn")) return;
    style();
    const actions = document.querySelector("#homeScreen .home-actions");
    if (!actions) return;
    const button = document.createElement("button");
    button.id = "rankedOnlineBtn";
    button.className = "shop-open-btn";
    button.textContent = "⚔️ RANKED ONLINE";
    actions.appendChild(button);

    const overlay = document.createElement("div");
    overlay.id = "ranked560Overlay";
    overlay.innerHTML = `<div class="ranked560Panel"><div class="ranked560Top"><div><span class="ranked560Badge">v5.6.0 • SERVER AUTHORITATIVE</span><h2>⚔️ RANKED ONLINE</h2></div><button id="ranked560Close">✕</button></div><div id="ranked560Body"></div></div>`;
    document.body.appendChild(overlay);
    button.onclick = () => { overlay.classList.add("open"); showStart(); };
    document.getElementById("ranked560Close").onclick = () => { if (!run) overlay.classList.remove("open"); };
  }

  function showStart(error = "") {
    const body = document.getElementById("ranked560Body");
    if (!body) return;
    body.innerHTML = `<div class="ranked560Meta"><span>🛡️ Server scoring</span><span>🎯 10 questions</span><span>🚫 Client score ignored</span></div><p>Trong Ranked, server phát câu hỏi, kiểm tra đáp án, thời gian và tự tính điểm. Điểm gửi từ client không được dùng.</p>${error ? `<p class="ranked560Error">${error}</p>` : ""}<button id="ranked560Start" class="primary-btn ranked560Start">🚀 START RANKED RUN</button>`;
    document.getElementById("ranked560Start").onclick = startRun;
  }

  async function startRun() {
    try {
      const result = await request("/runs/start", { method: "POST", body: JSON.stringify({ mode: "ranked", count: 10 }) });
      run = result; current = 0; locked = false; renderQuestion();
    } catch (error) { showStart(error.message); }
  }

  function renderQuestion() {
    const body = document.getElementById("ranked560Body");
    const q = run?.questions?.[current];
    if (!q) return finishRun();
    locked = false; questionStarted = performance.now();
    body.innerHTML = `<div class="ranked560Meta"><strong>QUESTION ${current + 1}/${run.questions.length}</strong><span>🛡️ Server verified</span></div><div class="ranked560Progress"><div style="width:${(current / run.questions.length) * 100}%"></div></div><div class="ranked560Question">${escapeHtml(q.question)}</div><div class="ranked560Answers">${q.answers.map((a, i) => `<button class="ranked560Answer" data-answer="${i}">${String.fromCharCode(65 + i)}. ${escapeHtml(a)}</button>`).join("")}</div><div id="ranked560Msg" class="ranked560Msg"></div>`;
    body.querySelectorAll(".ranked560Answer").forEach(button => button.onclick = () => answer(Number(button.dataset.answer)));
  }

  async function answer(answerIndex) {
    if (locked || !run) return;
    locked = true;
    const elapsedMs = Math.round(performance.now() - questionStarted);
    const q = run.questions[current];
    const msg = document.getElementById("ranked560Msg");
    try {
      const result = await request(`/runs/${encodeURIComponent(run.runId)}/answer`, { method: "POST", body: JSON.stringify({ questionId: q.id, answer: answerIndex, elapsedMs }) });
      msg.textContent = result.correct ? `✅ Correct • +${result.points} points` : "❌ Wrong • +0 points";
      setTimeout(() => { current += 1; if (current < run.questions.length) renderQuestion(); else finishRun(); }, 550);
    } catch (error) { locked = false; msg.textContent = `⚠️ ${error.message}`; }
  }

  async function finishRun() {
    if (!run) return;
    try {
      const result = await request(`/runs/${encodeURIComponent(run.runId)}/finish`, { method: "POST", body: JSON.stringify({ season: "all" }) });
      const body = document.getElementById("ranked560Body");
      body.innerHTML = `<div class="ranked560Result"><span class="ranked560Badge">SERVER VERIFIED</span><h2>🏆 RANKED RUN COMPLETE</h2><div class="ranked560Score">${result.score}</div><p>${result.correct}/${result.total} correct</p><p>🛡️ Authoritative score • saved to online leaderboard</p><button id="ranked560Again" class="primary-btn">⚔️ PLAY AGAIN</button></div>`;
      document.getElementById("ranked560Again").onclick = startRun;
    } catch (error) { showStart(error.message); }
    run = null;
  }

  function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c])); }
  const boot = setInterval(() => { if (document.readyState !== "loading") { clearInterval(boot); build(); } }, 100);
  window.QuizRanked = { start: startRun };
})();
