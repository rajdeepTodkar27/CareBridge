import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { connect } from '@/dbconfig/dbconfig'
import User from '@/models/User'
type Icredentials = {
  email : string,
  password: string
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connect();
        const { email, password } = credentials as Icredentials;
        const user = await User.findOne({ email: email });
        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid || !user.isActive) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          centerId: user.centerId
        };
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      await connect();

      
      if (account?.provider === 'google') {
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          
          const newUser = new User({
            email: user.email,
            password: '', 
            role: 'patient',
            centerId: ''
          });

          await newUser.save();
        }
        if(!existingUser.isActive) return false
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || 'patient'
        token.email = user.email
        token.centerId = user.centerId
      }
      return token;
    },

    async session({ session, token }) {
      session.user.role = token.role;
      session.user.email = token.email
      session.user.centerId = token.centerId;
      return session;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
