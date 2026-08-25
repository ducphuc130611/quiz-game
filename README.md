# Quiz Game

**Version:** v6.0.0 — ARENA & SOCIAL HUB ⚔️🏆

Quiz Game chạy trên trình duyệt, tối ưu cho GitHub Pages, PWA/offline-first. v6.0.0 là major gameplay expansion: Arena battles, bot matchmaking, daily missions, Battle Pass XP, trophies, coins và match history.

## v6.0.0 — ARENA & SOCIAL HUB

### ⚔️ Arena Hub

- Quick Match với 6 đối thủ có rating/skill khác nhau.
- Trận đấu 5 câu hỏi.
- Tính điểm theo streak và độ chính xác.
- Bot phản hồi theo skill.
- Victory / Draw / Defeat.
- Arena Rating 700–3000.
- Coins và Battle Pass XP.
- Match history.

### 🎯 Daily Missions

- Play 3 Arena Games.
- Win 2 Arena Games.
- Answer 15 Questions.
- Nhận XP + coins.
- Reset theo ngày.

### 🎟️ Battle Pass

- Pass level.
- XP progression.
- Tự động tăng level.
- Reward milestones.

### 🏆 Trophy Room

- First Win.
- Win Streak 3.
- Rating 1200.
- Rating 1500.
- 10 Arena Games.
- Battle Pass milestones.
- Daily Hero.

### 🌐 Online-ready

Arena dùng local fallback để chơi ngay cả khi backend không khả dụng. Match event có thể được đưa vào `QuizOnline.queue()` để đồng bộ khi online layer được cấu hình.

**Lưu ý:** v6.0.0 chưa tuyên bố bot Arena là multiplayer PvP thật. PvP server-authoritative sẽ được xây trên nền Arena này ở các bản tiếp theo.

## v5.9.0 — REAL POSTGRESQL FOUNDATION

- PostgreSQL runtime adapter.
- Connection pool.
- Transaction helper.
- PostgreSQL schema cho accounts, players và sessions.
- JSON → PostgreSQL migration engine.
- `npm run migrate:postgres`.
- JSON runtime vẫn được giữ để tránh phá dữ liệu hiện có trong quá trình chuyển đổi.

## v5.7.0 — PRODUCTION READINESS

- GitHub Actions backend CI.
- Syntax validation.
- Health smoke test.
- Environment template.

## v5.6.0 — SERVER-AUTHORITATIVE RANKED

- Server tạo ranked run và phát câu hỏi.
- Server kiểm tra answer và elapsed time.
- Server tính kết quả cuối cùng.
- Client không được tự quyết định ranked score.
- Run expiry, nonce và duplicate-answer protection.

## v5.5.0 — GLOBAL LEADERBOARD

- 🌍 Global ranking.
- 📄 Pagination.
- 📅 Season filter.
- 👤 Player rank.
- 🏆 Online leaderboard UI.

## v5.4.0 — SECURITY & ONLINE HARDENING

- 🛡️ Security headers, CORS allowlist, rate limiting.
- 🔐 Login lockout, session revocation, password change.
- 📊 Sync validation.

## v5.3.0 — AUTHENTICATED ONLINE

- 👤 Accounts.
- 🔐 Password hashing.
- 🎟️ Session authentication.
- ☁️ Protected player sync.
- 🚪 Logout.

## v5.2.0 — PERSISTENT ONLINE

- ☁️ Persistent JSON database.
- 🏆 Score-based online leaderboard.
- 📊 Persistent player statistics.
- 🔄 Serialized database writes.

## v5.1.0 — ONLINE SERVER KIT

- 🌐 Runnable Node.js API.
- ❤️ Health Check.
- ☁️ Player Sync API.
- 🏆 Online Leaderboard Foundation.

## v5.0.0 — ONLINE FOUNDATION

- 🆔 Player ID.
- 👤 Username.
- ☁️ Cloud sync adapter.
- 📦 Export Online Profile.
- 📡 Pending Sync Queue.
- 🟢 Connected / 🟠 Retry / ⚪ Offline-first status.

## Existing Major Systems

### v4.0.0
- 🏅 Ranked Rating 800–2500.
- 🏆 Weekly Tournament.
- 📅 Daily Event.
- 🎁 Loot Vault.
- 🏅 Seasonal Badges.
- 📖 Quiz Codex.
- ⭐ Season XP.

### v3.0.0
- 🌌 Player Hub.
- 🗺️ Campaign 30 chapters.
- 📚 Category Mastery.
- 🗝️ Relics.
- 📅 Weekly Missions.
- 📜 Run History.
- ⚙️ Settings + Save Export.

### v2.x and earlier
- 🎮 Game Modes.
- 🧩 Power-ups.
- 🎯 Daily Quest + Streak.
- ⭐ XP + Level + Rank.
- 🔥 Combo + Bonus.
- 🏆 Achievements.
- 🪙 Coins + Shop.
- 👤 Profile.
- 📊 Lifetime Statistics.
- 📚 124+ questions across 15 categories.

## Backend

```text
cd backend
npm install
npm start
```

Mặc định server chạy port `3000`.

GitHub Pages chỉ host frontend; backend phải được deploy riêng.

## Cấu trúc mới

```text
quiz-game/
├── .github/
│   └── workflows/
│       └── backend-ci.yml
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── server.js
│   ├── smoke-test.js
│   ├── anti-cheat.js
│   ├── question-bank.js
│   ├── global-leaderboard.js
│   ├── postgres.js
│   ├── postgres-migrate.js
│   ├── schema.sql
│   ├── db.json
│   └── README.md
├── index.html
├── online.js
├── global-leaderboard.js
├── ranked-online.js
├── v6-arena.js
├── manifest.json
├── sw.js
└── ...
```

## Release History

- v0.0.1: Core Quiz
- v0.0.2: Combo + Bonus
- v0.0.3: XP + Level
- v0.0.4: Achievement
- v0.0.5: Shop
- v0.0.6: Profile
- v0.0.7: Leaderboard
- v1.0.0: Official Release
- v1.0.1: Keyboard Controls
- v1.0.2: Lifetime Statistics
- v2.0.0: Game Modes + Power-ups + Daily Quest
- v2.1.0: Mega Content Update — 124+ Questions + 15 Categories
- v3.0.0: Super Major — Player Hub + Campaign + Mastery + Relics + Missions
- v4.0.0: Super Major II — Ranked + Tournament + Events + Loot + Codex
- v5.0.0: Online Foundation
- v5.1.0: Online Server Kit
- v5.2.0: Persistent Online
- v5.3.0: Authenticated Online
- v5.4.0: Security & Online Hardening
- v5.5.0: Global Leaderboard
- v5.6.0: Server-Authoritative Ranked
- v5.7.0: Production Readiness
- v5.8.0: Database Infrastructure
- v5.9.0: Real PostgreSQL Foundation
- **v6.0.0: Arena & Social Hub — Major Gameplay Expansion**
