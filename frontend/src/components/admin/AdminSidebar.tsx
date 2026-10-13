"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {href: "/admin", label: "Profile", icon: "👤"},
  {href: "/admin/skills", label: "Skills", icon: "🛠️"},
  {href: "/admin/projects", label: "Projects", icon: "📁"},
  {href: "/admin/certificates", label: "Certificates", icon: "📜"},
  {href: "/admin/timeline", label: "Timeline", icon: "⏳"},
  {href: "/admin/sections", label: "Sections", icon: "👁️"},
  {href: "/admin/messages", label: "Messages", icon: "✉️"},
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-ink text-sand-300 flex flex-col border-r border-ink shadow-2xl">
      <div className="p-6 border-b border-sand-900/50">
        <h2 className="font-display text-2xl text-ivory tracking-wider uppercase flex items-center gap-2">
          <span className="text-terracotta-600">■</span> Admin
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-widest text-sand-500 mt-2">
          Case File Management
        </p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 font-mono text-sm uppercase tracking-wider ${
                isActive 
                  ? "bg-terracotta-600/10 text-terracotta-500 border border-terracotta-600/30 font-bold" 
                  : "hover:bg-sand-900/30 hover:text-ivory border border-transparent"
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sand-900/50">
        <Link 
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 font-mono text-sm uppercase tracking-wider text-sand-500 hover:bg-sand-900/30 hover:text-ivory"
        >
          <span>←</span> View Site
        </Link>
      </div>
    </aside>
  );
}
