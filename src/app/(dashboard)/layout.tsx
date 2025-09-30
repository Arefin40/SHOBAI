import DashboardSidebar from "@/components/DashboardSidebar";

export default async function RootLayout({
   children
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <section className="grid grid-cols-[16rem_1fr] xl:grid-cols-[18rem_1fr]">
         <DashboardSidebar />
         <main className="col-start-2">{children}</main>
      </section>
   );
}
