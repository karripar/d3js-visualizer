"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { TechBar } from "@/components/BottomBar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ResumeList from "@/components/ResumeList";
import BackButton from "@/components/nav/BackButton";
import useSupabase from "@/hooks/supabaseHooks";
import { useAuth } from "@/hooks/useAuth";

type Resume = {
  id: number;
  name: string;
  title: string;
  slug: string;
  user_id?: string | null;
  created_at?: string;
};

export default function ProfilePage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { deleteProfile } = useSupabase();
  const { user } = useAuth();

  const userEmail = user?.email ?? null;
  const userId = user?.id ?? null;

  const rawMeta = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const userAvatar: string | null =
    (rawMeta.avatar_url as string | undefined) ??
    (rawMeta.picture as string | undefined) ??
    null;

  // Max resume limit and derived state
  const MAX_RESUMES = 3;
  const hasReachedLimit = !!userId && resumes.length >= MAX_RESUMES;

  useEffect(() => {
    const fetchResumes = async () => {
      if (!userId) {
        setResumes([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id,name,title,slug,user_id,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load resumes:");
        setResumes([]);
      } else {
        setResumes((data as Resume[]) ?? []);
      }
      setLoading(false);
    };

    fetchResumes();
  }, [userId]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleDelete = async (slug: string) => {
    if (
      confirm(
        "Are you sure you want to delete this resume? This action cannot be undone."
      )
    ) {
      const success = await deleteProfile(slug);
      if (success) {
        setResumes((prev) => prev.filter((r) => r.slug !== slug));
      } else {
        alert("Failed to delete resume. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100">
      {/* Global back button - respect safe areas and reduce offset on mobile */}
      <div className="fixed top-[env(safe-area-inset-top)] left-[env(safe-area-inset-left)] mt-2 ml-2 sm:mt-0 sm:ml-0 z-30">
        <BackButton to="/" label="Back to Home" variant="ghost" />
      </div>

      {/* Header */}
      <header className="max-w-6xl mx-auto w-full px-3 sm:px-6 pt-14 sm:pt-16 pb-3 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            {userAvatar ? (
              <Image
                src={
                  userAvatar ||
                  "https://www.gravatar.com/avatar?d=mp&f=y" // fallback to Gravatar default if avatar URL is empty
                }
                alt="User avatar"
                width={40}
                height={40}
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full ring-2 ring-white/10 shadow-md object-cover"
              />
            ) : (
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-linear-to-tr from-blue-600 to-cyan-500 ring-2 ring-white/10 shadow-md" />
            )}
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-semibold tracking-tight truncate">
                Your Profile
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 truncate">
                {userEmail ? `Signed in as ${userEmail}` : "Not signed in"}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            {userId ? (
              <button
                onClick={handleLogout}
                className="px-3 py-2 sm:py-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/10 text-sm backdrop-blur-sm transition-colors w-full sm:w-auto"
              >
                Log out
              </button>
            ) : null}
            {/* Create button: disabled if limit reached */}
            {hasReachedLimit ? (
              <div
                aria-disabled
                className="px-3 py-2 sm:py-1.5 rounded-md border border-white/10 text-sm w-full sm:w-auto bg-white/5 text-zinc-400 cursor-not-allowed select-none flex items-center gap-2"
                title={`Resume limit reached (${MAX_RESUMES}/${MAX_RESUMES})`}
              >
                <span className="i-lucide-ban">✕</span>
                Limit reached ({resumes.length}/{MAX_RESUMES})
              </div>
            ) : (
              <Link
                href="/new"
                className="px-3 py-2 sm:py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 border border-blue-400/40 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-0 w-full sm:w-auto"
              >
                Create new resume
              </Link>
            )}
          </div>
        </div>
        <div className="mt-3 sm:mt-4 h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto w-full px-3 sm:px-6 flex-1 pb-20 sm:pb-0">
        <section className="mt-2 sm:mt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm sm:text-lg text-zinc-300">Your resumes</h2>
            {/* Secondary create action in header for larger screens */}
            {hasReachedLimit ? (
              <div
                aria-disabled
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-sm text-zinc-400 cursor-not-allowed select-none"
                title={`Resume limit reached (${MAX_RESUMES}/${MAX_RESUMES})`}
              >
                <span className="i-lucide-ban">✕</span>
                Limit reached ({resumes.length}/{MAX_RESUMES})
              </div>
            ) : (
              <Link
                href="/new"
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-sm"
              >
                <span className="i-lucide-plus">+</span>
                New
              </Link>
            )}
          </div>

          {/* Modern inline notice when limit is reached */}
          {hasReachedLimit && (
            <div className="mb-3 sm:mb-4 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-amber-200 text-xs sm:text-sm flex items-center gap-2">
              <span className="i-lucide-info">ℹ</span>
              You’ve reached the maximum of {MAX_RESUMES} resumes. Delete an
              existing resume to create a new one.
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-lg border border-white/10 bg-white/5 animate-pulse h-20 sm:h-28" />
              <div className="rounded-lg border border-white/10 bg-white/5 animate-pulse h-20 sm:h-28" />
              <div className="rounded-lg border border-white/10 bg-white/5 animate-pulse h-20 sm:h-28" />
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
                    className="h-9 w-9 sm:h-10 sm:w-10 rounded-full ring-2 ring-white/10 shadow-md object-cover"
                  />
                ) : (
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-linear-to-tr from-blue-600 to-cyan-500 ring-2 ring-white/10 shadow-md" />
                )}
              </div>
              <h3 className="font-medium text-zinc-100 text-base sm:text-lg">
                No resumes yet
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                {userId
                  ? "Create your first resume to get started."
                  : "Sign in to view and create your resumes."}
              </p>
              <div className="mt-4">
                {/* In empty state, allow creation if signed in */}
                <Link
                  href={userId ? "/new" : "/"}
                  className="inline-flex w-full sm:w-auto justify-center px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 border border-blue-400/40 text-sm"
                >
                  {userId ? "Create new resume" : "Go to home"}
                </Link>
              </div>
            </div>
          ) : (
            <ResumeList resumes={resumes} onDelete={handleDelete} />
          )}
        </section>
      </main>

      <TechBar />
    </div>
  );
}
