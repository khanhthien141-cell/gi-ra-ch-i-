GIỜ RA CHƠI — ĐẤU TRÍ BẢNG PHẤN (BẢN TRIỂN KHAI TRỰC TUYẾN)

MỤC TIÊU
- Đưa trò chơi lên internet để máy chiếu và điện thoại có thể dùng mạng khác nhau.
- Học sinh mở Zalo, quét mã QR và mở trang trả lời bằng trình duyệt tích hợp/được chuyển sang trình duyệt. Không cần cài thêm ứng dụng.
- Gói này đã có cấu hình Render (render.yaml). Bạn cần tự tạo tài khoản và triển khai; tôi không thể đăng nhập hoặc xuất bản thay bạn từ đây.

CÁCH TRIỂN KHAI MIỄN PHÍ TRÊN RENDER
1. Giải nén ZIP này vào máy tính.
2. Tạo một repository mới trên GitHub. Tải lên TOÀN BỘ các tệp trong thư mục này, gồm server.js, package.json, render.yaml và thư mục public.
3. Mở https://render.com/ và đăng nhập/đăng ký. Chọn New > Web Service, kết nối repository GitHub vừa tạo.
4. Nếu Render nhận render.yaml, xác nhận cấu hình. Nếu cần nhập thủ công: Runtime Node, Build Command: npm install, Start Command: npm start, Plan: Free.
5. Chọn Deploy Web Service và chờ trạng thái Live. Render cấp một địa chỉ dạng https://ten-dich-vu.onrender.com.
6. Mở địa chỉ đó kèm /host.html, ví dụ https://ten-dich-vu.onrender.com/host.html. Mã QR tự tạo và dẫn tới /join.html.
7. Chiếu màn hình MC. Học sinh mở Zalo > biểu tượng quét QR, quét mã trên màn chiếu, chạm mở liên kết rồi nhập tên/chọn đội. Không cần cài ứng dụng trò chơi.

LƯU Ý
- Máy chiếu và điện thoại có thể dùng mạng khác nhau vì trang đã có địa chỉ công khai HTTPS.
- Gói miễn phí có thể tạm ngủ khi không hoạt động; hãy mở trang MC vài phút trước tiết học và kiểm tra QR trước khi bắt đầu.
- Điểm vẫn do MC chấm thủ công bằng nút +5 / -5. Mỗi câu chỉ nhận 5 lượt trả lời đầu tiên.
- Không chia sẻ thông tin cá nhân nhạy cảm trong trò chơi.
- Nếu cần cập nhật mã, tải các thay đổi lên GitHub; Render có thể triển khai lại từ repository đã kết nối.

CHẠY THỬ TẠI MÁY (KHÔNG PHẢI BẢN ONLINE)
1. Cài Node.js LTS.
2. Mở Terminal trong thư mục trò chơi.
3. Chạy npm install, sau đó npm start.
4. Mở http://localhost:3000/host.html. Khi chạy local, điện thoại thường phải cùng Wi-Fi với máy tính.
