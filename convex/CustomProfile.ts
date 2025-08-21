import { DataModel } from "./_generated/dataModel";
import { Password } from "@convex-dev/auth/providers/Password";

export default Password<DataModel>({
   profile(params, ctx) {
      return {
         email: params.email as string,
         name: params.name as string
      };
   }
});
