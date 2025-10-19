import Link from "next/link"

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/leads", label: "Leads" },
  { href: "/settings", label: "Settings" },
]

export function Sidebar() {
  return (
    <aside className="border-r p-4 hidden md:block">
      <nav className="space-y-2">
        {links.map((l)=>(
          <Link key={l.href} href={l.href} className="block px-3 py-2 rounded hover:bg-accent">
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
