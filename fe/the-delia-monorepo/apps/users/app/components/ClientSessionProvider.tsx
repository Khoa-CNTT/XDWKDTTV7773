"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <SessionProvider><AuthProvider>{children}</AuthProvider></SessionProvider>;
}
