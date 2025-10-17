"use client";

import React from "react";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { usePreloadedQuery, Preloaded } from "convex/react";
import PostAction from "./PostAction";

type PreloadedPosts = { preloadedPosts: Preloaded<typeof api.posts.getMyStorePosts> };

function StorePosts({ preloadedPosts }: PreloadedPosts) {
   const posts = usePreloadedQuery(preloadedPosts) || [];

   if (posts.length === 0) {
      return (
         <div className="flex-center text-muted-foreground h-full flex-1 grow">
            You have&apos;t published any posts yet
         </div>
      );
   }

   return (
      <div className="border-border overflow-hidden rounded-md border">
         <table className="min-w-full border-collapse bg-white">
            <thead className="bg-accent">
               <tr>
                  <th className="text-muted-foreground px-4 py-3 text-left text-sm font-semibold">
                     Content
                  </th>
                  <th className="text-muted-foreground min-w-64 px-4 py-3 text-left text-sm font-semibold">
                     Products
                  </th>
                  <th className="text-muted-foreground w-56 px-4 py-3 text-left text-sm font-semibold">
                     Created At
                  </th>
                  <th className="text-muted-foreground w-40 px-4 py-3 text-center text-sm font-semibold">
                     Likes
                  </th>
                  <th className="text-muted-foreground w-36 px-4 py-3 text-center text-sm font-semibold">
                     Action
                  </th>
               </tr>
            </thead>

            <tbody>
               {posts.map((post) => (
                  <tr key={post._id}>
                     <td className="px-4 py-2 text-sm">
                        <p className="text-sm font-medium">{post.content.slice(0, 40)}...</p>
                     </td>
                     <td className="px-4 py-2 text-sm">
                        <div className="flex">
                           {post.products.map((product) => (
                              <Image
                                 key={product}
                                 src={product as string}
                                 alt="Product"
                                 width={40}
                                 height={40}
                                 className="-mr-1.5 size-10 rounded-full border object-cover object-top shadow-xs"
                              />
                           ))}
                        </div>
                     </td>
                     <td className="px-4 py-2 text-sm">
                        {new Date(post._creationTime).toLocaleDateString()}
                     </td>
                     <td className="px-4 py-2 text-center text-sm">{post.total_likes}</td>
                     <td className="px-4 py-2 text-sm">
                        <PostAction postId={post._id} />
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

export default StorePosts;
