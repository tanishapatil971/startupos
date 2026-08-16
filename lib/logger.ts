type LogLevel = "info" | "warn" | "error";

interface LogPayload {
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
    [key: string]: unknown;
  };
}

const SENSITIVE_KEYS = new Set([
  "gemini_api_key", "api_key", "apikey", "secret", "password", "token",
  "cookie", "authorization", "auth", "prompt", "response", "reply",
  "answer", "document", "memory", "context", "text", "payload", "body",
  "email", "user", "company", "goal", "risk", "opportunity", "roadmap",
  "action", "history", "message", "messages", "chat", "chats"
]);

const SENSITIVE_KEY_PATTERNS = [
  /key/i,
  /token/i,
  /cookie/i,
  /auth/i,
  /password/i,
  /secret/i,
  /prompt/i,
  /response/i,
  /reply/i,
  /answer/i,
  /document/i,
  /memory/i,
  /context/i,
  /text/i,
  /payload/i,
  /body/i,
  /email/i,
  /user/i,
  /company/i,
  /message/i,
  /chat/i,
];

function isSensitiveKey(key: string, value: unknown): boolean {
  const normalized = key.toLowerCase();
  
  if ((normalized === "userid" || normalized === "user_id" || normalized === "username") && typeof value !== "object") {
    return false;
  }
  
  if (SENSITIVE_KEYS.has(normalized)) return true;
  return SENSITIVE_KEY_PATTERNS.some(pattern => pattern.test(key));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function scrubString(str?: string): string | undefined {
  if (!str) return str;
  let clean = str;
  
  clean = clean.replace(/eyJhbGciOi[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+/g, "[REDACTED_JWT]");
  
  if (process.env.GEMINI_API_KEY) {
    clean = clean.replace(new RegExp(escapeRegExp(process.env.GEMINI_API_KEY), "g"), "[REDACTED_GEMINI_KEY]");
  }
  if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    clean = clean.replace(new RegExp(escapeRegExp(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY), "g"), "[REDACTED_SUPABASE_KEY]");
  }
  if (process.env.UPSTASH_REDIS_REST_TOKEN) {
    clean = clean.replace(new RegExp(escapeRegExp(process.env.UPSTASH_REDIS_REST_TOKEN), "g"), "[REDACTED_UPSTASH_TOKEN]");
  }
  return clean;
}

function scrub(val: unknown, seen = new WeakSet<object>()): unknown {
  if (val === null || val === undefined) return val;

  if (typeof val !== "object") {
    if (typeof val === "string") {
      if (/^Bearer\s+/i.test(val) || val.includes("sb-") || (val.length > 100 && val.split(".").length === 3)) {
        return "[REDACTED_SENSITIVE_VALUE]";
      }
    }
    return val;
  }

  const objVal = val as object;
  if (seen.has(objVal)) return "[CIRCULAR]";
  seen.add(objVal);

  if (Array.isArray(val)) {
    return val.map(item => scrub(item, seen));
  }

  if (val instanceof Error) {
    const errorObject: Record<string, unknown> = {
      name: val.name,
      message: scrubString(val.message) || "",
      stack: scrubString(val.stack),
    };
    
    const errRecord = val as unknown as Record<string, unknown>;
    for (const key of Object.getOwnPropertyNames(val)) {
      if (key !== "name" && key !== "message" && key !== "stack") {
        if (isSensitiveKey(key, errRecord[key])) {
          errorObject[key] = "[REDACTED]";
        } else {
          errorObject[key] = scrub(errRecord[key], seen);
        }
      }
    }
    return errorObject;
  }

  if (isRecord(val)) {
    const scrubbed: Record<string, unknown> = {};
    for (const key of Object.keys(val)) {
      if (isSensitiveKey(key, val[key])) {
        scrubbed[key] = "[REDACTED]";
      } else {
        scrubbed[key] = scrub(val[key], seen);
      }
    }
    return scrubbed;
  }

  return val;
}

function printLog(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const logObj: LogPayload = {
    timestamp: new Date().toISOString(),
    level,
    message: scrubString(message) || "",
  };

  if (context) {
    const cleanContext = scrub(context);
    if (isRecord(cleanContext)) {
      if (cleanContext.error) {
        const errVal = cleanContext.error;
        if (isRecord(errVal)) {
          logObj.error = {
            name: typeof errVal.name === "string" ? errVal.name : "Error",
            message: typeof errVal.message === "string" ? errVal.message : "",
            stack: typeof errVal.stack === "string" ? errVal.stack : undefined,
            ...errVal
          };
        } else if (errVal instanceof Error) {
          logObj.error = {
            name: errVal.name,
            message: errVal.message,
            stack: errVal.stack,
          };
        }
        delete cleanContext.error;
      }
      if (Object.keys(cleanContext).length > 0) {
        logObj.metadata = cleanContext;
      }
    }
  }

  const logStr = JSON.stringify(logObj);
  if (level === "error") {
    console.error(logStr);
  } else if (level === "warn") {
    console.warn(logStr);
  } else {
    console.log(logStr);
  }
}

export const logger = {
  info(message: string, context?: Record<string, unknown>) {
    printLog("info", message, context);
  },
  warn(message: string, context?: Record<string, unknown>) {
    printLog("warn", message, context);
  },
  error(message: string, context?: Record<string, unknown>) {
    printLog("error", message, context);
  },
};
