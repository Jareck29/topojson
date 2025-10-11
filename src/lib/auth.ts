import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import { prisma } from './prisma';
import { hash, verify } from 'argon2';
import { z } from 'zod';
import { AdapterUser } from 'next-auth/adapters';
import { uuidv7 } from 'uuidv7';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
        if (!user) {
          return null;
        }

        const valid = await verify(user.passwordHash, parsed.data.password);
        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          role: user.role,
        } satisfies AdapterUser & { role: string };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.sub,
          role: token.role ?? 'USER',
        };
      }
      return session;
    },
    async jwt({ token, user, account, profile }: any) {
      if (user) {
        token.role = (user as any).role;
      }
      if (account && profile && token.email) {
        const existing = await prisma.user.findUnique({ where: { email: token.email } });
        if (!existing) {
          const created = await prisma.user.create({
            data: {
              id: uuidv7(),
              email: token.email,
              username: profile?.name ?? token.email.split('@')[0],
              role: 'USER',
              avatarUrl: (profile as any)?.picture ?? undefined,
              passwordHash: await hash(uuidv7()),
            },
          });
          token.role = created.role;
        } else if (existing) {
          token.role = existing.role;
        }
      }
      return token;
    },
  },
};

export const { auth: getServerAuthSession, handlers: { GET, POST } } = NextAuth(authOptions);
