"use client";

import { ReactNode } from "react";
import { useAppSelector } from "@/store/hooks";
import { redirect } from "next/navigation";

export default function AdminRoute({
  children,
}: {
  children: ReactNode;
}) {
  const user = useAppSelector((s) => s.auth.user);

  if (!user) return null;

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
