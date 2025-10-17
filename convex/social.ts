import { mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createPost = mutation({
   args: {
      content: v.string(),
      products: v.array(v.id("products"))
   },
   handler: async (ctx, { content, products }) => {
      // Check if the user is authenticated
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new ConvexError({ status: 401, message: "Unauthorized" });

      // Find the store for this merchant
      const store = await ctx.db
         .query("stores")
         .withIndex("by_merchant", (q) => q.eq("merchant", userId))
         .unique();
      if (!store) throw new ConvexError("Store not found");

      // Insert post and post_products
      const postId = await ctx.db.insert("posts", { storeId: store._id, content, total_likes: 0 });
      for (const productId of products) {
         await ctx.db.insert("post_products", { postId, productId });
      }

      return { success: true, message: "Post created successfully" };
   }
});
