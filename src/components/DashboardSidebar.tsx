"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { PanelLeft } from "lucide-react";
import { DashboardBlocks } from "@/icons";
import { usePathname } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { DashboardMenuItems } from "@/lib/data/dashboard";
import UserInfo from "@/components/DashboardUserInfo";

type DashboardMenuItemProps = React.ComponentProps<"li"> & {
   href: string;
   active?: boolean;
   icon: React.ReactNode;
};

const DashboardMenuItem: React.FC<DashboardMenuItemProps> = ({
   children,
   className,
   href,
   icon,
   active = false,
   ...props
}) => {
   return (
      <li className={cn("group relative", className)} {...props}>
         <Link
            href={href}
            prefetch={false}
            className={cn(
               "hover:bg-accent hover:text-accent-foreground mx-6 flex items-center gap-3 rounded-md p-2",
               { "bg-accent text-accent-foreground": active }
            )}
         >
            {icon}
            <p className="font-medium">{children}</p>
         </Link>
         {active && (
            <div className="bg-primary absolute top-1/2 left-0.5 h-8/10 w-1.25 -translate-y-1/2 rounded-r-md" />
         )}
      </li>
   );
};

export default function DashboardSidebar() {
   const pathname = usePathname();

   const user = useQuery(api.user.getCurrentUser);
   if (!user || !user.role) return null;
   if (!(user.role === "admin" || user.role === "merchant")) return null;
   const menuItems = DashboardMenuItems[user.role];

   return (
      <aside className="border-border fixed top-0 left-0 flex h-screen w-64 flex-col border-r bg-white text-sm xl:w-72 xl:text-base">
         <div className="px-6">
            <div className="border-border flex h-16 items-center justify-between border-b">
               <Link href="/dashboard" className="flex items-center gap-x-2">
                  <Image
                     priority
                     src="/images/Logo.svg"
                     alt="Logo"
                     width={105}
                     height={20}
                     className="h-5"
                  />
               </Link>
               <button>
                  <PanelLeft
                     size={20}
                     strokeWidth={1.5}
                     className="text-muted-foreground hover:text-foreground"
                  />
               </button>
            </div>
         </div>
         <div className="flex flex-1 flex-col py-4">
            <ul className="flex flex-col space-y-2">
               <DashboardMenuItem
                  active={pathname === "/dashboard"}
                  href="/dashboard"
                  icon={<DashboardBlocks />}
               >
                  Dashboard
               </DashboardMenuItem>
               {menuItems.map((item) => (
                  <DashboardMenuItem
                     key={item.name}
                     href={item.href}
                     icon={<item.icon />}
                     active={pathname.includes(item.href)}
                  >
                     {item.name}
                  </DashboardMenuItem>
               ))}
            </ul>
         </div>
         <div className="px-6">
            <UserInfo user={user} />
         </div>
      </aside>
   );
}
