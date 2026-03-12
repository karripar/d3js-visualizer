"use client";

import { useState } from "react";
import Skills from "./Skills";
import Projects from "./Projects";
import { JobExperience } from "@/types/LocalTypes";

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
  // New field for job experiences
  experiences?: JobExperience[];
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

  // New state for job experiences (max 3 positions)
  const [experiences, setExperiences] = useState<JobExperience[]>(
    initial?.experiences ?? [
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]
  );

  const [colorProfile, setColorProfile] = useState(
    initial?.colorProfile ?? "dark"
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

  // New helpers for experiences
  const addExperience = () => {
    setExperiences((prev) => {
      if (prev.length >= 3) return prev; // enforce max of three
      return [
        ...prev,
        { company: "", role: "", startDate: "", endDate: "", description: "" },
      ];
    });
  };

  const removeExperience = (i: number) => {
    setExperiences((prev) => prev.filter((_, idx) => idx !== i));
  };

  const updateExperience = (
    i: number,
    key: keyof JobExperience,
    value: string
  ) => {
    setExperiences((prev) =>
      prev.map((exp, idx) => (idx === i ? { ...exp, [key]: value } : exp))
    );
  };

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

      // Clean experiences: keep only those with company & role
      const cleanedExperiences = experiences
        .map((e) => ({
          company: e.company?.trim() ?? "",
          role: e.role?.trim() ?? "",
          startDate: e.startDate?.trim() ?? "",
          endDate: e.endDate?.trim() ?? "",
          description: e.description?.trim() || "",
        }))
        .filter((e) => e.company !== "" && e.role !== "");

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
        experiences: cleanedExperiences.length ? cleanedExperiences : undefined,
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
          Color profile{" "}
        </label>
        <p className="text-zinc-500 text-sm mt-1">
          Choose a color scheme for your profile. The dark theme is great for a
          sleek, modern look, while the light theme offers a clean and classic
          feel. You can change this later to keep your profile fresh and aligned
          with your personal brand!
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

      {/* Job Experience (max 3 positions) */}
      <section className="mt-8">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">
              Job experience
            </h2>
            <p className="text-zinc-500 text-sm">
              Add up to three of your most relevant roles.
            </p>
          </div>
          <button
            type="button"
            onClick={addExperience}
            disabled={experiences.length >= 3}
            className="text-xs px-3 py-1 rounded-full border border-zinc-600 text-zinc-200 hover:border-indigo-400 hover:text-indigo-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add position ({experiences.length}/3)
          </button>
        </div>

        <div className="mt-4 space-y-6">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="rounded-xl border border-zinc-700 bg-zinc-900/60 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-200">
                  Position {index + 1}
                </h3>
                {experiences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="text-xs text-red-300 hover:text-red-200"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400">
                    Company
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full p-2 text-sm bg-zinc-950 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="Acme Corp"
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(index, "company", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400">
                    Role / Position
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full p-2 text-sm bg-zinc-950 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="Frontend Developer"
                    value={exp.role}
                    onChange={(e) =>
                      updateExperience(index, "role", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400">
                    Start date
                  </label>
                  <input
                    type="month"
                    className="mt-1 w-full p-2 text-sm bg-zinc-950 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={exp.startDate}
                    onChange={(e) =>
                      updateExperience(index, "startDate", e.target.value)
                    }
                  />
                  <p className="mt-1 text-[10px] text-zinc-500">
                    Select month and year (e.g., Mar 2023)
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400">
                    End date
                  </label>
                  <input
                    type="month"
                    className="mt-1 w-full p-2 text-sm bg-zinc-950 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={exp.endDate}
                    onChange={(e) =>
                      updateExperience(index, "endDate", e.target.value)
                    }
                  />
                  <p className="mt-1 text-[10px] text-zinc-500">
                    Leave empty if currently employed, or select month and year
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400">
                  Summary (optional)
                </label>
                <textarea
                  className="mt-1 w-full p-2 text-sm bg-zinc-950 border border-zinc-700 rounded-lg resize-none h-20 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="Key responsibilities, impact, and technologies used..."
                  value={exp.description ?? ""}
                  onChange={(e) =>
                    updateExperience(index, "description", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
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
