import React from 'react'
import Link from 'next/link';

interface ResumaProps {
    id: number;
    name: string;
    title: string;
    slug: string;
    user_id?: string | null;
    created_at?: string;
}

const ResumeList = ({
    resumes,
}: {
    resumes: ResumaProps[];
}) => {
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
                      <div>
                        <h3 className="text-sm sm:text-base font-medium text-zinc-100 group-hover:text-white">
                          {r.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-400">
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
                </li>
              ))}
            </ul>
    </>
  )
}

export default ResumeList