"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen flex bg-white text-[#5A1FCC]">
      {/* Sidebar (same style as dashboard) */}
      <aside className="w-64 bg-[#5A1FCC] text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">Qwalify Portal</h2>
        <nav className="flex flex-col space-y-3">
          <Link
            href="/admin"
            className="hover:bg-white/10 px-4 py-2 rounded-md transition"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/settings"
            className="bg-white/20 px-4 py-2 rounded-md font-semibold"
          >
            Settings
          </Link>
        </nav>
        <div className="mt-auto pt-6 border-t border-white/20 text-sm text-white/80">
          Signed in as Admin
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-white text-[#5A1FCC]">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="max-w-lg bg-white rounded-xl shadow-md border border-[#5A1FCC]/20 p-8">
          <h2 className="text-xl font-semibold mb-2">
            Admin Session
          </h2>
          <p className="text-[#5A1FCC]/70 mb-6">
            You are securely logged into the Qualify Admin portal.
          </p>

          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#5A1FCC] text-white rounded-md hover:bg-[#924bff] transition"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </main>
    </div>
  );
}
