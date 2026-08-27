# Thuật ngữ Cốt lõi (IT Core & Frontend Glossary)

> Cập nhật sau mỗi bài học (theo quy tắc A23 của `/teach`). Chỉ thêm thuật ngữ khi đã hiểu rõ bản chất và sử dụng chính xác.

---

### Mạng Máy Tính & Giao Thức Truyền Tải (Networking & Transport)

- **Mô hình OSI (Open Systems Interconnection):** Mô hình tham chiếu lý thuyết 7 tầng chuẩn hóa bởi ISO (_Physical, Data Link, Network, Transport, Session, Presentation, Application_) mô tả cách dữ liệu được trừu tượng hóa và truyền đi trên mạng.
- **Mô hình TCP/IP:** Kiến trúc mạng 4 tầng thực tế của Internet (_Application, Transport, Internet, Network Access_), gom 3 tầng L7/L6/L5 của OSI thành một tầng Application duy nhất.
- **Encapsulation (Đóng gói dữ liệu):** Quá trình di chuyển dữ liệu từ tầng trên xuống tầng dưới tại máy gửi: `Data (L7)` → thêm TCP Header thành `Segment (L4)` → thêm IP Header thành `Packet (L3)` → thêm Ethernet MAC Header/Trailer thành `Frame (L2)` → biến thành `Bits (L1)`.
- **Decapsulation (Mở gói dữ liệu):** Quá trình bóc tách từng Header tương ứng từ tầng dưới ngược lên tầng trên tại máy nhận để trích xuất Payload ban đầu.
- **DNS Resolution (Phân giải tên miền):** Quá trình chuyển đổi tên miền dạng chữ con người dễ đọc (như `google.com`) thành địa chỉ IP máy chủ (như `142.250.190.46`).
- **DNS 4-Layer Cache:** Thứ tự tra cứu cache DNS từ gần đến xa: (1) Browser Cache (RAM) → (2) OS Cache / file `hosts` → (3) Router Cache → (4) ISP Recursive Resolver (nhà mạng / public DNS 8.8.8.8).
- **Authoritative Nameserver:** Máy chủ DNS nắm giữ bản ghi gốc (source of truth) và có thẩm quyền cuối cùng cho một tên miền cụ thể.
- **TCP 3-Way Handshake (Bắt tay 3 bước):** Quy trình thiết lập kết nối tin cậy giữa Client và Server: (1) Client gửi `SYN` (Seq=x) → (2) Server phản hồi `SYN-ACK` (Seq=y, Ack=x+1) → (3) Client xác nhận `ACK` (Seq=x+1, Ack=y+1). Cả hai bên chuyển sang trạng thái `ESTABLISHED`.
- **RTT (Round-Trip Time):** Khoảng thời gian (tính bằng mili-giây ms) để một gói tin đi từ Client tới Server và phản hồi quay trở lại Client.
- **TCP Slow Start:** Thuật toán phòng ngừa tắc nghẽn của TCP: khởi đầu với cửa sổ nghẽn ban đầu `initcwnd = 10 MSS` (~14.6 KB) và nhân đôi kích thước dữ liệu gửi đi sau mỗi lượt RTT thành công.
- **The 14KB Rule (Quy tắc 14KB):** Nguyên tắc tối ưu hiệu năng Frontend: giữ kích thước tài liệu HTML ban đầu (sau nén) dưới 14KB để Server có thể gửi trọn vẹn toàn bộ HTML tới trình duyệt ngay trong 1 lượt RTT đầu tiên, giúp FCP nhanh nhất.
- **TCP Keep-Alive:** Cơ chế giữ kết nối TCP mở sau khi hoàn thành một request/response, cho phép các request HTTP tiếp theo tái sử dụng socket sẵn có (Warm Connection) mà không phải lặp lại chi phí bắt tay 3 bước (0 RTT Handshake).
- **Resource Hints (`dns-prefetch` & `preconnect`):** Thẻ chỉ dẫn trình duyệt chuẩn bị trước tài nguyên: `dns-prefetch` chỉ phân giải IP; `preconnect` thực hiện trọn vẹn DNS + TCP Handshake + TLS Handshake để sẵn sàng tải tài nguyên tức thì.
- **TTFB (Time to First Byte):** Khoảng thời gian từ khi trình duyệt gửi xong HTTP Request đến khi nhận được byte đầu tiên của HTTP Response từ máy chủ (phản ánh tốc độ xử lý Backend + độ trễ mạng).
- **DoH (DNS-over-HTTPS):** Giao thức phân giải tên miền được mã hóa bằng TLS qua cổng HTTPS 443, ngăn chặn nhà mạng hoặc tin tặc nghe lén và giả mạo bản ghi DNS.

---

### Hệ điều hành & Kiến trúc Máy tính (OS & Hardware)

