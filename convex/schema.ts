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
   }).index("email", ["email"])
});

export default schema;
