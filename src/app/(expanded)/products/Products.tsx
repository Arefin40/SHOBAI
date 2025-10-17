"use client";

import React from "react";
import { api } from "@/convex/_generated/api";
import { usePreloadedQuery, Preloaded } from "convex/react";
import ProductCard from "./ProductCard";

function Products({
   preloadedProducts
}: {
   preloadedProducts: Preloaded<typeof api.products.getAllProductsWithStore>;
}) {
   const products = usePreloadedQuery(preloadedProducts) || [];

   return (
      <section className="h-screen bg-white">
         <main className="box-container h-full grid-cols-[18rem_1fr] gap-4">
            <div
               data-testid="product-grid"
               className="scroll-hide grid h-full grid-cols-2 items-start gap-4 overflow-y-auto pt-20 md:grid-cols-3 xl:grid-cols-4"
            >
               {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
               ))}
            </div>
         </main>
      </section>
   );
}

export default Products;
