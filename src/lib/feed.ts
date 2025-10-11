import { prisma } from './prisma';
import { getServerAuthSession } from './auth';
import { cache } from 'react';
import { uuidv7 } from 'uuidv7';

type FeedOptions = {
  orderBy?: 'trending' | 'latest' | 'saves';
  sectionSlug?: string;
  search?: string;
};

export const getTrendingFeed = cache(async ({ orderBy = 'trending', sectionSlug, search }: FeedOptions) => {
  const session = await getServerAuthSession();
  const viewerId = session?.user?.id ?? null;

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
      reposts: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      _count: {
        select: { comments: true, reposts: true },
      },
    },
    orderBy:
      orderBy === 'latest'
        ? { createdAt: 'desc' }
        : orderBy === 'saves'
        ? { saves: { _count: 'desc' } }
        : [{ reactions: { _count: 'desc' } }, { createdAt: 'desc' }],
    take: 20,
  });

  return prompts.map((prompt) => {
    const tags = Array.isArray(prompt.tags) ? prompt.tags : [];
    return {
      ...prompt,
      viewerId,
      likes: prompt.reactions.filter((r) => r.type === 'LIKE').length,
      dislikes: prompt.reactions.filter((r) => r.type === 'DISLIKE').length,
      isFavorited: prompt.favorites.some((f) => f.userId === viewerId),
      isSaved: prompt.saves.some((s) => s.userId === viewerId),
      tags,
    };
  });
});

export const createWithUuid = <T extends { id?: string }>(data: T): T => {
  if (!data.id) {
    return { ...data, id: uuidv7() };
  }
  return data;
};
