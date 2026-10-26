export interface RateLimitConfig {
  limit: number;
  windowMs: number;
  namespace?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
  retryAfterSeconds?: number;
  headers: Record<string, string>;
  error?: string;
}

export interface BotProtectionResult {
  isSuspicious: boolean;
  reason?: string;
}

// In-memory sliding-window log registry: key -> timestamp array
const slidingWindowRegistry = new Map<string, number[]>();
let operationCount = 0;

export function extractClientIp(request: Request): string {
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp && cfConnectingIp.trim().length > 0) {
    return cfConnectingIp.trim();
  }

  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp && xRealIp.trim().length > 0) {
    return xRealIp.trim();
  }

  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor && xForwardedFor.trim().length > 0) {
    const first = xForwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  return "127.0.0.1";
}

export function cleanupExpiredRecords(now: number, maxAgeMs: number = 3600000): void {
  for (const [key, timestamps] of slidingWindowRegistry.entries()) {
    const valid = timestamps.filter((t) => now - t < maxAgeMs);
    if (valid.length === 0) {
      slidingWindowRegistry.delete(key);
    } else {
      slidingWindowRegistry.set(key, valid);
    }
  }
}

export function checkSlidingWindowRateLimit(
  request: Request,
  config: RateLimitConfig
): RateLimitResult {
  const ip = extractClientIp(request);
  const namespace = config.namespace || "default";
  const key = `${namespace}:${ip}`;
  const now = Date.now();

  // Periodic garbage collection every 200 operations to prevent memory leaks
  operationCount++;
  if (operationCount > 200) {
    operationCount = 0;
    cleanupExpiredRecords(now, config.windowMs * 2);
  }

  const existing = slidingWindowRegistry.get(key) || [];
  const cutoff = now - config.windowMs;
  const recent = existing.filter((t) => t > cutoff);

  const resetSeconds = Math.max(1, Math.ceil(config.windowMs / 1000));

  if (recent.length >= config.limit) {
    const oldest = recent[0];
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldest + config.windowMs - now) / 1000)
    );

    const headers: Record<string, string> = {
      "RateLimit-Limit": String(config.limit),
      "RateLimit-Remaining": "0",
      "RateLimit-Reset": String(retryAfterSeconds),
      "Retry-After": String(retryAfterSeconds),
      "X-RateLimit-Exceeded": "true",
    };

    return {
      allowed: false,
      limit: config.limit,
      remaining: 0,
      resetSeconds: retryAfterSeconds,
      retryAfterSeconds,
      headers,
      error: `Rate limit exceeded. Too many requests to ${namespace}. Please retry in ${retryAfterSeconds} seconds.`,
    };
  }

  // Record current request
  recent.push(now);
  slidingWindowRegistry.set(key, recent);

  const remaining = Math.max(0, config.limit - recent.length);
  const headers: Record<string, string> = {
    "RateLimit-Limit": String(config.limit),
    "RateLimit-Remaining": String(remaining),
    "RateLimit-Reset": String(resetSeconds),
  };

  return {
    allowed: true,
    limit: config.limit,
    remaining,
    resetSeconds,
    headers,
  };
}

export function detectSuspiciousBot(
  request: Request,
  body?: Record<string, any>
): BotProtectionResult {
  const userAgent = (request.headers.get("user-agent") || "").toLowerCase();

  // 1. Detect automated vulnerability scanners or attack tools
  const maliciousAgents = [
    "sqlmap",
    "nikto",
    "masscan",
    "wpscan",
    "acunetix",
    "havij",
    "zgrab",
    "morfeus",
    "dirbuster",
    "nessus",
  ];

  for (const agent of maliciousAgents) {
    if (userAgent.includes(agent)) {
      return {
        isSuspicious: true,
        reason: `Blocked malicious automated scanner signature: ${agent}`,
      };
    }
  }

  // 2. Body Payload Inspection (if provided)
  if (body && typeof body === "object") {
    // Honeypot field inspection
    if (body.website && typeof body.website === "string" && body.website.trim().length > 0) {
      return {
        isSuspicious: true,
        reason: "Honeypot form field triggered",
      };
    }

    if (body.fax && typeof body.fax === "string" && body.fax.trim().length > 0) {
      return {
        isSuspicious: true,
        reason: "Secondary honeypot field triggered",
      };
    }

    // XSS / Script Injection patterns in strings
    const checkXss = (str: string): boolean => {
      return (
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(str) ||
        /javascript:/i.test(str) ||
        /onload\s*=/i.test(str) ||
        /onerror\s*=/i.test(str) ||
        /<iframe/i.test(str)
      );
    };

    for (const [key, val] of Object.entries(body)) {
      if (typeof val === "string") {
        if (checkXss(val)) {
          return {
            isSuspicious: true,
            reason: `Malicious script payload detected in field '${key}'`,
          };
        }
      }
    }

    // Excessive hyperlink spam detection in contact message
    if (typeof body.message === "string") {
      const urlCount = (body.message.match(/https?:\/\//gi) || []).length;
      if (urlCount > 4) {
        return {
          isSuspicious: true,
          reason: "Spam link threshold exceeded in message body",
        };
      }
    }
  }

  return {
    isSuspicious: false,
  };
}

// Pre-configured rate limit tiers
export const RATE_LIMIT_CONFIGS = {
  inquiries: {
    limit: 6,
    windowMs: 10 * 60 * 1000, // 6 inquiries per 10 minutes per IP
    namespace: "inquiries",
  },
  telemetryPost: {
    limit: 30,
    windowMs: 60 * 1000, // 30 pings per minute per IP
    namespace: "telemetry-post",
  },
  telemetryGet: {
    limit: 120,
    windowMs: 60 * 1000, // 120 mesh reads per minute per IP
    namespace: "telemetry-get",
  },
  ping: {
    limit: 60,
    windowMs: 60 * 1000, // 60 pings per minute per IP
    namespace: "edge-ping",
  },
  adminAuth: {
    limit: 6,
    windowMs: 15 * 60 * 1000, // 6 login attempts per 15 minutes per IP
    namespace: "admin-auth",
  },
} as const;

// Helper to reset state in testing environments
export function _resetRateLimitRegistryForTesting(): void {
  slidingWindowRegistry.clear();
  operationCount = 0;
}
