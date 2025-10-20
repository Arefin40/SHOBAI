import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });

type Database = ReturnType<typeof createDatabase>;

function createDatabase() {
   const connectionString = process.env.DATABASE_URL;

   if (!connectionString) {
      throw new Error(
         "DATABASE_URL is not set. Add it to .env.local or the deployment environment variables."
      );
   }

   return drizzle({ client: neon(connectionString) });
}

let database: Database | undefined;

function getDatabase(): Database {
   database ??= createDatabase();
   return database;
}

// Initialize the client lazily so importing this module (for example while
// collecting page data during a build) does not require a database connection.
export const db = new Proxy({} as Database, {
   get(_target, property) {
      const instance = getDatabase();
      const value = Reflect.get(instance, property, instance);

      return typeof value === "function" ? value.bind(instance) : value;
   }
});
