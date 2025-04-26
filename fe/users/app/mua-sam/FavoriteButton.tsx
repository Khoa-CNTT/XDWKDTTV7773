"use client";

import React, { useState } from "react";
import styles from "./ProductDetail.module.css";

interface FavoriteButtonProps {
  initialLikes: number;
}

export default function FavoriteButton({ initialLikes }: FavoriteButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const handleToggleLike = () => {
    setIsLiked((prev) => !prev);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <div className={styles.heartIconWrapper} onClick={handleToggleLike}>
      <i className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`} style={{ color: isLiked ? "#ff6200" : "#ff6200" }}></i>
      <span>{likes}</span>
    </div>
  );
}