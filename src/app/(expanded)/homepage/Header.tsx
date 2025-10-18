import React from "react";
import Link from "next/link";
import Image from "next/image";
import UserMenu from "./UserMenu";
import CartAndWishlistStats from "./CartAndWishlistStats";

export default async function Header() {
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
               <CartAndWishlistStats />
               <UserMenu />
            </div>
         </section>
      </header>
   );
}
