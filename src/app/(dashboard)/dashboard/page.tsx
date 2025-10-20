// Reads the current session, so render per request instead of at build time.
export const dynamic = "force-dynamic";

import React from "react";
import AdminDashboard from "./AdminDashboard";
// import MerchantDashboard from "./MerchantDashboard";

export default async function Dashboard() {
   return <AdminDashboard />;
   // return <MerchantDashboard />;
}
