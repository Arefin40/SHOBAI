import React from "react";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import Lorem from "@/components/sample/Lorem";
import Timeline from "./homepage/Timeline";

export default async function Home() {
   const preloadedPosts = await preloadQuery(
      api.posts.getAllPosts,
      {},
      { token: await convexAuthNextjsToken() }
   );

   const preloadedLikedPosts = await preloadQuery(
      api.posts.getLikedPosts,
      {},
      { token: await convexAuthNextjsToken() }
   );

   return (
      <section className="box-container fixed inset-0 grid overflow-hidden bg-gray-100 pt-16 md:grid-cols-[1fr_20rem] lg:grid-cols-[18rem_1fr_18rem] xl:grid-cols-[20rem_1fr_24rem]">
         <aside className="scroll-hide hidden w-72 overflow-y-auto border bg-white p-4 text-justify lg:block xl:w-80">
            <Lorem />
         </aside>

         <Timeline preloadedPosts={preloadedPosts} preloadedLikedPosts={preloadedLikedPosts} />

         <aside className="scroll-hide hidden w-72 overflow-y-auto border bg-white p-4 text-justify md:block xl:w-96">
            <Lorem />
         </aside>
      </section>
   );
}
