"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const brandLogo = "/icons/indo-asian-logo-main.png";
const cartIcon = "/icons/shopping-card-icon.png";
const heroBanner = "/icons/Screenshot 2026-04-02 at 11.12.24 AM 1.png";
const filterIcon = "/icons/filter-icon.png";
const dropdownIcon = "/icons/down-arrow-icon.png";
const gridIcon = "/icons/grid-view-icon.png";
const productImage = "/icons/Screenshot 2026-04-02 at 11.12.24 AM 1.png";
const plusIcon = "/icons/plus-red-icon.png";
const searchIcon = "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentcolor' stroke-width='2' viewBox='0 0 24 24'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E";
const listIcon = "/icons/list-view-icon.png";
const cartDeleteIcon = "/icons/dustbin-icon.png";
const cartProceedIcon = "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentcolor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'%3E%3Cpath d='m9 18 6-6-6-6'/%3E%3C/svg%3E";
const listQtyPlusIcon = "/icons/plus-red-icon.png";
const listQtyMinusIcon = "/icons/minus-icon.png";

// ─── Types ───────────────────────────────────────────────────────────────────

export type HeroSlide = {
  id: string;
  image: string;
  alt: string;
};

export type SanityCategory = {
  _id: string;
  name: string;
  order: number;
};

export type SanityProduct = {
  _id: string;
  name: string;
  code: string;
  slug?: string;
  unit?: string;
  weight?: string;
  price?: string;
  badge?: string;
  image?: string;
  categoryId?: string;
};

export type ActiveFilters = {
  weight: Set<string>;
  tag: Set<string>;
  unit: Set<string>;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function matchesQuery(product: SanityProduct, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  return (
    (product.name?.toLowerCase().includes(q) ?? false) ||
    (product.code?.toLowerCase().includes(q) ?? false) ||
    (product.unit?.toLowerCase().includes(q) ?? false) ||
    (product.weight?.toLowerCase().includes(q) ?? false)
  );
}

/** Parse a price string like "₹ 300.00" → 300.00. Returns null if unparseable. */
function parsePrice(priceStr?: string): number | null {
  if (!priceStr) return null;
  const num = parseFloat(priceStr.replace(/[^\d.]/g, ""));
  return isNaN(num) ? null : num;
}

function getUniqueValues(products: SanityProduct[], key: keyof SanityProduct): string[] {
  const vals = new Set<string>();
  for (const p of products) {
    const v = p[key];
    if (typeof v === "string" && v.trim()) vals.add(v.trim());
  }
  return Array.from(vals).sort();
}

// ─── useClickOutside ─────────────────────────────────────────────────────────

function useClickOutside(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, cb]);
}

// ─── FilterPill – checkbox dropdown ──────────────────────────────────────────

type FilterPillProps = {
  label: string;
  options: string[];
  selected: Set<string>;
  onToggle: (val: string) => void;
  onClear: () => void;
};

