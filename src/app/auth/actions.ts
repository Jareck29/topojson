'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { hash } from 'argon2';
import { uuidv7 } from 'uuidv7';
import { revalidatePath } from 'next/cache';

const registerSchema = z
  .object({
    username: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export async function registerUser(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: parsed.data.email }, { username: parsed.data.username }] },
  });

  if (existing) {
    return { error: { email: ['User already exists'] } };
  }

  const passwordHash = await hash(parsed.data.password);

  await prisma.user.create({
    data: {
      id: uuidv7(),
      email: parsed.data.email,
      username: parsed.data.username,
      passwordHash,
      role: 'USER',
    },
  });

  revalidatePath('/');
  return { success: true };
}
