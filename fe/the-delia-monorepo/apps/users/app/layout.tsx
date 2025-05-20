// app/layout.tsx
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NextIntlClientProvider } from "next-intl";
import ClientProviders from "./ClientProviders"; // ✅ Chứa <SessionProvider>
import { FavoritesProvider } from "./context/FavoritesContext";
import { CartProvider } from "./context/CartContext"; // ✅ Nhớ import
import Footer from "./components/Footer";

async function loadMessages(locale: string) {
  try {
    return (await import(`../locales/${locale}.json`)).default;
  } catch {
    return (await import(`../locales/vi.json`)).default;
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: { locale: string };
}) {
  const locale = params?.locale || "vi";
  const messages = await loadMessages(locale);

  return (
    <html lang={locale}>
      <body>
        <ClientProviders>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <CartProvider> {/* ✅ Bọc toàn bộ app trong CartProvider */}
              <FavoritesProvider>
                {children}
                <Footer />
                <ToastContainer />
              </FavoritesProvider>
            </CartProvider>
          </NextIntlClientProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
