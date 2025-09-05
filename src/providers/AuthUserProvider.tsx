"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

interface AuthUserContextType {
   user?: User | null;
}

const AuthUserContext = createContext<AuthUserContextType>({ user: null });

export function AuthUserProvider({ children }: { children: ReactNode }) {
   const user = useQuery(api.user.getCurrentUser);
   return <AuthUserContext.Provider value={{ user }}>{children}</AuthUserContext.Provider>;
}

export function useAuthUser() {
   return useContext(AuthUserContext);
}
