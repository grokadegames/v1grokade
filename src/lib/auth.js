import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Find user by username
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        // Check if user exists and password is correct
        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          return null;
        }

        // Get user roles
        const userRoles = await prisma.userRoles.findMany({
          where: { userId: user.id },
        });
        
        const roles = userRoles.map(ur => ur.role);
        const isAdmin = roles.includes('ADMIN');

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          isAdmin,
          allRoles: roles,
        };
      }
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.displayName = user.displayName;
        token.isAdmin = user.isAdmin;
        token.allRoles = user.allRoles;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        username: token.username,
        email: token.email,
        displayName: token.displayName,
        isAdmin: token.isAdmin,
        allRoles: token.allRoles,
      };
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.JWT_SECRET,
}; 