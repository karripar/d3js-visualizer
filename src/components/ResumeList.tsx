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

const ResumeList = ({ resumes }: { resumes: ResumaProps[] }) => {
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
                className="inline-flex justify-center items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 border border-blue-400/40 w-full sm:w-auto"
                aria-label={`Edit resume ${r.name}`}
              >
                Edit
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ResumeList;
