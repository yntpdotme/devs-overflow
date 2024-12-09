import bcryptjs from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import {getUser} from "@/lib/actions";
import {api} from "@/lib/api";
import {SignInSchema} from "@/lib/schemas";

export const {handlers, auth, signIn, signOut} = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        const {success, data} = SignInSchema.safeParse(credentials);

        if (success) {
          const {email, password} = data;

          const {data: existingAccount} =
            await api.accounts.getByProvider(email);
          if (!existingAccount || !existingAccount.password) return null;

          const {data: existingUser} = await api.users.getById(
            existingAccount.userId.toString()
          );

          if (!existingUser) return null;

          const passwordsMatch = await bcryptjs.compare(
            password,
            existingAccount.password
          );

          if (passwordsMatch)
            return {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
              image: existingUser.image,
            };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({token, account}) {
      if (account) {
        const {data: existingAccount, success} =
          await api.accounts.getByProvider(
            account.type === "credentials"
              ? token.email!
              : account.providerAccountId
          );

        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;

        const {data} = await getUser({
          userId: userId.toString(),
        });
        if (!data?.user) return token;

        if (userId) token.sub = userId.toString();
        token.username = data.user.username;
      }

      return token;
    },
    async session({session, token}) {
      if (token.sub && session.user) session.user.id = token.sub;
      if (token.username && session.user)
        session.user.username = token.username;
      
      return session;
    },
    async signIn({user, profile, account}) {
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;

      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username:
          account.provider === "github"
            ? (profile?.login as string)
            : (user.email!.split("@")[0] as string),
      };

      const {success} = await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as "github" | "google",
        providerAccountId: account.providerAccountId,
      });

      if (!success) return false;

      return true;
    },
  },
});
