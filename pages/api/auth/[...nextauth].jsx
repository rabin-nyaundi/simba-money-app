import NextAuth from "next-auth";
import prisma from "../../../lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

let userAccount;

const options = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error("User with email not found");
          }
          const checkPassword = await compare(
            credentials.password,
            user.password
          );

          if (!checkPassword) {
            throw new Error("Invalid password");
          }

          userAccount = user;
          console.log(userAccount);
          return Promise.resolve(user);

        } catch (error) {
          throw new Error(error);
        }

      },
    }),
  ],

  callbacks: {
    async session(session, token) {
      if (userAccount !== null) {
        session.user = userAccount;
      } else if (
        typeof token.user !== typeof undefined &&
        (typeof session.user === typeof undefined ||
          (typeof session.user !== typeof undefined &&
            typeof session.user.userId === typeof undefined))
      ) {
        session.user = token.user;
      } else if (typeof token !== typeof undefined) {
        session.token = token;
      }
      return session;
    },
    
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token;
    },
  },

  session: {
    jwt: true,
    maxAge: 24 * 60 * 60,
  },

  pages: {
    error: "/auth/login",
    signIn: "/auth/login",
    signOut: "/auth/login",
  },
};
export default (req, res) => NextAuth(req, res, options);
