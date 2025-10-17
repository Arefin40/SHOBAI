import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import WishlistProducts from "./WishlistProducts";

async function WishlistPage() {
   const preloadedWishlistItems = await preloadQuery(
      api.wishlist.getWishlistItems,
      {},
      { token: await convexAuthNextjsToken() }
   );

   return <WishlistProducts preloadedWishlistItems={preloadedWishlistItems} />;
}

export default WishlistPage;
