const SHOP_KEY = "quizGame_v005_shop";
const COINS_KEY = "quizGame_v005_coins";

const SHOP_ITEMS = [
  { id: "starter_badge", icon: "🎖️", name: "Starter Badge", description: "Huy hiệu người chơi", price: 50 },
  { id: "fire_badge", icon: "🔥", name: "Fire Badge", description: "Huy hiệu dành cho người có combo", price: 100 },
  { id: "speed_badge", icon: "⚡", name: "Speed Badge", description: "Huy hiệu tốc độ", price: 150 },
  { id: "gold_badge", icon: "👑", name: "Gold Badge", description: "Huy hiệu cao cấp", price: 300 },
  { id: "legend_badge", icon: "💎", name: "Legend Badge", description: "Vật phẩm hiếm nhất shop", price: 500 }
];

function getCoins() {
  return Number(localStorage.getItem(COINS_KEY) || 0);
}

function setCoins(value) {
  localStorage.setItem(COINS_KEY, String(Math.max(0, value)));
}

function getOwnedItems() {
  try {
    return JSON.parse(localStorage.getItem(SHOP_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveOwnedItems(items) {
  localStorage.setItem(SHOP_KEY, JSON.stringify(items));
}

function addCoins(amount) {
  if (amount <= 0) return;
  setCoins(getCoins() + amount);
}

function renderShop() {
  const coins = getCoins();
  const owned = getOwnedItems();
  const balance = document.getElementById("shopCoins");
  const homeBalance = document.getElementById("homeCoins");
  const list = document.getElementById("shopItems");

  if (balance) balance.textContent = coins;
  if (homeBalance) homeBalance.textContent = coins;
  if (!list) return;

  list.innerHTML = SHOP_ITEMS.map(item => {
    const isOwned = owned.includes(item.id);
    const canBuy = coins >= item.price;
    return `<div class="shop-item ${isOwned ? "owned" : ""}">
      <div class="shop-icon">${item.icon}</div>
      <div class="shop-item-info"><strong>${item.name}</strong><small>${item.description}</small></div>
      <button class="shop-buy-btn" data-shop-item="${item.id}" ${isOwned || !canBuy ? "disabled" : ""}>${isOwned ? "✓ ĐÃ MUA" : `🪙 ${item.price}`}</button>
    </div>`;
  }).join("");
}

function buyItem(id) {
  const item = SHOP_ITEMS.find(x => x.id === id);
  if (!item) return;

  const owned = getOwnedItems();
  if (owned.includes(id)) return;

  const coins = getCoins();
  if (coins < item.price) {
    alert(`Bạn cần ${item.price - coins} Coins nữa để mua ${item.name}.`);
    return;
  }

  setCoins(coins - item.price);
  owned.push(id);
  saveOwnedItems(owned);
  renderShop();
}

function injectShopStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .coin-panel{display:flex;align-items:center;gap:12px;margin:0 0 18px;padding:14px 16px;border:1px solid rgba(255,209,102,.2);border-radius:15px;background:rgba(255,209,102,.06)}
    .coin-panel span{color:#9eacc0;font-size:.72rem;letter-spacing:1px}.coin-panel strong{color:#ffd166;font-size:1.35rem;margin-right:auto}.shop-open-btn{border:1px solid rgba(255,209,102,.35);background:#2b2530;color:#ffd166;border-radius:10px;padding:9px 13px;font-weight:900;cursor:pointer}.shop-open-btn:hover{background:#3a3040}
    .coin-earned{margin:15px 0;padding:12px;border:1px solid rgba(255,209,102,.25);border-radius:12px;color:#ffd166;font-weight:800}
    .shop-card{max-width:760px;margin:auto;padding:28px;background:linear-gradient(145deg,rgba(19,36,59,.96),rgba(8,20,35,.96));border:1px solid rgba(255,255,255,.09);border-radius:24px;box-shadow:0 25px 70px rgba(0,0,0,.35)}
    .shop-header{display:flex;align-items:center;justify-content:space-between;gap:15px}.shop-header h2{margin:12px 0 0;font-size:2.2rem}.shop-balance{padding:12px 16px;border-radius:13px;background:rgba(255,209,102,.08);color:#ffd166;font-size:1.25rem}.shop-subtitle{color:#9eacc0}.shop-items{display:grid;gap:11px;margin:22px 0}.shop-item{display:flex;align-items:center;gap:14px;padding:14px;border:1px solid rgba(255,255,255,.09);border-radius:15px;background:#0b192b}.shop-item.owned{border-color:rgba(85,214,190,.35);background:rgba(85,214,190,.06)}.shop-icon{font-size:2rem;width:48px;text-align:center}.shop-item-info{flex:1}.shop-item-info strong{display:block}.shop-item-info small{display:block;color:#9eacc0;margin-top:3px}.shop-buy-btn{border:1px solid rgba(255,209,102,.3);background:#282338;color:#ffd166;border-radius:10px;padding:10px 12px;font-weight:900;cursor:pointer;white-space:nowrap}.shop-buy-btn:hover:not(:disabled){filter:brightness(1.15)}.shop-buy-btn:disabled{opacity:.5;cursor:default}
    @media(max-width:620px){.shop-card{padding:20px 15px}.shop-header{align-items:flex-start}.shop-header h2{font-size:1.7rem}.shop-item{align-items:flex-start}.shop-buy-btn{font-size:.72rem}.shop-icon{font-size:1.6rem;width:35px}}
  `;
  document.head.appendChild(style);
}

function openShop() {
  renderShop();
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById("shopScreen").classList.add("active");
}

function closeShop() {
  if (typeof updatePlayerUI === "function") updatePlayerUI();
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById("homeScreen").classList.add("active");
}

function setupShop() {
  injectShopStyles();
  document.getElementById("shopBtn").addEventListener("click", openShop);
  document.getElementById("closeShopBtn").addEventListener("click", closeShop);
  document.getElementById("shopItems").addEventListener("click", event => {
    const button = event.target.closest("[data-shop-item]");
    if (button) buyItem(button.dataset.shopItem);
  });

  // v0.0.5: thưởng Coins sau mỗi ván hoàn thành. 1 Coin / 100 điểm, tối thiểu 1 Coin.
  const originalFinishGame = window.finishGame;
  if (typeof originalFinishGame === "function") {
    window.finishGame = function() {
      originalFinishGame();
      const score = Number(document.getElementById("finalScore")?.textContent || 0);
      const earned = Math.max(1, Math.floor(score / 100));
      addCoins(earned);
      const earnedEl = document.getElementById("earnedCoins");
      if (earnedEl) earnedEl.textContent = earned;
      renderShop();
    };
  }

  renderShop();
}

document.addEventListener("DOMContentLoaded", setupShop);
