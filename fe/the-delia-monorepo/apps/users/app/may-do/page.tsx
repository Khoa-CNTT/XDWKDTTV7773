/* eslint-disable @next/next/no-img-element */
// app/may-do/page.tsx
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaWhatsapp, FaInstagram, FaQuestionCircle } from "react-icons/fa";
import styles from "./MayDo.module.css";
import pageStyles from "../page.module.css";

// Dữ liệu measurement steps (giữ nguyên)
const measurementSteps = [
  {
    id: 1,
    title: "Collar",
    description: [
      "Position tape around neck, 1 inch from neck/shoulder meeting or at Adam’s apple base.",
      "Tape should be level, no gaps.",
      "Insert one finger width for comfort.",
    ],
    image: "/images/collar-measurement.jpg",
  },
  {
    id: 2,
    title: "Shoulder Width",
    description: [
      "Position tape from one shoulder tip to other, touching collar bottom.",
      "Keep back straight, shoulders relaxed.",
    ],
    image: "/images/shoulder-measurement.jpg",
  },
  {
    id: 3,
    title: "Sleeve Length",
    description: [
      "Hold tape at shoulder seam.",
      "Lay it down along outside of bent arm to wrist where shirt cuff ends.",
    ],
    image: "/images/sleeve-measurement.jpg",
  },
  {
    id: 4,
    title: "Bicep",
    description: [
      "Relax arms by sides for bicep measurement.",
      "Measure the thickest part of bicep, about 2 inches below armpit.",
      "Insert one finger width for accuracy and comfort.",
    ],
    image: "/images/bicep-measurement.jpg",
  },
  {
    id: 5,
    title: "Wrist",
    description: [
      "Measure the circumference of your wrist inserting one finger to allow for some slack.",
    ],
    image: "/images/wrist-measurement.jpg",
  },
  {
    id: 6,
    title: "Armpit",
    description: [
      "Wrap tape around armpit from top of shoulder.",
      "Insert one finger width for accuracy and comfort.",
    ],
    image: "/images/armpit-measurement.jpg",
  },
  {
    id: 7,
    title: "Chest",
    description: [
      "Slide tape around chest, just under armpits.",
      "Position securely at widest part of chest, often above or at nipple line.",
    ],
    image: "/images/chest-measurement.jpg",
  },
  {
    id: 8,
    title: "Waist",
    description: [
      "Start at navel, circle tape around waist.",
      "Keep tape parallel to floor, snug but not digging into skin.",
      "Insert one finger width for comfort and accuracy.",
    ],
    image: "/images/waist-measurement.jpg",
  },
  {
    id: 9,
    title: "Stomach",
    description: [
      "Place end of tape between bellybutton and waistband.",
      "Keep tape parallel to floor, snug but not digging into skin.",
      "Insert one finger width for comfort and accuracy.",
    ],
    image: "/images/stomach-measurement.jpg",
  },
  {
    id: 10,
    title: "Above Chest Width",
    description: [
      "Slide tape around top of chest, on armpit crease.",
      "Position securely above widest part of chest, often above nipple line.",
      "Insert one finger width for some slack.",
    ],
    image: "/images/above-chest-measurement.jpg",
  },
  {
    id: 11,
    title: "Armpit Spacing",
    description: [
      "Measure distance between widest points of back from each armpit.",
      "Keep tape straight.",
      "Insert one finger width for accuracy and comfort.",
    ],
    image: "/images/armpit-spacing-measurement.jpg",
  },
  {
    id: 12,
    title: "Shoulder to Bust Length",
    description: [
      "Start measuring tape at top midpoint of shoulder.",
      "Measure from shoulder down to center of nipple.",
    ],
    image: "/images/shoulder-to-bust-measurement.jpg",
  },
  {
    id: 13,
    title: "Shoulder to Waist",
    description: [
      "Measure from the midpoint on top of the shoulder, vertically down the front of the body, to the waist line (level with your belly button).",
    ],
    image: "/images/shoulder-to-waist-measurement.jpg",
  },
  {
    id: 14,
    title: "Your Shirt Length",
    description: [
      "Place the end of the measuring tape on the shoulder seam touching the collar.",
      "With your arm relaxed, measure the length straight down to the bottom of the fly.",
    ],
    image: "/images/shirt-length-measurement.jpg",
  },
  {
    id: 15,
    title: "Distance Between Nipples",
    description: [
      "Stand up straight whilst wearing a well fitted bra. Measure the distance between both nipples from the center of each nipple.",
    ],
    image: "/images/distance-between-nipples-measurement.jpg",
  },
  {
    id: 16,
    title: "Front Chest Width",
    description: [
      "Measure chest at fullest point, typically around nipples.",
      "Wrap tape from back to front, snug but not tight.",
      "Insert one finger width for accuracy and comfort.",
    ],
    image: "/images/front-chest-width-measurement.jpg",
  },
  {
    id: 17,
    title: "Your Pants Waist",
    description: [
      "Begin at top of hip bone.",
      "Wrap tape around body to belly button.",
      "Ensure it’s not too tight and remains straight, including at the back.",
      "Insert one finger width for accuracy and comfort.",
    ],
    image: "/images/pants-waist-measurement.jpg",
  },
  {
    id: 18,
    title: "Above Your Hips",
    description: [
      "Wrap tape around bare stomach above upper hip bone.",
      "Keep tape parallel to floor.",
      "Ensure snugness without skin compression.",
      "Insert one finger width for accuracy and comfort.",
    ],
    image: "/images/above-hips-measurement.jpg",
  },
  {
    id: 19,
    title: "Hips",
    description: [
      "Remove outer garments, feet together.",
      "Wrap soft tape snugly around widest part of hips.",
      "Measure where end of tape meets remaining length.",
      "Insert one finger width for accuracy and comfort.",
    ],
    image: "/images/hips-measurement.jpg",
  },
  {
    id: 20,
    title: "Crotch",
    description: [
      "Begin at waist, bring tape down under crotch, up around curve of butt, and back up to waist in back.",
      "Ensure to include curves of belly and butt for accurate measurement.",
      "This ensures pants won’t feel too snug.",
    ],
    image: "/images/crotch-measurement.jpg",
  },
  {
    id: 21,
    title: "Thigh",
    description: [
      "Measure circumference of fullest part of thigh.",
      "Wrap tape around thigh from front to back and then around to front.",
      "Insert one finger width for accuracy and comfort.",
    ],
    image: "/images/thigh-measurement.jpg",
  },
  {
    id: 22,
    title: "Knee",
    description: [
      "Measure from center of bent kneecap at 45-degree angle.",
      "Wrap tape around this section until it meets starting point.",
      "Insert one finger width for accuracy and comfort.",
    ],
    image: "/images/knee-measurement.jpg",
  },
  {
    id: 23,
    title: "Calf",
    description: [
      "Wrap the measuring tape around the widest part of your calf. Insert a finger width.",
    ],
    image: "/images/calf-measurement.jpg",
  },
  {
    id: 24,
    title: "Pants Length",
    description: [
      "Measure from top of pants waist alongside pants seam to bottom of pants or roughly 1 inch from floor.",
      "Ensure standing straight for accurate measurement.",
    ],
    image: "/images/pants-length-measurement.jpg",
  },
];

