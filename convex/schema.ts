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
      .index("by_status", ["status"])
});

export default schema;
