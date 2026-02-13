// filepath: src/components/nav/AuthTab.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import GoogleLogin from "@/components/auth/GoogleLogin";

export default function AuthTab() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!isMounted) return;
      setUser(user ?? null);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      {user ? (
        <Link
          href="/profile"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all"
        >
          My Profile
        </Link>
      ) : (
        <GoogleLogin />
      )}
    </div>
  );
}
