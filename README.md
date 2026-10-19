# 20-10
# Hướng dẫn sử dụng

## 1. Dành cho người dùng

### Truy cập website
Mở link website được Admin chia sẻ trên điện thoại hoặc máy tính. Nếu truy cập bằng link Ngrok và thấy trang xác nhận, nhấn **Visit Site** để tiếp tục.

### Gửi lời chúc 20/10
1. Nhập lời chúc vào khung chat trên trang chủ (tối đa 100 từ).
2. Nhấn **Send** để mở phần nhập tên người gửi.
3. Nhập tên của bạn rồi nhấn **Send** lần nữa để hoàn tất.

Sau khi gửi thành công, lời chúc sẽ xuất hiện trong một trái tim và bay lên màn hình.
<img width="1903" height="912" alt="image" src="https://github.com/user-attachments/assets/87f75d79-32f2-4fa6-8317-a2374824d10a" />

### Chơi vòng quay may mắn
Tại khung chat trên trang chủ, nhập `Chơi game` để chuyển sang trang vòng quay.

Nhấn **Quay** để nhận một phần thưởng ngẫu nhiên. Nếu trúng thưởng, một popup sẽ xuất hiện. Nhập lời chúc và tên người gửi, sau đó nhấn **Send** để lưu lại và quay về trang chủ.
<img width="1890" height="920" alt="image" src="https://github.com/user-attachments/assets/14f54671-a791-4c88-96c9-3ab2bf572f0f" />

### Một chút bất ngờ
Website có một Easter Egg dành cho một số tên đặc biệt, hiệu ứng tặng hoa riêng sẽ được kích hoạt.

## 2. Dành cho Admin

### Chạy backend
Đảm bảo máy đã cài **Java 21** và các công cụ cần thiết để chạy dự án Spring Boot.

Mở project bằng VS Code hoặc IntelliJ, sau đó khởi chạy ứng dụng. Backend sử dụng cổng `8080`.

### Chia sẻ website qua Internet
Nếu muốn mọi người truy cập website từ thiết bị khác mà không cần kết nối cùng mạng, có thể sử dụng Ngrok.

Mở một cửa sổ Terminal mới và chạy:

```bash
ngrok http 8080
```

Sau khi Ngrok khởi chạy, copy đường dẫn HTTPS ở mục **Forwarding** và gửi cho mọi người. Đường dẫn này dùng để truy cập website khi đường hầm còn hoạt động.

### Kiểm tra lời chúc đã gửi
Các lời chúc được lưu tại file:

```text
data/wishes.dat
```

Để xem danh sách lời chúc đã lưu, có thể gọi API sau bằng trình duyệt hoặc công cụ như Postman:

http
GET http://localhost:8080/api/wishes


### Lưu ý
- Giữ backend Spring Boot đang chạy trong suốt thời gian sử dụng website.
- Không tắt Ngrok nếu vẫn muốn mọi người truy cập bằng đường link đã chia sẻ.
- File `wishes.dat` chứa dữ liệu lời chúc đã lưu, nên sao lưu file này nếu muốn giữ lại dữ liệu.
