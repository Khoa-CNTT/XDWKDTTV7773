// app/ClientProviders.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { AuthProvider } from "./context/AuthContext";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider 
      // Chi tiết cấu hình session
      // Tắt tự động refetch khi focus vào cửa sổ
      refetchOnWindowFocus={false}
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  );
}
