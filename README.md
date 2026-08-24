# Quiz Game

**Version:** v1.0.2 — Statistics Update 🚀

Game quiz trắc nghiệm chạy trên trình duyệt, tối ưu cho GitHub Pages và có thể cài đặt như một web app.

## v1.0.2 — Statistics Update

Bản cập nhật này bổ sung hệ thống **Lifetime Statistics**, giúp người chơi theo dõi tiến trình dài hạn ngay trong Profile.

### Lifetime Statistics

- 📊 Tổng số ván đã chơi.
- ❓ Tổng số câu hỏi đã trả lời.
- ✅ Tổng số câu đúng.
- 🎯 Độ chính xác tổng thể.
- 💯 Tổng điểm tích lũy.
- 🏆 Điểm cao nhất.
- 🎯 Độ chính xác tốt nhất trong một ván.
- 🔥 Combo cao nhất.
- ⚡ Speed Bonus cao nhất.
- 💾 Dữ liệu được lưu bằng `localStorage`.

### Keyboard Controls

- ⌨️ Phím `1` chọn đáp án A.
- ⌨️ Phím `2` chọn đáp án B.
- ⌨️ Phím `3` chọn đáp án C.
- ⌨️ Phím `4` chọn đáp án D.
- ⏎ `Enter` bắt đầu game từ trang chủ hoặc chơi lại từ màn hình kết quả.
- ⎋ `Esc` đóng Shop, Profile hoặc Leaderboard và quay về trang chủ.

### Core Quiz

- 10 câu hỏi mỗi ván.
- 15 giây cho mỗi câu.
- 100 điểm cơ bản cho mỗi câu đúng.
- Chọn chủ đề: Tổng hợp, Khoa học, Địa lý, Lịch sử, Công nghệ.
- Trộn câu hỏi và đáp án theo mỗi ván.
- Hiển thị đáp án đúng khi trả lời sai hoặc hết giờ.
- Giao diện responsive cho máy tính và điện thoại.

### Combo & Bonus

- 🔥 Combo liên tiếp tăng hệ số điểm.
- ⚡ Speed Bonus tối đa 50 điểm.
- 🎁 Combo Bonus.
- Combo reset khi trả lời sai hoặc hết giờ.

### XP, Level & Rank

- ⭐ XP cho câu trả lời đúng và hoàn thành ván.
- 📈 Level tối đa 100.
- 🏅 Rank từ NEWCOMER đến LEGEND.
- 🎉 Thông báo Level Up.
- 📊 Thanh XP.

### Achievement

- 🏆 10 thành tích.
- 🔒 Thành tích chưa mở khóa.
- 💾 Tiến độ lưu bằng `localStorage`.

### Shop & Coins

- 🪙 Coins nhận được sau mỗi ván.
- 🛒 Shop với 5 vật phẩm.
- 💾 Vật phẩm đã mua được lưu trên trình duyệt.

### Profile

- 👤 Tên người chơi tối đa 16 ký tự.
- 🎭 8 avatar.
- ⭐ Level và Rank.
- 📊 XP.
- 🎮 Số ván đã chơi.
- 🏆 High Score.
- 🏅 Achievement progress.
- 🪙 Coins và số item đã mua.
- 📊 Lifetime Statistics.

### Leaderboard

- 🏆 Top 10 điểm số.
- 🥇🥈🥉 Huy chương cho Top 3.
- 👤 Tên người chơi.
- 🎯 Số câu đúng.
- 📊 Độ chính xác.
- 📅 Ngày chơi.
- 💾 Lưu bằng `localStorage`.

> **Lưu ý:** Leaderboard hiện là local leaderboard. Dữ liệu chỉ tồn tại trên trình duyệt hiện tại và chưa đồng bộ giữa nhiều người chơi.

### Installable & Offline Ready

- 📱 Có `manifest.json` để hỗ trợ cài đặt như web app.
- 📦 Có Service Worker để cache các file game.
- 📴 Sau khi cache thành công, game có thể tiếp tục mở khi mất mạng.
- 🔄 Cache được version hóa theo `v1.0.2`.

## Công nghệ

- HTML5
- CSS3
- JavaScript thuần
- Service Worker API
- Web App Manifest
- Không cần backend.
- Không dùng thư viện ngoài.
- Chạy được trên GitHub Pages.

## Chạy local

Có thể mở `index.html` trực tiếp để chơi. Tính năng Service Worker/PWA cần môi trường HTTPS hoặc localhost theo quy định của trình duyệt.

## GitHub Pages

1. Vào repository trên GitHub.
2. Mở **Settings → Pages**.
3. Ở **Build and deployment**, chọn **Deploy from a branch**.
4. Chọn branch `main` và thư mục `/ (root)`.
5. Lưu lại và chờ GitHub Pages triển khai.

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
- **v1.0.2: Statistics Update + Lifetime Player Stats**
