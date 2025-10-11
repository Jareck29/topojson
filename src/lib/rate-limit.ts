const windowMs = 60 * 1000;
const maxRequests = 30;

const buckets = new Map<string, { count: number; expires: number }>();

export function rateLimit(ip: string) {
  const now = Date.now();
  const existing = buckets.get(ip);
  if (existing && existing.expires > now) {
    if (existing.count >= maxRequests) {
      return false;
    }
    existing.count += 1;
    buckets.set(ip, existing);
    return true;
  }

  buckets.set(ip, { count: 1, expires: now + windowMs });
  return true;
}
