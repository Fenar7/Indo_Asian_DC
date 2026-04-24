"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

// ─── Assets ───────────────────────────────────────────────────────────────────

const brandLogo   = "/icons/indo-asian-logo-main.png";
const cartIcon    = "/icons/shopping-card-icon.png";
const whatsappIcon= "/icons/whatsapp icon.png";
const fallbackImg = "/icons/Screenshot 2026-04-02 at 11.12.24 AM 1.png";
const qtyPlus     = "/icons/plus-red-icon.png";
const qtyMinus    = "/icons/minus-icon.png";
const deleteIcon  = "/icons/dustbin-icon.png";
const searchIcon  = "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatINR(n: number) {
  return `₹ ${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type LineItem = {
  _id: string; name: string; code: string;
  unit?: string; weight?: string; price?: string; image?: string;
  quantity: number;
};

// ─── CartItem ────────────────────────────────────────────────────────────────

function CartItem({ item }: { item: LineItem }) {
  const { updateQuantity, removeFromCart } = useCart();
  return (
    <article className="cart-line-item">
      <div className="cart-line-item__media">
        <img alt={item.name} src={item.image ?? fallbackImg} />
      </div>
      <div className="cart-line-item__content">
        <h3>{item.name}</h3>
        <dl className="cart-line-item__meta">
          {item.unit   && <div><dt>Unit</dt><dd>{item.unit}</dd></div>}
          {item.weight && <div><dt>Weight</dt><dd>{item.weight}</dd></div>}
        </dl>
        {item.price && <p className="cart-line-item__price">{item.price}</p>}
      </div>
      <div className="cart-line-item__controls">
        <button className="cart-line-item__delete" type="button" onClick={() => removeFromCart(item._id)}>
          <img alt="Remove" src={deleteIcon} />
        </button>
        <div className="cart-line-item__quantity">
          <button className="cart-line-item__quantity-button cart-line-item__quantity-button--minus" type="button" onClick={() => updateQuantity(item._id, item.quantity - 1)}>
            <img alt="−" src={qtyMinus} />
          </button>
          <span>{item.quantity}</span>
          <button className="cart-line-item__quantity-button cart-line-item__quantity-button--plus" type="button" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
            <img alt="+" src={qtyPlus} />
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Success Modal ────────────────────────────────────────────────────────────

function SuccessModal({ orderCode, onClose }: { orderCode: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(orderCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <div className="order-modal-overlay" onClick={onClose}>
      <div className="order-modal" onClick={(e) => e.stopPropagation()}>
        <div className="order-modal__icon">
          <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="26" cy="26" r="26" fill="#22c55e" />
            <path d="M14 26.5l8 8 16-16" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2>Order Placed Successfully!</h2>
        <p className="order-modal__subtitle">
          We've received your order and will contact you shortly on WhatsApp.
        </p>
        <div className="order-modal__code-block">
          <span className="order-modal__code-label">Order Code</span>
          <div className="order-modal__code-row">
            <span className="order-modal__code">{orderCode}</span>
            <button className={`order-modal__copy-btn ${copied ? "is-copied" : ""}`} type="button" onClick={handleCopy}>
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <p className="order-modal__note">Save your order code for reference. You'll hear from us soon.</p>
        <Link href="/" className="order-modal__cta" onClick={onClose}>Continue Shopping</Link>
      </div>
    </div>
  );
}

// ─── CartField ────────────────────────────────────────────────────────────────

function CartField({
  label, placeholder, value, onChange, required, error,
}: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; required?: boolean; error?: string;
}) {
  return (
    <div className={`cart-field ${error ? "has-error" : ""}`}>
      <label>
        {label}
        {required && <span className="cart-field__required"> *</span>}
      </label>
      <input placeholder={placeholder} required={required} type="text" value={value} onChange={(e) => onChange(e.target.value)} />
      {error && <span className="cart-field__error">{error}</span>}
    </div>
  );
}

// ─── CartPageScreen ───────────────────────────────────────────────────────────

export function CartPageScreen() {
  const { items, subtotal, totalItems, clearCart } = useCart();

  // Form state
  const [name,         setName]         = useState("");
  const [businessName, setBusinessName] = useState("");
  const [address1,     setAddress1]     = useState("");
  const [address2,     setAddress2]     = useState("");
  const [zip,          setZip]          = useState("");
  const [notes,        setNotes]        = useState("");

  // UI state
  const [errors,    setErrors]    = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [orderCode, setOrderCode] = useState<string | null>(null);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim())         e.name         = "Name is required";
    if (!businessName.trim()) e.businessName = "Business name is required";
    if (!address1.trim())     e.address1     = "Address is required";
    if (!zip.trim())          e.zip          = "Zip code is required";
    return e;
  }

  async function handlePlaceOrder() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      document.querySelector(".has-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      const res = await fetch("/api/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, businessName, address1, address2, zip, notes },
          items: items.map((i) => ({ name: i.name, code: i.code, quantity: i.quantity, price: i.price })),
          total: subtotal,
        }),
      });

      const data = await res.json();
      if (!res.ok) { alert(data.error ?? "Something went wrong. Please try again."); return; }

      setOrderCode(data.orderCode);
      clearCart();
    } catch {
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {orderCode && <SuccessModal orderCode={orderCode} onClose={() => setOrderCode(null)} />}

      <section className="cart-page">
        {/* Header */}
        <header className="cart-page__header">
          <Link href="/" className="cart-page__brand">
            <img alt="Indo Asian Foods logo" className="cart-page__logo" src={brandLogo} />
            <p>INDO ASIAN FOODS LTD</p>
          </Link>
          <div className="cart-page__header-actions">
            <label className="cart-page__search">
              <img alt="" src={searchIcon} />
              <input placeholder="Search" type="text" />
            </label>
            <Link href="/" className="cart-page__cart">
              <img alt="" src={cartIcon} />
              {totalItems > 0 && <span>{totalItems}</span>}
            </Link>
          </div>
        </header>

        {/* Empty state */}
        {items.length === 0 && !orderCode && (
          <div className="cart-page__empty">
            <img alt="" src={cartIcon} />
            <p>Your cart is empty.</p>
            <Link href="/" className="cart-page__empty-cta">Continue Shopping</Link>
          </div>
        )}

        {/* Body */}
        {items.length > 0 && (
          <section className="cart-page__body">
            {/* Checkout form */}
            <div className="cart-form">
              <h1>Checkout Details</h1>
              <div className="cart-form__fields">
                <div className="cart-form__row">
                  <CartField label="Name" placeholder="Enter your name" required value={name} onChange={setName} error={errors.name} />
                </div>
                <div className="cart-form__row">
                  <CartField label="Business Name" placeholder="Enter your business name" required value={businessName} onChange={setBusinessName} error={errors.businessName} />
                </div>
              </div>
              <div className="cart-form__section">
                <h2>Shipping</h2>
                <div className="cart-form__fields">
                  <div className="cart-form__row">
                    <CartField label="Address Line 1" placeholder="Enter the address here" required value={address1} onChange={setAddress1} error={errors.address1} />
                  </div>
                  <div className="cart-form__row cart-form__row--double">
                    <CartField label="Address Line 2 Optional" placeholder="Enter the address here" value={address2} onChange={setAddress2} />
                    <CartField label="Zip Code" placeholder="Enter the zip code" required value={zip} onChange={setZip} error={errors.zip} />
                  </div>
                  <div className="cart-form__row">
                    <CartField label="Additional Instructions" placeholder="If there are anything to note please enter it here" value={notes} onChange={setNotes} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="cart-side">
              <section className="cart-card cart-summary">
                <h2>Order Summary</h2>
                <div className="cart-summary__rows">
                  <div><p>Subtotal</p><p>{formatINR(subtotal)}</p></div>
                  <div><p>Shipping</p><p>FREE</p></div>
                </div>
                <div className="cart-summary__total">
                  <p>Total</p>
                  <p>{formatINR(subtotal)}</p>
                </div>
                <button
                  className={`cart-summary__cta ${isLoading ? "is-loading" : ""}`}
                  type="button"
                  disabled={isLoading}
                  onClick={handlePlaceOrder}
                >
                  {isLoading ? <span>Placing Order…</span> : (
                    <><span>Place Order on Whatsapp</span><img alt="" src={whatsappIcon} /></>
                  )}
                </button>
              </section>

              <section className="cart-card cart-items">
                <h2>Cart</h2>
                <div className="cart-items__list">
                  {items.map((item) => <CartItem item={item} key={item._id} />)}
                </div>
              </section>
            </div>
          </section>
        )}
        {/* Mobile fixed checkout bar — hidden on desktop */}
        {items.length > 0 && (
          <div className="cart-mobile-bar">
            <div className="cart-mobile-bar__total">
              <span className="cart-mobile-bar__label">Total</span>
              <span className="cart-mobile-bar__amount">{formatINR(subtotal)}</span>
            </div>
            <button
              className={`cart-mobile-bar__cta ${isLoading ? "is-loading" : ""}`}
              type="button"
              disabled={isLoading}
              onClick={handlePlaceOrder}
            >
              {isLoading ? <span>Placing…</span> : (
                <><span>Place Order</span><img alt="" src={whatsappIcon} /></>
              )}
            </button>
          </div>
        )}
      </section>
    </>
  );
}
