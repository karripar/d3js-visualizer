"use client";

import { supabase } from "@/lib/supabase";

export default function GoogleLogin() {
    const login = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
        });
    };

    return (
        <button
        onClick={login}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
        Sign in with Google
        </button>
    );
}