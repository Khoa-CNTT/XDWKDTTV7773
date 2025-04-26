/* eslint-disable @typescript-eslint/no-unused-vars */
/* app/auth/login/page.tsx */
import { getMessages } from "next-intl/server";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import HeaderWrapper from "../../components/HeaderWrapper";
import Footer from "../../components/Footer";
import LoginClient from "./LoginClient";

export default async function LoginPage({
  params,
}: {
  params: { locale: string };
}) {
  const session = await getServerSession();
  const locale = params.locale || "vi";
  const messages = await getMessages({ locale });

  if (session) {
    redirect("/"); // Chuyển hướng mặc định, sẽ được xử lý bởi next-auth
  }

  return (
    <div className="container">
      <HeaderWrapper messages={messages} locale={locale} />
      <main className="main">
        <LoginClient locale={locale} />
      </main>
      <Footer />
    </div>
  );
}