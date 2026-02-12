"use client";

import SkillChart from "@/components/skillChart";
import useSupabase from "@/hooks/supabaseHooks";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface ProfileData {
  name: string;
  title: string;
  skills: Array<{ name: string; level: number }>;
  introduction?: string;
  github?: string;
  linkedin?: string;
}

export default function ProfilePage() {
  const { getProfile } = useSupabase();
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (slug) getProfile(slug).then(setData);
  }, [slug]);

  return (
    <main className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Glow blobs */}
      <div className="absolute -top-40 -left-40 w-150 h-150 bg-blue-500/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-150 h-150 bg-purple-500/30 rounded-full blur-3xl" />

      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10 gap-8">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-2xl w-full shadow-xl text-white">
          {data ? (
            <>
              <h1 className="text-4xl font-bold tracking-tight">{data.name}</h1>
              <p className="text-lg text-blue-400 font-medium">{data.title}</p>

              <p className="mt-4 text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {data.introduction || "No introduction provided."}
              </p>

              <div className="mt-6 flex gap-3">
                {data.github && (
                  <a
                    href={data.github}
                    target="_blank"
                    className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg hover:bg-white/20 transition text-sm"
                  >
                    GitHub
                  </a>
                )}
                {data.linkedin && (
                  <a
                    href={data.linkedin}
                    target="_blank"
                    className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg hover:bg-white/20 transition text-sm"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </>
          ) : (
            <p className="text-zinc-400">Loading profile…</p>
          )}
        </div>

        {/* Chart below the card so it isn't behind the text */}
        {data && (
          <div className="w-full max-w-2xl">
            <SkillChart skills={data.skills} />
          </div>
        )}
      </div>
    </main>
  );
}
