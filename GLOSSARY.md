# Thuật ngữ Cốt lõi (IT Core & Frontend Glossary)

> Cập nhật sau mỗi bài học (theo quy tắc A23 của `/teach`). Chỉ thêm thuật ngữ khi đã hiểu rõ bản chất và sử dụng chính xác.

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
