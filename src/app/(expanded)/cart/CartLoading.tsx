import React from "react";

function CartIsLoading() {
   return (
      <main data-testid="cart-loading" className="h-screen overflow-hidden bg-gray-200 pt-20 pb-6">
         <section className="box-container grid size-full grid-cols-[1fr_18rem] gap-4">
            <section className="h-full rounded-xl bg-white p-6">
               <div className="flex h-full animate-pulse flex-col justify-between gap-y-6">
                  <div className="flex items-center justify-between">
                     <div className="h-8 w-48 rounded bg-gray-200"></div>
                     <div className="flex items-center gap-4">
                        <div className="h-6 w-24 rounded bg-gray-200"></div>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <div className="h-6 w-16 rounded bg-gray-200"></div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="grid grid-cols-[2fr_1fr_1fr_1fr_5rem] gap-4 border-b border-gray-200 pb-3">
                        {[...Array(5)].map((_, i) => (
                           <div key={i} className="h-6 rounded bg-gray-200"></div>
                        ))}
                     </div>

                     {[...Array(3)].map((_, i) => (
                        <div
                           key={i}
                           className="grid grid-cols-[2fr_1fr_1fr_1fr_5rem] gap-4 border-b border-gray-200 py-3 pb-6"
                        >
                           <div className="flex items-center gap-x-6">
                              <div className="size-16 rounded-md bg-gray-200"></div>
                              <div className="h-4 w-32 rounded bg-gray-200"></div>
                           </div>
                           <div className="flex items-center justify-center">
                              <div className="h-10 w-32 rounded bg-gray-200"></div>
                           </div>
                           <div className="flex items-center justify-center">
                              <div className="h-4 w-16 rounded bg-gray-200"></div>
                           </div>
                           <div className="flex items-center justify-center">
                              <div className="h-4 w-16 rounded bg-gray-200"></div>
                           </div>
                           <div className="flex items-center justify-center">
                              <div className="size-10 rounded-full bg-gray-200"></div>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="mt-auto flex justify-between">
                     <div className="h-12 w-40 rounded-xl bg-gray-200"></div>
                     <div className="h-12 w-32 rounded-xl bg-gray-200"></div>
                  </div>
               </div>
            </section>

            <aside className="rounded-xl bg-white p-6">
               <div className="flex h-full animate-pulse flex-col gap-y-6">
                  <div className="h-8 w-32 rounded bg-gray-200"></div>
                  <div className="flex gap-2">
                     <div className="h-10 flex-1 rounded bg-gray-200"></div>
                     <div className="h-10 w-20 rounded bg-gray-200"></div>
                  </div>
                  <div className="flex flex-col gap-y-2 pt-4">
                     {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex justify-between">
                           <div className="h-4 w-24 rounded bg-gray-200"></div>
                           <div className="h-4 w-16 rounded bg-gray-200"></div>
                        </div>
                     ))}
                  </div>
               </div>
            </aside>
         </section>
      </main>
   );
}

export default CartIsLoading;
