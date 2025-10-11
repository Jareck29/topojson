import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';
import { z } from 'zod';
import { uuidv7 } from 'uuidv7';
import { rateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/http';

const promptSchema = z.object({
  title: z.string().min(3),
  body: z.string().min(5),
  agentId: z.string().optional(),
  lang: z.enum(['es', 'en']),
  isPublic: z.boolean(),
  tags: z.array(z.string()).default([]),
});

export async function GET(request: Request) {
  if (!rateLimit(getClientIp(request))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  const { searchParams } = new URL(request.url);
  const order = (searchParams.get('order') as 'trending' | 'latest' | 'saves') ?? 'trending';
  const sectionSlug = searchParams.get('section') ?? undefined;
  const search = searchParams.get('q') ?? undefined;

  const prompts = await prisma.prompt.findMany({
    where: {
      isPublic: true,
      ...(sectionSlug
        ? {
            agent: {
              section: {
                slug: sectionSlug,
              },
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { body: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: {
      user: true,
      agent: {
        include: {
          section: true,
        },
      },
      reactions: true,
      favorites: true,
      saves: true,
      comments: {
        include: {
          user: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 3,
      },
    },
    orderBy:
      order === 'latest'
        ? { createdAt: 'desc' }
        : order === 'saves'
        ? { saves: { _count: 'desc' } }
        : [{ reactions: { _count: 'desc' } }, { createdAt: 'desc' }],
    take: 50,
  });

  return NextResponse.json(prompts);
}

export async function POST(request: Request) {
  if (!rateLimit(getClientIp(request))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = promptSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const prompt = await prisma.prompt.create({
    data: {
      id: uuidv7(),
      title: parsed.data.title,
      body: parsed.data.body,
      agentId: parsed.data.agentId,
      isPublic: parsed.data.isPublic,
      lang: parsed.data.lang,
      tags: parsed.data.tags,
      userId: session.user.id,
    },
  });

  return NextResponse.json(prompt, { status: 201 });
}
