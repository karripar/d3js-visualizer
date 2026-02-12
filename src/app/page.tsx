"use client";

import Link from "next/link";
import { TechBar } from "@/components/BottomBar";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* ambient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-blue-500/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-125 h-125 bg-purple-500/30 rounded-full blur-3xl" />

      {/* floating brand badge */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 shadow-md shadow-blue-500/10">
          <span className="font-semibold tracking-wide text-white">Aspect</span>
          <span className="h-1 w-1 rounded-full bg-blue-400/70" />
          <span className="text-zinc-400">Visual CV</span>
        </div>
      </div>

      {/* hero */}
      <section className="relative z-10 px-6 pt-24 pb-12 sm:pt-32 sm:pb-16 max-w-4xl mx-auto text-center text-white">
        {/* wordmark */}
        <div className="mx-auto w-fit">
          <span className="text-3xl sm:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-fuchsia-400 to-purple-400 drop-shadow-[0_0_20px_rgba(99,102,241,0.25)]">
            Aspect
          </span>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
          Build and share a visual professional profile
        </div>
        <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight">
          Turn your skills into a visual CV
        </h1>
        <p className="mt-4 text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto">
          Create a beautiful, shareable profile that highlights your strengths.
          Rate your skills, add links, and get a unique URL in seconds.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/new"
            className="px-6 py-3 rounded-xl font-semibold text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-200 shadow-lg hover:shadow-blue-500/30"
          >
            Generate your profile
          </Link>
          <Link
            href="/p/3096ea75-a0c8-43c6-9974-d2287ca1169a"
            className="px-6 py-3 rounded-xl font-semibold text-blue-300 bg-blue-500/10 border border-blue-400/20 hover:bg-blue-500/20 hover:border-blue-400/30 transition-all duration-200"
          >
            View a demo
          </Link>
        </div>
      </section>

      {/* features */}
      <section className="relative z-10 text-white px-6 pb-20 max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5">
            <h3 className="font-semibold">Simple form</h3>
            <p className="text-sm text-zinc-400 mt-1">
              Fill out your name, title, links and pick up to 8 skills with a
              quick slider.
            </p>
          </div>
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5">
            <h3 className="font-semibold">Visualized skills</h3>
            <p className="text-sm text-zinc-400 mt-1">
              Your proficiency is mapped to clean visual charts for an immediate
              overview.
            </p>
          </div>
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5">
            <h3 className="font-semibold">Shareable link</h3>
            <p className="text-sm text-zinc-400 mt-1">
              Get a unique URL to share with recruiters and peers.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-linear-to-br from-zinc-900 to-zinc-800 border border-white/10 p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 text-zinc-300">
              <h4 className="text-lg font-semibold text-white">
                Ready to build yours?
              </h4>
              <p className="text-sm text-zinc-400 mt-1">
                It only takes a minute. You can update your profile anytime.
              </p>
            </div>
            <Link
              href="/new"
              className="px-5 py-3 rounded-xl font-semibold text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all"
            >
              Start now
            </Link>
          </div>
        </div>
      </section>

      <TechBar />
    </main>
  );
}
