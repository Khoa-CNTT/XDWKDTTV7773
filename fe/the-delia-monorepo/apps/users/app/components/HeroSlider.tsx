"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import styles from "../page.module.css";

const heroImages = [
  "/hero-image.jpg",
  "/images/vest-nam-2.jpg",
  "/images/vay-ngan-nu.jpg",
];

export default function HeroSlider({ heroTitle, heroAlt }: { heroTitle: string, heroAlt: string }) {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      loop
      pagination={{ clickable: true }}
      navigation
      className={styles.heroSwiper}
    >
      {heroImages.map((src, idx) => (
        <SwiperSlide key={idx}>
          <div className={styles.heroWrapper}>
            <Image
              src={src}
              alt={heroAlt}
              fill
              priority={idx === 0}
              className={styles.heroImage}
              style={{ objectFit: "cover" }}
            />
            <div className={styles.heroText}>
              <h1>{heroTitle}</h1>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
} 