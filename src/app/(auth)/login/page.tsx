//src/app/%28auth%29/login/page.tsx
"use client"
import { SetStateAction, useState } from "react"
import * as NextAuth from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await NextAuth.signIn("client-login", { redirect: false, email, password })
    setLoading(false)
    if (res?.ok) router.push("/dashboard")
    else alert("Invalid credentials")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="p-6 space-y-4">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e: { target: { value: SetStateAction<string> } })=>setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e: { target: { value: SetStateAction<string> } })=>setPassword(e.target.value)} required />
            </div>
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Signing in..." : "Sign in"}</Button>
          </form>
          <p className="text-sm text-muted-foreground">
            New here? <a className="underline" href="/register">Create an account</a>
          </p>
        </Card>
      </div>
    </div>
  )
}
