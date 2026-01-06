"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
        company: session.user.company || "",
      });
    }
  }, [session]);

  async function handleSave() {
    setIsSaving(true);
    setStatus("");
    try {
      const res = await fetch("/api/clients/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("Profile updated successfully");
      } else {
        setStatus("Error updating profile ❌");
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      setStatus("Network error ❌");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6 text-[#5A1FCC]">
      <h2 className="text-xl font-semibold">Account Settings</h2>
      <p className="text-sm text-[#5A1FCC]/70">
        Manage your profile information and contact details.
      </p>

      <div className="space-y-4">
        {["name", "email", "phone", "company"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-[#5A1FCC] mb-1 capitalize">
              {field}
            </label>
            <input
              type={field === "email" ? "email" : "text"}
              value={formData[field as keyof typeof formData]}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
              className="w-full border border-[#5A1FCC]/30 rounded-md px-3 py-2 focus:ring-[#5A1FCC] focus:border-[#5A1FCC]"
              disabled={field === "email"} // email not editable
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#5A1FCC] text-white px-5 py-2 rounded-md hover:bg-[#924bff] transition disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
        {status && <p className="text-sm text-[#5A1FCC]/80">{status}</p>}
      </div>
    </div>
  );
}
