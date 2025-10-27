"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { Toaster } from "sonner";

const navLinks = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Leads", href: "/leads", icon: "👥" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = session?.user || {};
  const displayName = user.name || "Client";
  const avatar =
    user.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName
    )}&background=007bff&color=fff`;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-[240px] bg-gradient-to-b from-blue-600 to-blue-700 text-white flex flex-col justify-between p-6 shadow-lg">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-lg font-bold">
              LQ
            </div>
            <span className="text-xl font-semibold tracking-tight">Qwalify</span>
          </div>

          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white/20 shadow-sm"
                      : "hover:bg-white/10 hover:translate-x-1"
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="text-xs text-white/70 text-center mt-8">
          © {new Date().getFullYear()} Qwalify
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex justify-between items-center bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <h1 className="text-lg font-semibold">
            {pathname === "/dashboard"
              ? "Dashboard Overview"
              : pathname === "/leads"
              ? "Lead Management"
              : "Settings"}
          </h1>

          {/* Avatar + Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-1 rounded-full transition"
            >
              <img src={avatar} className="w-8 h-8 rounded-full" alt="User Avatar" />
              <span className="text-sm font-medium text-gray-700">{displayName}</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg py-1 animate-fadeIn">
                <div className="px-4 py-2 text-sm text-gray-600 border-b">
                  Signed in as
                  <div className="font-medium text-gray-900 truncate">
                    {user.email || displayName}
                  </div>
                </div>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  ⚙️ Account Settings
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
}
