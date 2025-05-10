/* app/context/AuthContext.tsx */
"use client";

import { createContext, useContext } from "react";

interface User {
  phone?: string | null;
  id: string;
  name?: string | null;
  email?: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = true;
  const user = null;

  const logout = async () => {
    // Placeholder for logout functionality
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, logout }}>
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