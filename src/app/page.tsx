"use client";

import { useState } from "react";
import useSupabase from "@/hooks/supabaseHooks";

export default function Home() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState<{ name: string; level: number }[]>([
    { name: "", level: 5 },
  ]);
  const [github, setGithub] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [link, setLink] = useState("");
  const { createProfile } = useSupabase();

  const addSkill = () => setSkills([...skills, { name: "", level: 5 }]);

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
      // map slider levels (1-10) to percentages (10-100)
      skills: skills.map((s) => ({ name: s.name, level: s.level * 10 })),
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
              placeholder="John Doe"
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
          <p className="text-sm text-zinc-400 mt-1">
            List your key skills and rate your proficiency from 1 to 10. This
            will help visualize your strengths in different areas. You can add
            up to 8 skills.
          </p>

          <div className="mt-4 space-y-4">
            {skills.map((s, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex-1">
                  <label className="sr-only">Skill name</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="React"
                    value={s.name}
                    onChange={(e) => updateSkill(i, "name", e.target.value)}
                  />
                </div>

                <div className="flex flex-col">
                  {/* <label className="text-xs text-zinc-400 text-center">
                    Level: {s.level}/10
                  </label> */}
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={s.level}
                      aria-label={`Skill level for ${s.name || "skill"}`}
                      className="w-40 h-2 appearance-none bg-zinc-800 rounded-lg outline-none cursor-pointer"
                      onChange={(e) =>
                        updateSkill(i, "level", Number(e.target.value))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "ArrowRight")
                          updateSkill(i, "level", Math.min(10, s.level + 1));
                        if (e.key === "ArrowLeft")
                          updateSkill(i, "level", Math.max(1, s.level - 1));
                      }}
                      data-slider="skill"
                    />
                    <span className="text-sm text-zinc-300 w-10 text-right">
                      {s.level * 10}%
                    </span>
                  </div>
                  {/* ticks */}
                  <div className="mt-1 flex justify-between w-40">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((t) => (
                      <span
                        key={t}
                        className={`h-2 w-px ${
                          t === s.level ? "bg-blue-400" : "bg-zinc-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addSkill}
            disabled={skills.length >= 8}
            className={`mt-3 text-sm transition ${
              skills.length >= 8
                ? "text-zinc-600 cursor-not-allowed"
                : "text-blue-400 hover:text-blue-300"
            }`}
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
