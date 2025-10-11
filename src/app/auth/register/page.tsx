'use client';

import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { registerUser } from '@/app/auth/actions';

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

type RegisterSchema = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { t } = useTranslation('auth');
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterSchema>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterSchema) => {
    const form = new FormData();
    Object.entries(values).forEach(([key, value]) => form.append(key, value));
    const result = await registerUser(form);
    if (result?.error) {
      setServerError('No se pudo crear la cuenta.');
      return;
    }
    setServerError(null);
    reset();
    toast.success('Cuenta creada. Ya puedes iniciar sesión.');
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8 rounded-3xl border border-slate-200 bg-white/80 p-10 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">{t('createAccount')}</h1>
        <p className="text-slate-500">
          {t('haveAccount')} <Link href="/auth/login" className="text-primary">{t('login')}</Link>
        </p>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Usuario</label>
          <Input {...register('username')} />
          {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
        </div>
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
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">{t('confirmPassword')}</label>
          <Input type="password" {...register('confirmPassword')} />
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>
        {serverError && <p className="text-sm text-red-500">{serverError}</p>}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {t('register')}
        </Button>
      </form>
    </div>
  );
}
