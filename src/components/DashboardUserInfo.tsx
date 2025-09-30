"use client";

import React from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import UserDropdown from "./DashboardUserDropdown";

function DashboardUserInfo() {
   const user = useQuery(api.user.getCurrentUser, {});

   if (!user) return null;

   return (
      <div className="border-border flex items-center justify-between border-t py-5">
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

         <UserDropdown />
      </div>
   );
}

export default DashboardUserInfo;
