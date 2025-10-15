import { v, ConvexError } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createStore = mutation({
   args: {
      name: v.string(),
      slug: v.string(),
      description: v.string(),
      logo: v.optional(v.string()),
      cover: v.optional(v.string())
   },
   handler: async (ctx, args) => {
      // Check if the user is authenticated
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new ConvexError({ status: 401, message: "Unauthorized" });

      // Check if the merchant already has a store
      const existing = await ctx.db
         .query("stores")
         .withIndex("by_merchant", (q) => q.eq("merchant", userId))
         .first();
      if (existing) {
         throw new Error("Store already exists for this merchant");
      }

      // Insert the new store
      const storeId = await ctx.db.insert("stores", {
         merchant: userId,
         name: args.name,
         slug: args.slug,
         description: args.description,
         logo: args.logo,
         cover: args.cover,
         totalFollowers: 0,
         isActive: true
      });

      return { success: true, id: storeId, slug: args.slug };
   }
});
