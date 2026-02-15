"use client";

import SkillChart from "@/components/skillChart";
import useSupabase from "@/hooks/supabaseHooks";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BackButton from "@/components/nav/BackButton";
// profile icon from lucide react
import ProfileCard from "@/components/profile/ProfileCard";
import ProjectsCard from "@/components/profile/ProjectsCard";
import { Project } from "@/types/LocalTypes";

interface ProfileData {
  name: string;
  title: string;
  skills: Array<{ name: string; level: number }>;
  introduction?: string;
  github?: string;
  linkedin?: string;
  personal_link?: string;
  projects?: Project[];
}

export default function ProfilePage() {
  const { getProfile } = useSupabase();
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (slug) {
          const profile = await getProfile(slug);
          if (profile) {
            setData({
              name: profile.name,
              title: profile.title,
              skills: profile.skills,
              introduction: profile.introduction || "",
              github: profile.github || "",
              linkedin: profile.linkedin || "",
              personal_link: profile.personal_link || "",
              projects: profile.projects || [],
            });
          } else {
            setData(null);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setData(null);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return (
    <main
      id="profile-card"
      className="min-h-screen bg-zinc-950 relative overflow-hidden"
    >
      {/* Glow blobs - smaller on mobile, larger on desktop */}
      <div className="absolute -top-32 -left-32 w-96 h-96 sm:w-120 sm:h-120 bg-blue-500/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 sm:w-120 sm:h-120 bg-purple-500/30 rounded-full blur-3xl" />

      {/* Content container with responsive spacing */}
      <div className="min-h-screen flex flex-col items-center justify-start px-3 sm:px-6 py-12 sm:py-16 relative z-10 gap-6 sm:gap-8">
        {/* Back button placed within flow to avoid overlap */}
        <div className="self-start">
          <BackButton to="/" label="Back to Home" variant="ghost" />
        </div>

        {/* Profile card */}
        <div className="w-full max-w-2xl">
          <ProfileCard data={data} />
        </div>

        {/* Chart below the card so it isn't behind the text */}
        {data && (
          <div className="w-full max-w-2xl">
            <SkillChart skills={data.skills} />
          </div>
        )}

        {/* Project card for each project */}
        {data?.projects &&
          data.projects.length > 0 &&
          data.projects.map((project, index) => (
            <div key={index} className="w-full max-w-2xl">
              <ProjectsCard project={project} />
            </div>
          ))}
      </div>
    </main>
  );
}
