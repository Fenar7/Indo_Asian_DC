"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./style.scss";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) { setError("Please enter the password."); return; }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Incorrect password. Please try again.");
        return;
      }

      // Authenticated — go to homepage
      router.push("/");
      router.refresh();
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page-container-main flex min-h-[100dvh] w-full items-center justify-center bg-pure-white px-4">
      <div className="login-page-container w-full">
        <section className="login-card">
          <div className="login-card__brand">
            {/* Real Indo Asian logo — same asset used in the shop header */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="login-card__logo"
              src="/icons/indo-asian-logo-main.png"
              alt="Indo Asian Foods"
            />
          </div>

          <div className="login-card__content">
            <h1 className="login-card__title">INDO ASIAN FOODS LTD</h1>
            <p className="login-card__description">
              The store is password protected. Use the password to enter the store.
            </p>

            <form className="login-form" onSubmit={handleSubmit}>
              <label className="login-form__label" htmlFor="store-password">
                Password
              </label>

              <input
                id="store-password"
                className={`login-form__input ${error ? "has-error" : ""}`}
                type="password"
                placeholder="Enter the password here"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                disabled={loading}
                autoComplete="current-password"
              />

              {error && (
                <p className="login-form__error">{error}</p>
              )}

              <button
                className={`login-form__submit ${loading ? "is-loading" : ""}`}
                type="submit"
                disabled={loading}
              >
                {loading ? "Verifying…" : "Enter"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
