import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { getScopedI18n, getCurrentLocale } from '@/lib/i18n';

export async function Sidebar() {
  const locale = getCurrentLocale();
  const t = await getScopedI18n('common');
  const sections = await prisma.section.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <aside className="hidden w-72 border-r border-slate-200 bg-white/60 px-6 py-8 dark:border-slate-800 dark:bg-slate-950/40 md:block">
      <nav className="space-y-6">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{t('actions')}</p>
          <ul className="space-y-2 text-sm font-medium text-slate-600">
            <li>
              <Link href="/?order=trending" className="rounded-xl px-3 py-2 transition hover:bg-primary/10 hover:text-primary">
                {t('trending')}
              </Link>
            </li>
            <li>
              <Link href="/?order=latest" className="rounded-xl px-3 py-2 transition hover:bg-primary/10 hover:text-primary">
                {t('latest')}
              </Link>
            </li>
            <li>
              <Link href="/?order=saves" className="rounded-xl px-3 py-2 transition hover:bg-primary/10 hover:text-primary">
                {t('saved')}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Secciones</p>
          <ul className="space-y-2 text-sm">
            {sections.map((section) => (
              <li key={section.id}>
                <Link
                  href={`/secciones/${section.slug}`}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-slate-600 transition hover:bg-primary/10 hover:text-primary"
                >
                  <span>{(section.name_i18n as any)[locale]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
