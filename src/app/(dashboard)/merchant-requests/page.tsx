import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import MerchantRequests from "./MerchantRequests";

export default async function MerchantRequestsWrapper() {
   const preloadedMerchantApplications = await preloadQuery(
      api.merchant.getAllMerchantApplications,
      {}
   );
   return <MerchantRequests preloadedMerchantApplications={preloadedMerchantApplications} />;
}
