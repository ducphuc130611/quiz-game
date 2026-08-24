# Quiz Game

**Version:** v0.0.6

Game quiz trắc nghiệm chạy hoàn toàn trên trình duyệt và sẵn sàng cho GitHub Pages.

## v0.0.6 — Profile System

- 10 câu hỏi mỗi ván.
- 15 giây cho mỗi câu.
- 100 điểm cơ bản cho mỗi câu đúng.
- 🔥 Combo liên tiếp tăng hệ số điểm.
- ⚡ Speed Bonus tối đa 50 điểm.
- 🎁 Combo Bonus.
- ⭐ XP + Level + Rank.
- 🏆 Achievement System với 10 thành tích.
- 🪙 Coin System: nhận Coins sau mỗi ván dựa trên điểm số.
- 🛒 Shop System với 5 vật phẩm.
- 👤 Profile System: tên người chơi, avatar và thống kê cá nhân.
- 📊 Profile hiển thị Level, Rank, XP, số ván, kỷ lục, Achievement, Coins và item đã mua.
- 💾 Profile được lưu bằng `localStorage` và không làm mất dữ liệu game.
- Chọn chủ đề: Tổng hợp, Khoa học, Địa lý, Lịch sử, Công nghệ.
- Trộn câu hỏi và đáp án theo mỗi ván.
- Hiển thị đáp án đúng khi trả lời sai hoặc hết giờ.
- Giao diện responsive cho máy tính và điện thoại.
- Không cần backend hoặc thư viện ngoài.

## Profile v0.0.6

Người chơi có thể:

- Đặt tên tối đa 16 ký tự.
- Chọn 1 trong 8 avatar.
- Xem Level và Rank.
- Theo dõi thanh XP.
- Xem số ván đã hoàn thành.
- Xem High Score.
- Xem tiến độ Achievement.
- Xem Coins và số item đã mua.
- Đổi tên/avatar mà không reset dữ liệu game.

## Chạy local

Mở `index.html` bằng trình duyệt là có thể chơi.

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
├── shop.js
├── profile.js
└── README.md
```

## Roadmap

- v0.0.7: Leaderboard.
- v1.0.0: Release chính thức.
