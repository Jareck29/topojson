import { getServerAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getScopedI18n } from '@/lib/i18n';

export default async function AdminDashboard() {
  const session = await getServerAuthSession();
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }
  const t = await getScopedI18n('admin');

  const [stats, topSections] = await Promise.all([
    prisma.prompt.count(),
    prisma.section.findMany({
      include: {
        _count: {
          select: {
            agents: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    }),
  ]);

  const activeUsers = await prisma.user.count({
    where: {
      prompts: {
        some: {
          createdAt: {
            gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
          },
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">{t('dashboard')}</h1>
        <p className="text-slate-500">Monitoriza la actividad de la comunidad.</p>
      </header>
      <section className="grid gap-6 md:grid-cols-3">
        <StatCard title="Usuarios activos (30d)" value={activeUsers} />
        <StatCard title="Prompts totales" value={stats} />
        <StatCard title="Secciones" value={topSections.length} />
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{t('sections')}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {topSections.map((section) => (
            <div key={section.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/60">
              <p className="font-semibold text-primary">{(section.name_i18n as any)['es']}</p>
              <p className="text-sm text-slate-500">Agentes: {section._count.agents}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <p className="text-sm uppercase tracking-wide text-slate-400">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
