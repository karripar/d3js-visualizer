import React from "react";
import Link from "next/link";

interface ResumaProps {
  id: number;
  name: string;
  title: string;
  slug: string;
  user_id?: string | null;
  created_at?: string;
}

interface ResumeListProps {
  resumes: ResumaProps[];
  onDelete?: (slug: string) => void; // Optional delete handler
}

const ResumeList = ({ resumes, onDelete }: ResumeListProps) => {
  // Add confirmation state for a more mature deletion UX
  const [confirmSlug, setConfirmSlug] = React.useState<string | null>(null);
  // Track which resume link was last copied for inline feedback
  const [copiedSlug, setCopiedSlug] = React.useState<string | null>(null);

  const handleCopy = async (slug: string) => {
    const url = `${window.location.origin}/p/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(
        () => setCopiedSlug((current) => (current === slug ? null : current)),
        2000
      );
    } catch (error) {
      console.error("Failed to copy resume URL", error);
    }
  };

  return (
    <>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {resumes.map((r) => (
          <li
            key={r.id}
            className="group rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition overflow-hidden shadow-sm hover:shadow-md"
          >
            {/* Header: date on the left, copy button on the right */}
            <div className="flex items-center justify-between gap-2 p-3 sm:p-4 pb-2 border-b border-white/5">
              <span className="text-[12px] sm:text-[14px] text-zinc-400">
                {r.created_at
                  ? new Date(r.created_at).toLocaleDateString()
                  : ""}
              </span>

              <button
                type="button"
                onClick={() => handleCopy(r.slug)}
                className="inline-flex items-center gap-1.5 rounded-md border border-sky-500/40 bg-sky-500/10 px-2 py-1 text-[10px] sm:text-xs font-medium text-sky-100 hover:bg-sky-500/20 hover:border-sky-400/70 transition-colors shrink-0"
                aria-label={`Copy public URL for resume ${r.name}`}
                title="Copy public link"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-3.5 w-3.5 items-center justify-center"
                >
                  <svg
                    className="h-3 w-3 text-sky-300"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 11.5L5.75 13.25C4.65 14.35 4.65 16.15 5.75 17.25C6.85 18.35 8.65 18.35 9.75 17.25L11.5 15.5M8.5 8.5L10.25 6.75C11.35 5.65 13.15 5.65 14.25 6.75C15.35 7.85 15.35 9.65 14.25 10.75L12.5 12.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>{copiedSlug === r.slug ? "Copied" : "Copy link"}</span>
              </button>
            </div>

            {/* Body: single instance of name + title, fully clickable */}
            <Link
              href={`/p/${r.slug}`}
              className="block px-3 pt-2 pb-3 sm:px-4 sm:pt-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-medium text-zinc-100 group-hover:text-white truncate">
                    {r.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 truncate">
                    {r.title}
                  </p>
                </div>
              </div>
            </Link>
            {/* Edit / Delete controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 px-3 pb-3 sm:px-4">
              <Link
                href={`/profile/update/${r.slug}`}
                className="inline-flex justify-center items-center gap-1.5 rounded-md border border-slate-500/40 bg-slate-800/40 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700/40 hover:border-slate-400/50 w-full sm:w-auto"
                aria-label={`Edit resume ${r.name}`}
              >
                Edit
              </Link>
              {onDelete &&
                // Two-step confirmation for deletion
                (confirmSlug === r.slug ? (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setConfirmSlug(null)}
                      className="inline-flex justify-center items-center gap-1.5 rounded-md border border-zinc-500/40 bg-transparent px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800/40 hover:border-zinc-400/50 w-full sm:w-auto"
                      aria-label={`Cancel deletion of resume ${r.name}`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setConfirmSlug(null);
                        onDelete?.(r.slug);
                      }}
                      className="inline-flex justify-center items-center gap-1.5 rounded-md border border-red-500/40 bg-red-800/30 px-3 py-1.5 text-xs font-medium text-red-200 hover:bg-red-800/50 hover:border-red-400/50 w-full sm:w-auto"
                      aria-label={`Confirm delete resume ${r.name}`}
                    >
                      Confirm
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmSlug(r.slug)}
                    className="inline-flex justify-center items-center gap-1.5 rounded-md border border-zinc-500/40 bg-transparent px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800/40 hover:border-zinc-400/50 w-full sm:w-auto"
                    aria-label={`Delete resume ${r.name}`}
                    title="Delete"
                  >
                    Delete
                  </button>
                ))}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ResumeList;
