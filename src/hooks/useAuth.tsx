"use client";

import { useAuthContext } from "@/context/AuthContext";

// Expose a simple hook that wraps the AuthContext
export function useAuth() {
  return useAuthContext();
}
