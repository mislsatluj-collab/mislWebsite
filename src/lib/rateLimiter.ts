type AttemptRecord = {
  count: number;
  lockoutUntil: number;
};

type WindowRecord = {
  count: number;
  resetAt: number;
};

// In-memory stores for rate limiting
const loginAttemptsStore = new Map<string, AttemptRecord>();
const genericRateLimitStore = new Map<string, WindowRecord>();

const MAX_LOGIN_ATTEMPTS = parseInt(process.env.ADMIN_MAX_LOGIN_ATTEMPTS || "4", 10);
const LOCKOUT_MINUTES = parseInt(process.env.ADMIN_LOCKOUT_MINUTES || "15", 10);
const LOCKOUT_MS = LOCKOUT_MINUTES * 60 * 1000;

// Helper to extract reliable client IP
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

// 1. Admin Authentication Rate Limiting
export function checkRateLimit(key: string): { isLocked: boolean; remainingMinutes?: number } {
  const now = Date.now();
  const record = loginAttemptsStore.get(key);

  if (!record) {
    return { isLocked: false };
  }

  if (record.lockoutUntil > now) {
    const remainingMinutes = Math.ceil((record.lockoutUntil - now) / (60 * 1000));
    return { isLocked: true, remainingMinutes };
  }

  if (record.lockoutUntil <= now && record.count >= MAX_LOGIN_ATTEMPTS) {
    loginAttemptsStore.delete(key);
  }

  return { isLocked: false };
}

export function recordFailedAttempt(key: string): { count: number; locked: boolean } {
  const now = Date.now();
  const record = loginAttemptsStore.get(key) || { count: 0, lockoutUntil: 0 };

  record.count += 1;

  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    record.lockoutUntil = now + LOCKOUT_MS;
    loginAttemptsStore.set(key, record);
    return { count: record.count, locked: true };
  }

  loginAttemptsStore.set(key, record);
  return { count: record.count, locked: false };
}

export function resetLoginAttempts(key: string): void {
  loginAttemptsStore.delete(key);
}

// 2. Generic Tiered Rate Limiting for Public Endpoints & Forms
export function limitRate(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = genericRateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    genericRateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  genericRateLimitStore.set(key, record);
  return { allowed: true, remaining: limit - record.count };
}
