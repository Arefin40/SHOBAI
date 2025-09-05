export {};
import { Id } from "@/convex/_generated/dataModel";

declare global {
   type User = {
      id: Id<"users">;
      image?: string;
      role?: "merchant" | "user" | "admin";
      name: string;
      email: string;
   };

   type Option = Record<"value" | "label", string> & Record<string, string>;

   interface DashboardIconProps extends React.SVGProps<SVGSVGElement> {
      active?: boolean;
      filled?: boolean;
   }
}
