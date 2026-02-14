"use client";

export type Skill = { name: string; level: number };

type SkillsProps = {
  skills: Skill[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (
    index: number,
    key: "name" | "level",
    value: string | number
  ) => void;
};

export default function Skills({
  skills,
  onAdd,
  onRemove,
  onUpdate,
}: SkillsProps) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold">Skills</h2>
      <p className="text-sm text-zinc-400 mt-1">
        List your key skills and rate your proficiency from 1 to 10. This will
        help visualize your strengths in different areas. You can add up to 8
        skills.
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
                onChange={(e) => onUpdate(i, "name", e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={s.level}
                  aria-label={`Skill level for ${s.name || "skill"}`}
                  className="w-40 h-2 appearance-none bg-zinc-800 rounded-lg outline-none cursor-pointer"
                  onChange={(e) => onUpdate(i, "level", Number(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight")
                      onUpdate(i, "level", Math.min(10, s.level + 1));
                    if (e.key === "ArrowLeft")
                      onUpdate(i, "level", Math.max(1, s.level - 1));
                  }}
                  data-slider="skill"
                />
                <span className="text-sm text-zinc-300 w-10 text-right">
                  {s.level * 10}%
                </span>
                <button
                  onClick={() => onRemove(i)}
                  className="text-red-400 hover:text-red-300 transition-opacity"
                  aria-label={`Remove skill ${s.name || "skill"}`}
                  disabled={skills.length <= 1}
                >
                  &times;
                </button>
              </div>

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
        onClick={onAdd}
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
  );
}
