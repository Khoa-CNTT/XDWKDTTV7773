"use client"; // Đánh dấu đây là Client Component

import { ReactNode } from "react";

export default function ClientSessionProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}