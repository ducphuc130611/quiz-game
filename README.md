# Quiz Game

**Version:** v5.0.0 — Online Foundation 🌐🚀

Quiz Game chạy trên trình duyệt, tối ưu cho GitHub Pages, PWA/offline-first. v5.0.0 bổ sung **Online Foundation**: định danh người chơi, Player ID ổn định, hàng đợi đồng bộ, cloud adapter và Online Hub, trong khi game vẫn chơi đầy đủ khi offline.

## v5.0.0 — ONLINE FOUNDATION

### 🌐 Online Hub

Trang chủ có nút **ONLINE** để quản lý danh tính online:

- 🆔 Player ID duy nhất.
- 👤 Username tối đa 16 ký tự.
- ☁️ Sync Now qua API backend tùy cấu hình.
- 📦 Export Online Profile để backup.
- 📡 Pending Sync Queue giữ các sự kiện chưa đồng bộ.
- 🟢 Connected / 🟠 Retry / ⚪ Offline-first status.

### ☁️ Cloud Adapter

`online.js` cung cấp API adapter:

- `QuizOnline.sync()` — đồng bộ dữ liệu đang chờ.
- `QuizOnline.queue(type, payload)` — xếp sự kiện vào hàng đợi.
- `QuizOnline.configure(apiBase)` — cấu hình URL backend.
- `QuizOnline.isConfigured()` — kiểm tra backend đã cấu hình hay chưa.

Endpoint sync dự kiến:

```text
POST <API_BASE>/players/sync
```

Payload gồm Player ID, username và các sự kiện đang chờ.

> **Lưu ý kiến trúc:** GitHub Pages chỉ host frontend tĩnh, vì vậy v5.0.0 đã chuẩn bị đầy đủ lớp client/backend adapter nhưng **chưa tự tạo một server cloud thật**. Khi có backend, chỉ cần cấu hình `QuizOnline.configure("https://your-api.example")`. Không giả mạo leaderboard online khi chưa có server.

### 🛡️ Offline-first

Nếu không có backend:

- Game vẫn hoạt động bình thường.
- Player ID vẫn được lưu local.
- Sự kiện được đưa vào pending queue.
- Có thể export profile.
- Không mất gameplay vì lỗi mạng.

### 💾 Save Isolation

v5 dùng các key riêng:

- `quizGame_v500_online`
- `quizGame_v500_config`

Không ghi đè trực tiếp save v4/v3/v2.

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
- Content pack độc lập `expansion-content.js` bổ sung vào `QUESTION_BANK`.

## 📱 PWA / Offline

- `manifest.json` lên v5.0.0.
- Service Worker dùng cache `quiz-game-v5.0.0`.
- Online Foundation cũng được cache để Online Hub hoạt động offline.

## Công nghệ

- HTML5
- CSS3
- JavaScript thuần
- LocalStorage
- Fetch API
- Web Crypto API
- Service Worker API
- Web App Manifest
- Không cần backend để chơi.
- Không dùng thư viện ngoài.
- Chạy được trên GitHub Pages.

## Chạy local

Mở `index.html` để chơi. PWA/Service Worker cần HTTPS hoặc localhost theo trình duyệt.

## GitHub Pages

1. Vào **Settings → Pages**.
2. Chọn **Deploy from a branch**.
3. Chọn branch `main` và `/ (root)`.
4. Save và chờ GitHub Pages deploy.

## Cấu trúc

```text
quiz-game/
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
- **v5.0.0: Online Foundation — Player Identity + Player ID + Cloud Adapter + Sync Queue + Online Hub + Offline-first Architecture**
