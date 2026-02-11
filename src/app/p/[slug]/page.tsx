"use client";

import SkillChart from "@/components/skillChart";
import useSupabase from "@/hooks/supabaseHooks";
import { use, useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface ProfilePageParams {
  params: {
    slug: string;
  };
}

export default function ProfilePage({ params }: ProfilePageParams) {
    const { getProfile } = useSupabase();
  
    interface ProfileData {
      name: string;
      title: string;
      skills: Array<{ name: string; level: number }>;
      introduction?: string;
      github?: string;
      linkedin?: string;
    }

    const [data, setData] = useState<ProfileData | null>(null);
    const { slug } = useParams();

    useEffect(() => {
        if (typeof slug === "string") {
            getProfile(slug).then(setData);
        }
    }, [slug]);

  return (
    <main className="min-h-screen text-white p-10 max-w-xl mx-auto">
      {data ? (
        <>
          <h1 className="text-4xl font-bold">{data.name}</h1>
          <p className="text-zinc-400">{data.title}</p>
          <div className="mt-4 text-zinc-300 whitespace-pre-wrap">
            {data.introduction || "No introduction provided."}
          </div>
          {data.github && (
            <a
              href={data.github}
                target="_blank"
                className="text-blue-400 mt-4 block"
            >
              GitHub: {data.github}
            </a>
            )}

          <SkillChart skills={data.skills} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
}
