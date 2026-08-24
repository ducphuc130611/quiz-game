# Quiz Game

**Version:** v5.7.0 — PRODUCTION READINESS 🧪🛡️

Quiz Game chạy trên trình duyệt, tối ưu cho GitHub Pages, PWA/offline-first. v5.7.0 bổ sung lớp kiểm tra tự động cho backend: syntax validation, smoke test, CI trên GitHub Actions và environment template để chuẩn bị cho hạ tầng production.

## v5.7.0 — PRODUCTION READINESS

### 🧪 Backend CI

- GitHub Actions workflow tại `.github/workflows/backend-ci.yml`.
- Chạy tự động khi push vào `main` và khi mở Pull Request.
- Cài dependencies bằng `npm install`.
- Kiểm tra syntax toàn bộ backend quan trọng.
- Khởi động server và chạy smoke test `/health`.

### ❤️ Health / Smoke Test

`backend/smoke-test.js` kiểm tra server có khởi động được và health payload có các trường nền tảng cần thiết.

Chạy local:

```text
cd backend
npm install
npm run check
npm run smoke
```

### ⚙️ Environment Template

File `backend/.env.example` cung cấp cấu hình mẫu:

```text
PORT=3000
CORS_ORIGIN=https://your-github-pages-site.example
TRUST_PROXY=0
```

Không commit secrets thật vào repository.

### 🎯 Mục tiêu của v5.7.0

Bản này không giả vờ rằng backend JSON hiện tại đã trở thành production database. Thay vào đó, nó tạo một quality gate để những thay đổi tiếp theo không dễ dàng làm hỏng backend trước khi chuyển sang database production.

## v5.6.0 — SERVER-AUTHORITATIVE RANKED

- `POST /runs/start` — server tạo ranked run và phát câu hỏi.
- `POST /runs/:runId/answer` — server kiểm tra question ID, answer và elapsed time.
- `POST /runs/:runId/finish` — server tính kết quả cuối cùng và lưu event authoritative.
- Client không được tự gửi score để quyết định điểm ranked.
- Server giữ đáp án đúng của ranked question bank.
- Run có expiry, nonce và duplicate-answer protection.

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
│   ├── db.json
│   └── README.md
├── index.html
├── online.js
├── global-leaderboard.js
├── ranked-online.js
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
- **v5.7.0: Production Readiness — Backend CI + Syntax Checks + Smoke Test + Environment Template**
