"use client";

import React from "react";
import DashboardContainer from "@/components/DashboardContainer";
import Image from "next/image";
import ActionMenu from "./ActionMenu";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { usePreloadedQuery, Preloaded } from "convex/react";

type User = {
   id: Id<"users">;
   image?: string;
   role: "user" | "merchant" | "admin";
   name: string;
   email: string;
};

type Props = {
   preloadedUsers: Preloaded<typeof api.user.getAllUsers>;
};

function ManageUsers({ preloadedUsers }: Props) {
   const users = (usePreloadedQuery(preloadedUsers) ?? []) as User[];

   return (
      <DashboardContainer
         title="Manage Users"
         description="Here you can manage all the users and their roles"
      >
         <div className="border-border overflow-hidden rounded-md border">
            <table className="min-w-full border-collapse bg-white">
               <thead className="bg-accent">
                  <tr>
                     <th className="text-muted-foreground px-4 py-3 text-left text-sm font-semibold">
                        User Details
                     </th>
                     <th className="text-muted-foreground px-4 py-3 text-left text-sm font-semibold xl:w-96">
                        Email
                     </th>
                     <th className="text-muted-foreground px-4 py-3 text-left text-sm font-semibold md:w-32 xl:w-56">
                        Role
                     </th>
                     <th className="text-muted-foreground px-4 py-3 text-right text-sm font-semibold xl:w-40">
                        Action
                     </th>
                  </tr>
               </thead>
               <tbody>
                  {users.map((user) => (
                     <tr key={user.id as string}>
                        <td className="px-4 py-2 text-sm">
                           <div className="flex items-center gap-x-4">
                              <Image
                                 src={user.image || "/images/user.png"}
                                 alt={user.name}
                                 width={32}
                                 height={32}
                                 className="rounded-full"
                              />
                              <p className="text-sm font-medium">{user.name}</p>
                           </div>
                        </td>
                        <td className="px-4 py-2 text-sm">
                           <a href={`mailto:${user.email}`}>{user.email}</a>
                        </td>
                        <td data-testid="user-role" className="px-4 py-2 text-sm">
                           {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </td>
                        <td className="flex items-center justify-end px-4 py-2 text-sm">
                           <ActionMenu
                              id={user.id}
                              hideAdmin={user.role === "admin"}
                              hideUser={user.role === "user"}
                           />
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </DashboardContainer>
   );
}

export default ManageUsers;
