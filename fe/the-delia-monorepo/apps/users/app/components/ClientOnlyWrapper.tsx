// app/components/ClientOnlyWrapper.tsx
"use client";

import { ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

export default function ClientOnlyWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  );
}
