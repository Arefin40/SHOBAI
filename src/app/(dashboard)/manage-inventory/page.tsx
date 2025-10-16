import Link from "next/link";
import StoreProducts from "./StoreProducts";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import DashboardContainer from "@/components/DashboardContainer";

export default async function ManageInventory() {
   const preloadedProducts = await preloadQuery(
      api.products.getMyStoreProducts,
      {},
      { token: await convexAuthNextjsToken() }
   );

   return (
      <DashboardContainer
         title="Manage Inventory"
         description="Manage product stock levels, availability, variants"
         actions={
            <Link
               href="/products/create"
               data-testid="add-product-button"
               className="flex-center bg-primary h-11 rounded-full px-4 text-white"
            >
               Add Product
            </Link>
         }
      >
         <StoreProducts preloadedProducts={preloadedProducts} />
      </DashboardContainer>
   );
}
