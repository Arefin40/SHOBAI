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
      .index("by_follower", ["follower"])
});

export default schema;
