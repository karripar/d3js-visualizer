"use client";

import SkillChart from "@/components/d3/skillChart";
import useSupabase from "@/hooks/supabaseHooks";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BackButton from "@/components/nav/BackButton";
// profile icon from lucide react
import ProfileCard from "@/components/profile/ProfileCard";
import ProjectsCard from "@/components/profile/ProjectsCard";
import { Project } from "@/types/LocalTypes";
import { JobExperience } from "@/types/LocalTypes";
import ExperiencesChart from "@/components/d3/ExperiencesChart";

interface ProfileData {
  name: string;
  title: string;
  skills: Array<{ name: string; level: number }>;
  introduction?: string;
  github?: string;
  linkedin?: string;
  personal_link?: string;
  projects?: Project[];
  colorProfile: string; // added color profile to the type
  experiences: JobExperience[]; // added experiences to the type
}

// Simple sessionStorage cache helpers
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const cacheKey = (slug: string) => `profile:${slug}`;

const readCache = (slug: string): ProfileData | null => {
  try {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem(cacheKey(slug));
    if (!raw) return null;
    const cached = JSON.parse(raw) as { data: ProfileData; ts: number };
    if (!cached?.data || !cached?.ts) return null;
    const isFresh = Date.now() - cached.ts < CACHE_TTL_MS;
    return isFresh ? cached.data : null;
  } catch {
    return null;
  }
};

const writeCache = (slug: string, data: ProfileData): void => {
  try {
    if (typeof window === "undefined") return;
    const payload = JSON.stringify({ data, ts: Date.now() });
    sessionStorage.setItem(cacheKey(slug), payload);
  } catch {
    // ignore
  }
};

export default function ProfilePage() {
  const { getProfile } = useSupabase();
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!slug) return;

        // 1) Try cache first
        const cached = readCache(slug);
        if (cached) {
          setData(cached);
          console.log("Loaded profile from cache:", slug);
          return; // Skip network if fresh cache
        }

        // 2) Fallback to Supabase
        const profile = await getProfile(slug);
        if (profile) {
          const normalized: ProfileData = {
            name: profile.name,
            title: profile.title,
            skills: profile.skills,
            introduction: profile.introduction || "",
            github: profile.github || "",
            linkedin: profile.linkedin || "",
            personal_link: profile.personal_link || "",
            projects: profile.projects || [],
            colorProfile: profile.colorProfile || "dark",
            experiences: profile.experiences || [],
          };
          setData(normalized);
          writeCache(slug, normalized);
        } else {
          setData(null);
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
      className={`min-h-screen relative overflow-hidden ${
        data?.colorProfile === "light" ? "bg-zinc-50" : "bg-zinc-950"
      }`}
    >
      {/* Glow blobs - smaller on mobile, larger on desktop */}
      <div
        className={`absolute -top-32 -left-32 w-96 h-96 sm:w-120 sm:h-120 rounded-full blur-3xl ${
          data?.colorProfile === "light" ? "bg-blue-300/30" : "bg-blue-500/30"
        }`}
      />
      <div
        className={`absolute -bottom-32 -right-32 w-96 h-96 sm:w-120 sm:h-120 rounded-full blur-3xl ${
          data?.colorProfile === "light"
            ? "bg-purple-300/30"
            : "bg-purple-500/30"
        }`}
      />

      {/* Content container with responsive spacing */}
      <div className="min-h-screen flex flex-col items-center justify-start px-3 sm:px-6 py-12 sm:py-16 relative z-10 gap-6 sm:gap-8">
        {/* Back button placed within flow to avoid overlap */}
        <div className="self-start">
          <BackButton to="/" label="Back to Home" variant="ghost" />
        </div>

        {/* Profile card */}
        <div className="w-full max-w-2xl">
          <ProfileCard
            data={data}
            colorProfile={data?.colorProfile || "dark"}
          />
        </div>

        {/* Experiences chart */}
        {data?.experiences && data.experiences.length > 0 && (
          <div className="w-full max-w-2xl overflow-visible">
            <ExperiencesChart
              experiences={data.experiences}
              colorProfile={data.colorProfile as "dark" | "light"}
            />
          </div>
        )}

        {/* Chart below the card so it isn't behind the text */}
        {data?.skills && data.skills.length > 0 && (
          <div className="w-full max-w-2xl">
            <SkillChart skills={data.skills} colorProfile={data.colorProfile} />
          </div>
        )}

        {/* Project card for each project */}
        {data?.projects &&
          data.projects.length > 0 &&
          data.projects.map((project, index) => (
            <div key={index} className="w-full max-w-2xl">
              <ProjectsCard
                project={project}
                colorProfile={data.colorProfile}
              />
            </div>
          ))}
      </div>
    </main>
  );
}
