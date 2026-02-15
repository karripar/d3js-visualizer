import { Project } from "@/types/LocalTypes";

interface ProjectsCardProps {
  project: Project;
}

const ProjectsCard = ({ project }: ProjectsCardProps) => {
  const { title, description, link, technologies } = project;
  const techList = technologies ? technologies.split(",").map((t) => t.trim()) : [];

  return (
    <article className="group relative overflow-hidden rounded-xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      {/* Decorative gradient accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-500 via-cyan-400 to-emerald-400 opacity-80" />

      <header className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            aria-label={`Open project: ${title}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path d="M14 3h7v7" />
              <path d="M10 14L21 3" />
              <path d="M21 14v7h-7" />
              <path d="M3 10l11 11" />
            </svg>
            Visit
          </a>
        )}
      </header>

      <p className="mb-4 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
        {description}
      </p>

      {techList.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {techList.map((tech, idx) => (
            <li key={`${tech}-${idx}`} className="">
              <span className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700">
                {tech}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Subtle glow on hover */}
      <div className="pointer-events-none absolute -inset-px rounded-xl opacity-0 ring-2 ring-blue-500/20 transition-opacity duration-200 group-hover:opacity-100" />
    </article>
  );
};

export default ProjectsCard;
