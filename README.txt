GIỜ RA CHƠI - TOP 5 ĐÚNG NHANH NHẤT

Để cập nhật repo GitHub hiện tại, thay 4 file:
  server.js
  questions.js (file mới ở thư mục gốc)
  public/host.html
  public/join.html

package.json: có thể thay bằng file đi kèm (đã có express, socket.io, qrcode).

Trên Render: Manual Deploy > Deploy latest commit.

MC: https://gi-ra-ch-i.onrender.com/host.html
Người chơi: chỉ vào qua QR trên trang MC, mỗi câu có mã khác nhau.

Quy tắc: 5 người trả lời ĐÚNG sớm nhất được 5,4,3,2,1 điểm cộng cho đội.
Trả lời sai không chiếm chỗ trong top 5, người đến sau được đẩy lên.
Mỗi tên trong mỗi đội chỉ gửi 1 lần/câu. Tên giống nhau trong cùng đội được xem là 1 người.
Kết quả hiển thị trên màn hình MC và lịch sử, có nút xuất CSV.

CHÚ Ý: Dữ liệu chỉ lưu trong bộ nhớ máy chủ. Render Free khởi động lại hoặc deploy sẽ xóa bảng điểm và lịch sử chưa xuất CSV.
Muốn lưu vĩnh viễn cần cơ sở dữ liệu ngoài. API điều khiển MC hiện chưa có đăng nhập, chỉ dùng trong lớp học với link quản trị được giữ riêng.
