import { getTranslations, getMessages } from "next-intl/server";
import styles from "./page.module.css";
import HeaderWrapper from "./components/HeaderWrapper";
import FloatingIcons from "./components/FloatingIcons";
import HomeContent from "./components/HomeContent";
import LiveChatBox from "@/app/components/LiveChatBox";
export const metadata = {
  title: "THE DELIA COUTURE",
  description: "Khám phá các bộ sưu tập thời trang độc đáo từ the delia couture.",
};

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const messages = await getMessages();
  const t = await getTranslations("Home");

  const translations = {
    searchResults: t("searchResults"),
    noResults: t("noResults"),
    newArrivalsTitle: t("newArrivalsTitle"),
    womenTitle: t("womenTitle"),
    menTitle: t("menTitle"),
    viewMore: t("viewMore"),
  };

  return (
    <div className={styles.container}>
      <HeaderWrapper messages={messages} locale={locale} />
      <HomeContent translations={translations} />
      <FloatingIcons />
    </div>
  );
}<LiveChatBox />
