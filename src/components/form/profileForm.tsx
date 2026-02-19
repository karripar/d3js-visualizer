"use client";

import { useState } from "react";
import Skills from "./Skills";
import Projects from "./Projects";

export type Skill = { name: string; level: number };
export type Project = {
  title: string;
  description: string;
  link?: string;
  technologies?: string; // comma-separated list
};
export type ProfileFormData = {
  name: string;
  title: string;
  skills: Skill[]; // level from 1-10
  github?: string;
  linkedin?: string;
  personal_link?: string;
  introduction?: string;
  projects?: Project[];
  colorProfile?: string; // optional field for color profile
};

type ProfileFormProps = {
  initial?: Partial<ProfileFormData>;
  onSubmit: (data: ProfileFormData) => Promise<void> | void;
};

export default function ProfileForm({ initial, onSubmit }: ProfileFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [skills, setSkills] = useState<Skill[]>(
    initial?.skills ?? [{ name: "", level: 5 }]
  );
  const [projects, setProjects] = useState<Project[]>(initial?.projects ?? []);

  const [colorProfile, setColorProfile] = useState(
    initial?.colorProfile ?? "blue"
  );

  const [github, setGithub] = useState(initial?.github ?? "");
  const [linkedIn, setLinkedIn] = useState(initial?.linkedin ?? "");
  const [personalLink, setPersonalLink] = useState(
    initial?.personal_link ?? ""
  );
  const [introduction, setIntroduction] = useState(initial?.introduction ?? "");
  const [submitting, setSubmitting] = useState(false);

  const addSkill = () => setSkills((prev) => [...prev, { name: "", level: 5 }]);
  const removeSkill = (i: number) =>
    setSkills((prev) => prev.filter((_, idx) => idx !== i));

  const addProject = () =>
    setProjects((p) => [
      ...p,
      { title: "", description: "", link: "", technologies: "" },
    ]);
  const removeProject = (i: number) =>
    setProjects((p) => p.filter((_, idx) => idx !== i));
  const updateProject = (i: number, key: keyof Project, value: string) =>
    setProjects((p) =>
      p.map((proj, idx) => (idx === i ? { ...proj, [key]: value } : proj))
    );

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
      // Avoid lazy alerts per UX; use inline disabled state instead.
      return;
    }
    setSubmitting(true);
    try {
      // Filter out empty skills and projects before submit
      const cleanedSkills = skills.filter((s) => s.name.trim() !== "");
      const cleanedProjects = projects
        .map((p) => ({
          title: p.title?.trim() ?? "",
          description: p.description?.trim() ?? "",
          link: p.link?.trim() || "",
          technologies: p.technologies?.trim() || "",
        }))
        .filter((p) => p.title !== "" && p.description !== "");

      await onSubmit({
        name,
        title,
        skills: cleanedSkills,
        github: github || undefined,
        linkedin: linkedIn || undefined,
        personal_link: personalLink || undefined,
        introduction: introduction || undefined,
        projects: cleanedProjects.map((p) => ({
          title: p.title,
          description: p.description,
          link: p.link || undefined,
          technologies: p.technologies || undefined,
        })),
        colorProfile,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-white p-10 max-w-2xl mx-auto mb-12">
      <h1 className="text-4xl font-bold tracking-tight">
        Generate Your Visual CV
      </h1>
      <p className="mt-2 text-zinc-400">
        Fill in your details to create a shareable visual professional profile.
        You can always update it later to keep it fresh and relevant. Focus on
        your strengths and let the visuals do the talking!
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
            value={name}
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
            value={title}
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
            value={github}
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
            value={linkedIn}
            onChange={(e) => setLinkedIn(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="personal-link"
            className="block text-sm font-medium text-zinc-300"
          >
            Personal website URL{" "}
            <span className="text-zinc-500">(optional)</span>
          </label>
          <input
            id="personal-link"
            className="mt-1 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="https://yourportfolio.com"
            value={personalLink}
            onChange={(e) => setPersonalLink(e.target.value)}
          />
        </div>
      </section>

      {/* Color Profile */}
      <section className="mt-8">
        <label
          htmlFor="color-profile"
          className="block text-sm font-medium text-zinc-300"
        >
          Color profile        </label>
          <p className="text-zinc-500 text-sm mt-1">
            Choose a color scheme for your profile. The dark theme is great for a sleek, modern look, while the light theme offers a clean and classic feel. You can change this later to keep your profile fresh and aligned with your personal brand!
          </p>
        <select
          id="color-profile"
          className="mt-2 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          value={colorProfile}
          onChange={(e) => setColorProfile(e.target.value)}
        >
          <option value="dark">Dark (default)</option>
          <option value="light">Light</option>
        </select>
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
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
        />
      </section>

      {/* Skills */}
      <Skills
        skills={skills}
        onAdd={addSkill}
        onRemove={removeSkill}
        onUpdate={updateSkill}
      />

      <Projects
        projects={projects}
        onAdd={addProject}
        onRemove={removeProject}
        onUpdate={updateProject}
      />

      {/* Submit */}
      <div className="mt-10">
        <button
          onClick={handleSubmit}
          disabled={submitting || !name.trim() || !title.trim()}
          className="px-6 py-3 rounded-xl font-semibold text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-200 shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          title={
            !name.trim() || !title.trim()
              ? "Fill in name and title to continue"
              : undefined
          }
        >
          {submitting ? "Generating..." : "Generate Profile"}
        </button>
        {!name.trim() || !title.trim() ? (
          <p className="mt-2 text-xs text-amber-200/80">
            Name and professional title are required.
          </p>
        ) : null}
      </div>
    </div>
  );
}
