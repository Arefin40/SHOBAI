import React from "react";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import Products from "./Products";

async function ProductsPage() {
   const preloadedProducts = await preloadQuery(
      api.products.getAllProductsWithStore,
      {},
      { token: await convexAuthNextjsToken() }
   );

   return <Products preloadedProducts={preloadedProducts} />;
}

export default ProductsPage;
