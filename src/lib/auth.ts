import db from './db';
import * as bcrypt from 'bcryptjs';
import { pgAdapter } from './pg-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  adapter: pgAdapter,
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Email e senha',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const res = await db.query(
          'SELECT id, email, password_hash, email_verified, name FROM users WHERE email = $1',
          [credentials.email]
        );
        const user = res.rows[0];
        if (!user) return null;

        const valid = bcrypt.compareSync(credentials.password, user.password_hash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.email_verified ? new Date() : null,
        };
      },
    }),
  ]
};
