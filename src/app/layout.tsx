import type { Metadata } from "next";
import { Mulish as FontSans, Geist_Mono as FontMono } from "next/font/google";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
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
      <html lang="en">
         <body
            className={`${fontSans.variable} ${fontMono.variable} min-h-screen font-sans font-medium antialiased`}
         >
            <ConvexClientProvider>{children}</ConvexClientProvider>
         </body>
      </html>
   );
}
