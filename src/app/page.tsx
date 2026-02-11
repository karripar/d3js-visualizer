"use client";

import { useState } from "react";
import useSupabase from "@/hooks/supabaseHooks";

export default function Home() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState<{ name: string; level: number }[]>([{ name: "", level: 50 }]);
  const [github, setGithub] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [link, setLink] = useState("");
  const { createProfile } = useSupabase();

  const addSkill = () =>
    setSkills([...skills, { name: "", level: 50 }]);

  const updateSkill = (i: number, key: "name" | "level", value: string | number) => {
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
      introduction: undefined
    });

    if (profile) {
      setLink(`${window.location.origin}/p/${profile.slug}`);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-10 max-w-xl mx-auto">
      <h1 className="text-4xl font-bold">Generate Your Visual CV</h1>

      <input
        className="mt-6 w-full p-2 bg-zinc-800 rounded"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="mt-3 w-full p-2 bg-zinc-800 rounded"
        placeholder="Title (e.g. Fullstack Developer)"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input 
      className="mt-3 w-full p-2 bg-zinc-800 rounded"
      placeholder="Github URL (optional)"
      onChange={(e) => setGithub(e.target.value)}
      />

      <input
        className="mt-3 w-full p-2 bg-zinc-800 rounded"
        placeholder="LinkedIn URL (optional)"
        onChange={(e) => setLinkedIn(e.target.value)}
      />

      <div>
        <h3 className="mt-6 text-lg font-semibold">
          Introduction (optional, max 300 chars)
        </h3>
        <textarea
          className="mt-2 w-full p-2 bg-zinc-800 rounded max-h-40 overflow-auto"
          placeholder="Write a short introduction about yourself"
          maxLength={300}
        />
      </div>


      <h2 className="mt-6 text-xl font-semibold">Skills</h2>

      {skills.map((s, i) => (
        <div key={i} className="flex gap-2 mt-2">
          <input
            className="flex-1 p-2 bg-zinc-800 rounded"
            placeholder="Skill name"
            onChange={(e) => updateSkill(i, "name", e.target.value)}
          />
          <input
            type="number"
            className="w-20 p-2 bg-zinc-800 rounded"
            value={s.level}
            onChange={(e) => updateSkill(i, "level", Number(e.target.value))}
          />
        </div>
      ))}

      <div className="flex flex-col items-start">
      <button
        onClick={addSkill}
        className="mt-2 text-blue-400 text-sm"
      >
        + Add skill
      </button>

      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-600 px-4 py-2 rounded font-semibold"
      >
        Generate Profile
      </button>
      </div>

      {link && (
        <div className="mt-6 bg-zinc-800 p-3 rounded">
          Your profile link:  
          <a className="text-blue-400 block" href={link}>{link}</a>
        </div>
      )}
    </main>
  );
}
