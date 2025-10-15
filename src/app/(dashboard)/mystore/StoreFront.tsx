"use client";

import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { usePreloadedQuery, Preloaded } from "convex/react";

function StoreFront({ preloadStore }: { preloadStore: Preloaded<typeof api.store.getMyStore> }) {
   "use client";

   const store = usePreloadedQuery(preloadStore);
   if (!store) return null;

   return (
      <div className="shadow-card scroll-hide col-span-1 col-start-2 flex-1 space-y-3 overflow-y-auto rounded-lg bg-white p-3">
         {/* Store front */}
         <section className="rounded-lg border border-gray-200">
            <div className="aspect-[3/1] w-full overflow-hidden rounded-t-lg bg-[#EAE9E5]">
               <Image
                  priority
                  src={store.cover || "/placeholder-cover.jpg"}
                  alt="Store cover"
                  width={1280}
                  height={720}
                  className="h-full w-full object-cover object-top"
               />
            </div>

            <div className="rounded-md px-4">
               <div className="flex items-end gap-x-8">
                  {/* Logo */}
                  <div className="relative w-48 flex-shrink-0">
                     <div className="absolute inset-x-0 bottom-0 aspect-[1/1] overflow-hidden rounded-full bg-white p-1">
                        <Image
                           priority
                           src={store.logo || "/placeholder-logo.jpg"}
                           alt="Store logo"
                           width={256}
                           height={256}
                           className="rounded-full border border-gray-200 object-cover"
                        />
                     </div>
                  </div>

                  {/* Info */}
                  <div className="flex w-full items-center justify-between gap-x-8 py-10 leading-none">
                     <div className="flex flex-col gap-y-1.5">
                        <h2 className="text-foreground text-2xl font-bold">{store.name}</h2>
                        <div className="flex items-center gap-x-2">
                           <p className="text-foreground">@{store.slug}</p>
                           <span className="size-1.5 flex-shrink-0 rounded-full bg-gray-300"></span>
                           <p>
                              <span className="text-foreground font-semibold">0</span>
                              <span> Followers</span>
                           </p>
                        </div>
                     </div>

                     <Button
                        variant="default"
                        className="rounded-full px-5 py-2 text-lg font-semibold"
                     >
                        Follow
                     </Button>
                  </div>
               </div>
            </div>
         </section>

         {/* Store content */}
         <main className="space-y-6 rounded-lg">
            <div className="space-y-4 rounded-md border border-gray-100 bg-white p-4 text-lg font-semibold">
               <h2 className="text text-foreground font-bold">Products</h2>
               <div>Products will be added soon</div>
            </div>
         </main>
      </div>
   );
}

export default StoreFront;
