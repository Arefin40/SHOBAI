import type { Metadata } from "next";
import { ReactLenis } from "@/lib/lenis";
import { Toaster } from "react-hot-toast";
import { Mulish as FontSans } from "next/font/google";
import { AuthSessionProvider } from "@/context/session";
import { QueryClientProvider } from "@/context/react-query";
import BackgroundGradients from "@/components/ui/gradients";
import Image from "next/image";
import Link from "next/link";
import "../../globals.css";

const fontSans = FontSans({
   variable: "--font-sans",
   subsets: ["latin"]
});

export const metadata: Metadata = {
   title: {
      template: "%s | SHOBAI",
      default: "SHOBAI"
   },
   description: "Generated by create next app"
};

export default function RootLayout({
   children
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <AuthSessionProvider>
         <QueryClientProvider>
            <ReactLenis root options={{ duration: 0.1 }}>
               <html lang="en">
                  <body
                     className={`${fontSans.variable} relative flex min-h-screen items-center justify-center bg-gray-100 font-sans antialiased`}
                  >
                     <Toaster />

                     <header className="fixed inset-x-0 top-0 flex justify-center p-6 lg:justify-start">
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

                     <main className="box-container">{children}</main>

                     <BackgroundGradients />
                  </body>
               </html>
            </ReactLenis>
         </QueryClientProvider>
      </AuthSessionProvider>
   );
}
