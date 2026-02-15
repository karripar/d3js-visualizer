"use client";

import UpdateForm from "@/components/form/updateForm";
import useSupabase from "@/hooks/supabaseHooks";
import type { Profile } from "@/types/LocalTypes";
import React, { use, useEffect, useState } from "react";
import BackButton from "@/components/nav/BackButton";
import { TechBar } from "@/components/BottomBar";
import { useParams } from "next/navigation";

export default function UpdateProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = useParams<{ slug: string }>();
  const { getProfile, updateProfile } = useSupabase();
  const [existingProfile, setExistingProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profile = await getProfile(slug);
        setExistingProfile(profile ?? null);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setExistingProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [slug]);

  const handleSave = async (updated: Profile) => {
    try {
      const { ...updates } = updated;
      await updateProfile(slug, updates);
      console.log("Profile updated", { slug });

      // redirect to the profile page after successful update
      window.location.href = `/profile`;
    } catch (e) {
      console.error("Failed to update profile", e);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 relative overflow-hidden">
      <BackButton
        to={`/p/${slug}`}
        label="Back to Profile"
        variant="ghost"
        className="absolute top-4 left-4 z-10"
      />
      <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-blue-500/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-125 h-125 bg-purple-500/30 rounded-full blur-3xl" />

      {loading ? (
        <div className="min-h-screen text-white p-10 max-w-2xl mx-auto mb-12 flex items-center justify-center">
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 w-full text-center">
            <h1 className="text-2xl font-semibold">Updating {slug}</h1>
            <p className="text-sm text-zinc-400 mt-2">Loading…</p>
          </div>
        </div>
      ) : !existingProfile ? (
        <div className="min-h-screen text-white p-10 max-w-2xl mx-auto mb-12 flex items-center justify-center">
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 w-full text-center">
            <h1 className="text-2xl font-semibold">Profile not found</h1>
            <p className="text-sm text-zinc-400 mt-2">
              We couldn’t find a profile for slug: {slug}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-white p-10 max-w-3xl mx-auto mb-24">
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 w-full">
            <h1 className="text-2xl font-semibold mb-4">Update Profile</h1>
            <UpdateForm profile={existingProfile} onSave={handleSave} />
          </div>
        </div>
      )}

      <TechBar />
    </main>
  );
}
