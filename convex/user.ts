import { ConvexError, v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Get all users except the current authenticated user.
 */
export const getAllUsers = query({
   args: {},
   handler: async (ctx) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) return [];
      const users = await ctx.db.query("users").collect();
      return users
         .filter((user) => user._id != userId)
         .map(({ _id, ...rest }) => ({
            id: _id,
            image: rest.image ?? undefined,
            role: (rest.role as "user" | "merchant" | "admin" | undefined) ?? undefined,
            name: rest.name,
            email: rest.email
         }));
   }
});

/**
 * Get currently loggin in user
 */
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

/**
 * Change a user's role.
 */
export const changeRole = mutation({
   args: {
      id: v.id("users"),
      role: v.union(v.literal("user"), v.literal("merchant"), v.literal("admin"))
   },
   handler: async (ctx, args) => {
      await ctx.db.patch(args.id, { role: args.role });
      return { success: true, message: "Role updated successfully" };
   }
});

/**
 * Get user's cart and wishlist items count
 */
export const getCartAndWishlistStats = query({
   args: {},
   handler: async (ctx) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new ConvexError("Unauthorized");

      const cart = await ctx.db
         .query("cart")
         .withIndex("by_cart_userId", (q) => q.eq("userId", userId))
         .first();

      const wishlistItems = await ctx.db
         .query("wishlist")
         .withIndex("by_wishlist_userId", (q) => q.eq("userId", userId))
         .collect();

      return {
         cartItems: cart?.totalQuantity || 0,
         wishlistItems: wishlistItems.length
      };
   }
});
