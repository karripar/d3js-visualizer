"use client";

import { useEffect, useState } from "react";
import useSupabase from "@/hooks/supabaseHooks";
import { TechBar } from "@/components/BottomBar";
import BackButton from "@/components/nav/BackButton";
import GoogleLogin from "@/components/auth/GoogleLogin";
import ProfileForm, { ProfileFormData } from "@/components/form/profileForm";

export default function Home() {
  const [link, setLink] = useState("");
  const [user, setUser] = useState<null | { id: string }>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [profilesCount, setProfilesCount] = useState<number>(0);

  const { createProfile, getUser, getAllProfilesByUser } = useSupabase();

  useEffect(() => {
    let mounted = true; // to prevent state updates if component unmounts
    (async () => {
      try {
        const response = await getUser();
        const currentUser = response?.data?.user
          ? { id: response.data.user.id }
          : null;
        if (mounted) setUser(currentUser);
        if (mounted && currentUser) {
          const list = await getAllProfilesByUser();
          if (Array.isArray(list)) setProfilesCount(list.length);
        }
      } catch (err) {
        console.error("Failed to check auth status:", err);
      } finally {
        if (mounted) setLoadingUser(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const MAX_PROFILES = 3;
  const reachedLimit = profilesCount >= MAX_PROFILES;

  const handleFormSubmit = async (data: ProfileFormData) => {
    if (reachedLimit || !user?.id) return; // guard
    const profile = await createProfile({
      user_id: user?.id ?? "", // Add user_id here
      name: data.name,
      title: data.title,
      skills: data.skills.map((s) => ({ name: s.name, level: s.level * 10 })),
      github: data.github,
      linkedin: data.linkedin,
      personal_link: data.personal_link,
      introduction: data.introduction,
      projects: data.projects?.map((p) => ({
        title: p.title,
        description: p.description,
        link: p.link,
        technologies: p.technologies,
      })),
    });
    if (profile) {
      setLink(`${window.location.origin}/p/${profile.slug}`);
      // update local count
      setProfilesCount((c) => c + 1);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 relative overflow-hidden pt-16 sm:pt-0">
      <BackButton
        to="/"
        label="Back to Home"
        variant="ghost"
        className="fixed top-6 left-4 sm:top-4 z-10"
      />
      <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-blue-500/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-125 h-125 bg-purple-500/30 rounded-full blur-3xl" />

      {loadingUser ? (
        <div className="min-h-screen text-white p-10 max-w-2xl mx-auto mb-12 flex items-center justify-center">
          <div className="text-zinc-400">Checking sign-in…</div>
        </div>
      ) : !user ? (
        <div className="min-h-screen text-white p-10 max-w-2xl mx-auto mb-12 flex items-center justify-center">
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 w-full text-center">
            <h1 className="text-2xl font-semibold">Sign in required</h1>
            <p className="text-sm text-zinc-400 mt-2">
              Please sign in to create your visual CV.
            </p>
            <div className="mt-4 flex justify-center">
              <GoogleLogin />
            </div>
          </div>
        </div>
      ) : (
        // Render the actual form to create profile
        <>
          {reachedLimit ? (
            <div className="min-h-screen text-white p-10 max-w-2xl mx-auto mb-12">
              <div className="rounded-2xl bg-amber-500/10 border border-amber-400/30 p-6 w-full">
                <h2 className="text-lg font-semibold text-amber-200">
                  Profile limit reached
                </h2>
                <p className="text-sm text-amber-200/80 mt-2">
                  You’ve reached the maximum of {MAX_PROFILES} resumes. Delete
                  an existing resume to create a new one.
                </p>
              </div>
            </div>
          ) : (
            <ProfileForm onSubmit={handleFormSubmit} />
          )}
        </>
      )}

      {/* Result */}
      {link && (
        <div className="mt-8 bg-zinc-900 border border-zinc-700 p-4 rounded-lg max-w-2xl mx-auto">
          <p className="text-sm text-zinc-400">Your profile link:</p>
          <a
            className="text-blue-400 font-medium break-all hover:underline"
            href={link}
            target="_blank"
          >
            {link}
          </a>
        </div>
      )}

      <TechBar />
    </main>
  );
}
