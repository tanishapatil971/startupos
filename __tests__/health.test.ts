import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { GET as healthGET } from "../app/api/health/route";

const mockPing = vi.fn();
const fetchMock = vi.fn();

vi.mock("@upstash/redis", () => {
  return {
    Redis: class {
      ping() {
        return mockPing();
      }
    }
  };
});

vi.mock("@/lib/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Health / Readiness Endpoint Tests", () => {
  let originalSupabaseUrl: string | undefined;
  let originalSupabaseKey: string | undefined;
  let originalRedisUrl: string | undefined;
  let originalRedisToken: string | undefined;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    
    // Save original env
    originalSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    originalSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    originalRedisUrl = process.env.UPSTASH_REDIS_REST_URL;
    originalRedisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    // Set default healthy env variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test-supabase-project.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
    process.env.UPSTASH_REDIS_REST_URL = "https://test-redis.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "test-redis-token";

    // Setup global fetch mock
    vi.stubGlobal("fetch", fetchMock);

    // Default healthy mock behaviors
    mockPing.mockResolvedValue("PONG");
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
    });
  });

  afterEach(() => {
    // Restore env variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalSupabaseUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalSupabaseKey;
    process.env.UPSTASH_REDIS_REST_URL = originalRedisUrl;
    process.env.UPSTASH_REDIS_REST_TOKEN = originalRedisToken;
  });

  it("liveness check returns HTTP 200 immediately without database/Redis calls", async () => {
    const req = new Request("http://localhost/api/health?check=liveness");
    const res = await healthGET(req);
    
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("healthy");
    expect(data.type).toBe("liveness");
    expect(data.timestamp).toBeTruthy();
    expect(data.checks).toBeUndefined();
    
    expect(fetchMock).not.toHaveBeenCalled();
    expect(mockPing).not.toHaveBeenCalled();
  });

  it("readiness returns 200 when both Supabase and Redis are healthy", async () => {
    const req = new Request("http://localhost/api/health");
    const res = await healthGET(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("healthy");
    expect(data.type).toBe("readiness");
    expect(data.checks.supabase).toBe("up");
    expect(data.checks.redis).toBe("up");

    const rawBody = JSON.stringify(data);
    expect(rawBody).not.toContain("test-anon-key");
    expect(rawBody).not.toContain("test-redis-token");
    expect(fetchMock).toHaveBeenCalled();
    expect(mockPing).toHaveBeenCalled();
  });

  it("readiness returns 503 when Supabase is not configured", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "";

    const req = new Request("http://localhost/api/health");
    const res = await healthGET(req);

    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.status).toBe("unhealthy");
    expect(data.checks.supabase).toBe("not_configured");
    expect(data.checks.redis).toBe("up");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("readiness returns 503 when Supabase connection check fails", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
    });

    const req = new Request("http://localhost/api/health");
    const res = await healthGET(req);

    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.status).toBe("unhealthy");
    expect(data.checks.supabase).toBe("down");
    expect(data.checks.redis).toBe("up");
    expect(fetchMock).toHaveBeenCalled();
  });

  it("readiness returns degraded status (HTTP 200) when Redis is down", async () => {
    mockPing.mockRejectedValue(new Error("Redis connection timeout"));

    const req = new Request("http://localhost/api/health");
    const res = await healthGET(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("degraded");
    expect(data.checks.supabase).toBe("up");
    expect(data.checks.redis).toBe("down");
    expect(fetchMock).toHaveBeenCalled();
    expect(mockPing).toHaveBeenCalled();
  });

  it("readiness returns degraded status (HTTP 200) when Redis is not configured", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "";

    const req = new Request("http://localhost/api/health");
    const res = await healthGET(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("degraded");
    expect(data.checks.supabase).toBe("up");
    expect(data.checks.redis).toBe("not_configured");
    expect(fetchMock).toHaveBeenCalled();
  });

  it("ensures no sensitive error messages or parameters are printed in readiness failures", async () => {
    fetchMock.mockRejectedValue(new Error("CRITICAL_DATABASE_DETAILS_SECRET_IP_127.0.0.1"));
    mockPing.mockRejectedValue(new Error("UPSTASH_SECRET_REDIS_FAILURE"));

    const req = new Request("http://localhost/api/health");
    const res = await healthGET(req);

    const data = await res.json();
    const rawBody = JSON.stringify(data);

    expect(res.status).toBe(503);
    expect(data.status).toBe("unhealthy");
    expect(data.checks.supabase).toBe("down");
    expect(data.checks.redis).toBe("down");

    expect(rawBody).not.toContain("CRITICAL_DATABASE_DETAILS");
    expect(rawBody).not.toContain("127.0.0.1");
    expect(rawBody).not.toContain("UPSTASH_SECRET");
    expect(fetchMock).toHaveBeenCalled();
  });
});
