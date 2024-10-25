import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"


// HANDLES api/auth/callback/google NATIVELY
// /api/auth/signin/google - The sign-in endpoint
// /api/auth/callback/google - The callback endpoint
// /api/auth/signout - The sign-out endpoint
// /api/auth/session - The session endpoint
// /api/auth/csrf - The CSRF token endpoint

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account consent", // Add consent to force Google to show permissions screen
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}/api/registration/signup/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: profile.email,
              first_name: profile.name?.split(' ')[0] || '',
              last_name: profile.name?.split(' ').slice(1).join(' ') || '',
              google_id: profile.sub,
            }),
          });

          const data = await response.json();
          console.log('Backend response:', data); // Debug log

          // Check for user exists in the UserResponse object
          if (data?.message === 'User already exists' || 
              (data[0] && data[0].email === profile.email)) {
            return `/auth/signin?message=${encodeURIComponent('Account already exists. Please sign in.')}`;
          }

          if (!response.ok) {
            // Pass the actual error message from the backend
            const errorMessage = data?.detail || data?.message || 'Authentication failed';
            return `/auth/error?error=${encodeURIComponent(errorMessage)}`;
          }

          return true;
        } catch (error) {
          console.error('Full error details:', error); // Debug log
          const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
          return `/auth/error?error=${encodeURIComponent(errorMessage)}`;
        }
      }
      return false;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to registration page after successful sign in
      return `${baseUrl}/registration?step=organizationDetails`;
    },
    async jwt({ token, account, profile }) {
      // Initial sign in
      if (account && profile) {
        return {
          ...token,
          email: profile.email,
          name: profile.name,
          picture: profile.image,
          sub: profile.sub,
          raw_profile: profile.email
        };
      }
      // Subsequent uses of the token
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },
  },
  debug: false,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }
