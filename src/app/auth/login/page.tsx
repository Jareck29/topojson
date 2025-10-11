'use client';

import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { t } = useTranslation('auth');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginSchema) => {
    await signIn('credentials', {
      email: values.email,
      password: values.password,
      callbackUrl: '/',
    });
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8 rounded-3xl border border-slate-200 bg-white/80 p-10 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">{t('welcomeBack')}</h1>
        <p className="text-slate-500">
          {t('needAccount')} <Link href="/auth/register" className="text-primary">{t('register')}</Link>
        </p>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">{t('email')}</label>
          <Input type="email" {...register('email')} />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">{t('password')}</label>
          <Input type="password" {...register('password')} />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {t('login')}
        </Button>
      </form>
    </div>
  );
}
