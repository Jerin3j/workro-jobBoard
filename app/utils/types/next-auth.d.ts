// types/next-auth.d.ts or wherever you're storing it

import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      userType?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    userType?: string | null;
  }
}
