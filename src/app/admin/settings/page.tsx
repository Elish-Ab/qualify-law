"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar (same style as dashboard) */}
      <aside className="w-64 bg-blue-700 text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">LeadIQ Admin</h2>
        <nav className="flex flex-col space-y-3">
          <a href="/admin" className="hover:bg-blue-800 px-4 py-2 rounded-md">
            Dashboard
          </a>
          <a
            href="/admin/settings"
            className="bg-white/20 px-4 py-2 rounded-md font-semibold"
          >
            Settings
          </a>
        </nav>
        <div className="mt-auto pt-6 border-t border-blue-600 text-sm text-blue-200">
          Signed in as Admin
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Settings</h1>

        <div className="max-w-lg bg-white rounded-xl shadow-md border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Admin Session
          </h2>
          <p className="text-gray-500 mb-6">
            You are securely logged into the Qualify Admin portal.
          </p>

          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </main>
    </div>
  );
}
