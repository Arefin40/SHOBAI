import Link from "next/link";
import StorePosts from "./StorePosts";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import DashboardContainer from "@/components/DashboardContainer";

export default async function ManagePosts() {
   const preloadedPosts = await preloadQuery(
      api.posts.getMyStorePosts,
      {},
      { token: await convexAuthNextjsToken() }
   );

   return (
      <DashboardContainer
         title="Manage Posts"
         description="Here you can manage all the posts"
         actions={
            <Link
               href="/posts/create"
               data-testid="create-post-button"
               className="flex-center bg-primary h-11 rounded-full px-4 text-white"
            >
               Create Post
            </Link>
         }
      >
         <StorePosts preloadedPosts={preloadedPosts} />
      </DashboardContainer>
   );
}
