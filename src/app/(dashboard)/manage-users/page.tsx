import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import ManageUsers from "./ManageUsers";

export default async function ManageUsersWrapper() {
   const preloadedUsers = await preloadQuery(api.user.getAllUsers, {});
   return <ManageUsers preloadedUsers={preloadedUsers} />;
}
