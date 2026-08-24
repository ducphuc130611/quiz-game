/* ============================================================
   QUIZ GAME v3.0.0 — SUPER MAJOR SYSTEM
   Large meta-progression layer. No external dependencies.
   ============================================================ */
(() => {
  "use strict";
  const KEY = "quizGame_v300_super";
  const CATS = ["all","science","geography","history","technology","math","biology","physics","chemistry","space","culture","sports","literature","vietnam","logic"];
  const CAT_NAMES = {all:"Tổng hợp",science:"Khoa học",geography:"Địa lý",history:"Lịch sử",technology:"Công nghệ",math:"Toán",biology:"Sinh học",physics:"Vật lý",chemistry:"Hóa học",space:"Vũ trụ",culture:"Văn hóa",sports:"Thể thao",literature:"Văn học",vietnam:"Việt Nam",logic:"Logic"};
  const TITLES = [
    ["Rookie", "Chơi 1 ván", s=>s.games>=1], ["Explorer", "Chơi 5 ván", s=>s.games>=5],
    ["Scholar", "Đạt 500 câu đúng", s=>s.correct>=500], ["Speedrunner", "Đạt speed bonus 50", s=>s.bestSpeed>=50],
    ["Combo Master", "Combo 10", s=>s.bestCombo>=10], ["Quiz Master", "Đạt 5.000 điểm", s=>s.bestScore>=5000],
    ["Veteran", "Chơi 50 ván", s=>s.games>=50], ["Legend", "Đạt 10.000 điểm", s=>s.bestScore>=10000],
    ["Completionist", "Mở 25 mốc", s=>s.relics>=25], ["Prestige", "Prestige lần đầu", s=>s.prestige>=1]
  ];
  const RELICS = [
    ["Compass","🧭","Chơi 3 ván"],["Hourglass","⌛","Đúng 25 câu"],["Atlas","🗺️","Đúng 100 câu"],["Quill","🪶","Đạt 1.000 XP"],["Crown","👑","Đạt 2.500 điểm"],
    ["Star","🌟","Combo 5"],["Flame","🔥","Combo 10"],["Lightning","⚡","Speed bonus 50"],["Shield","🛡️","Dùng Shield"],["Crystal","💎","Đạt level 10"],
    ["Globe","🌐","5 chủ đề đã chơi"],["Brain","🧠","3 chủ đề đạt mastery 5"],["Rocket","🚀","Chơi Space"],["Flag","🇻🇳","Chơi Vietnam"],["Medal","🏅","Top leaderboard"],
    ["Gem","💠","10 ngày streak"],["Sun","☀️","Daily Challenge"],["Moon","🌙","Chơi sau 20:00"],["Book","📖","Literature"],["Atom","⚛️","Science"],
    ["Gear","⚙️","Technology"],["Ball","⚽","Sports"],["Puzzle","🧩","Logic"],["Lab","🧪","Chemistry"],["Galaxy","🌌","10 chủ đề đã chơi"]
  ];
  const defaultData = () => ({games:0, correct:0, wrong:0, bestScore:0, bestCombo:0, bestSpeed:0, xp:0, prestige:0, streakBest:0, categories:{}, history:[], relics:[], weekly:{week:"",done:{games:0,correct:0,score:0,combo:0}}, settings:{sound:true,reducedMotion:false}});
  function load(){ try{return Object.assign(defaultData(), JSON.parse(localStorage.getItem(KEY)||"{}"), {categories:Object.assign({}, JSON.parse(localStorage.getItem(KEY)||"{}").categories||{})});}catch{return defaultData();} }
  let data=load();
  function save(){localStorage.setItem(KEY,JSON.stringify(data));}
  function weekKey(){const d=new Date(), t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())); const day=t.getUTCDay()||7; t.setUTCDate(t.getUTCDate()+4-day); const y=t.getUTCFullYear(); const first=new Date(Date.UTC(y,0,1)); return `${y}-W${String(Math.ceil((((t-first)/86400000)+1)/7)).padStart(2,"0")}`;}
  function toast(msg){let e=document.getElementById("superToast");if(!e){e=document.createElement("div");e.id="superToast";document.body.appendChild(e);}e.textContent=msg;e.classList.add("show");clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove("show"),2600);}
  function sound(){if(!data.settings.sound)return; try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const c=new A(),o=c.createOscillator(),g=c.createGain();o.frequency.value=520;g.gain.value=.025;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.08);}catch{}}
  function syncFromLegacy(){
    const games=Number(localStorage.getItem("quizGame_v006_games")||localStorage.getItem("quizGame_v003_games")||0);
    const score=Number(localStorage.getItem("quizGame_v003_highScore")||0);
    const xp=Number(localStorage.getItem("quizGame_v003_xp")||0);
    if(games>data.games)data.games=games;if(score>data.bestScore)data.bestScore=score;if(xp>data.xp)data.xp=xp;
    data.weekly.week=data.weekly.week||weekKey(); if(data.weekly.week!==weekKey()){data.weekly={week:weekKey(),done:{games:0,correct:0,score:0,combo:0}};save();}
  }
  syncFromLegacy();
  function mastery(cat){const x=data.categories[cat]||{games:0,correct:0,total:0,best:0}; return Math.min(10,Math.floor((x.correct||0)/Math.max(5,(x.total||0)/10+1)));}
  function checkRelics(){
    const played=new Set(Object.keys(data.categories));
    const conditions=[data.games>=3,data.correct>=25,data.correct>=100,data.xp>=1000,data.bestScore>=2500,data.bestCombo>=5,data.bestCombo>=10,data.bestSpeed>=50,Number(localStorage.getItem("quizGame_v200_powerups")||0)>=0,data.xp>=5000,played.size>=5,["science","geography","history","technology","math"].filter(c=>mastery(c)>=5).length>=3,played.has("space"),played.has("vietnam"),data.bestScore>=5000,data.streakBest>=10,data.history.some(h=>h.mode==="daily"),new Date().getHours()>=20,data.history.some(h=>h.category==="literature"),played.has("science"),played.has("technology"),played.has("sports"),played.has("logic"),played.has("chemistry"),played.size>=10];
    conditions.forEach((ok,i)=>{if(ok&&!data.relics.includes(i)){data.relics.push(i);toast(`🗝️ Relic unlocked: ${RELICS[i][1]} ${RELICS[i][0]}`);sound();}});save();
  }
  function recordGame(){
    const score=Number(document.getElementById("finalScore")?.textContent||0), correct=Number(document.getElementById("correctCount")?.textContent||0), wrong=Number(document.getElementById("wrongCount")?.textContent||0), combo=Number(document.getElementById("bestCombo")?.textContent||0), xp=Number(document.getElementById("earnedXP")?.textContent?.replace(/\D/g,"")||0), cat=window.state?.category||"all", mode=window.state?.mode||"classic";
    if(!score&&!correct&&!wrong)return;
    data.games++;data.correct+=correct;data.wrong+=wrong;data.bestScore=Math.max(data.bestScore,score);data.bestCombo=Math.max(data.bestCombo,combo);data.xp+=xp;
    const c=data.categories[cat]||(data.categories[cat]={games:0,correct:0,total:0,best:0});c.games++;c.correct+=correct;c.total+=correct+wrong;c.best=Math.max(c.best,score);
    data.weekly.done.games++;data.weekly.done.correct+=correct;data.weekly.done.score+=score;data.weekly.done.combo=Math.max(data.weekly.done.combo,combo);
    data.history.unshift({date:new Date().toISOString(),score,correct,wrong,combo,category:cat,mode});data.history=data.history.slice(0,30);save();checkRelics();renderHub();
  }
  function title(){for(let i=TITLES.length-1;i>=0;i--)if(TITLES[i][2](data))return TITLES[i][0];return "Rookie";}
  function campaign(){return Math.min(30,Math.floor(data.games/2)+Math.floor(data.correct/20));}
  function build(){
    if(document.getElementById("superHubBtn"))return;
    const home=document.querySelector("#homeScreen .home-actions"); if(!home)return;
    const b=document.createElement("button");b.id="superHubBtn";b.className="shop-open-btn super-btn";b.textContent="🌌 SUPER HUB";home.appendChild(b);b.onclick=()=>{renderHub();document.getElementById("superHub")?.classList.add("open");};
    const overlay=document.createElement("div");overlay.id="superHub";overlay.innerHTML=`<div class="super-panel"><div class="super-head"><div><div class="version">SUPER MAJOR • v3.0.0</div><h2>🌌 PLAYER HUB</h2></div><button id="superClose">✕</button></div><div class="super-tabs"><button data-tab="overview">OVERVIEW</button><button data-tab="mastery">MASTERY</button><button data-tab="campaign">CAMPAIGN</button><button data-tab="collection">COLLECTION</button><button data-tab="history">HISTORY</button><button data-tab="settings">SETTINGS</button></div><div id="superContent"></div></div>`;document.body.appendChild(overlay);
    overlay.querySelector("#superClose").onclick=()=>overlay.classList.remove("open");overlay.addEventListener("click",e=>{if(e.target===overlay)overlay.classList.remove("open");});overlay.querySelectorAll("[data-tab]").forEach(x=>x.onclick=()=>renderTab(x.dataset.tab));renderTab("overview");
  }
  function renderTab(tab){const el=document.getElementById("superContent");if(!el)return; if(tab==="overview")el.innerHTML=`<div class="super-grid"><div class="mega-stat"><b>${data.games}</b><span>GAMES</span></div><div class="mega-stat"><b>${data.correct}</b><span>CORRECT</span></div><div class="mega-stat"><b>${data.bestScore}</b><span>BEST SCORE</span></div><div class="mega-stat"><b>${data.bestCombo}</b><span>BEST COMBO</span></div></div><div class="hero-stat"><span>🏅 TITLE</span><strong>${title()}</strong><small>${data.prestige>0?`Prestige ${data.prestige}`:"Keep playing to prestige at Level 50."}</small></div><div class="weekly"><h3>📅 WEEKLY MISSION</h3><p>Chơi 5 ván: ${Math.min(data.weekly.done.games,5)}/5</p><p>Đúng 40 câu: ${Math.min(data.weekly.done.correct,40)}/40</p><p>Đạt 5.000 điểm: ${Math.min(data.weekly.done.score,5000)}/5000</p><p>Combo 10: ${Math.min(data.weekly.done.combo,10)}/10</p></div>`; else if(tab==="mastery")el.innerHTML=`<h3>📚 CATEGORY MASTERY</h3><div class="mastery-list">${CATS.filter(c=>c!=="all").map(c=>{const x=data.categories[c]||{games:0,correct:0,total:0};const m=mastery(c);const acc=x.total?Math.round(x.correct/x.total*100):0;return `<div class="mastery-row"><b>${CAT_NAMES[c]}</b><span>Lv.${m}/10</span><i><em style="width:${m*10}%"></em></i><small>${x.games} games • ${acc}% accuracy</small></div>`}).join("")}</div>`; else if(tab==="campaign")el.innerHTML=`<div class="campaign"><h3>🗺️ QUIZ CAMPAIGN</h3><div class="campaign-level">CHAPTER ${campaign()}/30</div><div class="campaign-track"><i style="width:${campaign()/30*100}%"></i></div><p>Complete games and answer questions to advance through 30 campaign chapters.</p><div class="chapters">${Array.from({length:30},(_,i)=>`<span class="${i+1<=campaign()?"done":""}">${i+1}</span>`).join("")}</div></div>`; else if(tab==="collection")el.innerHTML=`<h3>🗝️ RELIC COLLECTION ${data.relics.length}/${RELICS.length}</h3><div class="relic-grid">${RELICS.map((r,i)=>`<div class="relic ${data.relics.includes(i)?"unlocked":"locked"}"><strong>${data.relics.includes(i)?r[1]:"❔"}</strong><b>${r[0]}</b><small>${r[2]}</small></div>`).join("")}</div>`; else if(tab==="history")el.innerHTML=`<h3>📜 RECENT RUNS</h3><div class="history-list">${data.history.length?data.history.map(h=>`<div><b>${h.score}</b><span>${h.correct}✓ / ${h.wrong}✗ • ${h.mode}</span><small>${new Date(h.date).toLocaleDateString()}</small></div>`).join(""):"<p>Chưa có lịch sử.</p>"}</div>`; else el.innerHTML=`<h3>⚙️ SETTINGS</h3><label class="setting"><input id="superSound" type="checkbox" ${data.settings.sound?"checked":""}> 🔊 Sound effects</label><label class="setting"><input id="superMotion" type="checkbox" ${data.settings.reducedMotion?"checked":""}> ♿ Reduced motion</label><button id="exportSave" class="primary-btn">💾 EXPORT SAVE</button><button id="resetSuper" class="danger-btn">⚠ RESET SUPER DATA</button>`;
    document.getElementById("superSound")?.addEventListener("change",e=>{data.settings.sound=e.target.checked;save();});document.getElementById("superMotion")?.addEventListener("change",e=>{data.settings.reducedMotion=e.target.checked;document.body.classList.toggle("reduced-motion",data.settings.reducedMotion);save();});document.getElementById("exportSave")?.addEventListener("click",()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));a.download="quiz-game-v3-save.json";a.click();URL.revokeObjectURL(a.href);});document.getElementById("resetSuper")?.addEventListener("click",()=>{if(confirm("Xóa dữ liệu Super Major?")){data=defaultData();save();renderTab("overview");toast("Đã reset Super data.");}});
  }
  function renderHub(){syncFromLegacy();renderTab("overview");}
  window.QuizSuperMajor={data,recordGame,renderHub,title,campaign};
  const boot=setInterval(()=>{if(document.readyState!=="loading"){clearInterval(boot);build();}},100);
  const observer=new MutationObserver(()=>{const r=document.getElementById("resultScreen");if(r&&r.classList.contains("active")&&!r.dataset.superRecorded){r.dataset.superRecorded="1";setTimeout(()=>{recordGame();r.dataset.superRecorded="";},100);}});
  observer.observe(document.body,{attributes:true,subtree:true,attributeFilter:["class"]});
})();
