// app/components/SocialIcons.tsx
"use client";

import styles from "./SocialIcons.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useRef, useEffect } from 'react';
import dynamic from "next/dynamic";

// Nạp LiveChatBox chỉ ở client
const LiveChatBox = dynamic(() => import("./LiveChatBox"), { ssr: false });

export default function SocialIcons() {
  const chatRef = useRef<HTMLDivElement>(null);

  // Đảm bảo script Dialogflow Messenger luôn được nhúng
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.getElementById('df-messenger-script')) {
      const script = document.createElement('script');
      script.id = 'df-messenger-script';
      script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Gắn df-messenger vào DOM
  useEffect(() => {
    if (chatRef.current && !chatRef.current.querySelector('df-messenger')) {
      const df = document.createElement('df-messenger');
      df.setAttribute('intent', 'WELCOME');
      df.setAttribute('chat-title', 'ChatBot');
      df.setAttribute('agent-id', '79fba851-b66b-456e-a1c4-1bdf4307d70d');
      df.setAttribute('language-code', 'vi');
      df.style.position = 'fixed';
      df.style.bottom = '20px';
      df.style.right = '20px';
      df.style.zIndex = '1001';
      chatRef.current.appendChild(df);
    }
  }, []);

  return (
    <div className={styles.floatingIcons}>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.floatingIcon}>
        <i className="bi bi-instagram"></i>
      </a>
      <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className={styles.floatingIcon}>
        <i className="bi bi-whatsapp"></i>
      </a>
      <div ref={chatRef}></div>
       <LiveChatBox /> 
    </div>
  );
}