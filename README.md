# Quiz Game

**Version:** v4.0.0 — Super Major II 🚀🌠

Quiz Game chạy trên trình duyệt, tối ưu cho GitHub Pages, PWA/offline-first và giờ có thêm một lớp **Season Meta** phía trên toàn bộ progression cũ.

## v4.0.0 — SUPER MAJOR II

### 🌠 Season HQ

Mở **SEASON HQ** ngay trên trang chủ để quản lý hệ thống endgame mới:

- 🏅 Ranked Rating: từ 800–2500.
- 🥉 Bronze → 🥈 Silver → 🥇 Gold → 💠 Platinum → 💎 Diamond → 👑 Master → 🌌 Grandmaster.
- 🏆 Weekly Tournament Score.
- 📅 Daily Event Progress.
- 🎁 Loot Vault gồm 12 vật phẩm sưu tầm.
- 🏅 10 Seasonal Badges.
- 📖 Quiz Codex gồm 12 discoveries.
- 📜 Ranked Run History tối đa 20 lượt.
- ⭐ Season XP.

### 🏅 Ranked Rating

Mỗi ván hoàn thành tạo ra thay đổi Rating dựa trên điểm số và kết quả. Rating được giới hạn để tránh tăng vô hạn và xác định Division hiện tại.

### 🏆 Weekly Tournament

Mỗi tuần có một bảng điểm tournament cục bộ:

- Tournament Runs
- Wins
- Weekly Score
- Best Run

Dữ liệu reset theo tuần, nhưng Rating và bộ sưu tập mùa vẫn được giữ.

### 🌠 Daily Event

Mỗi ngày có một event progress riêng. Hoàn thành 100% sẽ mở khóa phần thưởng gồm Season XP và loot.

### 🎁 Loot Vault

12 loot items được mở ngẫu nhiên qua các ván và event. Collection được lưu độc lập với Shop và Relics của v3.

### 📖 Quiz Codex

12 discovery milestones theo dõi các mốc lớn như:

- 10 runs
- 100 speed bonus
- Combo 15
- Survival
- 250 câu đúng
- 10.000 điểm
- 5 loot
- 10 tournament runs
- Rating 1250/1500
- Daily Event
- 5.000 Season XP

### 🏅 Seasonal Badges

10 badge milestones tự động mở khóa theo Rating, Tournament, Event, Loot và Season XP.

### 💾 Save Isolation

v4 dùng key riêng `quizGame_v400_super2`, không ghi đè trực tiếp save v3/v2. Hệ thống tự reset phần dữ liệu theo mùa/tuần/ngày khi bước sang chu kỳ mới.

## v3.0.0 + Existing Systems

Toàn bộ hệ thống cũ vẫn được giữ:

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

- `manifest.json` lên v4.0.0.
- Service Worker dùng cache `quiz-game-v4.0.0`.
- `supermajor4.js` và `supermajor4.css` được cache để Season HQ hoạt động offline.

## Công nghệ

- HTML5
- CSS3
- JavaScript thuần
- LocalStorage
- Service Worker API
- Web App Manifest
- Không cần backend.
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
- **v4.0.0: Super Major II — Seasons + Ranked Rating + Weekly Tournament + Daily Event + Loot Vault + Seasonal Badges + Quiz Codex**
