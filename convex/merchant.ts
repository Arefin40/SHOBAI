import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const becomeMerchant = mutation({
   args: { email: v.string(), nid: v.string(), mobile: v.string() },

   handler: async (ctx, args) => {
      // Check if the user exits
      const user = await ctx.db
         .query("users")
         .withIndex("by_email", (q) => q.eq("email", args.email))
         .first();
      if (!user) throw new Error("Merchant application submission failed");

      // Create merchant application
      const merchantId = await ctx.db.insert("merchant_applications", {
         userId: user._id,
         nid: args.nid,
         mobile: args.mobile,
         status: "pending"
      });

      return merchantId;
   }
});
