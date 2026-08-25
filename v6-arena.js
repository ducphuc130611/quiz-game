/* ============================================================
   QUIZ GAME v6.0.0 — ARENA & SOCIAL HUB
   Major gameplay expansion: Arena battles, bot matchmaking,
   daily missions, battle pass XP, trophies and local fallback.
   ============================================================ */
(() => {
  "use strict";
  const KEY = "quizGame_v600_arena";
  const DAY = new Date().toISOString().slice(0,10);
  const defaultData = () => ({
    version: 1,
    coins: 0,
    arenaRating: 1000,
    wins: 0,
    losses: 0,
    draws: 0,
    bestStreak: 0,
    passXP: 0,
    passLevel: 1,
    trophies: [],
    missions: { day: DAY, games: 0, wins: 0, questions: 0, claimed: [] },
    history: []
  });
  let data;
  try { data = { ...defaultData(), ...JSON.parse(localStorage.getItem(KEY) || "{}") }; }
  catch { data = defaultData(); }
  if (!data.missions || data.missions.day !== DAY) data.missions = { day: DAY, games: 0, wins: 0, questions: 0, claimed: [] };
  data.trophies ||= [];
  data.history ||= [];
  save();

  const QUESTIONS = [
    ["What is the capital of Japan?",["Tokyo","Kyoto","Osaka","Nagoya"],0],
    ["Which planet is known as the Red Planet?",["Venus","Mars","Jupiter","Mercury"],1],
    ["What is 12 × 8?",["86","96","108","88"],1],
    ["Which ocean is the largest?",["Atlantic","Indian","Pacific","Arctic"],2],
    ["Who wrote Romeo and Juliet?",["Shakespeare","Dickens","Austen","Twain"],0],
    ["What is H2O?",["Oxygen","Hydrogen","Water","Salt"],2],
    ["Which continent is Egypt in?",["Asia","Europe","Africa","Oceania"],2],
    ["What is the square root of 144?",["10","11","12","14"],2],
    ["Which language is primarily used for web page structure?",["HTML","C++","SQL","Python"],0],
    ["How many sides does a hexagon have?",["5","6","7","8"],1],
    ["Which gas do plants absorb during photosynthesis?",["Oxygen","Nitrogen","Carbon dioxide","Helium"],2],
    ["What is the fastest land animal?",["Lion","Cheetah","Horse","Wolf"],1]
  ];
  const BOTS = [
    ["Nova",980,0.58], ["Atlas",1050,0.67], ["Pixel",1120,0.74],
    ["Raven",1210,0.81], ["Titan",1350,0.88], ["Oracle",1500,0.94]
  ];
  const MISSIONS = [
    ["PLAY 3 ARENA GAMES", "games", 3, 100],
    ["WIN 2 ARENA GAMES", "wins", 2, 150],
    ["ANSWER 15 QUESTIONS", "questions", 15, 200]
  ];

  function save(){ localStorage.setItem(KEY, JSON.stringify(data)); }
  function toast(msg){
    let e=document.getElementById("v6Toast");
    if(!e){e=document.createElement("div");e.id="v6Toast";document.body.appendChild(e)}
    e.textContent=msg;e.classList.add("show");clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove("show"),2600);
  }
  function addXP(n){
    data.passXP += n;
    while(data.passXP >= 500){data.passXP -= 500;data.passLevel++;toast(`🎟️ BATTLE PASS LEVEL ${data.passLevel}!`)}
  }
  function ratingDelta(win,draw){
    const d=draw?4:(win?Math.max(12,Math.min(32,Math.round((1150-data.arenaRating)/35)+18):-Math.max(8,Math.min(24,Math.round((data.arenaRating-1000)/40)+12)));
    data.arenaRating=Math.max(700,Math.min(3000,data.arenaRating+d));
  }
  function trophy(name){if(!data.trophies.includes(name)){data.trophies.push(name);toast(`🏆 TROPHY UNLOCKED: ${name}`)}}

  function build(){
    if(document.getElementById("v6ArenaBtn")) return;
    const home=document.querySelector("#homeScreen .home-actions") || document.querySelector("#homeScreen");
    if(!home)return;
    const b=document.createElement("button");b.id="v6ArenaBtn";b.className="shop-open-btn v6-arena-btn";b.textContent="⚔️ ARENA HUB";home.appendChild(b);
    const o=document.createElement("div");o.id="v6Overlay";o.innerHTML=`<div class="v6-panel"><header><div><div class="v6-version">MAJOR UPDATE • v6.0.0</div><h2>⚔️ ARENA & SOCIAL HUB</h2></div><button id="v6Close">✕</button></header><nav><button data-v="arena">ARENA</button><button data-v="missions">MISSIONS</button><button data-v="pass">BATTLE PASS</button><button data-v="trophies">TROPHIES</button><button data-v="history">HISTORY</button></nav><main id="v6Content"></main></div>`;
    document.body.appendChild(o);
    b.onclick=()=>{render("arena");o.classList.add("open")};
    o.querySelector("#v6Close").onclick=()=>o.classList.remove("open");
    o.addEventListener("click",e=>{if(e.target===o)o.classList.remove("open")});
    o.querySelectorAll("nav button").forEach(x=>x.onclick=()=>render(x.dataset.v));
    render("arena");
  }

  function render(v){
    const e=document.getElementById("v6Content");if(!e)return;
    if(v==="arena"){
      e.innerHTML=`<section class="v6-hero"><span>ARENA RATING</span><strong>${data.arenaRating}</strong><small>${data.wins} WINS • ${data.losses} LOSSES • ${data.draws} DRAWS</small></section><div class="v6-cards"><div><b>🎟️ ${data.passLevel}</b><span>PASS LEVEL</span></div><div><b>🪙 ${data.coins}</b><span>COINS</span></div><div><b>🔥 ${data.bestStreak}</b><span>BEST STREAK</span></div></div><h3>⚔️ QUICK MATCH</h3><p class="v6-note">Choose an opponent. The match uses the same server-authoritative scoring philosophy when an online endpoint is available, with a local bot fallback for instant play.</p><div class="bot-grid">${BOTS.map((x,i)=>`<button class="bot-card" data-bot="${i}"><strong>${x[0]}</strong><span>Rating ${x[1]}</span><small>${Math.round(x[2]*100)}% skill</small></button>`).join("")}</div>`;
      e.querySelectorAll(".bot-card").forEach(x=>x.onclick=()=>startMatch(Number(x.dataset.bot)));
    } else if(v==="missions"){
      e.innerHTML=`<h3>🎯 DAILY MISSIONS</h3><div class="mission-list">${MISSIONS.map((m,i)=>{const value=data.missions[m[1]]||0,done=value>=m[2],claimed=data.missions.claimed.includes(i);return `<div class="mission ${done?"done":""}"><div><b>${m[0]}</b><small>${Math.min(value,m[2])}/${m[2]} • +${m[3]} XP</small></div><button data-m="${i}" ${!done||claimed?"disabled":""}>${claimed?"CLAIMED":done?"CLAIM":"LOCKED"}</button></div>`}).join("")}</div>`;
      e.querySelectorAll("[data-m]").forEach(x=>x.onclick=()=>claimMission(Number(x.dataset.m)));
    } else if(v==="pass"){
      e.innerHTML=`<h3>🎟️ ARENA BATTLE PASS</h3><div class="pass-card"><div class="pass-level">LEVEL ${data.passLevel}</div><div class="pass-bar"><i style="width:${data.passXP/5}%"></i></div><p>${data.passXP}/500 XP to next level</p><div class="pass-rewards"><span>🎁 Lv ${data.passLevel+1}: +100 coins</span><span>🏅 Lv ${data.passLevel+3}: trophy</span><span>💎 Lv ${data.passLevel+5}: +500 coins</span></div></div>`;
    } else if(v==="trophies"){
      const all=["FIRST WIN","WIN STREAK 3","RATING 1200","RATING 1500","10 ARENA GAMES","BATTLE PASS 10","DAILY HERO"];
      e.innerHTML=`<h3>🏆 TROPHY ROOM ${data.trophies.length}/${all.length}</h3><div class="trophy-grid">${all.map(x=>`<div class="trophy ${data.trophies.includes(x)?"found":"locked"}"><b>${data.trophies.includes(x)?"🏆":"🔒"}</b><span>${x}</span></div>`).join("")}</div>`;
    } else {
      e.innerHTML=`<h3>📜 ARENA HISTORY</h3><div class="arena-history">${data.history.length?data.history.map(x=>`<div><b>${x.result}</b><span>${x.bot} • ${x.score}-${x.botScore}</span><strong>${x.rating}</strong></div>`).join(""):"<p>No matches yet. Pick an opponent in Quick Match.</p>"}</div>`;
    }
  }

  function startMatch(index){
    const bot=BOTS[index];
    let q=QUESTIONS.slice().sort(()=>Math.random()-.5).slice(0,5);
    let pos=0,score=0,botScore=0,streak=0,locked=false;
    const o=document.getElementById("v6Overlay"),e=document.getElementById("v6Content");
    function draw(){
      if(pos>=q.length)return finish();
      const item=q[pos];
      e.innerHTML=`<div class="match-head"><span>⚔️ ${bot[0]}</span><b>ROUND ${pos+1}/5</b><span>${score} - ${botScore}</span></div><div class="question-card"><h2>${item[0]}</h2><div class="answer-grid">${item[1].map((a,i)=>`<button data-a="${i}">${a}</button>`).join("")}</div></div><p class="match-note">Your answer is evaluated locally in fallback mode. Ranked server verification remains available through the online backend.</p>`;
      e.querySelectorAll("[data-a]").forEach(x=>x.onclick=()=>answer(Number(x.dataset.a)));
    }
    function answer(a){
      if(locked)return;locked=true;
      const item=q[pos],correct=a===item[2];
      if(correct){streak++;score+=100+streak*20;data.missions.questions++;data.bestStreak=Math.max(data.bestStreak,streak)}else streak=0;
      if(Math.random()<bot[2])botScore+=100+Math.floor(Math.random()*60);
      data.missions.questions++;
      [...e.querySelectorAll("[data-a]")].forEach(x=>x.disabled=true);
      const chosen=e.querySelector(`[data-a="${a}"]`);if(chosen)chosen.classList.add(correct?"right":"wrong");
      setTimeout(()=>{pos++;locked=false;draw()},550);
    }
    function finish(){
      data.missions.games++;const result=score>botScore?"WIN":score<botScore?"LOSS":"DRAW";const win=result==="WIN",draw=result==="DRAW";
      if(win){data.wins++;data.coins+=50;addXP(150);if(data.wins===1)trophy("FIRST WIN");if(data.bestStreak>=3)trophy("WIN STREAK 3")}else if(draw){data.draws++;addXP(60)}else{data.losses++;addXP(40)}
      ratingDelta(win,draw);if(data.arenaRating>=1200)trophy("RATING 1200");if(data.arenaRating>=1500)trophy("RATING 1500");if(data.missions.games>=10)trophy("10 ARENA GAMES");
      data.history.unshift({date:new Date().toISOString(),bot:bot[0],score,botScore,result,rating:data.arenaRating});data.history=data.history.slice(0,30);save();
      e.innerHTML=`<section class="match-result"><div class="result-badge">${win?"🏆 VICTORY":draw?"🤝 DRAW":"💥 DEFEAT"}</div><h2>${score} — ${botScore}</h2><p>Rating: <b>${data.arenaRating}</b> • +${win?50:0} coins</p><button id="v6Again" class="primary-btn">⚔️ PLAY AGAIN</button><button id="v6Back" class="secondary-btn">← ARENA HUB</button></section>`;
      document.getElementById("v6Again").onclick=()=>startMatch(index);document.getElementById("v6Back").onclick=()=>render("arena");
      if(window.QuizOnline?.queue)window.QuizOnline.queue("arena",{bot:bot[0],score,botScore,result,rating:data.arenaRating});
    }
    draw();
  }

  function claimMission(i){
    const m=MISSIONS[i],v=data.missions[m[1]]||0;
    if(v<m[2]||data.missions.claimed.includes(i))return;
    data.missions.claimed.push(i);addXP(m[3]);data.coins+=m[3]/5;if(data.missions.claimed.length===MISSIONS.length)trophy("DAILY HERO");save();toast(`🎁 Mission claimed: +${m[3]} XP`);render("missions");
  }

  const style=document.createElement("style");style.textContent=`
  #v6Overlay{position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.82);display:none;align-items:center;justify-content:center;padding:18px}
  #v6Overlay.open{display:flex}.v6-panel{width:min(980px,96vw);max-height:92vh;overflow:auto;background:#10131c;border:1px solid #3a4258;border-radius:22px;box-shadow:0 30px 100px #000;padding:22px;color:#f4f7ff;font-family:inherit}.v6-panel header{display:flex;justify-content:space-between;align-items:center}.v6-panel header button{background:none;border:0;color:#fff;font-size:24px;cursor:pointer}.v6-version{font-size:11px;letter-spacing:2px;opacity:.65}.v6-panel nav{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}.v6-panel nav button,.bot-card,.mission button,.primary-btn,.secondary-btn{border:1px solid #3a4258;background:#181d29;color:#fff;border-radius:12px;padding:11px 14px;cursor:pointer}.v6-panel nav button:hover,.bot-card:hover{transform:translateY(-1px);border-color:#8291b5}.v6-hero{padding:25px;border-radius:18px;background:linear-gradient(135deg,#191f31,#252d45);text-align:center}.v6-hero span,.v6-hero small{display:block;opacity:.7}.v6-hero strong{display:block;font-size:52px;margin:8px}.v6-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:14px 0}.v6-cards div{padding:15px;background:#171b26;border-radius:14px;text-align:center}.v6-cards b,.v6-cards span{display:block}.v6-cards span{font-size:11px;opacity:.65;margin-top:5px}.bot-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.bot-card{text-align:left;display:flex;flex-direction:column;gap:5px}.bot-card strong{font-size:18px}.bot-card small,.bot-card span{opacity:.7}.v6-note,.match-note{opacity:.7;line-height:1.5}.mission-list{display:grid;gap:10px}.mission{display:flex;justify-content:space-between;align-items:center;background:#171b26;padding:15px;border-radius:14px}.mission small{display:block;opacity:.65;margin-top:4px}.mission button:disabled{opacity:.45;cursor:not-allowed}.pass-card{background:#171b26;border-radius:18px;padding:22px}.pass-level{font-size:25px;font-weight:800}.pass-bar{height:14px;background:#2a3040;border-radius:10px;margin:18px 0;overflow:hidden}.pass-bar i{display:block;height:100%;background:#8aa0d8}.pass-rewards{display:grid;gap:8px}.trophy-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.trophy{padding:16px;background:#171b26;border-radius:14px;text-align:center}.trophy b{font-size:28px;display:block}.trophy span{font-size:12px}.locked{opacity:.35}.arena-history{display:grid;gap:8px}.arena-history div{display:grid;grid-template-columns:90px 1fr 70px;background:#171b26;padding:12px;border-radius:10px}.match-head{display:flex;justify-content:space-between;background:#171b26;padding:13px;border-radius:12px;margin-bottom:14px}.question-card{padding:22px;background:#171b26;border-radius:18px}.question-card h2{font-size:25px}.answer-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.answer-grid button{padding:17px;border-radius:12px;border:1px solid #3a4258;background:#11151e;color:#fff;text-align:left;cursor:pointer}.answer-grid button:hover{border-color:#91a5d1}.answer-grid button.right{border-color:#62c28a}.answer-grid button.wrong{border-color:#d96b6b}.match-result{text-align:center;padding:45px 10px}.result-badge{font-size:25px;font-weight:900}.match-result h2{font-size:48px;margin:15px}.secondary-btn{margin-left:8px}.v6-arena-btn{margin-left:8px}.v6-panel button{transition:.15s}@media(max-width:700px){.bot-grid,.trophy-grid,.v6-cards{grid-template-columns:1fr 1fr}.answer-grid{grid-template-columns:1fr}.arena-history div{grid-template-columns:70px 1fr 60px}}@media(max-width:450px){.bot-grid,.trophy-grid,.v6-cards{grid-template-columns:1fr}}
  `;document.head.appendChild(style);
  const boot=setInterval(()=>{if(document.readyState!=="loading"){clearInterval(boot);build()}},100);
  window.QuizArenaV6={data,render,startMatch};
})();
