import { vi, describe, it, expect, beforeEach } from 'vitest';
import { POST as analyzePOST } from '../app/api/analyze/route';
import { POST as chatPOST } from '../app/api/chat/route';
import { POST as cofounderPOST } from '../app/api/cofounder/route';

const { mockGenerateContent, mockGenerateContentLegacy } = vi.hoisted(() => ({
  mockGenerateContent: vi.fn(),
  mockGenerateContentLegacy: vi.fn(),
}));

// Mocks
vi.mock('../lib/supabase-server', () => ({
  createClient: vi.fn(),
}));
vi.mock('../lib/rate-limit', () => ({
  checkRateLimit: vi.fn(),
}));
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn(function() {
    return {
      models: {
        generateContent: mockGenerateContent,
      },
    };
  }),
}));
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(function() {
    return {
      getGenerativeModel: vi.fn().mockReturnValue({
        generateContent: mockGenerateContentLegacy,
      }),
    };
  }),
}));

// Import mocks to manipulate them
import { createClient } from '../lib/supabase-server';
import { checkRateLimit } from '../lib/rate-limit';

describe('API Routes Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test_api_key';
  });

  const setupAuth = (user: unknown = { id: 'user-123' }) => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user } }),
      },
    } as unknown as Awaited<ReturnType<typeof createClient>>);
  };

  const setupRateLimit = (success = true, reset = Date.now() + 10000) => {
    vi.mocked(checkRateLimit).mockResolvedValue({ success, reset });
  };

  describe('1. API AUTHENTICATION', () => {
    it('unauthenticated /api/analyze returns 401', async () => {
      setupAuth(null);
      const req = new Request('http://localhost/api/analyze', { method: 'POST', body: JSON.stringify({}) });
      const res = await analyzePOST(req);
      expect(res.status).toBe(401);
    });

    it('unauthenticated /api/chat returns 401', async () => {
      setupAuth(null);
      const req = new Request('http://localhost/api/chat', { method: 'POST', body: JSON.stringify({}) });
      const res = await chatPOST(req);
      expect(res.status).toBe(401);
    });

    it('unauthenticated /api/cofounder returns 401', async () => {
      setupAuth(null);
      const req = new Request('http://localhost/api/cofounder', { method: 'POST', body: JSON.stringify({}) });
      const res = await cofounderPOST(req);
      expect(res.status).toBe(401);
    });
  });

  describe('2. INPUT VALIDATION', () => {
    beforeEach(() => {
      setupAuth();
      setupRateLimit();
    });

    it('analyze endpoint rejects missing fields', async () => {
      const req = new Request('http://localhost/api/analyze', { method: 'POST', body: JSON.stringify({ goal: 'only goal' }) });
      const res = await analyzePOST(req);
      expect(res.status).toBe(400);
    });

    it('chat endpoint rejects missing/invalid message', async () => {
      const req = new Request('http://localhost/api/chat', { method: 'POST', body: JSON.stringify({}) });
      const res = await chatPOST(req);
      expect(res.status).toBe(400);
    });

    it('cofounder endpoint rejects missing prompt', async () => {
      const req = new Request('http://localhost/api/cofounder', { method: 'POST', body: JSON.stringify({ wrong: 'field' }) });
      const res = await cofounderPOST(req);
      expect(res.status).toBe(400);
    });
  });

  describe('3. RATE LIMITING', () => {
    beforeEach(() => {
      setupAuth();
    });

    it('returns 429 when rate limit exceeded on analyze', async () => {
      setupRateLimit(false);
      const req = new Request('http://localhost/api/analyze', { method: 'POST', body: JSON.stringify({ goal: 'a', context: 'b' }) });
      const res = await analyzePOST(req);
      expect(res.status).toBe(429);
      expect(res.headers.get('Retry-After')).toBeTruthy();
    });
  });

  describe('4. API SUCCESS PATHS', () => {
    beforeEach(() => {
      setupAuth();
      setupRateLimit();
    });

    it('successful analyze returns correct format', async () => {
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify({ healthScore: 90 }),
      });

      const req = new Request('http://localhost/api/analyze', { method: 'POST', body: JSON.stringify({ goal: 'a', context: 'b' }) });
      const res = await analyzePOST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.analysis.healthScore).toBe(90);
    });

    it('successful chat returns correct format', async () => {
      mockGenerateContent.mockResolvedValue({
        text: 'hello founder',
      });

      const req = new Request('http://localhost/api/chat', { method: 'POST', body: JSON.stringify({ message: 'hi' }) });
      const res = await chatPOST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.reply).toBe('hello founder');
    });

    it('successful cofounder returns correct format', async () => {
      mockGenerateContentLegacy.mockResolvedValue({
        response: { text: () => 'cofounder advice' },
      });

      const req = new Request('http://localhost/api/cofounder', { method: 'POST', body: JSON.stringify({ prompt: 'help' }) });
      const res = await cofounderPOST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.answer).toBe('cofounder advice');
    });
  });

  describe('5. ERROR HANDLING', () => {
    beforeEach(() => {
      setupAuth();
      setupRateLimit();
    });

    it('returns safe 500 on Gemini failure in analyze', async () => {
      mockGenerateContent.mockRejectedValue(new Error('AI API Down'));
      // Suppress console.error for clean test output
      vi.spyOn(console, 'error').mockImplementation(() => {});

      const req = new Request('http://localhost/api/analyze', { method: 'POST', body: JSON.stringify({ goal: 'a', context: 'b' }) });
      const res = await analyzePOST(req);
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Analysis failed. Please try again later.');
    });

    it('returns safe 500 on database failure', async () => {
      vi.mocked(createClient).mockRejectedValue(new Error('DB connection lost'));
      vi.spyOn(console, 'error').mockImplementation(() => {});

      const req = new Request('http://localhost/api/chat', { method: 'POST', body: JSON.stringify({ message: 'hi' }) });
      const res = await chatPOST(req);
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.error).toBeTruthy();
    });
  });

  describe('6. AUTHORIZATION / USER ISOLATION', () => {
    it('uses session identity rather than payload to check rate limits', async () => {
      setupAuth({ id: 'real-user-123' });
      setupRateLimit();
      const req = new Request('http://localhost/api/chat', { method: 'POST', body: JSON.stringify({ message: 'hi', user_id: 'fake-impersonated-user' }) });
      await chatPOST(req);
      
      // Ensure checkRateLimit was called with real user ID from session
      expect(checkRateLimit).toHaveBeenCalledWith('real-user-123', 'chat');
    });
  });
});
