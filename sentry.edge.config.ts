import * as Sentry from "@sentry/nextjs";

const SENSITIVE_KEY_PATTERNS = [
  /key/i, /token/i, /cookie/i, /auth/i, /password/i, /secret/i,
  /prompt/i, /response/i, /reply/i, /answer/i, /document/i, /memory/i,
  /context/i, /text/i, /payload/i, /body/i, /email/i, /user/i,
  /company/i, /message/i, /chat/i,
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function scrub(obj: any, seen = new WeakSet()): any {
  if (typeof obj !== "object" || obj === null) return obj;
  if (seen.has(obj)) return "[CIRCULAR]";
  seen.add(obj);

  if (Array.isArray(obj)) return obj.map((item) => scrub(item, seen));
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scrubbed: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (SENSITIVE_KEY_PATTERNS.some((p) => p.test(k))) {
      scrubbed[k] = "[REDACTED]";
    } else {
      scrubbed[k] = typeof v === "object" ? scrub(v, seen) : v;
    }
  }
  return scrubbed;
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  sendDefaultPii: false,
  
  beforeSend(event) {
    if (event.request) {
      if (event.request.headers) {
        event.request.headers = scrub(event.request.headers);
      }
      if (event.request.data) {
        event.request.data = scrub(event.request.data);
      }
    }
    if (event.extra) {
      event.extra = scrub(event.extra);
    }
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map(b => scrub(b));
    }
    return event;
  },

  beforeBreadcrumb(breadcrumb) {
    if (breadcrumb.category === "fetch" || breadcrumb.category === "xhr" || breadcrumb.category === "http") {
      return null;
    }
    if (breadcrumb.data) {
      breadcrumb.data = scrub(breadcrumb.data);
    }
    return breadcrumb;
  },
});
