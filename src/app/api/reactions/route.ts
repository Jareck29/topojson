import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/http';
import { getServerAuthSession } from '@/lib/auth';
import { z } from 'zod';
import { uuidv7 } from 'uuidv7';

const schema = z.object({
  promptId: z.string(),
  type: z.enum(['LIKE', 'DISLIKE']),
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

  const reaction = await prisma.reaction.upsert({
    where: {
      userId_promptId: {
        userId: session.user.id,
        promptId: parsed.data.promptId,
      },
    },
    update: {
      type: parsed.data.type,
    },
    create: {
      id: uuidv7(),
      userId: session.user.id,
      promptId: parsed.data.promptId,
      type: parsed.data.type,
    },
  });

  return NextResponse.json(reaction, { status: 201 });
}
