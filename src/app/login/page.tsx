"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (!error) {
      router.push("/dashboard")
    } else {
      alert(error.message)
    }
  }

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (!error) {
      alert("Check your email to confirm")
    } else {
      alert(error.message)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Login / Signup</h1>

      <input
        className="border border-zinc-700 bg-zinc-900 rounded p-2 text-white placeholder-zinc-400"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border border-zinc-700 bg-zinc-900 rounded p-2 text-white placeholder-zinc-400"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex gap-4">
        <button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded">
          Login
        </button>

        <button onClick={handleSignup} className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded">
          Signup
        </button>
      </div>
    </div>
  )
}
