import type {DefaultSession} from "next-auth";
import "next-auth/jwt";

export type ExtendedUser = DefaultSession["user"] & {
  username: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
  }
}
