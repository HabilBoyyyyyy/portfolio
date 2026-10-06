import Link from "next/link";

const links = [
  {href: "/admin", label: "Profile"},
  {href: "/admin/skills", label: "Skills"},
  {href: "/admin/projects", label: "Projects"},
  {href: "/admin/certificates", label: "Certificates"},
  {href: "/admin/timeline", label: "Timeline"},
  {href: "/admin/sections", label: "Sections"},
  {href: "/admin/messages", label: "Messages"},
];

export default function AdminLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex min-h-screen bg-[#FAF6F0]">
      <aside className="w-56 bg-[#201C1A] text-[#F2ECE4] p-6 space-y-2">
        <h2 className="font-bold mb-4">Admin</h2>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block py-1 hover:text-[#C1502E]">
            {link.label}
          </Link>
        ))}
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
