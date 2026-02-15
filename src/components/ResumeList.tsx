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

  return (
    <>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {resumes.map((r) => (
          <li
            key={r.id}
            className="group rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition overflow-hidden shadow-sm hover:shadow-md"
          >
            <Link href={`/p/${r.slug}`} className="block p-3 sm:p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-medium text-zinc-100 group-hover:text-white truncate">
                    {r.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 truncate">
                    {r.title}
                  </p>
                </div>
                <span className="text-[10px] sm:text-[11px] text-zinc-500 whitespace-nowrap">
                  {r.created_at
                    ? new Date(r.created_at).toLocaleDateString()
                    : ""}
                </span>
              </div>
            </Link>
            {/* Edit link accessible from profile page list */}
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
