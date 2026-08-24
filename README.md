# Quiz Game

**Version:** v3.0.0 — Super Major Update 🚀🌌

Quiz Game chạy trên trình duyệt, tối ưu cho GitHub Pages, có PWA/offline cache và một lớp meta-progression lớn giúp mỗi ván đóng góp vào hành trình dài hạn của người chơi.

## v3.0.0 — SUPER MAJOR UPDATE

### 🌌 Player Hub

Mở **SUPER HUB** ngay trên trang chủ để xem toàn bộ tiến trình:

- 📊 Lifetime game/correct/best score/best combo.
- 🏅 Dynamic Player Title với 10 danh hiệu.
- 🗺️ Campaign 30 chapters.
- 📚 Category Mastery cho 14 nhóm nội dung.
- 🗝️ Relic Collection gồm 25 relics.
- 📅 Weekly Mission progress.
- 📜 Recent Run History tối đa 30 ván.
- ⚙️ Sound, Reduced Motion và Save Export.

### 🗺️ Campaign

Hành trình 30 chapter tăng dần theo số ván và số câu đúng. Đây là lớp progression dài hạn độc lập với Level/XP hiện có.

### 📚 Category Mastery

Mỗi chủ đề có Mastery Level 0–10, dựa trên số câu đúng và số lần chơi. Người chơi có thể theo dõi accuracy, games và best score theo từng chủ đề.

### 🗝️ Relic Collection

25 relics để sưu tầm, từ Common milestones đến các mốc chuyên biệt:

- Combo
- Speed
- XP
- Level
- Categories
- Daily Challenge
- Streak
- Score
- Content specialization

### 🏅 Player Titles

Danh hiệu tự động mở khóa theo thành tích:

Rookie → Explorer → Scholar → Speedrunner → Combo Master → Quiz Master → Veteran → Legend → Completionist → Prestige.

### 📅 Weekly Missions

Theo dõi bốn mục tiêu mỗi tuần:

- Chơi 5 ván.
- Đúng 40 câu.
- Kiếm 5.000 điểm.
- Đạt combo 10.

### 📜 Run History

Lưu 30 ván gần nhất với:

- điểm
- đúng/sai
- combo
- category
- mode
- ngày chơi

### 💾 Super Save Layer

Dữ liệu Super Major nằm trong `quizGame_v300_super`, tách khỏi save cũ để giảm nguy cơ phá dữ liệu v1/v2. Có reset riêng và export JSON.

## 📚 Content Base

- **124+ câu hỏi**.
- **15 chủ đề:** Tổng hợp, Khoa học, Địa lý, Lịch sử, Công nghệ, Toán, Sinh học, Vật lý, Hóa học, Vũ trụ, Văn hóa, Thể thao, Văn học, Việt Nam và Logic.
- Content pack độc lập `expansion-content.js` bổ sung vào `QUESTION_BANK`.

## 🎮 Game Modes

- 🎯 Classic
- 💀 Hard Mode
- 🛡️ Survival
- 🔥 Combo Rush
- ⏱️ Time Attack
- 📅 Daily Challenge

## 🧩 Power-ups

- 💡 50/50
- ⏸️ Freeze
- ✖️ Double
- 🛡️ Shield
- 🔄 Reroll

## 🎯 Existing Progression

- XP + Level + Rank
- Combo + Bonus
- Achievement
- Coins + Shop
- Profile
- Lifetime Statistics
- Local Leaderboard
- Daily Quest + Daily Streak

## 📱 PWA / Offline

- `manifest.json` đã lên v3.0.0.
- Service Worker dùng cache `quiz-game-v3.0.0`.
- `supermajor.js` và `supermajor.css` được cache để Player Hub hoạt động offline.

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
├── supermajor.js
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
- **v3.0.0: Super Major Update — Player Hub + Campaign + Mastery + Relics + Weekly Missions + History + Settings**
