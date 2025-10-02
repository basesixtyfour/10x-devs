"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/",
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErr(e.message || "Registration failed");
      } else {
        setErr("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-sm mx-auto pt-20 px-4">
      <h1 className="text-2xl font-bold mb-6">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded p-2"
        />
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded p-2"
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded p-2"
          required
          autoComplete="new-password"
        />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white rounded py-2"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
      <p className="text-sm mt-4">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
