"use client";
import React, { useEffect, useState } from "react";
import useSupabase from "@/hooks/supabaseHooks";
import BackButton from "./BackButton";
import GoogleLogin from "@/components/auth/GoogleLogin";
import Link from "next/link";

type UniversalNavProps = {
  backTo?: string;
  backLabel?: string;
  className?: string;
};

const UniversalNav: React.FC<UniversalNavProps> = ({
  backTo = "/",
  backLabel = "Back to Home",
  className,
}) => {
  const { getUser } = useSupabase();
  const [user, setUser] = useState<null | { id: string }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getUser();
        if (mounted) setUser(res?.data?.user ? { id: res.data.user.id } : null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [getUser]);

  return (
    <nav
      className={
        className ??
        "fixed top-0 left-0 right-0 z-30 px-4 py-3 flex items-center justify-between bg-zinc-950/70 backdrop-blur border-b border-white/10"
      }
    >
      <div className="flex items-center gap-3">
        <BackButton to={backTo} label={backLabel} variant="ghost" />
      </div>

      <div className="flex items-center gap-3">
        {loading ? (
          <span className="text-xs text-zinc-400">Loading…</span>
        ) : user ? (
          <>
            {/* Replace target with your user’s profile route if different */}
            <Link
              href={`/p/${user.id}`}
              className="px-3 py-2 rounded-lg text-sm font-medium text-white bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 transition"
            >
              My Profile
            </Link>
          </>
        ) : (
          <GoogleLogin />
        )}
      </div>
    </nav>
  );
};

export default UniversalNav;
