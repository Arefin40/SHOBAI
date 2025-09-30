import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

export const getAllMerchantApplications = query({
   args: {},
   handler: async (ctx) => {
      const applications = await ctx.db.query("merchant_applications").collect();
      return await Promise.all(
         applications.map(async (application) => {
            const user = await ctx.db.get(application.userId);
            return {
               id: application._id,
               name: user?.name ?? "",
               nid: application.nid,
               mobile: application.mobile,
               status: application.status
            };
         })
      );
   }
});

export const approveApplication = mutation({
   args: { id: v.id("merchant_applications") },
   handler: async (ctx, { id }) => {
      // Get the merchant application
      const application = await ctx.db.get(id);
      if (!application) throw new Error("Merchant application not found");

      // Update the application status to "approved"
      await ctx.db.patch(id, { status: "approved" });

      // Update the user's role to "merchant"
      await ctx.db.patch(application.userId, { role: "merchant" });
   }
});

export const rejectApplication = mutation({
   args: { id: v.id("merchant_applications") },
   handler: async (ctx, { id }) => {
      // Get the merchant application
      const application = await ctx.db.get(id);
      if (!application) throw new Error("Merchant application not found");

      // Update the application status to "rejected"
      await ctx.db.patch(id, { status: "rejected" });
   }
});