- **Process (Tiến trình):** Đơn vị thực thi độc lập được hệ điều hành cấp phát virtual address space riêng (Stack, Heap, Data segment), file descriptor table và CPU registers riêng. Các process cô lập hoàn toàn về bộ nhớ (Fault & Security isolation).
- **Thread (Luồng):** Đơn vị thực thi nhỏ nhất bên trong một Process. Các thread trong cùng process chia sẻ chung Heap và global variables nhưng có Call Stack riêng. Chi phí tạo và chuyển đổi nhẹ hơn process rất nhiều.
- **Context Switching (Chuyển ngữ cảnh):** Quá trình OS CPU lưu lại trạng thái (registers, program counter, stack pointer) của thread/process đang chạy và nạp trạng thái của thread/process tiếp theo. Tốn ~1-10µs và có chi phí cache miss / TLB flush.
- **Race Condition (Cạnh tranh điều kiện):** Lỗi xảy ra khi hai hay nhiều luồng/tác vụ cùng đọc-sửa-ghi một vùng nhớ chia sẻ mà không có cơ chế đồng bộ hóa (Mutex/Lock), dẫn đến kết quả phụ thuộc vào thứ tự thực thi ngẫu nhiên của CPU.
- **Concurrency vs Parallelism:** _Concurrency (Đồng thời)_ là xử lý nhiều việc xen kẽ nhau (interleaving) trên 1 hoặc nhiều core (như 1 đầu bếp đảo 5 chảo). _Parallelism (Song song)_ là thực sự chạy cùng một lúc trên nhiều CPU core vật lý khác nhau (như 5 đầu bếp cùng nấu).

---

### V8 Engine & Quản lý Bộ nhớ (V8 & Memory Management)

- **Ignition:** Trình thông dịch (Bytecode Interpreter) của V8, nhận AST từ Parser và sinh Bytecode gọn nhẹ, khởi động cực nhanh cho code khởi tạo hoặc chạy ít lần.
- **TurboFan:** Trình biên dịch JIT (Just-In-Time Compiler) của V8, tối ưu hóa các hàm "hot" (chạy nhiều lần) thành mã máy (native machine code) dựa trên các giả định về kiểu dữ liệu (Type Assumptions). Nếu kiểu dữ liệu thay đổi đột ngột, TurboFan sẽ kích hoạt **Deoptimization** quay về Ignition.
- **Call Stack:** Cấu trúc dữ liệu LIFO (Last-In-First-Out) dùng để theo dõi execution context của các hàm đang được gọi. Lưu primitives, references và return address. Khi đệ quy không điểm dừng sẽ gây _Stack Overflow_.
- **Memory Heap:** Vùng nhớ động không có cấu trúc ngăn xếp, dùng để chứa objects, arrays, functions, closures. Quản lý cấp phát và giải phóng bởi Garbage Collector.
- **Generational GC:** Cơ chế dọn rác phân chia theo thế hệ dựa trên giả thuyết _"phần lớn objects chết trẻ"_. Gồm **Young Generation** (New Space, dọn bằng _Scavenger / Minor GC_ siêu nhanh qua copy semi-spaces) và **Old Generation** (Old Space, dọn bằng _Mark-Sweep-Compact / Major GC_).
- **Reachability (Khả năng chạm tới):** Tiêu chí quyết định object có bị dọn rác hay không. Object được giữ sống khi và chỉ khi có đường dẫn tham chiếu từ các _GC Roots_ (Global object, active call stack, closures, DOM tree). Không bị lỗi Circular Reference như cơ chế Reference Counting cũ.
- **Memory Leak (Rò rỉ bộ nhớ):** Tình trạng bộ nhớ không còn được ứng dụng sử dụng nhưng vẫn không thể được GC giải phóng vì còn tham chiếu vô tình từ GC Roots (do Closure capture thừa, Global variables vô ý, forgotten Timers/setInterval, hoặc Detached DOM nodes).

---

### JavaScript Runtime & Mô hình Bất đồng bộ (Async Model)

- **Single-Threaded Execution:** JavaScript Engine chỉ có duy nhất 1 Call Stack chính để thực thi mã JS tại một thời điểm, giúp tránh hoàn toàn race conditions trên DOM và không cần cơ chế mutex lock phức tạp.
- **Event Loop (Vòng lặp sự kiện):** Cơ chế điều phối thực thi của JS Runtime: liên tục kiểm tra nếu Call Stack rỗng, nó sẽ drain toàn bộ **Microtask Queue** (Promise, queueMicrotask), sau đó trigger render/rAF (nếu đến frame boundary), rồi mới lấy **1 Macrotask** (setTimeout, I/O, events) tiếp theo từ Task Queue.
- **Microtask:** Tác vụ ưu tiên cao (sinh ra từ `Promise.then/catch/finally`, `queueMicrotask`, `MutationObserver`). Được xử lý sạch sẽ ngay sau khi Stack rỗng và trước mọi Macrotask/Render.
- **Macrotask (Task):** Tác vụ thông thường từ Web APIs hoặc libuv (sinh ra từ `setTimeout`, `setInterval`, DOM event callbacks, I/O callback). Mỗi tick của Event Loop chỉ lấy tối đa 1 macrotask.
- **Microtask Starvation:** Hiện tượng UI và timers bị treo hoàn toàn do một microtask liên tục sinh thêm microtask mới đệ quy, khiến Microtask Queue không bao giờ rỗng để Event Loop chuyển sang bước Render hay Macrotask tiếp theo.
- **requestAnimationFrame (rAF):** API yêu cầu trình duyệt gọi callback ngay trước lần vẽ lại màn hình tiếp theo (~60fps / 16.7ms), giúp animation mượt mà và đồng bộ với tần số quét của màn hình.
