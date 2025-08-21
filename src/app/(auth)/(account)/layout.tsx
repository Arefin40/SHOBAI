import Link from "next/link";
import Image from "next/image";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
   children
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <section className="grid min-h-screen font-sans antialiased md:gap-y-6 lg:grid-cols-2">
         <Toaster />

         <div className="flex flex-col gap-y-8 p-4 sm:p-6">
            <header>
               <Link href="/" className="flex items-center gap-x-2">
                  <Image
                     src="/images/Logo.svg"
                     alt="Logo"
                     width={105}
                     height={20}
                     className="h-5"
                  />
               </Link>
            </header>

            {children}
         </div>

         <aside
            suppressHydrationWarning
            data-test="auth-sidebar"
            className="flex items-center justify-center p-4 sm:p-6 lg:p-12"
         >
            <div className="relative aspect-square grow">
               <Image
                  fill
                  sizes="100%"
                  src="/images/AuthBG.jpg"
                  alt="Login"
                  className="transform object-contain"
               />
            </div>
         </aside>
      </section>
   );
}
