// filepath: c:\Users\karri\WebDev\new-tech\d3js-visualizer\src\components\form\updateForm.tsx
import React, { useEffect, useState } from "react";
import type { Profile } from "@/types/LocalTypes";
import Skills from "./Skills";

type UpdateFormProps = {
  profile: Profile;
  onSave?: (updated: Profile) => void;
  onCancel?: () => void;
};

export default function UpdateForm({
  profile,
  onSave,
  onCancel,
}: UpdateFormProps) {
  const [form, setForm] = useState<Profile>(profile);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Projects handlers
  const handleProjectChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const projects = [...(prev.projects ?? [])];
      const proj = {
        ...(projects[index] ?? { title: "", description: "" }),
      } as NonNullable<Profile["projects"]>[number];
      // Map form names to project fields
      if (name === "project_title") proj.title = value;
      if (name === "project_description") proj.description = value;
      if (name === "project_link") proj.link = value;
      if (name === "project_technologies") proj.technologies = value;
      projects[index] = proj;
      return { ...prev, projects };
    });
  };

  const addProject = () => {
    setForm((prev) => ({
      ...prev,
      projects: [
        ...(prev.projects ?? []),
        { title: "", description: "", link: "", technologies: "" },
      ],
    }));
  };

  const removeProject = (index: number) => {
    setForm((prev) => {
      const projects = [...(prev.projects ?? [])];
      projects.splice(index, 1);
      return { ...prev, projects };
    });
  };

  // Skills handlers using shared Skills component (UI uses 1–10, storage uses 0–100)
  const addSkill = () => {
    setForm((prev) => ({
      ...prev,
      skills: [...(prev.skills ?? []), { name: "", level: 50 }],
    }));
  };

  const removeSkill = (index: number) => {
    setForm((prev) => {
      const skills = [...(prev.skills ?? [])];
      skills.splice(index, 1);
      return { ...prev, skills };
    });
  };

  const updateSkill = (
    index: number,
    key: "name" | "level",
    value: string | number
  ) => {
    setForm((prev) => {
      const skills = [...(prev.skills ?? [])];
      const skill = { ...(skills[index] ?? { name: "", level: 50 }) };
      if (key === "name") skill.name = String(value);
      if (key === "level") skill.level = Number(value) * 10; // map 1–10 to 10–100
      skills[index] = skill;
      return { ...prev, skills };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      onSave?.(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 mx-auto text-white w-full px-2 sm:px-4"
    >
      {/* Header */}
      <div>
        <p className="mt-2 text-zinc-400">
          Adjust your details to keep your visual CV current and relevant.
        </p>
      </div>

      {/* Basic profile fields */}
      <section className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-zinc-300"
          >
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            required
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
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            className="mt-1 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            required
          />
        </div>

        <div>
          <label
            htmlFor="introduction"
            className="block text-sm font-medium text-zinc-300"
          >
            Short introduction{" "}
            <span className="text-zinc-500">(max 300 characters)</span>
          </label>
          <textarea
            id="introduction"
            name="introduction"
            maxLength={300}
            value={form.introduction ?? ""}
            onChange={handleChange}
            className="mt-2 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg resize-none h-32 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </section>

      {/* Social links */}
      <section className="space-y-4">
        <div>
          <label
            htmlFor="github"
            className="block text-sm font-medium text-zinc-300"
          >
            GitHub URL <span className="text-zinc-500">(optional)</span>
          </label>
          <input
            id="github"
            name="github"
            type="url"
            value={form.github ?? ""}
            onChange={handleChange}
            className="mt-1 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="https://github.com/username"
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
            name="linkedin"
            type="url"
            value={form.linkedin ?? ""}
            onChange={handleChange}
            className="mt-1 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="https://www.linkedin.com/in/username"
          />
        </div>

        <div>
          <label
            htmlFor="personal_link"
            className="block text-sm font-medium text-zinc-300"
          >
            Personal website URL{" "}
            <span className="text-zinc-500">(optional)</span>
          </label>
          <input
            id="personal_link"
            name="personal_link"
            type="url"
            value={form.personal_link ?? ""}
            onChange={handleChange}
            className="mt-1 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="https://example.com"
          />
        </div>
      </section>

      { /* Color profile (optional) */}
      <section>
        <label
          htmlFor="colorProfile"
          className="block text-sm font-medium text-zinc-300"
        >
          Color Profile <span className="text-zinc-500">(optional)</span>
        </label>
        <select
          id="colorProfile"
          name="colorProfile"
          value={form.colorProfile ?? "dark"}
          onChange={handleChange}
          className="mt-1 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="dark">Dark (default)</option>
          <option value="light">Light</option>
          
        </select>
      </section>

      {/* Projects */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-300">Projects</h3>
          <button
            type="button"
            onClick={addProject}
            className="px-3 py-1 rounded-xl font-medium text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-200 text-sm"
          >
            Add Project
          </button>
        </div>
        {(form.projects ?? []).length === 0 && (
          <p className="text-xs text-zinc-500">No projects added yet.</p>
        )}
        {(form.projects ?? []).map((proj, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-zinc-900 border border-zinc-700 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Project #{idx + 1}</span>
              <button
                type="button"
                onClick={() => removeProject(idx)}
                className="px-2 py-1 rounded-xl font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 text-xs"
              >
                Remove
              </button>
            </div>
            <div>
              <label
                className="block text-sm font-medium text-zinc-300"
                htmlFor={`project_title_${idx}`}
              >
                Title
              </label>
              <input
                id={`project_title_${idx}`}
                name="project_title"
                type="text"
                value={proj.title ?? ""}
                onChange={(e) => handleProjectChange(idx, e)}
                className="mt-1 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-zinc-300"
                htmlFor={`project_description_${idx}`}
              >
                Description
              </label>
              <textarea
                id={`project_description_${idx}`}
                name="project_description"
                value={proj.description ?? ""}
                onChange={(e) => handleProjectChange(idx, e)}
                className="mt-2 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 max-h-75 resize-none"
                rows={3}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-zinc-300"
                htmlFor={`project_link_${idx}`}
              >
                Link
              </label>
              <input
                id={`project_link_${idx}`}
                name="project_link"
                type="url"
                value={proj.link ?? ""}
                onChange={(e) => handleProjectChange(idx, e)}
                className="mt-1 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="https://example.com/project"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-zinc-300"
                htmlFor={`project_technologies_${idx}`}
              >
                Technologies
              </label>
              <input
                id={`project_technologies_${idx}`}
                name="project_technologies"
                type="text"
                value={proj.technologies ?? ""}
                onChange={(e) => handleProjectChange(idx, e)}
                className="mt-1 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="e.g. React, D3.js, Node.js"
              />
            </div>
          </div>
        ))}
      </section>

      {/* Skills (shared component with sliders) */}
      <Skills
        skills={(form.skills ?? []).map((s) => ({
          name: s.name ?? "",
          level: Math.max(1, Math.min(10, Math.round((s.level ?? 50) / 10))),
        }))}
        onAdd={addSkill}
        onRemove={removeSkill}
        onUpdate={updateSkill}
      />

      {/* Actions */}
      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          className="px-6 py-3 rounded-xl font-semibold text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-200 shadow-lg hover:shadow-blue-500/30 disabled:opacity-50"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
          >
            Cancel
          </button>
        )}
        
      </div>
    </form>
  );
}
