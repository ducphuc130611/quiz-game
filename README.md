# Quiz Game

**Version:** v5.5.0 — GLOBAL LEADERBOARD 🌍🏆

Quiz Game chạy trên trình duyệt, tối ưu cho GitHub Pages, PWA/offline-first. v5.5.0 mở rộng Online Foundation thành Global Leaderboard với phân trang, season filter, player rank và giao diện bảng xếp hạng online.

## v5.5.0 — GLOBAL LEADERBOARD

### 🌍 Global Ranking

- `GET /leaderboard/global` — bảng xếp hạng công khai.
- Pagination tối đa 100 người/trang.
- `season` filter cho all-time hoặc season cụ thể.
- Score, best score, games và accuracy.
- `GET /leaderboard/me` — thứ hạng của tài khoản đang đăng nhập.
- `GET /leaderboard/seasons` — danh sách season có dữ liệu.
- Global Leaderboard UI ngay trên trang chủ.
- Offline vẫn chơi bình thường; Global Leaderboard yêu cầu backend online.

### 🔐 Authentication vẫn giữ nguyên

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`
- `POST /auth/logout-all`
- `POST /auth/change-password`
- `POST /players/sync`

Mật khẩu không lưu plaintext. Server dùng Node.js `scrypt` + salt; session token được lưu dưới dạng SHA-256 hash.

### 🛡️ Security

- Security response headers.
- `X-Powered-By` disabled.
- Configurable `CORS_ORIGIN` allowlist.
- 128 KB JSON request limit.
- Authentication rate limit.
- Temporary login lockout.
- Constant-time password hash comparison.
- Server-side bounds cho synced score/correct/total.
- Generic 500 errors.

### Chạy backend

```text
cd backend
npm install
npm start
```

Mặc định server chạy ở port `3000`.

### Environment

```text
PORT=3000
CORS_ORIGIN=https://your-github-pages-site.example
TRUST_PROXY=1
```

### Kết nối frontend

```js
QuizOnline.configure("http://localhost:3000");
```

Sau đó mở **🌐 ONLINE**, đăng nhập và dùng **🌍 GLOBAL LEADERBOARD**.

### 💾 Offline-first

Không có backend vẫn chơi được. Global Leaderboard chỉ là lớp online bổ sung và không thay thế local game/save.

## ⚠️ Giới hạn v5.5.0

Đây là **Global Leaderboard foundation**, chưa phải hệ thống competitive production hoàn chỉnh. Dữ liệu vẫn dùng JSON development-scale; score hiện vẫn bắt nguồn từ client sync nên **chưa thể coi là anti-cheat/server-authoritative scoring**. Trước khi mở ranked competition quy mô lớn cần database production, HTTPS, persistent/distributed rate limiting, audit logs, backups, monitoring, secret management và server-authoritative match validation.

GitHub Pages chỉ host frontend; backend phải được deploy riêng.

## v5.4.0 — SECURITY & ONLINE HARDENING

- 🛡️ Security headers, CORS allowlist, rate limiting.
- 🔐 Login lockout, session revocation, password change.
- 📊 Sync validation.
- 🧹 Session/rate-limit cleanup.

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

- Manifest và Service Worker đã bump lên v5.5.0.
- `global-leaderboard.js` được cache offline.
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
- Node.js `crypto.scrypt`
- Session tokens
- JSON persistent storage (development-scale)

## Cấu trúc

```text
quiz-game/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── global-leaderboard.js
│   ├── db.json
│   └── README.md
├── index.html
├── style.css
├── supermajor.css
├── supermajor4.css
├── supermajor.js
├── supermajor4.js
├── online.js
├── global-leaderboard.js
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

Frontend deploy bình thường từ branch `main` và `/ (root)`. Backend không chạy trên GitHub Pages; deploy thư mục `backend` lên Node.js hosting riêng rồi cấu hình API URL cho frontend.

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
- v5.1.0: Online Server Kit — Runnable Node.js API + Health Check + Player Sync + Online Leaderboard Foundation
- v5.2.0: Persistent Online — JSON Database + Score Leaderboard + Persistent Player Statistics
- v5.3.0: Authenticated Online — Accounts + Password Hashing + Sessions + Protected Sync
- v5.4.0: Security & Online Hardening — CORS Allowlist + Security Headers + Login Lockout + Session Revocation + Password Change + Sync Validation
- **v5.5.0: Global Leaderboard — Global Ranking + Pagination + Season Filters + Player Rank + Online Leaderboard UI**
