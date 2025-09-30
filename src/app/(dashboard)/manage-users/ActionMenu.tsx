"use client";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
   DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface ActionMenuProps {
   id: Id<"users">;
   disabled?: boolean;
   hideAdmin?: boolean;
   hideUser?: boolean;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
   id,
   disabled = false,
   hideAdmin = false,
   hideUser = false
}) => {
   const changeRole = useMutation(api.user.changeRole);

   const handleChangeRole = (role: "user" | "admin") => {
      changeRole({ id, role });
   };

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild data-testid="manage-user-action-button">
            <Button variant="ghost" size="icon" className="rounded-full" disabled={disabled}>
               <MoreVertical size={20} />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent side="right">
            <DropdownMenuLabel className="text-muted-foreground font-medium">
               Change Role
            </DropdownMenuLabel>
            {!hideUser && (
               <DropdownMenuItem
                  data-testid="user-role-button"
                  onClick={() => handleChangeRole("user")}
               >
                  User
               </DropdownMenuItem>
            )}
            {!hideAdmin && (
               <DropdownMenuItem
                  data-testid="admin-role-button"
                  onClick={() => handleChangeRole("admin")}
               >
                  Admin
               </DropdownMenuItem>
            )}
         </DropdownMenuContent>
      </DropdownMenu>
   );
};

export default ActionMenu;
