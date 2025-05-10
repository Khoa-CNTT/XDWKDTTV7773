/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* app/components/AuthModal.tsx */
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FaGoogle, FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import styles from "./AuthModal.module.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "register" | "forgot";
  onForgotPassword?: () => void;
}

export default function AuthModal({ isOpen, onClose, initialTab = "login", onForgotPassword }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot">(initialTab);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerSurname, setRegisterSurname] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const t = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  useEffect(() => {
    if (redirectUrl && initialTab !== "login") {
      setActiveTab("login");
    }
  }, [redirectUrl, initialTab]);

  const handleLoginSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!loginEmail || !loginPassword) {
        setError(t("errorEmptyFields"));
        toast.error(t("errorEmptyFields"), {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        return;
      }

      setIsLoading(true);
      try {
        // Tạm thời bỏ qua việc gọi API
        console.log("Login data:", { email: loginEmail, password: loginPassword });
        
        // Giả lập đăng nhập thành công
        setError("");
        setTimeout(() => {
          onClose();
          router.push(redirectUrl || "/");
        }, 500);
      } catch (err: any) {
        const errorMessage = err.message || t("errorUnexpected");
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        console.error("Login error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [loginEmail, loginPassword, onClose, t, router, redirectUrl]
  );

  const handleRegisterSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!registerName || !registerSurname || !registerEmail || !registerPassword || !registerConfirmPassword) {
        setError(t("errorEmptyFields"));
        toast.error(t("errorEmptyFields"), {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        return;
      }
      if (registerPassword !== registerConfirmPassword) {
        setError(t("errorPasswordMismatch"));
        toast.error(t("errorPasswordMismatch"), {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        return;
      }

      setIsLoading(true);
      try {
        // Tạm thời bỏ qua việc gọi API
        console.log("Register data:", {
          name: registerName,
          surname: registerSurname,
          email: registerEmail,
          password: registerPassword,
        });
        
        setError("");
        setTimeout(() => {
          setActiveTab("login");
        }, 500);
      } catch (err: any) {
        const errorMessage = err.message || t("errorUnexpected");
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        console.error("Register error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [registerName, registerSurname, registerEmail, registerPassword, registerConfirmPassword, t]
  );

  const handleSocialLogin = useCallback(
    async (provider: string) => {
      setIsLoading(true);
      try {
        // Tạm thời bỏ qua việc gọi API
        console.log(`Social login (${provider}) data`);
        
        // Giả lập đăng nhập thành công
        setTimeout(() => {
          router.push(redirectUrl || "/");
        }, 500);
      } catch (err: any) {
        const errorMessage = err.message || t("errorUnexpected");
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        console.error(`Social login error (${provider}):`, err);
      } finally {
        setIsLoading(false);
      }
    },
    [redirectUrl, t, router]
  );

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotError("Vui lòng nhập địa chỉ email.");
      setForgotSuccess("");
      return;
    }
    setForgotLoading(true);
    setForgotError("");
    setTimeout(() => {
      setForgotSuccess("Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi.");
      setForgotLoading(false);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label={t("closeModalAria")}
          disabled={isLoading}
        >
          ×
        </button>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "register" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("register")}
            disabled={isLoading}
            aria-selected={activeTab === "register"}
          >
            {t("register")}
          </button>
          <button
            className={`${styles.tab} ${activeTab === "login" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("login")}
            disabled={isLoading}
            aria-selected={activeTab === "login"}
          >
            {t("login")}
          </button>
        </div>

        {activeTab === "login" ? (
          <form onSubmit={handleLoginSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="login-email">{t("emailLabel")}</label>
              <input
                id="login-email"
                type="email"
                placeholder={t("emailPlaceholder")}
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className={styles.input}
                disabled={isLoading}
                aria-required="true"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="login-password">{t("passwordLabel")}</label>
              <div className={styles.passwordInput}>
                <input
                  id="login-password"
                  type={showLoginPassword ? "text" : "password"}
                  placeholder={t("passwordPlaceholder")}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={styles.input}
                  disabled={isLoading}
                  aria-required="true"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label={showLoginPassword ? "Hide password" : "Show password"}
                >
                  {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button
              type="button"
              className={styles.forgotPassword}
              style={{ textAlign: "right", background: "none", border: "none", color: "#666", cursor: "pointer", marginBottom: 8 }}
              onClick={onForgotPassword}
              disabled={isLoading}
            >
              {t("forgotPassword")}
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? t("loading") : t("loginButton")}
            </button>
            <div className={styles.socialLogin}>
              <p>{t("orLoginWith")}</p>
              <div className={styles.socialButtons}>
                <button
                  type="button"
                  className={styles.socialButton}
                  onClick={() => handleSocialLogin("google")}
                  disabled={isLoading}
                  aria-label={t("loginWithGoogleAria")}
                >
                  <FaGoogle /> GOOGLE
                </button>
                <button
                  type="button"
                  className={styles.socialButton}
                  onClick={() => handleSocialLogin("facebook")}
                  disabled={isLoading}
                  aria-label={t("loginWithFacebookAria")}
                >
                  <FaFacebookF /> FACEBOOK
                </button>
              </div>
            </div>
          </form>
        ) : activeTab === "register" ? (
          <form onSubmit={handleRegisterSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="register-name">{t("firstNameLabel")}</label>
              <input
                id="register-name"
                type="text"
                placeholder={t("firstNamePlaceholder")}
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                className={styles.input}
                disabled={isLoading}
                aria-required="true"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="register-surname">{t("lastNameLabel")}</label>
              <input
                id="register-surname"
                type="text"
                placeholder={t("lastNamePlaceholder")}
                value={registerSurname}
                onChange={(e) => setRegisterSurname(e.target.value)}
                className={styles.input}
                disabled={isLoading}
                aria-required="true"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="register-email">{t("emailLabel")}</label>
              <input
                id="register-email"
                type="email"
                placeholder={t("emailPlaceholder")}
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className={styles.input}
                disabled={isLoading}
                aria-required="true"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="register-password">{t("passwordLabel")}</label>
              <div className={styles.passwordInput}>
                <input
                  id="register-password"
                  type={showRegisterPassword ? "text" : "password"}
                  placeholder={t("passwordPlaceholder")}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className={styles.input}
                  disabled={isLoading}
                  aria-required="true"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  aria-label={showRegisterPassword ? "Hide password" : "Show password"}
                >
                  {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="register-confirm-password">{t("confirmPasswordLabel")}</label>
              <div className={styles.passwordInput}>
                <input
                  id="register-confirm-password"
                  type={showRegisterConfirmPassword ? "text" : "password"}
                  placeholder={t("confirmPasswordPlaceholder")}
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  className={styles.input}
                  disabled={isLoading}
                  aria-required="true"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                  aria-label={showRegisterConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showRegisterConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? t("loading") : t("registerButton")}
            </button>
            <div className={styles.socialLogin}>
              <p>{t("orRegisterWith")}</p>
              <div className={styles.socialButtons}>
                <button
                  type="button"
                  className={styles.socialButton}
                  onClick={() => handleSocialLogin("google")}
                  disabled={isLoading}
                  aria-label={t("registerWithGoogleAria")}
                >
                  <FaGoogle /> GOOGLE
                </button>
                <button
                  type="button"
                  className={styles.socialButton}
                  onClick={() => handleSocialLogin("facebook")}
                  disabled={isLoading}
                  aria-label={t("registerWithFacebookAria")}
                >
                  <FaFacebookF /> FACEBOOK
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="forgot-email">* Địa chỉ Email</label>
              <input
                id="forgot-email"
                type="email"
                placeholder="Địa chỉ Email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className={styles.input}
                disabled={forgotLoading}
              />
            </div>
            {forgotError && <p className={styles.error}>{forgotError}</p>}
            {forgotSuccess && <p style={{ color: '#2ecc40', textAlign: 'center' }}>{forgotSuccess}</p>}
            <button type="submit" className={styles.submitButton} disabled={forgotLoading}>
              {forgotLoading ? "Đang gửi..." : "GỬI"}
            </button>
            <button
              type="button"
              className={styles.forgotPassword}
              style={{ textAlign: "right", background: "none", border: "none", color: "#666", cursor: "pointer", marginTop: 8 }}
              onClick={() => setActiveTab("login")}
              disabled={forgotLoading}
            >
              Quay lại đăng nhập
            </button>
          </form>
        )}
      </div>
    </div>
  );
}