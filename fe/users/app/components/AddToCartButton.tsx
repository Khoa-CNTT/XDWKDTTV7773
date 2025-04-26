/* components/AddToCartButton.tsx */
"use client";

import { useCart } from "../context/CartContext";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { BsCart } from "react-icons/bs";
import { useCallback, useRef } from "react";

interface AddToCartButtonProps {
  product: {
    id: string | number;
    name: string;
    price: number;
    image: string; // Thay đổi từ StaticImageData sang string
  };
  className?: string;
}

export default function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const t = useTranslations("Product");
  const isAdding = useRef(false);
  const lastClickTime = useRef<number>(0);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - lastClickTime.current < 500) {
        console.log("Click bị bỏ qua vì quá gần nhau");
        return;
      }
      lastClickTime.current = now;

      if (isAdding.current) {
        console.log("handleAddToCart bị bỏ qua vì đang xử lý");
        return;
      }

      isAdding.current = true;
      console.log(`handleAddToCart được gọi cho sản phẩm ${product.id}`);

      if (!product.id || !product.name || !product.price || !product.image) {
        console.error("Sản phẩm không hợp lệ:", product);
        toast.error(t("errorInvalidProduct"), {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        isAdding.current = false;
        return;
      }

      const productId = typeof product.id === "string" ? parseInt(product.id, 10) : product.id;

      if (isNaN(productId)) {
        console.error("ID sản phẩm không hợp lệ:", product.id);
        toast.error(t("errorInvalidProduct"), {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        isAdding.current = false;
        return;
      }

      const productWithImageString = {
        ...product,
        id: productId,
        image: product.image, // Đã là chuỗi, không cần .src
        quantity: 1,
      };

      addToCart(productWithImageString);

      const toastKey = `addedToCart_${product.id}`;
      const hasShownToast = sessionStorage.getItem(toastKey);

      if (!hasShownToast) {
        toast.success(t("addedToCart"), {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        sessionStorage.setItem(toastKey, "true");
      }

      setTimeout(() => {
        isAdding.current = false;
        console.log("handleAddToCart đã hoàn tất xử lý");
      }, 500);
    },
    [addToCart, product, t]
  );

  return (
    <button
      onClick={handleAddToCart}
      className={className}
      aria-label={t("addToCartAria", { name: product.name })}
    >
      <BsCart />
    </button>
  );
}