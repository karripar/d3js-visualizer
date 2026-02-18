import Image from "next/image";

export function TechBar() {
  return (
    <footer className="sticky bottom-0 left-0 w-full bg-white/5 backdrop-blur-xl border-t border-white/10 z-40">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-300">
        <span className="flex items-center gap-1">Powered by</span>

        <TechBadge icon="/icons/Next.js.svg">Next.js</TechBadge>
        <TechBadge icon="/icons/React.svg">React</TechBadge>
        <TechBadge icon="/icons/PostgresSQL.svg">
          Supabase + PostgreSQL
        </TechBadge>
        <TechBadge icon="/icons/D3.js.svg">D3.js</TechBadge>
      </div>
      {/* Link to privacy policy */}
      <div className="absolute top-1 left-3 text-[14px] text-zinc-500">
        <a
          href="/privacy"
          className="underline hover:text-zinc-400 transition"
        >
          Privacy Policy
        </a>
      </div>

      {/* Creator credits */}
      <div className="absolute top-1 right-3 text-[14px] text-zinc-500">
        Created by{" "}
        <a
          href="https://github.com/karripar"
          target="_blank"
          className="underline hover:text-zinc-400 transition"
        >
          karripar
        </a>
      </div>
    </footer>
  );
}

function TechBadge({
  icon,
  children,
}: {
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-md border border-white/10 hover:bg-white/20 transition">
      <Image src={icon} alt="" width={14} height={14} className="opacity-80" />
      {children}
    </span>
  );
}
