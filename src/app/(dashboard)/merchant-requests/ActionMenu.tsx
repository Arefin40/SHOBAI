"use client";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface ActionMenuProps {
   id: Id<"merchant_applications">;
   disabled?: boolean;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ id, disabled = false }) => {
   const approve = useMutation(api.merchant.approveApplication);
   const reject = useMutation(api.merchant.rejectApplication);

   const handleApprove = () => {
      approve({ id });
   };

   const handleReject = () => {
      reject({ id });
   };

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild data-testid="manage-merchant-request-button">
            <Button variant="ghost" size="icon" className="rounded-full" disabled={disabled}>
               <MoreVertical size={20} />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent side="right">
            <DropdownMenuItem data-testid="approve-button" onClick={handleApprove}>
               Approve
            </DropdownMenuItem>
            <DropdownMenuItem data-testid="reject-button" onClick={handleReject}>
               Reject
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
};

export default ActionMenu;
