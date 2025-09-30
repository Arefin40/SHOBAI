import Lorem from "@/components/!Lorem";
import React from "react";

export default function Home() {
   return (
      <>
         <header className="flex-center fixed inset-x-0 top-0 z-50 h-16 border-b bg-white">
            Main Navigation
         </header>

         <section className="box-container fixed inset-0 grid overflow-hidden pt-16 md:grid-cols-[1fr_20rem] lg:grid-cols-[18rem_1fr_18rem] xl:grid-cols-[20rem_1fr_24rem]">
            <aside className="scroll-hide hidden w-72 overflow-y-auto border bg-white p-4 text-justify lg:block xl:w-80">
               <Lorem />
               {/* Sidebar */}
            </aside>

            <section className="scroll-hide overflow-y-auto border p-4 text-justify">
               <Lorem />
               {/* Main */}
            </section>

            <aside className="scroll-hide hidden w-72 overflow-y-auto border bg-white p-4 text-justify md:block xl:w-96">
               <Lorem />
               {/* Sidebar */}
            </aside>
         </section>
      </>
   );
}
