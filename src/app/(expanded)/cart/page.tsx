import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import UserCart from "./UserCart";

async function WishlistPage() {
   const preloadedCart = await preloadQuery(
      api.cart.getCart,
      {},
      { token: await convexAuthNextjsToken() }
   );

   return (
      <main className="h-screen overflow-hidden bg-gray-100 pt-20 pb-6">
         <UserCart preloadedCart={preloadedCart} />
      </main>
   );
}

export default WishlistPage;
