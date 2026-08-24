const QUESTION_BANK = [
  { category: "science", question: "Hành tinh nào gần Mặt Trời nhất?", answers: ["Sao Kim", "Sao Hỏa", "Sao Thủy", "Trái Đất"], correct: 2 },
  { category: "science", question: "Nước có công thức hóa học là gì?", answers: ["CO₂", "H₂O", "O₂", "NaCl"], correct: 1 },
  { category: "science", question: "Cơ quan nào bơm máu đi khắp cơ thể người?", answers: ["Phổi", "Gan", "Thận", "Tim"], correct: 3 },
  { category: "science", question: "Lực hút của Trái Đất lên một vật được gọi là gì?", answers: ["Trọng lực", "Lực ma sát", "Lực đàn hồi", "Lực đẩy"], correct: 0 },
  { category: "science", question: "Khí nào chiếm tỉ lệ lớn nhất trong khí quyển Trái Đất?", answers: ["Oxy", "Nitơ", "Carbon dioxide", "Hydro"], correct: 1 },
  { category: "geography", question: "Thủ đô của Nhật Bản là gì?", answers: ["Kyoto", "Osaka", "Tokyo", "Hiroshima"], correct: 2 },
  { category: "geography", question: "Châu lục nào có diện tích lớn nhất?", answers: ["Châu Phi", "Châu Á", "Châu Âu", "Bắc Mỹ"], correct: 1 },
  { category: "geography", question: "Đỉnh núi cao nhất thế giới là gì?", answers: ["K2", "Everest", "Lhotse", "Kangchenjunga"], correct: 1 },
  { category: "geography", question: "Việt Nam nằm ở khu vực nào của châu Á?", answers: ["Đông Á", "Tây Á", "Đông Nam Á", "Nam Á"], correct: 2 },
  { category: "geography", question: "Đại dương lớn nhất thế giới là gì?", answers: ["Đại Tây Dương", "Ấn Độ Dương", "Bắc Băng Dương", "Thái Bình Dương"], correct: 3 },
  { category: "history", question: "Ai là người đọc Tuyên ngôn Độc lập ngày 2/9/1945?", answers: ["Võ Nguyên Giáp", "Hồ Chí Minh", "Phan Bội Châu", "Trường Chinh"], correct: 1 },
  { category: "history", question: "Văn minh Ai Cập cổ đại phát triển chủ yếu bên dòng sông nào?", answers: ["Sông Nile", "Sông Hằng", "Sông Hoàng Hà", "Sông Amazon"], correct: 0 },
  { category: "history", question: "Chiến thắng Điện Biên Phủ diễn ra vào năm nào?", answers: ["1945", "1950", "1954", "1968"], correct: 2 },
  { category: "history", question: "Ai là vị vua đầu tiên của nhà Lý?", answers: ["Lý Thường Kiệt", "Lý Công Uẩn", "Lý Nhân Tông", "Lý Thánh Tông"], correct: 1 },
  { category: "history", question: "Thành Cổ Loa gắn với vị vua nào?", answers: ["An Dương Vương", "Đinh Tiên Hoàng", "Lê Lợi", "Quang Trung"], correct: 0 },
  { category: "technology", question: "HTML chủ yếu được dùng để làm gì?", answers: ["Tạo cấu trúc trang web", "Chỉnh sửa ảnh", "Quản lý cơ sở dữ liệu", "Biên dịch C++"], correct: 0 },
  { category: "technology", question: "JavaScript thường được dùng để làm gì trên web?", answers: ["Tạo tương tác và logic", "Chỉ lưu ảnh", "Thay thế hệ điều hành", "Tạo phần cứng"], correct: 0 },
  { category: "technology", question: "GitHub chủ yếu là nền tảng dành cho việc gì?", answers: ["Xem phim", "Lưu trữ và cộng tác mã nguồn", "Mua máy tính", "Chơi game"], correct: 1 },
  { category: "technology", question: "CSS có vai trò chính nào?", answers: ["Tạo cơ sở dữ liệu", "Tạo kiểu dáng giao diện", "Chạy máy chủ", "Biên dịch Java"], correct: 1 },
  { category: "technology", question: "Tên miền của GitHub Pages thường có dạng nào?", answers: ["github.io", "github.exe", "github.local", "github.app"], correct: 0 },
  { category: "science", question: "Âm thanh không thể truyền qua môi trường nào?", answers: ["Không khí", "Nước", "Thép", "Chân không"], correct: 3 },
  { category: "geography", question: "Sa mạc Sahara nằm ở châu lục nào?", answers: ["Châu Phi", "Châu Á", "Châu Úc", "Nam Mỹ"], correct: 0 },
  { category: "history", question: "Đế chế La Mã cổ đại có trung tâm là thành phố nào?", answers: ["Athens", "Rome", "Paris", "London"], correct: 1 },
  { category: "technology", question: "JSON thường được sử dụng để làm gì?", answers: ["Trao đổi dữ liệu", "Nén video", "Vẽ 3D", "In tài liệu"], correct: 0 }
];

const CATEGORY_NAMES = {
  all: "TỔNG HỢP",
  science: "KHOA HỌC",
  geography: "ĐỊA LÝ",
  history: "LỊCH SỬ",
  technology: "CÔNG NGHỆ"
};
