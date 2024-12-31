import type { TokenSet } from 'next-auth';
import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? ''
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async session({ session, token }: { session: any; token: TokenSet }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.providerAccountId = token.sub
      
      return session
    }
  }

})

export { handler as GET, handler as POST }
