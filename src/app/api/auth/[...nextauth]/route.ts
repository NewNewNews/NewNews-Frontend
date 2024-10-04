import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      isAdmin: boolean;
    } & DefaultSession["user"];
    accessToken: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    token: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        hashedPassword: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.hashedPassword) return null;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!res.ok) return null;
        const user = await res.json();

        // Ensure that the user object contains the token
        const authToken = res.headers
          .get("set-cookie")
          ?.split(";")
          .find((cookie) => cookie.startsWith("auth_token"))
          ?.split("=")[1];
        console.log("this is my token", authToken);
        return {
          ...user,
          token: authToken, // Include the token in the user object
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token; // Use the token from the user object
      }

      // Fetch additional user data from /api/me here, if needed
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/protected/me`, {
        headers: {
          Cookie: `auth_token=${token.accessToken}`, // Pass the token here
        },
        credentials: "include",
      });
      // console.log("This is respond", res.json());

      if (res.ok) {
        const userData = await res.json();
        token.id = userData.id;
        token.name = userData.name;
        token.email = userData.email;
        token.isAdmin = userData.isAdmin;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          isAdmin: token.isAdmin as boolean,
        };
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
