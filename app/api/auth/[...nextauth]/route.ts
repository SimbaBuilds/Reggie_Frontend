import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return profile?.email ? true : false
      }
      return true // Do different verification for other providers that don't have `email_verified`
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? ''
        // You can add more user properties here if needed
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.uid = token.sub
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
