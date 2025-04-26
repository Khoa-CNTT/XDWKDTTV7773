/* eslint-disable react-hooks/rules-of-hooks */
/* app/components/ProductCard.tsx */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";
import { FaRegHeart } from "react-icons/fa";
import AddToCartButton from "./AddToCartButton";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import styles from "./ProductCard.module.css";
import { Product } from "../mua-sam/data/products";

const ProductCard = ({ product, category }: { product: Product; category: string }) => {
  const [favorites, setFavorites] = useState(product.favorites || 0);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const t = useTranslations("Product");
  const isProcessing = useRef(false);

  // Kiểm tra dữ liệu hợp lệ
  if (!product.subCategory || !product.id) {
    return <div>Invalid product data</div>;
  }

  // Khôi phục trạng thái yêu thích từ localStorage khi component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem(`favorite_${product.id}`);
    if (savedFavorites) {
      setIsFavorited(JSON.parse(savedFavorites));
    }
  }, [product.id]);

  const handleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn chặn sự kiện lan tỏa lên <Link>

    if (isProcessing.current) {
      console.log("handleFavorite bị bỏ qua vì đang xử lý");
      return;
    }

    isProcessing.current = true;
    console.log(`handleFavorite được gọi cho sản phẩm ${product.id}`);

    const newIsFavorited = !isFavorited;
    const newFavorites = isFavorited ? favorites - 1 : favorites + 1;

    setFavorites(newFavorites);
    setIsFavorited(newIsFavorited);

    localStorage.setItem(`favorite_${product.id}`, JSON.stringify(newIsFavorited));

    toast.success(
      newIsFavorited ? t("addedToFavorites") : t("removedFromFavorites"),
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      }
    );

    setTimeout(() => {
      isProcessing.current = false;
      console.log("handleFavorite đã hoàn tất xử lý");
    }, 300);
  }, [isFavorited, favorites, product.id, t]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className={styles.card}>
      <Link
        href={`/mua-sam/${category}/${product.subCategory}/${product.id}`}
        className={styles.link}
      >
        <div className={styles.imageWrapper}>
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={200}
              height={300}
              className={styles.productImage}
            />
          ) : (
            <div className={styles.placeholderImage}>{t("noImage")}</div>
          )}
        </div>
        <h3 className={styles.productName}>{product.name.toUpperCase()}</h3>
        <p className={styles.productPrice}>{formatPrice(product.price)}</p>
      </Link>
      <div className={styles.actions}>
        <AddToCartButton product={product} className={styles.addToCart} />
        <button
          className={styles.favoriteButton}
          onClick={handleFavorite}
          aria-label={
            isFavorited
              ? t("removeFavoriteAria", { name: product.name })
              : t("addFavoriteAria", { name: product.name })
          }
        >
          <FaRegHeart style={{ color: isFavorited ? "#ff6f61" : "#ccc" }} />
          <span className={styles.favoriteCount}>{favorites}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;