/* eslint-disable @typescript-eslint/no-explicit-any */
/* app/cart/CartPageClient.tsx */
"use client";

import { NextIntlClientProvider, useTranslations } from "next-intl";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./Cart.module.css";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';

interface CartPageClientProps {
  messages: any;
  locale: string;
}

export default function CartPageClient({ messages, locale }: CartPageClientProps) {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth(); 
  const tCart = useTranslations("Cart");
  const router = useRouter();

  if (process.env.NODE_ENV === "development" && (!messages || !messages.Cart)) {
    console.error(
      "CartPageClient: messages is empty or missing 'Cart' namespace. This will cause MISSING_MESSAGE errors.",
      messages
    );
  }

  if (!messages || !messages.Cart) {
    return (
      <div className={styles.cartContainer}>
        <h2>Failed to load translations. Please check messages configuration in locales/{locale}.json.</h2>
      </div>
    );
  }

  const totalPrice = cartItems ? cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0) : 0;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      await Swal.fire({
        title: 'Bạn chưa đăng nhập',
        text: 'Xin hãy đăng nhập để mua sản phẩm!',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ff6f61'
      });
      router.push("/");
      return;
    }
    router.push("/cart/thanh-toan");
  };

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className={styles.cartContainer}>
        <h2>{tCart("title")}</h2>
        {cartItems && cartItems.length > 0 ? (
          <div className={styles.cartWrapper}>
            <div className={styles.cartItems}>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                />
              ))}
            </div>
            <div className={styles.cartSummary}>
              <h3>{tCart("summary")}</h3>
              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span>{tCart("subtotal")}</span>
                  <span>{totalPrice.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")} {locale === "vi" ? "đ" : "$"}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>{tCart("shippingFee")}</span>
                  <span>{tCart("tbd")}</span>
                </div>
                <div className={styles.summaryTotal}>
                  <span>{tCart("total")}</span>
                  <span>{totalPrice.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")} {locale === "vi" ? "đ" : "$"}</span>
                </div>
              </div>
              <button onClick={handleCheckout} type="button" className={styles.checkoutButton}>
                {tCart("checkout")}
              </button>
              <p className={styles.shippingNote}>{tCart("shippingNote")}</p>
              <div className={styles.paymentMethods}>
                <h4>{tCart("acceptedPayments")}</h4>
                <div className={styles.paymentIcons}>
                  <Image src="/images/visa.png" alt="Visa" width={40} height={24} />
                  <Image src="/images/mastercard.png" alt="Mastercard" width={40} height={24} />
                  <Image src="/images/vnpay.png" alt="VNPAY" width={40} height={24} />
                  <Image src="/images/paypal.png" alt="Paypal" width={40} height={24} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>{tCart("emptyCart")}</p>
        )}
      </div>
    </NextIntlClientProvider>
  );
}

function CartItem({
  item,
  removeFromCart,
  updateQuantity,
}: {
  item: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    size: string;
    material: string;
    color?: string;
    fabric?: string;
  };
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
}) {
  const tCart = useTranslations("Cart");
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      const favoritesList = JSON.parse(storedFavorites);
      const isProductFavorited = favoritesList.some((fav: any) => fav.id === item.id);
      setIsFavorited(isProductFavorited);
    }
  }, [item.id]);

  const handleFavorite = () => {
    const storedFavorites = localStorage.getItem("favorites");
    let favoritesList = storedFavorites ? JSON.parse(storedFavorites) : [];
    if (isFavorited) {
      favoritesList = favoritesList.filter((fav: any) => fav.id !== item.id);
      setIsFavorited(false);
    } else {
      favoritesList.push(item);
      setIsFavorited(true);
    }
    localStorage.setItem("favorites", JSON.stringify(favoritesList));
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className={styles.cartItem}>
      <Image
        src={item.image}
        alt={item.name}
        width={120}
        height={180}
        className={styles.cartItemImage}
      />
      <div className={styles.cartItemDetails}>
        <h3>{item.name}</h3>
        <p>{item.price.toLocaleString("vi-VN")} đ</p>
        {item.fabric && (
          <p>
            {tCart("fabric")}: {item.fabric}
          </p>
        )}
        <p>
          {tCart("size")}: {item.size || "N/A"}
        </p>
        {item.color && (
          <p>
            {tCart("color")}: {item.color}
          </p>
        )}
        <div className={styles.favorite} onClick={handleFavorite} style={{ color: isFavorited ? "#ff6f61" : "#ccc" }}>
          <i className={isFavorited ? "bi bi-heart-fill" : "bi bi-heart"}></i>
          <span>{tCart("addToFavorites")}</span>
        </div>
        <div className={styles.quantitySelector}>
          <span>{tCart("quantity")}</span>
          <button onClick={handleDecrease} className={styles.quantityButton}>
            <i className="bi bi-dash"></i>
          </button>
          <span>{quantity}</span>
          <button onClick={handleIncrease} className={styles.quantityButton}>
            <i className="bi bi-plus"></i>
          </button>
          <button
            onClick={() => removeFromCart(item.id)}
            className={styles.removeButton}
            title={tCart("remove")}
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
}