"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type AppHeaderUser = {
  name?: string | null;
  clientName?: string | null;
};

type AppHeaderProps = {
  user?: AppHeaderUser;
  onLogout: () => void;
};

export function AppHeader({ user, onLogout }: AppHeaderProps) {
  return (
    <header className="h-16 border-b border-[#5A1FCC]/20 flex items-center justify-between px-6 bg-white text-[#5A1FCC]">
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" className="h-6 w-auto" alt="Logo" width={96} height={24} priority />
        <span className="font-semibold">Qwalify Portal</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-[#5A1FCC]/70 hidden md:block">{user?.clientName}</span>
        <Avatar className="h-8 w-8">
          <AvatarFallback>{(user?.name || "?").slice(0,1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <Button
          variant="outline"
          className="text-[#5A1FCC] border-[#5A1FCC]/30 hover:bg-[#5A1FCC]/10"
          onClick={onLogout}
        >
          Logout
        </Button>
      </div>
    </header>
  )
}
