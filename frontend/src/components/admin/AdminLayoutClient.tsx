"use client";

import {usePathname} from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // Login page gets its own full-screen layout without the admin dashboard sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-sand-50 selection:bg-terracotta-200 selection:text-ink">
      <AdminSidebar />
      <main className="flex-1 min-h-screen ml-[80px] p-8 md:p-12 overflow-auto bg-[url('/noise.png')] bg-repeat bg-fixed">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
