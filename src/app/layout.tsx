import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Mulish as FontSans, Geist_Mono as FontMono } from "next/font/google";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import { AuthUserProvider } from "@/providers/AuthUserProvider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import "./globals.css";

const fontSans = FontSans({
   variable: "--font-sans",
   subsets: ["latin"]
});

const fontMono = FontMono({
   variable: "--font-mono",
   subsets: ["latin"]
});

export const metadata: Metadata = {
   title: {
      default: "SHOBAI",
      template: "%s | SHOBAI"
   },
   description: "Marketplace for small and medium business"
};

export default function RootLayout({
   children
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <ConvexAuthNextjsServerProvider>
         <html lang="en">
            <body
               className={`${fontSans.variable} ${fontMono.variable} min-h-screen font-sans font-medium antialiased`}
            >
               <Toaster />
               <ConvexClientProvider>
                  <AuthUserProvider>{children}</AuthUserProvider>
               </ConvexClientProvider>
            </body>
         </html>
      </ConvexAuthNextjsServerProvider>
   );
}
