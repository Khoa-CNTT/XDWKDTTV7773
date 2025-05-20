import { getMessages, getTranslations } from "next-intl/server";
import HeaderWrapper from "../components/HeaderWrapper";
import Sidebar from "../components/Sidebar";
import styles from "./ProfileLayout.module.css";
import ClientOnlyWrapper from "../components/ClientOnlyWrapper";

export default async function ProfileLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  const t = await getTranslations("Profile");

  return (
    <ClientOnlyWrapper>
      <div className={styles.container}>
        <HeaderWrapper locale={locale} messages={messages} />
        <div className={styles.main}>
          <Sidebar />
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </ClientOnlyWrapper>
  );
}
