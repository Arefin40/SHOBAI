import React from "react";
import Link from "next/link";
import Image from "next/image";
import UserMenu from "./UserMenu";
import { Cart, Marketplace, Wishlist } from "@/icons";

async function Header() {
   return (
      <header className="fixed inset-x-0 top-0 z-50 col-span-full flex min-h-16 w-full items-center border-b border-gray-100 bg-white/75 backdrop-blur-3xl">
         <section className="box-container mx-auto grid w-full grid-cols-[18rem_1fr_18rem] items-center gap-x-4">
            {/* Left zone */}
            <div className="flex w-full items-center">
               <Link href="/" className="flex items-center gap-x-2">
                  <Image
                     priority
                     src="/images/Logo.svg"
                     alt="Logo"
                     width={105}
                     height={20}
                     className="h-5"
                  />
               </Link>
            </div>

            {/* Middle zone */}
            <div className="flex-center w-full gap-x-4">{/* Search */}</div>

            {/* Right zone */}
            <div className="flex w-full items-center justify-end gap-x-4">
               <LinkItem href="/products" icon={<Marketplace />} />
               <div className="relative inline-block">
                  <LinkItem href="/cart" icon={<Cart />} />
               </div>
               <div className="relative inline-block">
                  <LinkItem href="/wishlist" icon={<Wishlist />} />
               </div>
               <UserMenu />
            </div>
         </section>
      </header>
   );
}

export default Header;

function LinkItem({ href, icon }: { href: string; icon: React.ReactNode }) {
   return (
      <Link href={href}>
         <div className="flex-center size-10 rounded-full bg-gray-200/90 text-gray-800 hover:bg-gray-300/70 hover:text-gray-700 active:scale-90">
            {icon}
         </div>
      </Link>
   );
}
