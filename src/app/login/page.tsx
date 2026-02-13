"use client";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 w-80 text-center">
        <h1 className="text-xl font-semibold">Sign in required</h1>
        <p className="text-sm text-zinc-400 mt-2">
          Please sign in to continue.
        </p>
        <Link
          href="/api/auth/signin"
          className="mt-4 inline-block px-5 py-2 rounded-xl font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
