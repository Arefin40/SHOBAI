"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import PostLikeButton from "./PostLikeButton";
import { formatPostTime } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";

interface TimelineProps {
   preloadedPosts: Preloaded<typeof api.posts.getAllPosts>;
   preloadedLikedPosts: Preloaded<typeof api.posts.getLikedPosts>;
}

export default function Timeline({ preloadedPosts, preloadedLikedPosts }: TimelineProps) {
   const posts = usePreloadedQuery(preloadedPosts) || [];
   const likedPosts = usePreloadedQuery(preloadedLikedPosts) || [];

   return (
      <section className="scroll-hide overflow-y-auto text-justify sm:p-4">
         {posts.map((post) => (
            <div
               key={post._id}
               data-testid="post"
               className="rounded-lg border border-gray-100 bg-white"
            >
               {/* Post Header */}
               <header className="flex items-center gap-3 border-b border-gray-100 px-6 py-2.5">
                  <div className="size-12 flex-shrink-0 rounded-full bg-gray-200">
                     <Image
                        src={post.store?.logo ?? ""}
                        alt={post.store?.name ?? ""}
                        width={48}
                        height={48}
                        className="size-12 rounded-full"
                     />
                  </div>
                  <div className="grid">
                     <p className="flex items-center gap-x-2 font-semibold">
                        <span className="text-foreground">{post.store?.name}</span>
                     </p>
                     <p className="text-muted-foreground flex items-center gap-x-2 text-sm">
                        <span>@{post.store?.slug}</span>
                        <span className="size-1 rounded-full bg-gray-400"></span>
                        <span>{formatPostTime(post._creationTime)}</span>
                     </p>
                  </div>
               </header>

               {/* Post Content */}
               <main data-testid="post-content">
                  <div className="text-foreground space-y-2.5 px-6 py-3 text-sm whitespace-pre-wrap">
                     {post.content}
                  </div>
                  {post.products.length > 0 && (
                     <div
                        className={`grid w-full gap-0.5 ${
                           post.products.length === 3
                              ? "grid-cols-[2fr,1fr] grid-rows-[repeat(2,200px)]"
                              : post.products.length === 2
                                ? "grid-cols-2"
                                : "grid-cols-1"
                        }`}
                     >
                        {post.products.map((product, index) => (
                           <Link
                              key={index}
                              data-testid="post-product"
                              href={`/products/${product?._id}/details`}
                              className={`relative block aspect-square h-full w-full overflow-hidden ${
                                 post.products.length === 3 && index === 0 ? "row-span-2" : ""
                              }`}
                           >
                              <Image
                                 fill
                                 priority
                                 src={product.image ?? ""}
                                 alt={`Product ${index + 1}`}
                                 sizes="800px"
                                 className="h-full w-full object-cover object-top"
                              />
                           </Link>
                        ))}
                     </div>
                  )}
               </main>

               {/* Post Footer */}
               <footer className="flex items-center px-6 py-2.5 text-sm">
                  <PostLikeButton
                     postId={post._id}
                     totalLikes={post.total_likes}
                     isLiked={likedPosts.includes(post._id)}
                  />
               </footer>
            </div>
         ))}
      </section>
   );
}
