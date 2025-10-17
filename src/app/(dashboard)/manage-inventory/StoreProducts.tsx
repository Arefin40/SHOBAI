"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { usePreloadedQuery, Preloaded } from "convex/react";
import DeleteProductButton from "./DeleteProductButton";

function StoreProducts({
   preloadedProducts
}: {
   preloadedProducts: Preloaded<typeof api.products.getMyStoreProducts>;
}) {
   const products = usePreloadedQuery(preloadedProducts) || [];

   return products.length > 0 ? (
      <div className="border-border rounded-md border">
         <table className="min-w-full border-collapse bg-white">
            <thead className="bg-accent">
               <tr>
                  <th className="text-muted-foreground px-4 py-3 text-left text-sm font-semibold">
                     Product
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-sm font-semibold">
                     Price
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-sm font-semibold">
                     Stock
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-sm font-semibold">
                     Status
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-right text-sm font-semibold">
                     Action
                  </th>
               </tr>
            </thead>
            <tbody>
               {products.map((product) => (
                  <tr key={product._id}>
                     <td className="px-4 py-2 text-sm">
                        <div className="flex items-center gap-x-4">
                           <Image
                              src={product.image || "/images/product.png"}
                              alt={product.name}
                              width={56}
                              height={56}
                              className="size-14 rounded-md object-cover object-top"
                           />
                           <div>
                              <p className="text-sm font-medium">{product.name}</p>
                              <p className="text-muted-foreground text-sm">{product.category}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-4 py-2 text-sm">${product.price}</td>
                     <td className="px-4 py-2 text-sm">{product.stock}</td>
                     <td className="px-4 py-2 text-sm">
                        <span
                           className={`rounded-full px-2 py-1 text-xs font-medium ${
                              product.isActive
                                 ? "bg-green-100 text-green-800"
                                 : "bg-red-100 text-red-800"
                           }`}
                        >
                           {product.isActive ? "Active" : "Inactive"}
                        </span>
                     </td>

                     <td className="px-4 py-2 text-sm">
                        <div className="flex justify-center gap-x-3">
                           <Link
                              href={`/products/${product._id}/update`}
                              className="text-muted-foreground bg-muted hover:text-foreground flex-center size-9 rounded-full transition-colors"
                           >
                              <Pencil className="size-5" />
                           </Link>

                           <DeleteProductButton productId={product._id} />
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   ) : (
      <>
         <div className="flex-center text-muted-foreground h-full flex-1 grow">
            You have&apos;t added any product yet
         </div>
      </>
   );
}

export default StoreProducts;
