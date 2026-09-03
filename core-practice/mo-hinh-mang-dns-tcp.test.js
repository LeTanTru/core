import { describe, it, expect } from 'vitest';

// ==========================================
// 1. MÔ PHỎNG ĐÓNG GÓI DỮ LIỆU (ENCAPSULATION & DECAPSULATION)
// ==========================================
class NetworkPacketPipeline {
  static encapsulate(httpPayload, srcPort, dstPort, srcIP, dstIP, srcMAC, dstMAC) {
    // L7 Application: Data
    const data = httpPayload;

    // L4 Transport: Gắn TCP Header -> Segment
    const segment = {
      layer: 'L4_Transport',
      header: { srcPort, dstPort, protocol: 'TCP' },
      payload: data,
    };

    // L3 Network: Gắn IP Header -> Packet
    const packet = {
      layer: 'L3_Network',
      header: { srcIP, dstIP, protocol: 'IPv4' },
      payload: segment,
    };

    // L2 Data Link: Gắn Ethernet Header & Trailer -> Frame
    const frame = {
      layer: 'L2_DataLink',
      header: { srcMAC, dstMAC, type: 'Ethernet_II' },
      payload: packet,
      trailer: 'FCS_CRC32_CHECKSUM',
    };

    return frame;
  }

  static decapsulate(frame) {
    const packet = frame.payload;
    const segment = packet.payload;
    const httpData = segment.payload;
    return {
      httpData,
      dstPort: segment.header.dstPort,
      dstIP: packet.header.dstIP,
    };
  }
}

// ==========================================
// 2. MÔ PHỎNG CƠ CHẾ DNS 4-LAYER CACHE
// ==========================================
class DNSResolver {
  constructor() {
    this.browserCache = new Map();
    this.osCache = new Map();
    this.routerCache = new Map();
    this.authoritativeRecords = new Map([
      ['google.com', '142.250.190.46'],
      ['cdn.example.com', '104.16.123.99'],
    ]);
  }

  resolve(domain) {
    if (this.browserCache.has(domain)) {
      return { ip: this.browserCache.get(domain), source: 'browser_cache', rttHops: 0 };
    }
    if (this.osCache.has(domain)) {
      const ip = this.osCache.get(domain);
      this.browserCache.set(domain, ip);
      return { ip, source: 'os_cache', rttHops: 0 };
    }
    if (this.routerCache.has(domain)) {
      const ip = this.routerCache.get(domain);
      this.osCache.set(domain, ip);
      this.browserCache.set(domain, ip);
      return { ip, source: 'router_cache', rttHops: 1 };
    }
    if (this.authoritativeRecords.has(domain)) {
      const ip = this.authoritativeRecords.get(domain);
      this.routerCache.set(domain, ip);
      this.osCache.set(domain, ip);
      this.browserCache.set(domain, ip);
      return { ip, source: 'authoritative_nameserver', rttHops: 3 };
    }
    throw new Error(`NXDOMAIN: Không tìm thấy ${domain}`);
  }
}

// ==========================================
// 3. MÔ PHỎNG TCP HANDSHAKE & CONNECTION REUSE (KEEP-ALIVE)
// ==========================================
class TCPConnectionPool {
  constructor() {
    this.activeSockets = new Map(); // domain -> socket
  }

  // Kết nối đến host: nếu đã có socket keep-alive thì tái sử dụng (0 RTT), nếu chưa thì bắt tay 3 bước (1 RTT)
  connect(host, rttMs = 50) {
    if (this.activeSockets.has(host)) {
      return {
        reused: true,
        handshakeLatencyMs: 0, // Tái sử dụng kết nối ấm (Warm Connection)
        socket: this.activeSockets.get(host),
      };
    }

    // Thiết lập kết nối mới: Tốn 1 RTT (3-Way Handshake)
    const socket = { host, state: 'ESTABLISHED', createdAt: Date.now() };
    this.activeSockets.set(host, socket);
    return {
      reused: false,
      handshakeLatencyMs: rttMs, // Tốn 1 RTT bắt tay
      socket,
    };
  }
}

// ==========================================
// 4. KIỂM THỬ VỚI VITEST RUNNER
// ==========================================
describe('Bài 01: Mô hình Mạng, DNS, TCP Handshake & DevTools Performance Labs', () => {
  it('Đóng gói (Encapsulation) bọc đúng thứ tự: Data -> L4 Segment -> L3 Packet -> L2 Frame', () => {
    const rawHTTPRequest = 'GET /api/user HTTP/1.1\r\nHost: google.com\r\n\r\n';

    const frame = NetworkPacketPipeline.encapsulate(
      rawHTTPRequest,
      54321,
      443,
      '192.168.1.100',
      '142.250.190.46',
      'AA:BB:CC:DD:EE:01',
      'AA:BB:CC:DD:EE:02',
    );

    expect(frame.layer).toBe('L2_DataLink');
    expect(frame.payload.layer).toBe('L3_Network');
    expect(frame.payload.payload.layer).toBe('L4_Transport');
    expect(frame.payload.payload.payload).toBe(rawHTTPRequest);

    const result = NetworkPacketPipeline.decapsulate(frame);
    expect(result.httpData).toBe(rawHTTPRequest);
    expect(result.dstPort).toBe(443);
    expect(result.dstIP).toBe('142.250.190.46');
  });

  it('DNS 4 Tầng: Lần 1 query tốn 3 hops, lần 2 cache hit tốn 0 hops', () => {
    const dns = new DNSResolver();
    const q1 = dns.resolve('google.com');
    expect(q1.ip).toBe('142.250.190.46');
    expect(q1.rttHops).toBe(3);

    const q2 = dns.resolve('google.com');
    expect(q2.ip).toBe('142.250.190.46');
    expect(q2.source).toBe('browser_cache');
    expect(q2.rttHops).toBe(0);
  });

  it('TCP Connection Reuse (Keep-Alive) loại bỏ hoàn toàn độ trễ 1 RTT của TCP Handshake cho request kế tiếp', () => {
    const pool = new TCPConnectionPool();
    const RTT = 60; // Giả sử độ trễ mạng 60ms

    // Request 1: Mở kết nối mới -> tốn 60ms bắt tay TCP 3 bước
    const conn1 = pool.connect('api.github.com', RTT);
    expect(conn1.reused).toBe(false);
    expect(conn1.handshakeLatencyMs).toBe(60);

    // Request 2: Cùng host, tái sử dụng Keep-Alive -> tốn 0ms bắt tay!
    const conn2 = pool.connect('api.github.com', RTT);
    expect(conn2.reused).toBe(true);
    expect(conn2.handshakeLatencyMs).toBe(0);
  });

  it('Mô phỏng TCP Slow Start & Quy tắc 14KB: Payload <= 14.6KB được truyền trọn vẹn trong 1 RTT đầu tiên', () => {
    const MSS = 1460;
    const initCwndSegments = 10;
    const maxFirstRttBytes = MSS * initCwndSegments; // 14,600 bytes

    const htmlFileSize = 13800; // 13.8 KB
    expect(htmlFileSize <= maxFirstRttBytes).toBe(true);
  });
});
