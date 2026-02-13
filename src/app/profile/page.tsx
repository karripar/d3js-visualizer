"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { TechBar } from "@/components/BottomBar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BackButton from "@/components/nav/BackButton";

type Resume = {
  id: number;
  name: string;
  title: string;
  slug: string;
  user_id?: string | null;
  created_at?: string;
};

export default function ProfilePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: userResult } = await supabase.auth.getUser();
      const u = userResult.user ?? null;
      setUserEmail(u?.email ?? null);
      setUserId(u?.id ?? null);
      // Try common metadata keys used by OAuth providers (e.g., Google)
      const meta: Record<string, unknown> | undefined = u?.user_metadata as
        | Record<string, unknown>
        | undefined;
      const avatar =
        typeof meta?.avatar_url === "string"
          ? (meta.avatar_url as string)
          : typeof meta?.picture === "string"
          ? (meta.picture as string)
          : null;
      setUserAvatar(avatar);

      if (!u) {
        setResumes([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id,name,title,slug,user_id,created_at")
        .eq("user_id", u.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load resumes:", error);
        setResumes([]);
      } else {
        setResumes((data as Resume[]) ?? []);
      }
      setLoading(false);
    };

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      init();
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100">
      {/* Header */}
      <header className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-6 sm:pt-10 pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            {userAvatar ? (
              <Image
                src={userAvatar}
                alt="User avatar"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full ring-2 ring-white/10 shadow-md object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-linear-to-tr from-blue-600 to-cyan-500 ring-2 ring-white/10 shadow-md" />
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Your Profile
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                {userEmail ? `Signed in as ${userEmail}` : "Not signed in"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {userId ? (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/10 text-sm backdrop-blur-sm transition-colors"
              >
                Log out
              </button>
            ) : (
              <Link
                href="/"
                className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/10 text-sm backdrop-blur-sm transition-colors"
              >
                Go to home
              </Link>
            )}
            <Link
              href="/new"
              className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 border border-blue-400/40 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-0"
            >
              Create new resume
            </Link>
          </div>
        </div>
        <div className="mt-4 h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 flex-1">
        <section className="mt-2 sm:mt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg text-zinc-300">Your resumes</h2>
            {/* Secondary create action in header for larger screens */}
            <Link
              href="/new"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-sm"
            >
              <span className="i-lucide-plus">+</span>
              New
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-lg border border-white/10 bg-white/5 animate-pulse h-24 sm:h-28" />
              <div className="rounded-lg border border-white/10 bg-white/5 animate-pulse h-24 sm:h-28" />
              <div className="rounded-lg border border-white/10 bg-white/5 animate-pulse h-24 sm:h-28" />
            </div>
          ) : resumes.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                {userAvatar ? (
                  <Image
                    src={userAvatar}
                    alt="User avatar"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full ring-2 ring-white/10 shadow-md object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-linear-to-tr from-blue-600 to-cyan-500 ring-2 ring-white/10 shadow-md" />
                )}
              </div>
              <h3 className="font-medium text-zinc-100">No resumes yet</h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                {userId
                  ? "Create your first resume to get started."
                  : "Sign in to view and create your resumes."}
              </p>
              <div className="mt-4">
                <Link
                  href={userId ? "/new" : "/"}
                  className="inline-flex px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 border border-blue-400/40 text-sm"
                >
                  {userId ? "Create new resume" : "Go to home"}
                </Link>
              </div>
            </div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {resumes.map((r) => (
                <li
                  key={r.id}
                  className="group rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition overflow-hidden shadow-sm hover:shadow-md"
                >
                  <Link href={`/p/${r.slug}`} className="block p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm sm:text-base font-medium text-zinc-100 group-hover:text-white">
                          {r.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-400">
                          {r.title}
                        </p>
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-zinc-500 whitespace-nowrap">
                        {r.created_at
                          ? new Date(r.created_at).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <TechBar />
    </div>
  );
}
