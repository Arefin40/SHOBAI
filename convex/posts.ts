import { v, ConvexError } from "convex/values";
import { query, mutation } from "./_generated/server";
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

export const getAllPosts = query({
   args: {},
   handler: async (ctx) => {
      // Get all posts, newest first
      const posts = await ctx.db.query("posts").order("desc").collect();

      // For each post, fetch store and products
      const allPosts = [];
      for (const post of posts) {
         const store = await ctx.db.get(post.storeId);

         const postProducts = await ctx.db
            .query("post_products")
            .withIndex("by_post_product", (q) => q.eq("postId", post._id))
            .collect();

         const products = [];
         for (const pp of postProducts) {
            const prod = await ctx.db.get(pp.productId);
            if (prod) products.push(prod);
         }

         allPosts.push({ ...post, store, products });
      }
      return allPosts;
   }
});

export const deletePost = mutation({
   args: { id: v.id("posts") },
   handler: async (ctx, { id }) => {
      // Check if the user is authenticated
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new ConvexError({ status: 401, message: "Unauthorized" });

      // Check if the post exists
      const post = await ctx.db.get(id);
      if (!post) throw new ConvexError("Post not found");

      // Check if the merchant has an store
      const store = await ctx.db
         .query("stores")
         .withIndex("by_merchant", (q) => q.eq("merchant", userId))
         .unique();
      if (!store) throw new ConvexError("Store not found");

      // Check if the post belongs to the store
      if (post.storeId !== store._id) throw new ConvexError("Post does not belong to your store");

      // Delete related post_products
      const postProducts = await ctx.db
         .query("post_products")
         .withIndex("by_post_product", (q) => q.eq("postId", id))
         .collect();

      // Delete the post products and the post
      for (const pp of postProducts) {
         await ctx.db.delete(pp._id);
      }
      await ctx.db.delete(id);

      return { success: true, message: "Post deleted successfully" };
   }
});

export const getMyStorePosts = query({
   args: {},
   handler: async (ctx) => {
      // Check if the user is authenticated
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new ConvexError({ status: 401, message: "Unauthorized" });

      // Check if the merchant has an store
      const store = await ctx.db
         .query("stores")
         .withIndex("by_merchant", (q) => q.eq("merchant", userId))
         .unique();
      if (!store) throw new ConvexError("Store not found");

      // COllect all posts of this store
      const posts = await ctx.db
         .query("posts")
         .withIndex("by_post_store", (q) => q.eq("storeId", store._id))
         .order("desc")
         .collect();

      const storePosts = [];
      for (const post of posts) {
         // Collect the products related to the post
         const postProducts = await ctx.db
            .query("post_products")
            .withIndex("by_post_product", (q) => q.eq("postId", post._id))
            .collect();

         const products = [];
         for (const pp of postProducts) {
            const prod = await ctx.db.get(pp.productId);
            if (prod && "image" in prod) products.push(prod.image);
         }
         storePosts.push({ ...post, products });
      }

      return storePosts;
   }
});

export const toggleLikePost = mutation({
   args: { postId: v.id("posts") },
   handler: async (ctx, { postId }) => {
      // Check if the user is authenticated
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new ConvexError({ status: 401, message: "Unauthorized" });

      // Check if the post exists
      const post = await ctx.db.get(postId);
      if (!post) throw new ConvexError("Post not found");

      // Check if user has already liked the post
      const alreadyLiked = await ctx.db
         .query("post_likes")
         .withIndex("by_user_post", (q) => q.eq("userId", userId).eq("postId", postId))
         .unique();

      // Insert or Delete post like (toggle)
      let message = "";
      if (alreadyLiked) {
         await ctx.db.delete(alreadyLiked._id);
         await ctx.db.patch(postId, { total_likes: Math.max(0, post.total_likes - 1) });
         message = "Post has been liked successfully";
      } else {
         await ctx.db.insert("post_likes", { postId, userId });
         await ctx.db.patch(postId, { total_likes: post.total_likes + 1 });
         message = "Post has been unliked successfully";
      }

      return { success: true, message };
   }
});

export const getLikedPosts = query({
   args: {},
   handler: async (ctx) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new ConvexError({ status: 401, message: "Unauthorized" });

      const likes = await ctx.db
         .query("post_likes")
         .withIndex("by_reacted_user", (q) => q.eq("userId", userId))
         .collect();

      return likes.map((like) => like.postId);
   }
});
