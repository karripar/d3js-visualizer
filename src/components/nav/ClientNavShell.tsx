"use client";

import { usePathname } from "next/navigation";
import AuthTab from "@/components/nav/AuthTab";

export default function ClientNavShell() {
  const pathname = usePathname();
  const hideAuthTab =
    pathname?.startsWith("/profile") ||
    pathname === "/new" ||
    pathname?.startsWith("/p/");

  return !hideAuthTab ? <AuthTab /> : null;
}
