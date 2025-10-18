"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Cart, Marketplace, Wishlist } from "@/icons";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function CartAndWishlistStats() {
   const stats = useQuery(api.user.getCartAndWishlistStats);

   return (
      <>
         <LinkItem href="/products" icon={<Marketplace />} />
         <div className="relative inline-block">
            <LinkItem href="/cart" icon={<Cart />} />
            <ItemsCountBadge count={stats?.cartItems} />
         </div>
         <div className="relative inline-block">
            <LinkItem href="/wishlist" icon={<Wishlist />} />
            <ItemsCountBadge count={stats?.wishlistItems} />
         </div>
      </>
   );
}

function LinkItem({ href, icon }: { href: string; icon: React.ReactNode }) {
   return (
      <Link href={href}>
         <div className="flex-center size-10 rounded-full bg-gray-200/90 text-gray-800 hover:bg-gray-300/70 hover:text-gray-700 active:scale-90">
            {icon}
         </div>
      </Link>
   );
}

function ItemsCountBadge({ count = 0 }) {
   if (count < 1) return null;

   return (
      <motion.span
         key={count}
         initial={{ scale: 0 }}
         animate={{ scale: 1 }}
         transition={{ type: "spring", stiffness: 500, damping: 15 }}
         className="bg-primary flex-center pointer-events-none absolute -top-2 -right-2.5 min-h-[1.375rem] min-w-[1.375rem] rounded-full px-1 py-0.5 text-xs text-white shadow"
      >
         {count}
      </motion.span>
   );
}