export default function MayDo() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.centeredContainer}>
          <h1 className={styles.title}>Hướng dẫn đo lường</h1>
          <p className={styles.description}>
            Nếu bạn là khách hàng cũ và số đo của bạn KHÔNG thay đổi, vui lòng BỎ QUA bước này. *
            <br />
            Tuy nhiên, nếu bạn là khách hàng MỚI hoặc số đo của bạn đã thay đổi đáng kể, bạn có thể làm theo hướng dẫn chi tiết dưới đây để tự đo toàn bộ số đo với sự trợ giúp của bạn bè và thước dây.
            <br />
            <span className={styles.note}>
              * Chúng tôi có thể liên hệ với bạn để xác nhận thêm về số đo của bạn.
            </span>
          </p>

          {/* Submit Your Measurements Section */}
          <section className={styles.measurementSection}>
            <h2 className={styles.sectionTitle}>Gửi số đo của bạn</h2>
            {measurementSteps.map((step) => (
              <div key={step.id} className={styles.measurementStep}>
                <div className={styles.stepInfo}>
                  <h3 className={styles.stepTitle}>{`${step.id}. ${step.title}`}</h3>
                  <ul className={styles.stepList}>
                    {step.description.map((desc, index) => (
                      <li key={index} className={styles.stepItem}>{desc}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.stepImageWrapper}>
                  <img
                    src={step.image}
                    alt={step.title}
                    className={styles.stepImage}
                  />
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
      {/* Social Icons */}
      <div className={pageStyles.socialIcons}>
        <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">
          <FaWhatsapp className={pageStyles.icon} />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram className={pageStyles.icon} />
        </a>
        <a href="https://example.com" target="_blank" rel="noopener noreferrer">
          <FaQuestionCircle className={pageStyles.icon} />
        </a>
      </div>
      <Footer />
    </div>
  );
}