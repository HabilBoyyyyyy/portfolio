"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer whenever the pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Login page gets its own full-screen layout without the admin dashboard sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Get current section label for mobile top bar
  const currentTitle = (() => {
    if (pathname === "/admin") return "Profile & Hero";
    if (pathname.startsWith("/admin/skills")) return "Skills";
    if (pathname.startsWith("/admin/projects")) return "Projects";
    if (pathname.startsWith("/admin/experience")) return "Experience";
    if (pathname.startsWith("/admin/certificates")) return "Certificates";
    if (pathname.startsWith("/admin/timeline")) return "Journey / Timeline";
    if (pathname.startsWith("/admin/sections")) return "Sections";
    if (pathname.startsWith("/admin/messages")) return "Messages";
    return "Admin";
  })();

  return (
    <div className="flex min-h-screen bg-sand-50 selection:bg-terracotta-200 selection:text-ink">
      {/* Mobile Top Navigation Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-ink/95 backdrop-blur-md border-b border-sand-800/80 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-sand-900 border border-sand-800 flex items-center justify-center text-terracotta-500 shadow-inner shrink-0">
            <span className="font-display font-bold text-sm leading-none">H</span>
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-sm text-ivory uppercase font-bold tracking-wider leading-none truncate">
              {currentTitle}
            </h1>
            <p className="font-mono text-[8px] uppercase tracking-widest text-sand-500 mt-0.5">
              Admin Panel
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle Navigation Menu"
          aria-expanded={mobileMenuOpen}
          className="p-2 rounded-lg bg-sand-900/80 border border-sand-800 text-sand-300 hover:text-ivory hover:bg-sand-800 transition shrink-0 cursor-pointer">
          {mobileMenuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 bg-ink/70 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar (both desktop hover & mobile drawer) */}
      <AdminSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen ml-0 md:ml-[80px] pt-18 md:pt-12 p-3 sm:p-6 md:p-12 overflow-x-hidden bg-[url('/noise.png')] bg-repeat bg-fixed w-full min-w-0">
        <div className="max-w-4xl mx-auto w-full min-w-0">{children}</div>
      </main>
    </div>
  );
}
