//src/app/admin/%5Bid%5D/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ClientDetails, { ClientDetailsData } from "@/components/admin/ClientDetails";

export default function AdminClientPage() {
  const { id } = useParams();
  const [clientData, setClientData] = useState<ClientDetailsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClient() {
      try {
        const res = await fetch(`/api/admin/clients/${id}`);
        const data = await res.json();
        setClientData(data);
      } catch (err) {
        console.error("Failed to load client:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchClient();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading client data...
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        No client data found.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ClientDetails data={clientData} />
    </div>
  );
}
