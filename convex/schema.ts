import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
   ...authTables,

   users: defineTable({
      name: v.string(),
      image: v.optional(v.string()),
      email: v.string(),
      role: v.optional(v.union(v.literal("user"), v.literal("merchant"), v.literal("admin")))
   }).index("by_email", ["email"]),

   merchant_applications: defineTable({
      userId: v.id("users"),
      image: v.optional(v.string()),
      nid: v.string(),
      mobile: v.string(),
      comment: v.optional(v.string()),
      status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))
   })
      .index("by_userId", ["userId"])
      .index("by_nid", ["nid"])
      .index("by_status", ["status"]),

   stores: defineTable({
      merchant: v.id("users"),
      name: v.string(),
      slug: v.string(),
      description: v.string(),
      logo: v.optional(v.string()),
      cover: v.optional(v.string()),
      totalFollowers: v.number(),
      isActive: v.boolean()
   })
      .index("by_merchant", ["merchant"])
      .index("by_slug", ["slug"]),

   store_followers: defineTable({
      store: v.id("stores"),
      follower: v.id("users"),
      followed_at: v.number()
   })
      .index("by_store", ["store"])
      .index("by_follower", ["follower"]),

   products: defineTable({
      storeId: v.id("stores"),
      name: v.string(),
      image: v.optional(v.string()),
      category: v.string(),
      description: v.string(),
      price: v.number(),
      stock: v.number(),
      total_sales: v.number(),
      total_reviews: v.number(),
      total_likes: v.number(),
      isActive: v.boolean()
   }).index("by_storeId", ["storeId"]),

   product_images: defineTable({
      productId: v.id("products"),
      image: v.string()
   }).index("by_product", ["productId"]),

   posts: defineTable({
      storeId: v.id("stores"),
      content: v.string(),
      total_likes: v.number()
   }).index("by_post_store", ["storeId"]),

   post_products: defineTable({
      postId: v.id("posts"),
      productId: v.id("products")
   }).index("by_post_product", ["postId"]),

   post_likes: defineTable({
      postId: v.id("posts"),
      userId: v.id("users")
   })
      .index("by_user_post", ["userId", "postId"])
      .index("by_reacted_user", ["userId"])
      .index("by_like_post", ["postId"]),

   wishlist: defineTable({
      userId: v.id("users"),
      productId: v.id("products")
   })
      .index("by_wishlist_user", ["userId", "productId"])
      .index("by_wishlist_userId", ["userId"])
});

export default schema;
