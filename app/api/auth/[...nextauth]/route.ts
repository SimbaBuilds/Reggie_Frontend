import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"


// HANDLES api/auth/callback/google NATIVELY

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // Ensure you have a session and callbacks configured if needed
  session: {
    strategy: 'jwt',
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback triggered', { token, user });
      // Add user info to the token if needed
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback triggered', { session, token });
      // Add token info to the session if needed
      return session;
    },
  },
  pages: {
    error: '/auth/error', // Custom error page
  },
})

export { handler as GET, handler as POST }
