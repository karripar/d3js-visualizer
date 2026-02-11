"use client";

import { useState } from "react";
import useSupabase from "@/hooks/supabaseHooks";

export default function Home() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState<{ name: string; level: number }[]>([
    { name: "", level: 50 },
  ]);
  const [github, setGithub] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [link, setLink] = useState("");
  const { createProfile } = useSupabase();

  const addSkill = () => setSkills([...skills, { name: "", level: 50 }]);

  const updateSkill = (
    i: number,
    key: "name" | "level",
    value: string | number
  ) => {
    const newSkills = [...skills];
    (newSkills[i][key] as typeof value) = value;
    setSkills(newSkills);
  };

  const handleSubmit = async () => {
    if (!name || !title) {
      alert("Name and title are required");
      return;
    }

    const profile = await createProfile({
      name,
      title,
      skills,
      github: github || undefined,
      linkedin: linkedIn || undefined,
      introduction: introduction || undefined,
    });

    if (profile) {
      setLink(`${window.location.origin}/p/${profile.slug}`);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-blue-500/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-125 h-125 bg-purple-500/30 rounded-full blur-3xl" />

      <div className="min-h-screen text-white p-10 max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Generate Your Visual CV
        </h1>
        <p className="mt-2 text-zinc-400">
          Fill in your details to create a shareable visual developer profile.
        </p>

        {/* Basic Info */}
        <section className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-300"
            >
              Full name
            </label>
            <input
              id="name"
              className="mt-1 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="Karri Partanen"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-zinc-300"
            >
              Professional title
            </label>
            <input
              id="title"
              className="mt-1 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="Full-Stack Developer"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="github"
              className="block text-sm font-medium text-zinc-300"
            >
              GitHub URL <span className="text-zinc-500">(optional)</span>
            </label>
            <input
              id="github"
              className="mt-1 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="https://github.com/username"
              onChange={(e) => setGithub(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="linkedin"
              className="block text-sm font-medium text-zinc-300"
            >
              LinkedIn URL <span className="text-zinc-500">(optional)</span>
            </label>
            <input
              id="linkedin"
              className="mt-1 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="https://linkedin.com/in/username"
              onChange={(e) => setLinkedIn(e.target.value)}
            />
          </div>
        </section>

        {/* Introduction */}
        <section className="mt-8">
          <label
            htmlFor="intro"
            className="block text-sm font-medium text-zinc-300"
          >
            Short introduction{" "}
            <span className="text-zinc-500">(max 300 characters)</span>
          </label>

          <textarea
            id="intro"
            maxLength={300}
            className="mt-2 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg resize-none h-32 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="I’m a third-year ICT student passionate about building modern web apps..."
            onChange={(e) => setIntroduction(e.target.value)}
          />
        </section>

        {/* Skills */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Skills</h2>

          <div className="mt-4 space-y-3">
            {skills.map((s, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex-1">
                  <label className="sr-only">Skill name</label>
                  <input
                    className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="React"
                    onChange={(e) => updateSkill(i, "name", e.target.value)}
                  />
                </div>

                <div>
                  <label className="sr-only">Skill level</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    className="w-24 p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={s.level}
                    onChange={(e) =>
                      updateSkill(i, "level", Number(e.target.value))
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addSkill}
            className="mt-3 text-sm text-blue-400 hover:text-blue-300"
          >
            + Add another skill
          </button>
        </section>

        {/* Submit */}
        <div className="mt-10">
          <button
            onClick={handleSubmit}
            className="
                px-6 py-3 rounded-xl font-semibold text-white
                bg-white/10 backdrop-blur-md border border-white/20
                hover:bg-white/20 hover:border-white/30
                transition-all duration-200
                shadow-lg hover:shadow-blue-500/30"
          >
            Generate Profile
          </button>
        </div>

        {/* Result */}
        {link && (
          <div className="mt-8 bg-zinc-900 border border-zinc-700 p-4 rounded-lg">
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
      </div>
    </main>
  );
}
