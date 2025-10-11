import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const locale = request.cookies.get('NEXT_LOCALE')?.value || 'es';
  const response = NextResponse.next();
  response.headers.set('x-language', locale);
  return response;
}

export const config = {
  matcher: ['/((?!_next|api/auth).*)'],
};
