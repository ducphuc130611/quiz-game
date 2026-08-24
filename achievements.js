const ACHIEVEMENTS = [
  {id:"first_win",icon:"🎯",name:"First Victory",description:"Trả lời đúng ít nhất 1 câu trong một ván.",check:s=>s.correct>=1},
  {id:"perfect",icon:"💯",name:"Perfect",description:"Trả lời đúng cả 10 câu.",check:s=>s.correct===10},
  {id:"combo3",icon:"🔥",name:"On Fire",description:"Đạt combo 3.",check:s=>s.bestCombo>=3},
  {id:"combo6",icon:"⚡",name:"Unstoppable",description:"Đạt combo 6.",check:s=>s.bestCombo>=6},
  {id:"speed",icon:"🏎️",name:"Speedster",description:"Nhận Speed Bonus ít nhất 30 điểm.",check:s=>s.speedBonus>=30},
  {id:"score1000",icon:"💰",name:"Four Digits",description:"Đạt ít nhất 1000 điểm trong một ván.",check:s=>s.score>=1000},
  {id:"xp100",icon:"⭐",name:"XP Hunter",description:"Kiếm ít nhất 100 XP trong một ván.",check:s=>s.earnedXP>=100},
  {id:"level5",icon:"🏅",name:"Skilled",description:"Đạt Level 5.",check:s=>s.level>=5},
  {id:"games5",icon:"🎮",name:"Regular Player",description:"Hoàn thành 5 ván.",check:s=>s.gamesPlayed>=5},
  {id:"games10",icon:"🏆",name:"Quiz Veteran",description:"Hoàn thành 10 ván.",check:s=>s.gamesPlayed>=10}
];
const ACHIEVEMENT_KEY="quizGame_v004_achievements",GAMES_KEY="quizGame_v004_games";
function getUnlockedAchievements(){try{return JSON.parse(localStorage.getItem(ACHIEVEMENT_KEY)||"[]")}catch(e){return []}}
function saveUnlockedAchievements(a){localStorage.setItem(ACHIEVEMENT_KEY,JSON.stringify(a))}
function getGamesPlayed(){return Number(localStorage.getItem(GAMES_KEY)||0)}
function incrementGamesPlayed(){const n=getGamesPlayed()+1;localStorage.setItem(GAMES_KEY,String(n));return n}
function evaluateAchievements(stats){const unlocked=getUnlockedAchievements(),newly=[];ACHIEVEMENTS.forEach(a=>{if(!unlocked.includes(a.id)&&a.check(stats)){unlocked.push(a.id);newly.push(a)}});saveUnlockedAchievements(unlocked);return newly}
function renderAchievements(){const box=document.getElementById("achievementList");if(!box)return;const unlocked=getUnlockedAchievements();box.innerHTML=ACHIEVEMENTS.map(a=>{const ok=unlocked.includes(a.id);return `<div class="achievement ${ok?"unlocked":"locked"}"><div class="achievement-icon">${ok?a.icon:"🔒"}</div><div><strong>${a.name}</strong><small>${a.description}</small></div><span>${ok?"✓":""}</span></div>`}).join("");const count=document.getElementById("achievementCount");if(count)count.textContent=`${unlocked.length}/${ACHIEVEMENTS.length}`}
