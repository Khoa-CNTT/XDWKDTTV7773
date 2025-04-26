/* components/FavoriteButton.tsx */
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// Export interface để các file khác có thể sử dụng
export interface FavoriteButtonProps {
  initialLikes: number;
}

export default function FavoriteButton({ initialLikes }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const t = useTranslations("Product");

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    setLikes((prev) => (isFavorite ? prev - 1 : prev + 1));
  };

  return (
    <button
      onClick={toggleFavorite}
      aria-label={isFavorite ? t("removeFavoriteAria") : t("addFavoriteAria")}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        padding: "5px 10px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        background: "white",
        cursor: "pointer",
        transition: "background 0.3s ease",
      }}
    >
      <span style={{ fontSize: "1rem", color: isFavorite ? "#ff6200" : "#333" }}>
        {isFavorite ? "★" : "☆"}
      </span>
      <span style={{ fontSize: "0.8rem", color: "#ff6200" }}>{likes}</span>
    </button>
  );
}