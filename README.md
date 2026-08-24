# Quiz Game

**Version:** v2.0.0 — The Big Update 🚀

Quiz Game chạy trên trình duyệt, tối ưu cho GitHub Pages, có PWA/offline cache và nay có nhiều chế độ chơi cùng hệ thống Power-up, Daily Quest và tiến trình mở rộng.

## v2.0.0 — THE BIG UPDATE

### 🎮 Game Modes

- 🎯 **Classic:** 10 câu, 15 giây/câu.
- 💀 **Hard Mode:** 10 câu, 12 giây/câu, điểm cơ bản được nhân 1.5.
- 🛡️ **Survival:** tối đa 20 câu, sai một lần sẽ kết thúc ván.
- 🔥 **Combo Rush:** 12 câu, 10 giây/câu, ưu tiên xây combo.
- ⏱️ **Time Attack:** 60 giây, trả lời càng nhiều càng tốt.
- 📅 **Daily Challenge:** bộ câu hỏi được trộn theo ngày và có thưởng tiến trình Daily.

### 🧩 Power-ups

- 💡 **50/50:** loại 2 đáp án sai.
- ⏸️ **Freeze:** đóng băng thời gian 5 giây.
- ✖️ **Double:** nhân đôi điểm của câu đúng tiếp theo.
- 🛡️ **Shield:** bảo vệ một lần sai hoặc hết giờ.
- 🔄 **Reroll:** đổi câu hỏi hiện tại.

Power-up có số lượng riêng, được lưu trong hệ thống save v2 và không thể dùng khi đáp án đã bị khóa.

### 🎯 Daily Quest

Mỗi ngày có 4 mục tiêu:

- Chơi 2 ván.
- Trả lời đúng 15 câu.
- Đạt combo 5.
- Tích lũy 1.000 điểm.

Hoàn thành Daily Quest nhận **+100 XP, +100 Coins, 1 Double Power-up và 1 Freeze Power-up**, đồng thời tăng Daily Streak.

### 💾 Central v2 Save

`v2-system.js` quản lý dữ liệu v2 trong một save riêng:

- Power-ups.
- Mode statistics.
- Daily Challenge.
- Daily Quest.
- Streak.
- Theme state.
- Save version/migration-ready structure.

Dữ liệu v0.x/v1.x vẫn được giữ nguyên để không làm mất XP, Coins, Profile, Achievement hoặc Leaderboard cũ.

### 🔥 Hệ thống cũ vẫn giữ nguyên

- Core Quiz.
- Combo + Bonus.
- XP + Level + Rank.
- Achievement.
- Coins + Shop.
- Profile.
- Local Leaderboard.
- Lifetime Statistics.
- Keyboard Controls.
- PWA + Offline cache.

### 🌎 Question Categories

- Tổng hợp.
- Khoa học.
- Địa lý.
- Lịch sử.
- Công nghệ.

### 📱 PWA / Offline

- Có `manifest.json`.
- Có Service Worker.
- Cache được version hóa thành `quiz-game-v2.0.0`.
- Có thể tiếp tục mở game khi mất mạng sau khi cache thành công.

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

Có thể mở `index.html` trực tiếp để chơi. PWA/Service Worker cần HTTPS hoặc localhost theo trình duyệt.

## GitHub Pages

1. Vào repository trên GitHub.
2. Mở **Settings → Pages**.
3. Chọn **Deploy from a branch**.
4. Chọn branch `main` và thư mục `/ (root)`.
5. Lưu và chờ GitHub Pages triển khai.

## Cấu trúc

```text
quiz-game/
├── index.html
├── style.css
├── script.js
├── questions.js
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
- **v2.0.0: The Big Update — Game Modes + Power-ups + Daily Quest + Central v2 Save**
