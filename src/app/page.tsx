"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAuthInit } from "@/hooks/useAuthInit";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useSelector(
    (state: RootState) => state.auth
  );

  // 🔑 Restore session on first load
  useAuthInit();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  // No UI – routing only
  return null;
}
