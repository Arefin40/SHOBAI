"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Store } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import UserDropdown from "./DashboardUserDropdown";

function DashboardUserInfo({ user }: { user: User }) {
   return (
      <div className="border-border flex items-center justify-between border-t py-5">
         {user.role === "merchant" ? <StoreInfo /> : <UserInfo user={user} />}
         <UserDropdown />
      </div>
   );
}

function UserInfo({ user }: { user: User }) {
   return (
      <div className="flex items-center gap-3">
         <Image
            priority
            src={user?.image || "/images/user.png"}
            alt="Logo"
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full"
         />

         <div>
            <h4 className="font-semibold">{user?.name}</h4>
            <p className="text-muted-foreground text-xs">{user?.email}</p>
         </div>
      </div>
   );
}

function StoreInfo() {
   const store = useQuery(api.store.getMyStore);
   if (!store)
      return (
         <div className="flex items-center gap-3">
            <div className="bg-muted flex-center size-10 shrink-0 rounded-full">
               <Store className="text-muted-foreground size-5" />
            </div>

            <div>
               <Link href="/stores/create" className="text-primary hover:text-primary/90">
                  <h4 className="font-semibold">Create Store</h4>
               </Link>
               <p className="text-muted-foreground text-xs">Start selling today</p>
            </div>
         </div>
      );

   return (
      <div className="flex items-center gap-3">
         <Image
            priority
            src={store.logo || "/images/user.png"}
            alt="Logo"
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full"
         />

         <div>
            <Link href="/mystore" className="font-semibold">
               {store.name}
            </Link>
            <p className="text-muted-foreground text-xs">@{store?.slug}</p>
         </div>
      </div>
   );
}

export default DashboardUserInfo;