function FilterPill({ label, options, selected, onToggle, onClear }: FilterPillProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  const count = selected.size;
  const hasOptions = options.length > 0;

  return (
    <div className={`filter-pill-wrapper ${open ? "is-open" : ""}`} ref={ref}>
      <button
        className={`filter-pill ${count > 0 ? "is-active" : ""}`}
        disabled={!hasOptions}
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <span>
          {label}
          {count > 0 && <span className="filter-pill__count">{count}</span>}
        </span>
        <img alt="" src={dropdownIcon} />
      </button>

      {open && hasOptions && (
        <div className="filter-pill__dropdown" role="listbox">
          <div className="filter-pill__dropdown-header">
            <span>{label}</span>
            {count > 0 && (
              <button
                className="filter-pill__clear-link"
                onClick={(e) => { e.stopPropagation(); onClear(); }}
                type="button"
              >
                Clear
              </button>
            )}
          </div>
          <ul>
            {options.map((opt) => {
              const checked = selected.has(opt);
              return (
                <li key={opt}>
                  <label className={`filter-pill__option ${checked ? "is-checked" : ""}`}>
                    <input
                      checked={checked}
                      onChange={() => onToggle(opt)}
                      type="checkbox"
                    />
                    <span className="filter-pill__checkbox" />
                    <span className="filter-pill__option-label">{opt}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── PriceFilterPill – min/max range ─────────────────────────────────────────

type PriceFilterPillProps = {
  minPrice: number | null;
  maxPrice: number | null;
  priceMin: string;
  priceMax: string;
  onPriceMin: (v: string) => void;
  onPriceMax: (v: string) => void;
  onClear: () => void;
};

function PriceFilterPill({
  minPrice,
  maxPrice,
  priceMin,
  priceMax,
  onPriceMin,
  onPriceMax,
  onClear,
}: PriceFilterPillProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  const isActive = priceMin !== "" || priceMax !== "";
  const hasProducts = minPrice !== null || maxPrice !== null;

  return (
    <div className={`filter-pill-wrapper ${open ? "is-open" : ""}`} ref={ref}>
      <button
        className={`filter-pill ${isActive ? "is-active" : ""}`}
        disabled={!hasProducts}
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <span>
          Price
          {isActive && <span className="filter-pill__count">✓</span>}
        </span>
        <img alt="" src={dropdownIcon} />
      </button>

      {open && (
        <div className="filter-pill__dropdown filter-pill__dropdown--price" role="dialog">
          <div className="filter-pill__dropdown-header">
            <span>Price Range</span>
            {isActive && (
              <button
                className="filter-pill__clear-link"
                onClick={(e) => { e.stopPropagation(); onClear(); }}
                type="button"
              >
                Clear
              </button>
            )}
          </div>
          <div className="filter-pill__price-row">
            <div className="filter-pill__price-field">
              <label>Min (₹)</label>
              <input
                min="0"
                placeholder={minPrice !== null ? String(Math.floor(minPrice)) : "0"}
                type="number"
                value={priceMin}
                onChange={(e) => onPriceMin(e.target.value)}
              />
            </div>
            <span className="filter-pill__price-dash">–</span>
            <div className="filter-pill__price-field">
              <label>Max (₹)</label>
              <input
                min="0"
                placeholder={maxPrice !== null ? String(Math.ceil(maxPrice)) : "∞"}
                type="number"
                value={priceMax}
                onChange={(e) => onPriceMax(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SearchBar ───────────────────────────────────────────────────────────────

type SearchBarProps = {
  placeholder: string;
  className?: string;
  products: SanityProduct[];
  onSearch: (query: string) => void;
};

function SearchBar({ placeholder, className, products, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SanityProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dropdownPos, setDropdownPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // SSR guard — portal needs document.body
  useEffect(() => setMounted(true), []);

  // Click-outside: close if click is outside BOTH the input wrapper AND the
  // portalled dropdown. Standard useClickOutside won't work because the portal
  // lives outside wrapperRef in the DOM tree.
  useEffect(() => {
    function handler(e: MouseEvent) {
      const target = e.target as Node;
      const insideWrapper = wrapperRef.current?.contains(target);
      const insideDropdown = dropdownRef.current?.contains(target);
      if (!insideWrapper && !insideDropdown) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function calcPos() {
    const el = wrapperRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setDropdownPos({ top: r.bottom + 6, left: r.left, width: r.width });
  }

  // ─ Core search logic ─────────────────────────────────────────────────────
  // Filters as-you-type (instant), plus shows suggestion dropdown.

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1);

    const trimmed = value.trim();
    if (trimmed.length === 0) {
      setSuggestions([]);
      setIsOpen(false);
      onSearch("");
      return;
    }

    // Instant filter — products grid updates on every keystroke
    onSearch(trimmed);

    // Build suggestions
    const matched = products
      .filter((p) => matchesQuery(p, trimmed))
      .slice(0, 8);
    setSuggestions(matched);

    if (matched.length > 0) {
      calcPos();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Enter should ALWAYS commit search (even if dropdown is closed)
    if (e.key === "Enter") {
      e.preventDefault();
      if (isOpen && activeIndex >= 0) {
        selectSuggestion(suggestions[activeIndex]);
      } else {
        commitSearch(query);
      }
      return;
    }

    if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    // Arrow keys only when dropdown is open
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    }
  }

  function selectSuggestion(product: SanityProduct) {
    setQuery(product.name);
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
    onSearch(product.name);
  }

  function commitSearch(value: string) {
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
    onSearch(value.trim());
  }

  function handleClear() {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
    onSearch("");
    inputRef.current?.focus();
  }

  function highlightMatch(text: string, q: string) {
    if (!q.trim()) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase().trim());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark>{text.slice(idx, idx + q.trim().length)}</mark>
        {text.slice(idx + q.trim().length)}
      </>
    );
  }

  // ─ Portal dropdown ───────────────────────────────────────────────────────
  // Rendered into document.body so it escapes the sticky header's stacking
  // context and always paints on top.

  const suggestionsDropdown =
    mounted && isOpen && suggestions.length > 0 && dropdownPos
      ? createPortal(
          <ul
            ref={dropdownRef}
            className="shop-search__suggestions"
            role="listbox"
            style={{
              position: "fixed",
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
              zIndex: 9999,
            }}
          >
            {suggestions.map((product, index) => (
              <li
                key={product._id}
                role="option"
                aria-selected={index === activeIndex}
                className={`shop-search__suggestion-item ${
                  index === activeIndex ? "is-active" : ""
                }`}
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent blur → keeps dropdown alive
                  selectSuggestion(product);
                }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div className="shop-search__suggestion-media">
                  <img
                    alt={product.name}
                    src={product.image ?? productImage}
                  />
                </div>
                <div className="shop-search__suggestion-info">
                  <span className="shop-search__suggestion-name">
                    {highlightMatch(product.name, query)}
                  </span>
                  <span className="shop-search__suggestion-code">
                    {product.code}
                  </span>
                </div>
              </li>
            ))}
          </ul>,
          document.body
        )
      : null;

  return (
    <div
      className={`shop-search-wrapper ${className ?? ""}`.trim()}
      ref={wrapperRef}
    >
      <label className="shop-search">
        <img alt="" className="shop-search__icon" src={searchIcon} />
        <input
          aria-autocomplete="list"
          aria-expanded={isOpen}
          placeholder={placeholder}
          ref={inputRef}
          role="combobox"
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => {
            if (suggestions.length > 0) {
              calcPos();
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            aria-label="Clear search"
            className="shop-search__clear"
            type="button"
            onClick={handleClear}
          >
            ✕
          </button>
        )}
      </label>
      {suggestionsDropdown}
    </div>
  );
}

// ─── ProductCard ─────────────────────────────────────────────────────────────

type ProductCardProps = { product: SanityProduct; variant: "grid" | "list" };

function ProductCard({ product, variant }: ProductCardProps) {
  const { addToCart } = useCart();
  const href = `/product/${product._id}`;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      _id: product._id,
      name: product.name,
      code: product.code,
      unit: product.unit,
      weight: product.weight,
      price: product.price,
      image: product.image,
    });
  }

  if (variant === "list") {
    return (
      <Link href={href} className="shop-product-card-link">
        <article className="shop-product-card shop-product-card--list">
          <div className="shop-product-card__media shop-product-card__media--list">
            <img alt={product.name} src={product.image ?? productImage} />
          </div>
          <div className="shop-product-card__content shop-product-card__content--list">
            <div className="shop-product-card__head shop-product-card__head--list">
              <div>
                <h3>{product.name}</h3>
                <p>Product code : {product.code}</p>
              </div>
              <span className="shop-product-card__badge">{product.badge}</span>
            </div>
            <dl className="shop-product-card__meta shop-product-card__meta--list">
              <div><dt>Unit</dt><dd>{product.unit}</dd></div>
              <div><dt>Weight</dt><dd>{product.weight}</dd></div>
            </dl>
            <div className="shop-product-card__footer shop-product-card__footer--list">
              <p>{product.price}</p>
              <button type="button" onClick={handleAddToCart}>
                <span>Add to Cart</span>
                <img alt="" src={plusIcon} />
              </button>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={href} className="shop-product-card-link">
      <article className="shop-product-card">
        <div className="shop-product-card__media">
          <img alt={product.name} src={product.image ?? productImage} />
        </div>
        <div className="shop-product-card__content">
          <div className="shop-product-card__head">
            <h3>{product.name}</h3>
            <p>Product code : {product.code}</p>
          </div>
          <dl className="shop-product-card__meta">
            <div><dt>Unit</dt><dd>{product.unit}</dd></div>
            <div><dt>Weight</dt><dd>{product.weight}</dd></div>
          </dl>
          <div className="shop-product-card__footer">
            <p>{product.price}</p>
            <button type="button" onClick={handleAddToCart}>
              <span>Add to Cart</span>
              <img alt="" src={plusIcon} />
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── CartScrollArea – real DOM custom scrollbar (macOS-proof) ────────────────
//
// macOS overlays scrollbars and hides them regardless of CSS.
// The only reliable fix is to build the scrollbar as actual DOM nodes.
//
function CartScrollArea({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ top: 0, height: 0 });
  const [canScroll, setCanScroll] = useState(false);

  const recalc = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollable = el.scrollHeight > el.clientHeight + 1;
    setCanScroll(scrollable);
    if (scrollable) {
      const ratio    = el.clientHeight / el.scrollHeight;
      const h        = Math.max(ratio * el.clientHeight, 36);
      const maxScroll = el.scrollHeight - el.clientHeight;
      const maxTop   = el.clientHeight - h;
      setThumb({
        height: h,
        top: maxScroll > 0 ? (el.scrollTop / maxScroll) * maxTop : 0,
      });
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    recalc();
    el.addEventListener("scroll", recalc, { passive: true });
    const ro = new ResizeObserver(recalc);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", recalc);
      ro.disconnect();
    };
  }, [recalc]);

  return (
    <div className="cart-scroll-area">
      <div ref={scrollRef} className="shop-cart-panel__items-list">
        {children}
      </div>
      {/* Always-visible custom scrollbar track + thumb */}
      <div className="cart-scrollbar-track" aria-hidden>
        <div
          className="cart-scrollbar-thumb"
          style={{
            height: thumb.height,
            transform: `translateY(${thumb.top}px)`,
            opacity: canScroll ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
}

// ─── CartPanel (live) ─────────────────────────────────────────────────────────

function CartPanel() {
  const { items, subtotal, updateQuantity, removeFromCart, hydrated } = useCart();
  const router = useRouter();

  const formatINR = (n: number) =>
    `₹ ${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // ── Loading skeleton — shown until localStorage has been read ──────────────
  if (!hydrated) {
    return (
      <div className="shop-cart-panel__skeleton">
        {[1, 2, 3].map((i) => (
          <div key={i} className="shop-cart-panel__skeleton-item">
            <div className="shop-cart-panel__skeleton-thumb shimmer" />
            <div className="shop-cart-panel__skeleton-lines">
              <div className="shop-cart-panel__skeleton-line shop-cart-panel__skeleton-line--title shimmer" />
              <div className="shop-cart-panel__skeleton-line shop-cart-panel__skeleton-line--sub shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="shop-cart-panel__empty">
        <img alt="" src={cartIcon} />
        <p>Cart is empty — add items</p>
      </div>
    );
  }

  return (
    <div className="shop-cart-panel__filled">
      <CartScrollArea>
        {items.map((item) => (
          <div className="shop-cart-panel__item" key={item._id}>
            <div className="shop-cart-panel__item-media">
              <img alt={item.name} src={item.image ?? productImage} />
            </div>
            <div className="shop-cart-panel__item-main">
              <h3>{item.name}</h3>
              <div className="shop-cart-panel__item-controls">
                <div className="shop-cart-panel__quantity">
                  <button
                    className="shop-cart-panel__quantity-button shop-cart-panel__quantity-button--minus"
                    type="button"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  >
                    <img alt="" src={listQtyMinusIcon} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="shop-cart-panel__quantity-button shop-cart-panel__quantity-button--plus"
                    type="button"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    <img alt="" src={listQtyPlusIcon} />
                  </button>
                </div>
                <button
                  className="shop-cart-panel__delete"
                  type="button"
                  onClick={() => removeFromCart(item._id)}
                >
                  <img alt="Remove" src={cartDeleteIcon} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </CartScrollArea>

      <div className="shop-cart-panel__subtotal">
        <p>Subtotal</p>
        <p>{formatINR(subtotal)}</p>
      </div>

      <button
        className="shop-cart-panel__checkout"
        type="button"
        onClick={() => router.push("/cart-page")}
      >
        <span>Proceed to Checkout</span>
        <img alt="" src={cartProceedIcon} />
      </button>
    </div>
  );
}

// ─── HeroSlider ───────────────────────────────────────────────────────────────

function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const rotateSlide = useEffectEvent(() => {
    if (slides.length > 0) setActiveSlide((c) => (c + 1) % slides.length);
  });

  useEffect(() => {
    const id = window.setInterval(rotateSlide, 4500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="shop-hero">
      <div className="shop-hero__track" style={{ transform: `translate3d(-${activeSlide * 100}%, 0, 0)` }}>
        {slides.map((s) => (
          <div className="shop-hero__slide" key={s.id}>
            <img alt={s.alt || ""} src={s.image} />
          </div>
        ))}
      </div>
      <div className="shop-hero__dots">
        {slides.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Go to slide ${i + 1}`}
            className={i === activeSlide ? "is-active" : ""}
            type="button"
            onClick={() => setActiveSlide(i)}
          />
        ))}
      </div>
    </section>
  );
}

// ─── ShopPageScreen ───────────────────────────────────────────────────────────

export function ShopPageScreen({
  heroSlides,
  categories = [],
  products = [],
}: {
  heroSlides?: HeroSlide[];
  categories?: SanityCategory[];
  products?: SanityProduct[];
}) {
  // Debug: log data received from server
  useEffect(() => {
    console.log("[ShopPageScreen] products:", products.length, "categories:", categories.length);
    console.log("[ShopPageScreen] sample product:", products[0]);
    console.log("[ShopPageScreen] sample category:", categories[0]);
  }, [products, categories]);

  const { totalItems } = useCart();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter state
  const [weightFilter, setWeightFilter] = useState<Set<string>>(new Set());
  const [tagFilter, setTagFilter] = useState<Set<string>>(new Set());
  const [unitFilter, setUnitFilter] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  // Derive unique options from ALL products (not filtered), so dropdowns are always populated
  const weightOptions = getUniqueValues(products, "weight");
  const tagOptions = getUniqueValues(products, "badge");
  const unitOptions = getUniqueValues(products, "unit");

  // Derive global price bounds for placeholder hints
  const allPrices = products.map((p) => parsePrice(p.price)).filter((n): n is number => n !== null);
  const globalMinPrice = allPrices.length ? Math.min(...allPrices) : null;
  const globalMaxPrice = allPrices.length ? Math.max(...allPrices) : null;

  const totalActiveFilters =
    weightFilter.size + tagFilter.size + unitFilter.size +
    (priceMin !== "" ? 1 : 0) + (priceMax !== "" ? 1 : 0);

  function clearAllFilters() {
    setWeightFilter(new Set());
    setTagFilter(new Set());
    setUnitFilter(new Set());
    setPriceMin("");
    setPriceMax("");
  }

  function toggleSetFilter(setter: React.Dispatch<React.SetStateAction<Set<string>>>, val: string) {
    setter((prev) => {
      const next = new Set(prev);
      next.has(val) ? next.delete(val) : next.add(val);
      return next;
    });
  }

  // ── Filtering pipeline ────────────────────────────────────────────────────

  // 1. Category
  const categoryFiltered = activeCategoryId
    ? products.filter((p) => p.categoryId === activeCategoryId)
    : products;

  // 2. Search
  const searchFiltered = searchQuery
    ? categoryFiltered.filter((p) => matchesQuery(p, searchQuery))
    : categoryFiltered;

  // 3. Weight (OR within the set)
  const weightFiltered =
    weightFilter.size > 0
      ? searchFiltered.filter((p) => p.weight && weightFilter.has(p.weight))
      : searchFiltered;

  // 4. Tag/Badge (OR within the set)
  const tagFiltered =
    tagFilter.size > 0
      ? weightFiltered.filter((p) => p.badge && tagFilter.has(p.badge))
      : weightFiltered;

  // 5. Unit (OR within the set)
  const unitFiltered =
    unitFilter.size > 0
      ? tagFiltered.filter((p) => p.unit && unitFilter.has(p.unit))
      : tagFiltered;

  // 6. Price range
  const priceFiltered = unitFiltered.filter((p) => {
    const price = parsePrice(p.price);
    if (price === null) return true; // keep products with no price
    if (priceMin !== "" && price < parseFloat(priceMin)) return false;
    if (priceMax !== "" && price > parseFloat(priceMax)) return false;
    return true;
  });

  const filteredProducts = priceFiltered;
  const visibleProducts = viewMode === "list" ? filteredProducts.slice(0, 4) : filteredProducts;

  const hasActiveFilters = totalActiveFilters > 0 || searchQuery !== "";

  return (
    <section className="shop-page">
      {/* ── Header ── */}
      <header className="shop-page__header">
        <div className="shop-brand">
          <img alt="Indo Asian Foods logo" className="shop-brand__logo" src={brandLogo} />
          <p>INDO ASIAN FOODS LTD</p>
        </div>
        <div className="shop-page__header-actions">
          <SearchBar placeholder="Search products…" products={products} onSearch={setSearchQuery} />
          <Link href="/cart-page" className="shop-cart-button">
            <img alt="" src={cartIcon} />
            {totalItems > 0 && <span>{totalItems}</span>}
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      {heroSlides && heroSlides.length > 0 && <HeroSlider slides={heroSlides} />}

      {/* ── Category chip row ── */}
      {categories.length > 0 && (
        <div className="shop-chip-row-outer">
          <div className="shop-chip-row" role="tablist">
            <button
              className={activeCategoryId === null ? "is-active" : ""}
              onClick={() => setActiveCategoryId(null)}
              type="button"
            >
              All ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat._id).length;
              return (
                <button
                  key={cat._id}
                  className={activeCategoryId === cat._id ? "is-active" : ""}
                  onClick={() => setActiveCategoryId(cat._id)}
                  type="button"
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Filter bar ── */}
      <div className="shop-filter-bar-outer">
        <section className="shop-filter-bar">
          <div className="shop-filter-bar__left">
            <button
              className={`shop-filter-bar__filters ${totalActiveFilters > 0 ? "is-active" : ""}`}
              type="button"
              onClick={totalActiveFilters > 0 ? clearAllFilters : undefined}
            >
              <img alt="" src={filterIcon} />
              <span>
                {totalActiveFilters > 0
                  ? `Filters (${totalActiveFilters}) — Clear`
                  : "Filters"}
              </span>
            </button>

            <div className="shop-filter-bar__pill-group">
              <FilterPill
                label="Weight"
                options={weightOptions}
                selected={weightFilter}
                onToggle={(v) => toggleSetFilter(setWeightFilter, v)}
                onClear={() => setWeightFilter(new Set())}
              />
              <FilterPill
                label="Tag"
                options={tagOptions}
                selected={tagFilter}
                onToggle={(v) => toggleSetFilter(setTagFilter, v)}
                onClear={() => setTagFilter(new Set())}
              />
              <FilterPill
                label="Unit"
                options={unitOptions}
                selected={unitFilter}
                onToggle={(v) => toggleSetFilter(setUnitFilter, v)}
                onClear={() => setUnitFilter(new Set())}
              />
              <PriceFilterPill
                minPrice={globalMinPrice}
                maxPrice={globalMaxPrice}
                priceMin={priceMin}
                priceMax={priceMax}
                onPriceMin={setPriceMin}
                onPriceMax={setPriceMax}
                onClear={() => { setPriceMin(""); setPriceMax(""); }}
              />
            </div>
          </div>

          <div className="shop-filter-bar__right">
            <button
              className="shop-filter-bar__view"
              onClick={() => setViewMode((c) => (c === "grid" ? "list" : "grid"))}
              type="button"
            >
              <span>{viewMode === "grid" ? "List View" : "Grid View"}</span>
              <img alt="" src={viewMode === "grid" ? listIcon : gridIcon} />
            </button>
          </div>
        </section>
      </div>

      {/* ── Catalog ── */}
      <section className="shop-catalog">
        <aside className="shop-sidebar">
          <div className="shop-sidebar__inner">
            <button
              className={activeCategoryId === null ? "is-active" : ""}
              onClick={() => setActiveCategoryId(null)}
              type="button"
            >
              All ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat._id).length;
              return (
                <button
                  key={cat._id}
                  className={activeCategoryId === cat._id ? "is-active" : ""}
                  onClick={() => setActiveCategoryId(cat._id)}
                  type="button"
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </aside>

        <div className="shop-results">
          <div className="shop-results__top">
            <div className="shop-results__heading">
              <h2>
                {hasActiveFilters ? "Filtered Products" : "Showing All Products"}
              </h2>
              <p>
                <span>{filteredProducts.length}</span> Products Available
              </p>
            </div>
            <SearchBar
              className="shop-results__search"
              placeholder="Search products…"
              products={products}
              onSearch={setSearchQuery}
            />
          </div>

          {filteredProducts.length === 0 && (
            <div className="shop-results__empty">
              <p>No products match the current filters.</p>
              <button
                className="shop-results__empty-reset"
                onClick={clearAllFilters}
                type="button"
              >
                Clear all filters
              </button>
            </div>
          )}

          <div className={viewMode === "list" ? "shop-results__grid shop-results__grid--list" : "shop-results__grid"}>
            {visibleProducts.map((product) => (
              <ProductCard key={product._id} product={product} variant={viewMode} />
            ))}
          </div>
        </div>

        <aside className="shop-cart-panel">
          <div className="shop-cart-panel__inner">
            <h2>Cart</h2>
            <CartPanel />
          </div>
        </aside>
      </section>
    </section>
  );
}
