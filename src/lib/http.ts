export function getClientIp(request: Request) {
  const header = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
  return header.split(',')[0].trim() || 'unknown';
}
