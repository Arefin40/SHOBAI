import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const getCurrentUser = query({
   args: {},
   handler: async (ctx) => {
      const userId = await getAuthUserId(ctx);
      if (userId === null) return null;
      const user = await ctx.db.get(userId);
      if (!user) return null;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _creationTime, _id, ...restUserData } = user;
      return { id: _id, ...restUserData };
   }
});
