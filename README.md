# Quiz Game

**Version:** v5.1.0 — ONLINE SERVER KIT 🌐🚀

Quiz Game chạy trên trình duyệt, tối ưu cho GitHub Pages, PWA/offline-first. v5.1.0 mở rộng Online Foundation thành một **backend kit chạy được bằng Node.js**, có health check, player sync và online leaderboard foundation. Frontend vẫn chơi offline nếu không cấu hình server.

## v5.1.0 — ONLINE SERVER KIT

### 🌐 Runnable Online API

Thư mục `backend/` chứa server Node.js/Express tùy chọn:

- `GET /health` — kiểm tra server.
- `POST /players/sync` — nhận Player ID, username và pending events.
- `GET /leaderboard` — trả về bảng xếp hạng hoạt động online hiện tại.

Chạy:

```text
cd backend
npm install
npm start
```

Mặc định server chạy ở port `3000`.

### ☁️ Kết nối frontend

`online.js` đã có adapter:

```js
QuizOnline.configure("http://localhost:3000");
```

Sau đó `QuizOnline.sync()` có thể gửi pending queue tới `/players/sync`.

### ⚠️ Giới hạn v5.1.0

Backend hiện dùng `Map` trong RAM để làm nền tảng phát triển. Restart server sẽ xóa dữ liệu online. Đây **chưa phải production backend**. Trước khi public cần thêm database, authentication, rate limiting, HTTPS, validation và persistent leaderboard.

GitHub Pages vẫn chỉ host frontend; server phải được deploy riêng.

## v5.0.0 — ONLINE FOUNDATION

- 🆔 Player ID duy nhất.
- 👤 Username tối đa 16 ký tự.
- ☁️ Cloud sync adapter.
- 📦 Export Online Profile.
- 📡 Pending Sync Queue.
- 🟢 Connected / 🟠 Retry / ⚪ Offline-first status.
- 💾 Save isolation.

## v4.0.0 — SUPER MAJOR II

- 🏅 Ranked Rating 800–2500.
- 🥉 Bronze → 🥈 Silver → 🥇 Gold → 💠 Platinum → 💎 Diamond → 👑 Master → 🌌 Grandmaster.
- 🏆 Weekly Tournament.
- 📅 Daily Event.
- 🎁 Loot Vault 12 items.
- 🏅 Seasonal Badges.
- 📖 Quiz Codex.
- 📜 Ranked Run History.
- ⭐ Season XP.

## v3.0.0 + Existing Systems

- 🌌 Player Hub
- 🗺️ Campaign 30 chapters
- 📚 Category Mastery
- 🗝️ 25 Relics
- 📅 Weekly Missions
- 📜 Run History
- ⚙️ Settings + Save Export
- 🎮 6 Game Modes
- 🧩 Power-ups
- 🎯 Daily Quest + Streak
- ⭐ XP + Level + Rank
- 🔥 Combo + Bonus
- 🏆 Achievements
- 🪙 Coins + Shop
- 👤 Profile
- 🏅 Local Leaderboard
- 📊 Lifetime Statistics

## 📚 Content Base

- **124+ câu hỏi**.
- **15 chủ đề:** Tổng hợp, Khoa học, Địa lý, Lịch sử, Công nghệ, Toán, Sinh học, Vật lý, Hóa học, Vũ trụ, Văn hóa, Thể thao, Văn học, Việt Nam và Logic.

## 📱 PWA / Offline

- `manifest.json` lên v5.1.0.
- Service Worker dùng cache `quiz-game-v5.1.0`.
- Game vẫn chơi được khi backend offline hoặc chưa cấu hình.

## Công nghệ

### Frontend

- HTML5
- CSS3
- JavaScript thuần
- LocalStorage
- Fetch API
- Web Crypto API
- Service Worker API
- Web App Manifest

### Optional Backend

- Node.js 18+
- Express
- CORS
- In-memory Map (development only)

## Cấu trúc

```text
quiz-game/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── README.md
├── index.html
├── style.css
├── supermajor.css
├── supermajor4.css
├── supermajor.js
├── supermajor4.js
├── online.js
├── script.js
├── questions.js
├── expansion-content.js
├── achievements.js
├── leaderboard.js
├── shop.js
├── profile.js
├── keyboard.js
├── stats.js
├── v2-system.js
├── manifest.json
├── sw.js
└── README.md
```

## GitHub Pages

Frontend vẫn deploy bình thường từ branch `main` và `/ (root)`. Backend không chạy trên GitHub Pages; hãy deploy thư mục `backend` lên một Node.js hosting riêng rồi cấu hình API URL cho frontend.

## Release History

- v0.0.1: Core Quiz
- v0.0.2: Combo + Bonus
- v0.0.3: XP + Level
- v0.0.4: Achievement
- v0.0.5: Shop
- v0.0.6: Profile
- v0.0.7: Leaderboard
- v1.0.0: Official Release + Installable/Offline Ready
- v1.0.1: Quality Update + Keyboard Controls
- v1.0.2: Statistics Update + Lifetime Player Stats
- v2.0.0: The Big Update — Game Modes + Power-ups + Daily Quest + Central v2 Save
- v2.1.0: Mega Content Update — 124+ Questions + 15 Categories
- v3.0.0: Super Major Update — Player Hub + Campaign + Mastery + Relics + Weekly Missions + History + Settings
- v4.0.0: Super Major II — Seasons + Ranked Rating + Weekly Tournament + Daily Event + Loot Vault + Seasonal Badges + Quiz Codex
- v5.0.0: Online Foundation — Player Identity + Player ID + Cloud Adapter + Sync Queue + Online Hub + Offline-first Architecture
- **v5.1.0: Online Server Kit — Runnable Node.js API + Health Check + Player Sync + Online Leaderboard Foundation**
