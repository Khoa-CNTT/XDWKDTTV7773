/* eslint-disable @typescript-eslint/no-explicit-any */
/* app/cart/CartWrapper.tsx */
"use client";

import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "../context/AuthContext";

const CartPageClient = dynamic(() => import("./CartPageClient"), {
  ssr: false,
  loading: () => <div>Loading cart...</div>, 
});

interface CartWrapperProps {
  messages: Record<string, any> | null; 
  locale: string;
}

export default function CartWrapper({ messages, locale }: CartWrapperProps) {
  if (process.env.NODE_ENV === "development" && (!messages || !messages.Cart)) {
    console.error(
      "CartWrapper: messages is empty or missing 'Cart' namespace. This will cause MISSING_MESSAGE errors.",
      messages
    );
  }

  const safeLocale = locale || "vi";

  return (
    <SessionProvider>
      <AuthProvider>
        <CartPageClient messages={messages} locale={safeLocale} />
      </AuthProvider>
    </SessionProvider>
  );
}