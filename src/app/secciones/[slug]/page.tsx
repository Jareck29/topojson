import { getTrendingFeed } from '@/lib/feed';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PromptCard } from '@/components/prompt-card';
import { getServerAuthSession } from '@/lib/auth';
import { getScopedI18n, getCurrentLocale } from '@/lib/i18n';

interface SectionPageProps {
  params: { slug: string };
}

export default async function SectionPage({ params }: SectionPageProps) {
  const section = await prisma.section.findUnique({ where: { slug: params.slug } });
  if (!section) {
    notFound();
  }
  const session = await getServerAuthSession();
  const locale = getCurrentLocale();
  const t = await getScopedI18n('home');
  const feed = await getTrendingFeed({ sectionSlug: params.slug });

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">{(section.name_i18n as any)[locale]}</h1>
        <p className="max-w-2xl text-slate-600 dark:text-slate-300">{(section.description_i18n as any)[locale]}</p>
      </header>
      <section className="grid gap-6">
        {feed.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900/40">
            {t('empty')}
          </div>
        )}
        {feed.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} viewerId={session?.user?.id ?? null} />
        ))}
      </section>
    </div>
  );
}
