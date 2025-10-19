"use client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function AppHeader({ user, onLogout }: { user?: any; onLogout: ()=>void }) {
  return (
    <header className="h-16 border-b flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <img src="/logo.svg" className="h-6" alt="Logo" />
        <span className="font-semibold">Lead Qualify</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground hidden md:block">{user?.clientName}</span>
        <Avatar className="h-8 w-8"><AvatarFallback>{(user?.name || "?").slice(0,1).toUpperCase()}</AvatarFallback></Avatar>
        <Button variant="outline" onClick={onLogout}>Logout</Button>
      </div>
    </header>
  )
}
