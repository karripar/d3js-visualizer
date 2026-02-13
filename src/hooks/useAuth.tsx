"use client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js"; // Import User type from Supabase
import { supabase } from "@/lib/supabase";

export default function AuthListener() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === "SIGNED_IN") {
                    setUser(session?.user ?? null);
                } else if (event === "SIGNED_OUT") {
                    setUser(null);
                }
            }
        );
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return (
        <div>
            {user ? (
                <div>Welcome, {user.email}</div>
            ) : (
                <div>Please log in.</div>
            )}
        </div>
    );
}
