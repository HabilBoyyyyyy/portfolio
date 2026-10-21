"use client";

import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";

// Zero emojis! All icons are crisp, accessible SVGs matching the portfolio palette.
const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Profile",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    href: "/admin/skills",
    label: "Skills",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    href: "/admin/projects",
    label: "Projects",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
    ),
  },
  {
    href: "/admin/certificates",
    label: "Certificates",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.004-6.75a3 3 0 11-6 0 3 3 0 016 0zm-6 0v.75m6-.75v.75m-6 3h6" />
      </svg>
    ),
  },
  {
    href: "/admin/timeline",
    label: "Timeline",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: "/admin/sections",
    label: "Sections",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    href: "/admin/messages",
    label: "Messages",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", {method: "POST"});
    } catch {
      // ignore
    }
    window.location.href = "/admin/login";
  }

  return (
    <aside
      className="group/sidebar fixed top-0 left-0 h-full w-[80px] hover:w-[260px] transition-all duration-300 ease-in-out z-40 bg-ink/95 backdrop-blur-md border-r border-sand-800/80 shadow-2xl flex flex-col justify-between py-5 pr-3 overflow-hidden select-none"
      aria-label="Admin Navigation">
      {/* ── Top Header Brand ── */}
      <div>
        <div className="h-16 flex items-center pl-4 mb-4 overflow-hidden border-b border-sand-900/60">
          <div className="w-11 h-11 rounded-full bg-sand-900 border border-sand-800 flex items-center justify-center flex-shrink-0 text-terracotta-500 shadow-inner">
            <span className="font-display font-bold text-lg leading-none">H</span>
          </div>
          <div className="ml-3 opacity-0 max-w-0 group-hover/sidebar:opacity-100 group-hover/sidebar:max-w-[170px] transition-all duration-300 overflow-hidden whitespace-nowrap">
            <h2 className="font-display text-base text-ivory tracking-wider uppercase font-bold">
              Admin
            </h2>
            <p className="font-mono text-[9px] uppercase tracking-widest text-sand-500">
              Dashboard
            </p>
          </div>
        </div>

        {/* ── Navigation Links (Sliding Pill Items) ── */}
        <nav>
          <ul className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center pl-3.5 py-1.5 rounded-r-[50px] transition-all duration-200 group/link ${
                      isActive
                        ? "bg-terracotta-600/15 text-terracotta-400 font-semibold"
                        : "text-sand-400 hover:bg-sand-900/60 hover:text-ivory"
                    }`}>
                    {/* Circular Icon Container */}
                    <span
                      className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        isActive
                          ? "bg-terracotta-600 text-ivory shadow-md shadow-terracotta-900/40 border border-terracotta-500"
                          : "bg-sand-900/80 text-sand-400 group-hover/link:text-terracotta-400 group-hover/link:bg-sand-800 border border-sand-800/80"
                      }`}>
                      {item.icon}
                    </span>

                    {/* Sliding Label (fades & slides in on sidebar hover) */}
                    <span className="ml-3.5 opacity-0 max-w-0 group-hover/sidebar:opacity-100 group-hover/sidebar:max-w-[170px] transition-all duration-300 overflow-hidden whitespace-nowrap font-mono text-xs uppercase tracking-wider">
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* ── Bottom Actions (View Site & Logout) ── */}
      <div className="pt-3 border-t border-sand-900/60 space-y-1">
        {/* View Site */}
        <Link
          href="/"
          className="flex items-center pl-3.5 py-1.5 rounded-r-[50px] text-sand-400 hover:bg-sand-900/60 hover:text-ivory transition-all duration-200 group/link">
          <span className="w-11 h-11 rounded-full bg-sand-900/80 border border-sand-800/80 flex items-center justify-center flex-shrink-0 text-sand-400 group-hover/link:text-terracotta-400 group-hover/link:bg-sand-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </span>
          <span className="ml-3.5 opacity-0 max-w-0 group-hover/sidebar:opacity-100 group-hover/sidebar:max-w-[170px] transition-all duration-300 overflow-hidden whitespace-nowrap font-mono text-xs uppercase tracking-wider text-sand-400 group-hover/link:text-ivory">
            View Site
          </span>
        </Link>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center pl-3.5 py-1.5 rounded-r-[50px] text-sand-500 hover:bg-error/10 hover:text-[#f87171] transition-all duration-200 group/logout cursor-pointer">
          <span className="w-11 h-11 rounded-full bg-sand-900/80 border border-sand-800/80 flex items-center justify-center flex-shrink-0 text-sand-500 group-hover/logout:text-[#f87171] group-hover/logout:border-error/30 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </span>
          <span className="ml-3.5 opacity-0 max-w-0 group-hover/sidebar:opacity-100 group-hover/sidebar:max-w-[170px] transition-all duration-300 overflow-hidden whitespace-nowrap font-mono text-xs uppercase tracking-wider text-sand-400 group-hover/logout:text-[#f87171]">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
