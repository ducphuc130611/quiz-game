export const QUESTION_BANK = [
  { id: "sci-001", category: "science", question: "Hành tinh nào gần Mặt Trời nhất?", answers: ["Sao Kim", "Sao Hỏa", "Sao Thủy", "Trái Đất"], correct: 2 },
  { id: "sci-002", category: "science", question: "Nước có công thức hóa học là gì?", answers: ["CO₂", "H₂O", "O₂", "NaCl"], correct: 1 },
  { id: "sci-003", category: "science", question: "Cơ quan nào bơm máu đi khắp cơ thể người?", answers: ["Phổi", "Gan", "Thận", "Tim"], correct: 3 },
  { id: "geo-001", category: "geography", question: "Thủ đô của Nhật Bản là gì?", answers: ["Kyoto", "Osaka", "Tokyo", "Hiroshima"], correct: 2 },
  { id: "geo-002", category: "geography", question: "Châu lục nào có diện tích lớn nhất?", answers: ["Châu Phi", "Châu Á", "Châu Âu", "Bắc Mỹ"], correct: 1 },
  { id: "geo-003", category: "geography", question: "Đỉnh núi cao nhất thế giới là gì?", answers: ["K2", "Everest", "Lhotse", "Kangchenjunga"], correct: 1 },
  { id: "his-001", category: "history", question: "Ai là người đọc Tuyên ngôn Độc lập ngày 2/9/1945?", answers: ["Võ Nguyên Giáp", "Hồ Chí Minh", "Phan Bội Châu", "Trường Chinh"], correct: 1 },
  { id: "his-002", category: "history", question: "Chiến thắng Điện Biên Phủ diễn ra vào năm nào?", answers: ["1945", "1950", "1954", "1968"], correct: 2 },
  { id: "his-003", category: "history", question: "Ai là vị vua đầu tiên của nhà Lý?", answers: ["Lý Thường Kiệt", "Lý Công Uẩn", "Lý Nhân Tông", "Lý Thánh Tông"], correct: 1 },
  { id: "tech-001", category: "technology", question: "HTML chủ yếu được dùng để làm gì?", answers: ["Tạo cấu trúc trang web", "Chỉnh sửa ảnh", "Quản lý cơ sở dữ liệu", "Biên dịch C++"], correct: 0 },
  { id: "tech-002", category: "technology", question: "JavaScript thường được dùng để làm gì trên web?", answers: ["Tạo tương tác và logic", "Chỉ lưu ảnh", "Thay thế hệ điều hành", "Tạo phần cứng"], correct: 0 },
  { id: "tech-003", category: "technology", question: "CSS có vai trò chính nào?", answers: ["Tạo cơ sở dữ liệu", "Tạo kiểu dáng giao diện", "Chạy máy chủ", "Biên dịch Java"], correct: 1 }
];

export function publicQuestion(question) {
  return { id: question.id, category: question.category, question: question.question, answers: question.answers };
}
