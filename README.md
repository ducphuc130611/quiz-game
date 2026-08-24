# Quiz Game

**Version:** v0.0.5

Game quiz trắc nghiệm chạy hoàn toàn trên trình duyệt và sẵn sàng cho GitHub Pages.

## v0.0.5 — Shop System

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
- 💾 Coins và vật phẩm đã mua được lưu bằng `localStorage`.
- Chọn chủ đề: Tổng hợp, Khoa học, Địa lý, Lịch sử, Công nghệ.
- Trộn câu hỏi và đáp án theo mỗi ván.
- Hiển thị đáp án đúng khi trả lời sai hoặc hết giờ.
- Giao diện responsive cho máy tính và điện thoại.
- Không cần backend hoặc thư viện ngoài.

## Coin Economy v0.0.5

Sau mỗi ván hoàn thành:

```text
Coins nhận được = max(1, floor(score / 100))
```

Ví dụ: 850 điểm → 8 Coins.

## Shop Items

- 🎖️ Starter Badge — 50 Coins
- 🔥 Fire Badge — 100 Coins
- ⚡ Speed Badge — 150 Coins
- 👑 Gold Badge — 300 Coins
- 💎 Legend Badge — 500 Coins

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
└── README.md
```

## Roadmap

- v0.0.6: Profile.
- v0.0.7: Leaderboard.
- v1.0.0: Release chính thức.
