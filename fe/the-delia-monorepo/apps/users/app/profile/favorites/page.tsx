/* app/profile/favorites/page.tsx */
"use client";

import { useTranslations } from "next-intl";
import { useFavorites } from "../../context/FavoritesContext"; // Cập nhật đường dẫn
import styles from "./Favorites.module.css";
import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";
import { BsSearchHeart } from "react-icons/bs";

export default function FavoritesPage() {
  const t = useTranslations("Profile");
  const { favorites, removeFromFavorites } = useFavorites();

  // Hàm định dạng giá
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Hàm xử lý thêm vào giỏ hàng (tạm thời log, bạn có thể tích hợp với context hoặc API)
  const handleAddToCart = (productId: string) => {
    console.log(`Thêm sản phẩm ${productId} vào giỏ hàng`);
  };

  return (
    <div className={styles.favoritesContainer}>
      <h1 className={styles.pageTitle}><i className="bi bi-heart"></i> {t("favorites")}</h1>
      {/* Có thể thêm phân trang ở đây nếu cần */}
      {favorites.length === 0 ? (
        <div className={styles.emptyState}>
          <BsSearchHeart className={styles.emptyIconBig} />
          <div className={styles.emptyText}>Hiện tại chưa có sản phẩm yêu thích.</div>
          <a href="/mua-sam" className={styles.shopBtn}>Bắt đầu mua sắm &rarr;</a>
        </div>
      ) : (
        <>
          <div className={styles.favoritesList}>
            {favorites.map((product) => (
              <div key={product.id} className={styles.favoriteItem}>
                <Link
                  href={`/mua-sam/${product.category}/${product.subCategory}/${product.id}`}
                  passHref
                >
                  <div className={styles.imageWrapper}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={200}
                      height={250}
                      className={styles.productImage}
                    />
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productPrice}>{formatPrice(product.price)}</p>
                  </div>
                </Link>
                <div className={styles.buttonWrapper}>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className={styles.cartButton}
                  >
                    <FaShoppingCart className={styles.cartIcon} />
                  </button>
                  <button
                    onClick={() => removeFromFavorites(product.id)}
                    className={styles.favoriteButton}
                  >
                    <FaHeart className={styles.favoriteIcon} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.pagination}>
            {/* Phân trang ở đây nếu có nhiều sản phẩm */}
            <button className={styles.pageBtn + ' ' + styles.active}>1</button>
          </div>
        </>
      )}
    </div>
  );
}