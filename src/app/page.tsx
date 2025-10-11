import { getServerAuthSession } from '@/lib/auth';
import { getTrendingFeed } from '@/lib/feed';
import { PromptCard } from '@/components/prompt-card';
import { Metadata } from 'next';
import { getScopedI18n } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Promptverse',
};

interface HomeProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Home({ searchParams }: HomeProps) {
  const session = await getServerAuthSession();
  const t = await getScopedI18n('home');
  const order = (searchParams?.order as 'trending' | 'latest' | 'saves') ?? 'trending';
  const section = searchParams?.section as string | undefined;
  const query = searchParams?.q as string | undefined;
  const feed = await getTrendingFeed({ orderBy: order, sectionSlug: section, search: query });

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">{t('headline')}</h1>
        <p className="max-w-2xl text-slate-600 dark:text-slate-300">{t('subhead')}</p>
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
