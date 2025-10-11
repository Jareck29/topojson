import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/http';
import { getServerAuthSession } from '@/lib/auth';
import { z } from 'zod';
import { uuidv7 } from 'uuidv7';

const schema = z.object({
  promptId: z.string(),
  comment: z.string().optional(),
});

export async function POST(request: Request) {
  if (!rateLimit(getClientIp(request))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.repost.findUnique({
    where: {
      userId_promptId: {
        userId: session.user.id,
        promptId: parsed.data.promptId,
      },
    },
  });

  if (existing) {
    await prisma.repost.delete({ where: { id: existing.id } });
    return NextResponse.json({ removed: true });
  }

  const repost = await prisma.repost.create({
    data: {
      id: uuidv7(),
      userId: session.user.id,
      promptId: parsed.data.promptId,
      comment: parsed.data.comment,
    },
  });

  return NextResponse.json(repost, { status: 201 });
}
