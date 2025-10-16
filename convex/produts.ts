import { v, ConvexError } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createProduct = mutation({
   args: {
      name: v.string(),
      image: v.optional(v.string()),
      category: v.string(),
      description: v.string(),
      price: v.number(),
      stock: v.number(),
      images: v.optional(v.array(v.string()))
   },
   handler: async (ctx, args) => {
      // Check if user is not authenticated, return error
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new ConvexError("Unauthorized");

      // Check if store exists
      const store = await ctx.db
         .query("stores")
         .withIndex("by_merchant", (q) => q.eq("merchant", userId))
         .unique();
      if (!store) throw new ConvexError("Store not found");

      // Create product
      const productId = await ctx.db.insert("products", {
         storeId: store._id,
         name: args.name,
         image: args.image,
         category: args.category,
         description: args.description,
         price: args.price,
         stock: args.stock,
         total_sales: 0,
         total_reviews: 0,
         total_likes: 0,
         isActive: true
      });

      // Create product images
      if (args.images && args.images.length > 0) {
         for (const image of args.images) {
            await ctx.db.insert("product_images", { productId: productId, image });
         }
      }

      return { success: true, message: "Product created successfully" };
   }
});

