import React from "react";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import StoreFront from "./StoreFront";

export default async function MyStore() {
   const preloadedStore = await preloadQuery(
      api.store.getMyStore,
      {},
      { token: await convexAuthNextjsToken() }
   );

   return <StoreFront preloadStore={preloadedStore} />;
}
