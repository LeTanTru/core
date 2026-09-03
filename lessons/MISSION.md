# Mission: IT Core Knowledge cho Frontend Intern (Toàn diện & Thực chiến)

## Why

Hệ thống hóa và đào sâu bản chất kiến thức IT Core & Frontend Fundamentals trong vòng 1 tháng để tự tin đỗ vị trí Frontend Intern tại các công ty công nghệ hàng đầu và sẵn sàng làm việc thực tế với tư duy kỹ thuật vững chắc.

## Success looks like

1. **Nắm vững bản chất & phản xạ phỏng vấn (Bottom-Up):**
   - **Mạng & Giao thức Web:** DNS 4-layer cache, TCP 3-Way Handshake, TLS 1.3 Handshake, HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC), REST API & Idempotency, Realtime (WebSocket vs SSE vs Polling), Web Caching (ETag, Cache-Control, 304), SOP & CORS (Simple vs Preflight OPTIONS).
   - **Hệ điều hành & JS Engine:** Process vs Thread, Context Switching, Chrome Multi-Process & Site Isolation, V8 Pipeline (Ignition & TurboFan), Call Stack vs Memory Heap, Generational GC (Scavenger & Mark-Sweep-Compact), 4 nguyên nhân Memory Leaks.
   - **JavaScript Core & Bất đồng bộ:** Execution Context, Scope Chain, Closures, Prototype Chain, `this` binding, Event Loop sâu (Call Stack → Microtasks → Render/rAF → Macrotasks), Promise Internals & Async/Await desugaring, ES6+ Data Structures (Map/Set, WeakMap/WeakSet).
   - **Trình duyệt & Rendering:** DOM/CSSOM Tree, `<script>` async vs defer, Critical Rendering Path (Layout/Reflow, Paint, Composite), Layout Thrashing & 60fps optimization, DOM Event Propagation (Capturing, Target, Bubbling, Delegation).
   - **Lưu trữ & Bảo mật:** Cookie (HttpOnly, Secure, SameSite) vs Web Storage vs IndexedDB, Authentication (Session vs JWT Rotation), Phòng chống XSS (CSP, DOMPurify) & CSRF (SameSite, Anti-CSRF Token).
   - **Hiệu năng & Kỹ thuật:** Core Web Vitals (LCP, INP, CLS), Resource Hints (`preload`, `prefetch`, `preconnect`), Code Splitting & Tree Shaking cơ bản.
   - **Git Internals & Workflow:** Git Object Store (Blob, Tree, Commit), HEAD/Branches, Merge vs Rebase, Conventional Commits.
2. **Kỹ năng thực hành & Debugging:**
   - Sử dụng thành thạo Chrome DevTools (Network Waterfall, Performance Profiler, Memory Heap Snapshot & Allocation Timeline).
   - Tự tay viết code test và verify các kịch bản bất đồng bộ, race conditions, memory leaks trong sân tập `core-practice`.
3. **Phản xạ phỏng vấn vững vàng:**
   - Trả lời trôi chảy trong 60 giây các câu hỏi kinh điển (như _"Khi gõ google.com và nhấn Enter chuyện gì xảy ra?"_, _"Event loop hoạt động ra sao?"_, _"XSS vs CSRF khác nhau thế nào?"_).
   - Luôn phân tích được Trade-offs (Ưu / Nhược điểm / Khi nào nên dùng).

## Constraints

- Thời gian: 1 tháng (tập trung trọng tâm phỏng vấn, bài học ngắn gọn ~15-25 phút/bài, làm xong có win ngay).
- Nền tảng: Đã có nền tảng CNTT/CS từ trường học, cần "bắc cầu" từ lý thuyết hàn lâm sang thực tiễn Frontend.
- Hình thức: Sân tập gọn (Practice Labs với Vitest) + Bài tập phỏng vấn tình huống, không kèm dự án song song.

## Out of scope

- Sử dụng framework UI cụ thể ở mức sâu (React Hooks nâng cao, Redux Toolkit, Vue/Angular framework internals).
- Lập trình Backend/Database chi tiết không phục vụ tương tác Client-Server.

## Parallel project

không
