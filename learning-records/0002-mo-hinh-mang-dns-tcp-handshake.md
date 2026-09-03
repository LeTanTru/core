# 0002: Mô hình Mạng (OSI vs TCP/IP), Encapsulation, DNS & TCP Handshake

Nắm vững toàn cảnh kiến trúc mạng nhiều tầng (OSI 7 tầng vs TCP/IP 4 tầng), quá trình đóng gói dữ liệu (Encapsulation: Data → Segment → Packet → Frame → Bits), cơ chế phân giải tên miền DNS qua 4 tầng cache (Browser → OS → Router → ISP Resolver), bản chất bắt tay 3 bước TCP (SYN → SYN-ACK → ACK) để ngăn ngừa Half-Open Connection, và ứng dụng thuật toán TCP Slow Start vào "Quy tắc 14KB" tối ưu hiệu năng Frontend.

## Evidence

- Hoàn thành bài học `lessons/0001-mo-hinh-mang-dns-tcp-handshake.html` với đầy đủ sơ đồ bảng đối chiếu OSI/TCP-IP, luồng bọc Header, quiz tương tác và 5 câu hỏi phỏng vấn thực chiến.
- Test suite `core-practice/mo-hinh-mang-dns-tcp.test.js` mô phỏng Đóng gói/Mở gói Header (Encapsulation & Decapsulation), DNS caching, TCP state machine và 14KB initial window chạy pass 100% (5/5 tests) với Vitest.

## Implications

- Hiểu rõ chi phí bọc Header và Round-Trip Time (RTT) ở từng tầng mạng, làm tiền đề trực tiếp để học cơ chế bắt tay mã hóa TLS 1.3 Handshake (Bài 02) và sự tiến hóa của HTTP/1.1 vs HTTP/2 vs HTTP/3 QUIC (Bài 03).
