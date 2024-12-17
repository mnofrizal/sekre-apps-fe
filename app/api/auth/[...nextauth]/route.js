import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await fetch("http://localhost:4000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Invalid credentials");
          }

          const { user, accessToken } = data.data;

          if (!user || !accessToken) {
            throw new Error("Invalid response from server");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Initial sign in
        token.accessToken = user.accessToken;
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
        return token;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Error page
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});

export { handler as GET, handler as POST };
