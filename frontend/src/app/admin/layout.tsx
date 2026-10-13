import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex min-h-screen bg-sand-50 selection:bg-terracotta-200 selection:text-ink">
      <AdminSidebar />
      <main className="flex-1 p-8 md:p-12 overflow-auto bg-[url('/noise.png')] bg-repeat bg-fixed">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
