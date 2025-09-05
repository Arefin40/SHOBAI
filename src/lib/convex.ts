import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

export const getCurrentUser = async (): Promise<User | null> => {
   const user = await fetchQuery(
      api.user.getCurrentUser,
      {},
      { token: await convexAuthNextjsToken() }
   );

   return user;
};
