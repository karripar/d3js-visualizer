"use client";

import React from "react";

export type Project = {
  title: string;
  description: string;
  link?: string;
  technologies?: string; // comma-separated list
};

type ProjectsProps = {
  projects: Project[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, key: keyof Project, value: string) => void;
};

export default function Projects({
  projects,
  onAdd,
  onRemove,
  onUpdate,
}: ProjectsProps) {
  const max = 3;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold">Projects</h2>
      <p className="text-sm text-zinc-400 mt-1">
        Add up to {max} projects. Include a short description, a link, and the
        technologies used.
      </p>

      <div className="mt-4 space-y-6">
        {projects.map((p, i) => (
          <div
            key={i}
            className="p-4 border border-zinc-700 rounded-lg bg-zinc-900/50 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-zinc-300">
                Project title
              </label>
              <input
                type="text"
                className="mt-1 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Portfolio Website"
                value={p.title}
                onChange={(e) => onUpdate(i, "title", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300">
                Description
              </label>
              <textarea
                className="mt-1 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-y min-h-24"
                placeholder="A responsive portfolio site showcasing my projects and blog."
                value={p.description}
                onChange={(e) => onUpdate(i, "description", e.target.value)}
                maxLength={500}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300">
                Project link (optional)
              </label>
              <input
                type="url"
                className="mt-1 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="https://example.com"
                value={p.link ?? ""}
                onChange={(e) => onUpdate(i, "link", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300">
                Technologies used (optional)
              </label>
              <input
                type="text"
                className="mt-1 w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="React, TypeScript, Tailwind CSS"
                value={p.technologies ?? ""}
                onChange={(e) => onUpdate(i, "technologies", e.target.value)}
              />
              <p className="text-xs text-zinc-500 mt-1">
                Separate with commas.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => onRemove(i)}
                className="text-red-400 hover:text-red-300 transition"
                aria-label={`Remove project ${p.title || i + 1}`}
                disabled={projects.length <= 1}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onAdd}
        disabled={projects.length >= max}
        className={`mt-3 text-sm transition ${
          projects.length >= max
            ? "text-zinc-600 cursor-not-allowed"
            : "text-blue-400 hover:text-blue-300"
        }`}
      >
        + Add another project
      </button>
    </section>
  );
}
