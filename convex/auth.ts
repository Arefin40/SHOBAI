import Google from "@auth/core/providers/google";
import Password from "./CustomProfile";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
   providers: [Password, Google],

   callbacks: {
      async createOrUpdateUser(ctx, args) {
         // existing user
         if (args.existingUserId) {
            const existingUser = await ctx.db.get(args.existingUserId);
            const role = existingUser?.role ?? "user";
            await ctx.db.patch(args.existingUserId, {
               name: args.profile.name,
               email: args.profile.email,
               image: args.profile.image,
               role
            });
            return args.existingUserId;
         }

         // new user creation
         return ctx.db.insert("users", {
            name: args.profile.name,
            email: args.profile.email,
            image: args.profile.image,
            role: "user"
         });
      }
   }
});
