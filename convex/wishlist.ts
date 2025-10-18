import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const toggleWishlistItem = mutation({
   args: {
      productId: v.id("products")
   },
   handler: async (ctx, { productId }) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new ConvexError("Unauthorized");

      // Check if item exists in wishlist
      const existing = await ctx.db
         .query("wishlist")
         .withIndex("by_wishlist_user", (q) => q.eq("userId", userId).eq("productId", productId))
         .unique();

      if (existing) {
         // Remove from wishlist
         await ctx.db.delete(existing._id);
         return { message: "Wishlist updated", action: "removed" };
      } else {
         // Add to wishlist
         await ctx.db.insert("wishlist", { userId, productId });
         return { message: "Wishlist updated", action: "added" };
      }
   }
});

