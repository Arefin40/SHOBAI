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

export const getAllProductsWithStore = query({
   args: {},
   handler: async (ctx) => {
      const products = await ctx.db.query("products").collect();
      return await Promise.all(
         products.map(async (product) => {
            const store = await ctx.db.get(product.storeId);
            return { ...product, store };
         })
      );
   }
});

export const getMyStoreProducts = query({
   args: {},
   handler: async (ctx) => {
      // Check if user is authenticated
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new ConvexError("Unauthorized");

      // Find the store for the current merchant
      const store = await ctx.db
         .query("stores")
         .withIndex("by_merchant", (q) => q.eq("merchant", userId))
         .unique();
      if (!store) throw new ConvexError("Store not found");

      // Get products for this store
      const products = await ctx.db
         .query("products")
         .withIndex("by_storeId", (q) => q.eq("storeId", store._id))
         .order("desc")
         .collect();

      return products;
   }
});

export const getProductById = query({
   args: { id: v.id("products") },
   handler: async (ctx, { id }) => {
      // Check if product exists
      const product = await ctx.db.get(id);
      if (!product) return null;

      // Check if related store exists
      const store = await ctx.db.get(product.storeId);
      if (!store) return null;

      // Get product images
      const images = await ctx.db
         .query("product_images")
         .withIndex("by_product", (q) => q.eq("productId", id))
         .collect();

      return {
         ...product,
         images: images.map((img) => img.image),
         store: {
            id: store._id,
            name: store.name,
            logo: store.logo,
            slug: store.slug
         }
      };
   }
});

export const updateProduct = mutation({
   args: {
      id: v.id("products"),
      data: v.object({
         name: v.optional(v.string()),
         image: v.optional(v.string()),
         category: v.optional(v.string()),
         description: v.optional(v.string()),
         price: v.optional(v.number()),
         stock: v.optional(v.number()),
         total_likes: v.optional(v.number()),
         isActive: v.optional(v.boolean())
      })
   },
   handler: async (ctx, { id, data }) => {
      try {
         await ctx.db.patch(id, data);
         return { success: true, message: "Product updated successfully" };
      } catch (error) {
         throw new ConvexError("Failed to update product");
      }
   }
});

export const deleteProduct = mutation({
   args: { id: v.id("products") },
   handler: async (ctx, { id }) => {
      try {
         await ctx.db.delete(id);
         return { success: true, message: "Product deleted successfully" };
      } catch (error) {
         throw new ConvexError("Failed to delete product");
      }
   }
});
