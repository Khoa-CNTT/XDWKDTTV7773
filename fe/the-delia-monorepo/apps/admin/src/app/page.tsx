"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();

  const handleOpenClick = () => {
    router.push("/login"); // chuyển tới trang login
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          WELCOME TO THE DELIA WITH ADMIN & EMPLOYEE
        </h1>
        <button className={styles.button} onClick={handleOpenClick}>
          OPENS
        </button>
      </main>
    </div>
  );
}
