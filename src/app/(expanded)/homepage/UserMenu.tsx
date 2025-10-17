"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { User, Box, LogOut, LogIn, ChevronDown } from "lucide-react";

const DropdownNavigationMenu = {
   user: [
      { label: "Profile", icon: User, href: "/profile" },
      { label: "Orders", icon: Box, href: "/orders" }
   ]
};

function UserMenu() {
   const user = useQuery(api.user.getCurrentUser);
   const { signOut } = useAuthActions();

   return (
      <DropdownMenu>
         <DropdownMenuTrigger
            className="relative outline-none"
            data-testid={user ? "user-menu" : null}
         >
            <Image
               src={user?.image || "/images/user.png"}
               width="40"
               height="40"
               alt="Profile Picture"
               className="border-border size-10 shrink-0 rounded-full border"
            />

            <div className="bg-background flex-center absolute top-full right-0 size-4 -translate-y-2/3 rounded-full border shadow">
               <ChevronDown className="size-9/10" />
            </div>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end" className="min-w-40">
            <DropdownMenuLabel className="text-muted-foreground font-semibold">
               My Account
            </DropdownMenuLabel>
            <DropdownMenuLabel
               data-testid={user ? "usermenu-username" : null}
               className="mt-0 pt-0"
            >
               {user?.name}
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            {user ? (
               <>
                  {DropdownNavigationMenu.user.map((menu) => (
                     <DropdownMenuItem key={menu.href} asChild>
                        <Link href={menu.href} className="flex items-center gap-2">
                           <menu.icon className="text-foreground" />
                           <span>{menu.label}</span>
                        </Link>
                     </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 text-sm">
                     <LogOut className="text-foreground size-4" />
                     <span>Log Out</span>
                  </DropdownMenuItem>
               </>
            ) : (
               <>
                  <DropdownMenuItem>
                     <Link href="/login" className="flex w-full items-center gap-2">
                        <LogIn className="text-foreground size-4" />
                        <span>Log in</span>
                     </Link>
                  </DropdownMenuItem>
               </>
            )}
         </DropdownMenuContent>
      </DropdownMenu>
   );
}

export default UserMenu;
