"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import Link from "next/link";

const brandLogo =
  "https://www.figma.com/api/mcp/asset/6fb267ce-e6cf-4ff7-a197-80343b35d983";
const cartIcon =
  "https://www.figma.com/api/mcp/asset/dae3ce05-7ea1-4737-95da-8395c5063175";
const quantityPlus =
  "https://www.figma.com/api/mcp/asset/b80116fd-1ab6-482d-bff2-5c2a48776e31";
const quantityMinus =
  "https://www.figma.com/api/mcp/asset/e4c60a0d-da94-4cb6-a440-c36589cfa7ce";
const addToCartPlus =
  "https://www.figma.com/api/mcp/asset/f40dc0ee-d1bd-4938-918a-5c834423a53a";
const cardPlus =
  "https://www.figma.com/api/mcp/asset/4a72c3da-95a0-4b25-b754-9fed8adc2ac2";
const searchIcon =
  "https://www.figma.com/api/mcp/asset/319353d3-96c9-4c5d-bc4e-36081cb368e6";
const fallbackImage =
  "https://www.figma.com/api/mcp/asset/0eb03f38-5aeb-4c39-aaa5-4f1a9f5c3007";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProductDetailData = {
  _id: string;
  name: string;
  slug: string;
  code: string;
  unit?: string;
  weight?: string;
  price?: string;
  badge?: string;
  image?: string;
  categoryName?: string;
  categoryId?: string;
};

export type RelatedProduct = {
  _id: string;
  name: string;
  code: string;
  slug?: string;
  unit?: string;
  weight?: string;
  price?: string;
  image?: string;
};

// ─── Header ───────────────────────────────────────────────────────────────────

function HeaderSearch() {
  return (
    <label className="product-detail-header__search">
      <img alt="" src={searchIcon} />
      <input placeholder="Search" type="text" />
    </label>
  );
}

// ─── Related Product Card ─────────────────────────────────────────────────────

function RelatedProductCard({ product }: { product: RelatedProduct }) {
  const href = `/product/${product._id}`;
  return (
    <Link href={href} className="related-product-card-link">
      <article className="related-product-card">
        <div className="related-product-card__media">
          <img alt={product.name} src={product.image ?? fallbackImage} />
        </div>
        <div className="related-product-card__content">
          <div className="related-product-card__head">
            <h3>{product.name}</h3>
            <p>Product code : {product.code}</p>
          </div>
          <dl className="related-product-card__meta">
            <div><dt>Unit</dt><dd>{product.unit}</dd></div>
            <div><dt>Weight</dt><dd>{product.weight}</dd></div>
          </dl>
          <div className="related-product-card__footer">
            <p>{product.price}</p>
            <button type="button" onClick={(e) => e.preventDefault()}>
              <span>Add to Cart</span>
              <img alt="" src={cardPlus} />
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Product Gallery ──────────────────────────────────────────────────────────

function ProductGallery({ mainImage, name }: { mainImage?: string; name: string }) {
  const [activeImage, setActiveImage] = useState(mainImage ?? fallbackImage);

  // Currently only one real image; we show it as the first thumb
  const thumbs = mainImage ? [{ id: "main", src: mainImage }] : [];

  return (
    <div className="product-gallery">
      <div className="product-gallery__stage">
        <img alt={name} src={activeImage} />
      </div>

      {thumbs.length > 0 && (
        <div className="product-gallery__thumbs">
          {thumbs.map((t) => (
            <button
              key={t.id}
              className={`product-gallery__thumb ${activeImage === t.src ? "is-active" : ""}`}
              type="button"
              onClick={() => setActiveImage(t.src)}
            >
              <img alt={name} src={t.src} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Product Summary ──────────────────────────────────────────────────────────

function ProductSummary({ product }: { product: ProductDetailData }) {
  const [qty, setQty] = useState(1);

  return (
    <div className="product-summary">
      {product.badge && (
        <div className="product-summary__badges">
          <span className="product-summary__badge product-summary__badge--green">
            {product.badge}
          </span>
        </div>
      )}

      <h1>{product.name}</h1>
      {product.price && (
        <p className="product-summary__price">{product.price}</p>
      )}

      <div className="product-summary__actions">
        <div className="product-quantity">
          <button
            className="product-quantity__button product-quantity__button--minus"
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            <img alt="Minus" src={quantityMinus} />
          </button>
          <span>{qty}</span>
          <button
            className="product-quantity__button product-quantity__button--plus"
            type="button"
            onClick={() => setQty((q) => q + 1)}
          >
            <img alt="Plus" src={quantityPlus} />
          </button>
        </div>

        <button className="product-summary__cta" type="button">
          <span>Add to Cart</span>
          <img alt="" src={addToCartPlus} />
        </button>
      </div>

      <div className="product-summary__info">
        <h2>Product Information</h2>
        <dl>
          {product.unit && (
            <div><dt>Unit</dt><dd>{product.unit}</dd></div>
          )}
          {product.weight && (
            <div><dt>Weight</dt><dd>{product.weight}</dd></div>
          )}
          {product.code && (
            <div><dt>Product Code</dt><dd>{product.code}</dd></div>
          )}
        </dl>
      </div>
    </div>
  );
}

// ─── ProductDetailScreen ──────────────────────────────────────────────────────

type ProductDetailScreenProps = {
  product: ProductDetailData;
  relatedProducts?: RelatedProduct[];
};

export function ProductDetailScreen({ product, relatedProducts = [] }: ProductDetailScreenProps) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    ...(product.categoryName ? [{ label: product.categoryName, href: "/" }] : []),
    { label: product.name, href: "#" },
  ];

  return (
    <section className="product-detail">
      {/* ── Header ── */}
      <header className="product-detail-header">
        <div className="product-detail-header__brand">
          <img alt="Indo Asian Foods logo" className="product-detail-header__logo" src={brandLogo} />
          <p>INDO ASIAN FOODS LTD</p>
        </div>
        <div className="product-detail-header__actions">
          <HeaderSearch />
          <button className="product-detail-header__cart" type="button">
            <img alt="" src={cartIcon} />
            <span>0</span>
          </button>
        </div>
      </header>

      {/* ── Breadcrumbs ── */}
      <div className="product-detail__breadcrumbs">
        {breadcrumbs.map((crumb, i) => (
          <Link key={i} href={crumb.href} className={i === breadcrumbs.length - 1 ? "is-current" : ""}>
            {crumb.label}
          </Link>
        ))}
      </div>

      {/* ── Hero section ── */}
      <section className="product-detail__hero">
        <ProductGallery mainImage={product.image} name={product.name} />
        <ProductSummary product={product} />
      </section>

      {/* ── Related products ── */}
      {relatedProducts.length > 0 && (
        <section className="product-detail__related">
          <h2>Related Products</h2>
          <div className="product-detail__related-grid">
            {relatedProducts.map((p) => (
              <RelatedProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
