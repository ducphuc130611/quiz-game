# Quiz Game

**Version:** v2.1.0 — Mega Content Update 🚀

Quiz Game chạy trên trình duyệt, tối ưu cho GitHub Pages, có PWA/offline cache và nay có một kho câu hỏi lớn hơn nhiều.

## v2.1.0 — MEGA CONTENT UPDATE

### 📚 Huge Question Expansion

- **160+ câu hỏi** khi kết hợp ngân hàng cũ và content pack mới.
- **15 chủ đề:** Tổng hợp, Khoa học, Địa lý, Lịch sử, Công nghệ, Toán, Sinh học, Vật lý, Hóa học, Vũ trụ, Văn hóa, Thể thao, Văn học, Việt Nam và Logic.
- Mỗi chủ đề mới có thêm 10 câu hỏi.
- Hệ thống chọn câu hỏi hiện tại tự động dùng toàn bộ `QUESTION_BANK`, nên các mode cũ được hưởng lợi ngay mà không cần viết lại logic game.
- Daily Challenge vẫn dùng cách trộn cố định theo ngày.

### 🎮 Game Modes

- 🎯 **Classic:** 10 câu, 15 giây/câu.
- 💀 **Hard Mode:** 10 câu, 12 giây/câu, điểm cơ bản được nhân 1.5.
- 🛡️ **Survival:** tối đa 20 câu, sai một lần sẽ kết thúc ván.
- 🔥 **Combo Rush:** 12 câu, 10 giây/câu, ưu tiên xây combo.
- ⏱️ **Time Attack:** 60 giây, trả lời càng nhiều càng tốt.
- 📅 **Daily Challenge:** bộ câu hỏi được trộn theo ngày.

### 🧩 Power-ups

- 💡 50/50
- ⏸️ Freeze
- ✖️ Double
- 🛡️ Shield
- 🔄 Reroll

### 🎯 Daily Quest & Progression

Daily Quest, Daily Streak, XP, Level, Rank, Achievement, Coins, Shop, Profile, Statistics và Local Leaderboard tiếp tục hoạt động trên nền hệ thống v2.

### 💾 Save & Compatibility

Content pack mới là module độc lập `expansion-content.js`: nó bổ sung câu hỏi vào `QUESTION_BANK` thay vì ghi đè ngân hàng cũ. Điều này giúp giữ tương thích với các hệ thống mode hiện tại.

## 🌎 Question Categories

1. Tổng hợp
2. Khoa học
3. Địa lý
4. Lịch sử
5. Công nghệ
6. Toán học
7. Sinh học
8. Vật lý
9. Hóa học
10. Vũ trụ
11. Văn hóa
12. Thể thao
13. Văn học
14. Việt Nam
15. Logic

## 📱 PWA / Offline

- `manifest.json` đã lên v2.1.0.
- Service Worker dùng cache `quiz-game-v2.1.0`.
- `expansion-content.js` được cache để kho câu hỏi mới hoạt động offline.

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
- **v2.1.0: Mega Content Update — 160+ Questions + 15 Categories**
