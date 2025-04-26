/* eslint-disable @typescript-eslint/no-unused-vars */
/* app/layout.tsx */
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { NextIntlClientProvider, createTranslator } from "next-intl";
import ClientProviders from "./ClientProviders";
import 'bootstrap-icons/font/bootstrap-icons.css';

export async function generateMetadata({ params }: { params?: { locale: string } }) {
  const locale = params?.locale || "vi";
  let messages;
  try {
    messages = await import(`../locales/${locale}.json`).then((mod) => mod.default);
  } catch (error) {
    messages = await import(`../locales/vi.json`).then((mod) => mod.default);
  }
  const t = createTranslator({ locale, messages, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: { locale: string };
}) {
  const locale = params?.locale || "vi";

  let messages;
  try {
    messages = await import(`../locales/${locale}.json`).then((mod) => mod.default);
  } catch (error) {
    messages = await import(`../locales/vi.json`).then((mod) => mod.default);
  }

  return (
    <html lang={locale}>
      <body>
        <ClientProviders>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={locale === "en"}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </NextIntlClientProvider>
        </ClientProviders>
      </body>
    </html>
  );
}