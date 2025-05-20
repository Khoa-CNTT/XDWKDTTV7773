// app/context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

interface User {
  id?: number | string;
  id_nguoidung?: number | string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  vai_tro?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  // Xử lý trạng thái loading và cập nhật sau khi session hoàn tất
  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status]);

  const isAuthenticated = status === "authenticated";
  const user = session?.user as User | null;

  const logout = async () => {
    try {
      // Buộc chuyển hướng đến http://localhost:3000 sau khi đăng xuất
      await signOut({ redirect: true, callbackUrl: "http://localhost:3000" });
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
