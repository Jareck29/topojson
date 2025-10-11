import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/http';

export async function GET(request: Request) {
  if (!rateLimit(getClientIp(request))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') ?? '';

  if (!q) {
    return NextResponse.json([]);
  }

  const prompts = await prisma.prompt.findMany({
    where: {
      isPublic: true,
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { body: { contains: q, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      title: true,
      lang: true,
      tags: true,
    },
    take: 10,
  });

  return NextResponse.json(prompts);
}
