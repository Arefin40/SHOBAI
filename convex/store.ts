import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create a new store for a merchant.
 * Expects: { merchant: Id<"users">, name: string, slug: string, description: string, logo?: string, cover?: string }
 * Throws if the merchant already has a store.
 */
export const createStore = mutation({
  args: {
    merchant: v.id("users"),
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    logo: v.optional(v.string()),
    cover: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Check if the merchant already has a store
    const existing = await ctx.db
      .query("stores")
      .withIndex("by_merchant", (q) => q.eq("merchant", args.merchant))
      .first();
    if (existing) {
      throw new Error("Store already exists for this merchant");
    }

    // Insert the new store
    const storeId = await ctx.db.insert("stores", {
      merchant: args.merchant,
      name: args.name,
      slug: args.slug,
      description: args.description,
      logo: args.logo,
      cover: args.cover,
      totalFollowers: 0,
      isActive: true
    });

    return { success: true, id: storeId };
  }
});
