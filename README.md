# Quiz Game

**Version:** v0.0.2

Game quiz trắc nghiệm kiến thức tổng hợp chạy hoàn toàn trên trình duyệt.

## Tính năng v0.0.2

- 10 câu hỏi mỗi ván.
- 15 giây cho mỗi câu.
- 100 điểm cơ bản cho mỗi câu đúng.
- 🔥 Combo liên tiếp tăng hệ số điểm:
  - 1 đúng: x1
  - 2–3 đúng liên tiếp: x1.5
  - 4–5 đúng liên tiếp: x2
  - 6+ đúng liên tiếp: x3
- ⚡ Speed Bonus tối đa 50 điểm dựa trên thời gian còn lại.
- 🎁 Combo Bonus tăng thêm điểm theo chuỗi combo.
- Trả lời sai hoặc hết giờ sẽ reset combo về 0.
- Hiển thị combo, hệ số và bonus ngay trong trận.
- Hiển thị combo cao nhất và tổng bonus ở màn hình kết quả.
- Chọn chủ đề: Tổng hợp, Khoa học, Địa lý, Lịch sử, Công nghệ.
- Trộn câu hỏi và đáp án theo mỗi ván.
- Hiển thị đáp án đúng khi trả lời sai hoặc hết giờ.
- Tính số câu đúng, sai và phần trăm chính xác.
- Lưu kỷ lục bằng `localStorage`.
- Giao diện responsive cho máy tính và điện thoại.
- Không cần backend hoặc thư viện ngoài.

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
└── README.md
```

## Roadmap

- v0.0.3: XP và Level.
- v0.0.4: Achievement.
- v0.0.5: Shop.
- v0.0.6: Profile.
- v0.0.7: Leaderboard.
- v1.0.0: Release chính thức.
