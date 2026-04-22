"use client";
/* eslint-disable @next/next/no-img-element */

const brandLogo =
  "https://www.figma.com/api/mcp/asset/6fb267ce-e6cf-4ff7-a197-80343b35d983";
const cartIcon =
  "https://www.figma.com/api/mcp/asset/dae3ce05-7ea1-4737-95da-8395c5063175";
const heroProductImage =
  "https://www.figma.com/api/mcp/asset/0eb03f38-5aeb-4c39-aaa5-4f1a9f5c3007";
const thumbImage =
  "https://www.figma.com/api/mcp/asset/f15fd44c-7c42-4837-b34e-bfdf13b35f84";
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

const breadcrumbs = ["Home", "INDO - Breakfast Flours", "INDO PUTTUPODI"];

const galleryThumbs = [
  { id: "thumb-1", image: thumbImage, alt: "Product view 1" },
  { id: "thumb-2", image: thumbImage, alt: "Product view 2" },
  { id: "thumb-3", image: thumbImage, alt: "Product view 3" },
];

const relatedProducts = Array.from({ length: 5 }, (_, index) => ({
  id: `related-${index + 1}`,
  name: "VIS BANANA ROAST 454G X12 @2.91",
  code: "VSBAN",
  unit: "₹ 300.00",
  weight: "5 Boxes x 10 kg",
  price: "₹ 300.00",
  image: heroProductImage,
}));

function HeaderSearch() {
  return (
    <label className="product-detail-header__search">
      <img alt="" src={searchIcon} />
      <input placeholder="Search" type="text" />
    </label>
  );
}

type RelatedProductCardProps = {
  product: (typeof relatedProducts)[number];
};

function RelatedProductCard({ product }: RelatedProductCardProps) {
  return (
    <article className="related-product-card">
      <div className="related-product-card__media">
        <img alt={product.name} src={product.image} />
      </div>

      <div className="related-product-card__content">
        <div className="related-product-card__head">
          <h3>{product.name}</h3>
          <p>Product code : {product.code}</p>
        </div>

        <dl className="related-product-card__meta">
          <div>
            <dt>Unit</dt>
            <dd>{product.unit}</dd>
          </div>
          <div>
            <dt>Weight</dt>
            <dd>{product.weight}</dd>
          </div>
        </dl>

        <div className="related-product-card__footer">
          <p>{product.price}</p>
          <button type="button">
            <span>Add to Cart</span>
            <img alt="" src={cardPlus} />
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductGallery() {
  return (
    <div className="product-gallery">
      <div className="product-gallery__stage">
        <img alt="Ajmi Puttupodi White 1kg" src={heroProductImage} />
      </div>

      <div className="product-gallery__thumbs">
        {galleryThumbs.map((thumb) => (
          <button className="product-gallery__thumb" key={thumb.id} type="button">
            <img alt={thumb.alt} src={thumb.image} />
          </button>
        ))}

        <button className="product-gallery__thumb product-gallery__thumb--more" type="button">
          +2
        </button>
      </div>
    </div>
  );
}

function ProductSummary() {
  return (
    <div className="product-summary">
      <div className="product-summary__badges">
        <span className="product-summary__badge product-summary__badge--green">
          50% OFF
        </span>
        <span className="product-summary__badge product-summary__badge--red">
          Fresh Made
        </span>
      </div>

      <h1>AJMI PUTTUPODI WHITE 1KG (OFFER - BUY 5 BOXES)</h1>
      <p className="product-summary__price">₹ 300.00</p>

      <div className="product-summary__actions">
        <div className="product-quantity">
          <button className="product-quantity__button product-quantity__button--minus" type="button">
            <img alt="" src={quantityMinus} />
          </button>
          <span>3</span>
          <button className="product-quantity__button product-quantity__button--plus" type="button">
            <img alt="" src={quantityPlus} />
          </button>
        </div>

        <button className="product-summary__cta" type="button">
          <span>Add to Cart</span>
          <img alt="" src={addToCartPlus} />
        </button>
      </div>

      <div className="product-summary__info">
        <h2>Product Infomation</h2>

        <dl>
          <div>
            <dt>Unit</dt>
            <dd>₹ 300.00</dd>
          </div>
          <div>
            <dt>Weight</dt>
            <dd>5 x 2kg</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export function ProductDetailScreen() {
  return (
    <section className="product-detail">
      <header className="product-detail-header">
        <div className="product-detail-header__brand">
          <img alt="Indo Asian Foods logo" className="product-detail-header__logo" src={brandLogo} />
          <p>INDO ASIAN FOODS LTD</p>
        </div>

        <div className="product-detail-header__actions">
          <HeaderSearch />

          <button className="product-detail-header__cart" type="button">
            <img alt="" src={cartIcon} />
            <span>2</span>
          </button>
        </div>
      </header>

      <div className="product-detail__breadcrumbs">
        {breadcrumbs.map((item) => (
          <button key={item} type="button">
            {item}
          </button>
        ))}
      </div>

      <section className="product-detail__hero">
        <ProductGallery />
        <ProductSummary />
      </section>

      <section className="product-detail__related">
        <h2>Related Products</h2>

        <div className="product-detail__related-grid">
          {relatedProducts.map((product) => (
            <RelatedProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </section>
  );
}
