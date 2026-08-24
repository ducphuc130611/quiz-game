# Quiz Game

**Version:** v5.4.0 — SECURITY & ONLINE HARDENING 🛡️🌐

Quiz Game chạy trên trình duyệt, tối ưu cho GitHub Pages, PWA/offline-first. v5.4.0 củng cố backend online bằng security headers, CORS allowlist, rate limiting riêng cho authentication, login lockout, session revocation, password change và validation dữ liệu sync.

## v5.4.0 — SECURITY & ONLINE HARDENING

### 🛡️ Backend Security

- Security response headers.
- `X-Powered-By` disabled.
- Configurable `CORS_ORIGIN` allowlist.
- 128 KB JSON request limit.
- Authentication rate limit.
- Temporary login lockout after repeated failures.
- Constant-time password hash comparison.
- `POST /auth/logout-all` để thu hồi toàn bộ session.
- `POST /auth/change-password` để đổi mật khẩu và thu hồi các session khác.
- Server-side bounds cho synced score/correct/total.
- Generic 500 errors không trả chi tiết exception.
- Cleanup session/rate-limit state định kỳ.

### 🔐 Account System

Backend hỗ trợ:

- `POST /auth/register` — tạo tài khoản.
- `POST /auth/login` — đăng nhập và nhận session token.
- `GET /auth/me` — kiểm tra tài khoản hiện tại.
- `POST /auth/logout` — thu hồi session hiện tại.
- `POST /auth/logout-all` — thu hồi mọi session.
- `POST /auth/change-password` — đổi mật khẩu.
- `POST /players/sync` — yêu cầu authentication và chỉ cho phép đồng bộ Player ID thuộc tài khoản.
- `GET /leaderboard` — leaderboard online theo tổng điểm.

Mật khẩu **không được lưu dạng plaintext**. Server dùng Node.js `scrypt` + salt và token session ngẫu nhiên được lưu dưới dạng SHA-256 hash.

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

`CORS_ORIGIN` nên được cấu hình thành allowlist cụ thể khi deploy. Chỉ bật `TRUST_PROXY=1` khi backend thực sự nằm sau reverse proxy đáng tin cậy.

### Kết nối frontend

```js
QuizOnline.configure("http://localhost:3000");
```

Sau đó mở **🌐 ONLINE**, tạo tài khoản/đăng nhập rồi `SYNC NOW` để đồng bộ pending queue.

### 💾 Offline-first

Không có backend vẫn chơi được. Pending events tiếp tục được giữ local; cloud sync chỉ hoạt động khi có API endpoint và tài khoản đã xác thực.

### ⚠️ Giới hạn v5.4.0

Đây là **security hardening foundation**, chưa phải hệ thống production hoàn chỉnh. JSON database vẫn là development-scale storage. Trước khi mở ranked competition công khai cần database production, HTTPS deployment, email verification, password reset, persistent/distributed rate limiting, audit logs, backups, monitoring, secret management và server-authoritative scoring/anti-cheat.

GitHub Pages chỉ host frontend; backend phải được deploy riêng.

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
- ❤️ Health check với persistence status.

## v5.1.0 — ONLINE SERVER KIT

- 🌐 Runnable Node.js API.
- ❤️ Health Check.
- ☁️ Player Sync API.
- 🏆 Online Leaderboard Foundation.
- 📚 Backend documentation.

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

- `manifest.json` lên v5.4.0.
- Service Worker dùng cache cần được bump lên v5.4.0 khi frontend cache được cập nhật.
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
│   ├── db.json
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
- v5.1.0: Online Server Kit — Runnable Node.js API + Health Check + Player Sync + Online Leaderboard Foundation
- v5.2.0: Persistent Online — JSON Database + Score Leaderboard + Persistent Player Statistics
- v5.3.0: Authenticated Online — Accounts + Password Hashing + Sessions + Protected Sync
- **v5.4.0: Security & Online Hardening — CORS Allowlist + Security Headers + Login Lockout + Session Revocation + Password Change + Sync Validation**
