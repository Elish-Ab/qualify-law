//src/app/admin/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = await signIn("admin-login", {
      redirect: true,
      email,
      password,
      callbackUrl: "/admin",
    });

    if (result?.error) setError("Invalid admin credentials");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-[#5A1FCC]">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#5A1FCC]/20 shadow-lg p-8 rounded-xl w-96 space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">Admin Login</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Admin email"
          className="border border-[#5A1FCC]/30 rounded-lg w-full px-3 py-2 focus:ring-[#5A1FCC] focus:border-[#5A1FCC]"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border border-[#5A1FCC]/30 rounded-lg w-full px-3 py-2 focus:ring-[#5A1FCC] focus:border-[#5A1FCC]"
        />
        {error && <p className="text-sm text-[#5A1FCC]">{error}</p>}
        <button
          type="submit"
          className="w-full bg-[#5A1FCC] hover:bg-[#924bff] text-white py-2 rounded-lg transition"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
