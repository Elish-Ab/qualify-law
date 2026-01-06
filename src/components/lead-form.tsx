"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function LeadForm({ onCreated }: { onCreated?: () => void }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    source: "Form",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
          source: "Form",
        });
        onCreated?.();
      } else {
        alert("Failed to create lead");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating lead");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-2 bg-white rounded-lg text-[#5A1FCC]"
    >
      <h2 className="text-lg font-semibold mb-2 text-[#5A1FCC]">
        Lead Information
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="text-[#5A1FCC]">
            First Name
          </Label>
          <Input
            id="firstName"
            placeholder="Enter first name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
            className="border-[#5A1FCC]/30 focus-visible:ring-[#5A1FCC]"
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-[#5A1FCC]">
            Last Name
          </Label>
          <Input
            id="lastName"
            placeholder="Enter last name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            required
            className="border-[#5A1FCC]/30 focus-visible:ring-[#5A1FCC]"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="text-[#5A1FCC]">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="example@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="border-[#5A1FCC]/30 focus-visible:ring-[#5A1FCC]"
        />
      </div>

      <div>
        <Label htmlFor="phone" className="text-[#5A1FCC]">
          Phone
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 555 123 4567"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
          className="border-[#5A1FCC]/30 focus-visible:ring-[#5A1FCC]"
        />
      </div>

      <div>
        <Label htmlFor="message" className="text-[#5A1FCC]">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Describe the inquiry or interest"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="border-[#5A1FCC]/30 focus-visible:ring-[#5A1FCC]"
        />
      </div>

      <div>
        <Label htmlFor="source" className="text-[#5A1FCC]">
          Source
        </Label>
        <Select
          value={form.source}
          onValueChange={(v) => setForm({ ...form, source: v })}
        >
          <SelectTrigger className="border-[#5A1FCC]/30 focus-visible:ring-[#5A1FCC] text-[#5A1FCC]">
            <SelectValue placeholder="Select source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Form">Form</SelectItem>
            <SelectItem value="Voicemail">Voicemail</SelectItem>
            <SelectItem value="CSV Import">CSV Import</SelectItem>
            <SelectItem value="Chatbot">Chatbot</SelectItem>
            <SelectItem value="Standard">Standard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#5A1FCC] text-white hover:bg-[#924bff]"
        >
          {loading ? "Saving..." : "Save"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="text-[#5A1FCC] border-[#5A1FCC]/40 hover:bg-[#5A1FCC]/10"
          onClick={() =>
            setForm({
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              message: "",
              source: "Form",
            })
          }
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
