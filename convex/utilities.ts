import { mutation } from "./_generated/server";
import schema from "./schema";

export const clearAllTables = mutation({
   args: {},
   handler: async (ctx) => {
      const tableNames = Object.keys(schema.tables) as Array<keyof typeof schema.tables>;
      for (const table of tableNames) {
         const docs = await ctx.db.query(table).collect();
         await Promise.all(docs.map((doc) => ctx.db.delete(doc._id)));
      }
   }
});
