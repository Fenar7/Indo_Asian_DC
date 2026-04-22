/* eslint-disable @next/next/no-img-element */

const brandLogo =
  "https://www.figma.com/api/mcp/asset/6556e848-8f8a-4751-8aa9-b0776cdee66c";
const cartIcon =
  "https://www.figma.com/api/mcp/asset/ffa80aaa-5735-47b2-aacf-5d2a80644582";
const whatsappIcon =
  "https://www.figma.com/api/mcp/asset/72e185e0-bfa1-4053-8b9b-1fe5f455faef";
const productImage =
  "https://www.figma.com/api/mcp/asset/b4e669ac-5242-4553-b1a6-314f8dd7d601";
const quantityPlus =
  "https://www.figma.com/api/mcp/asset/11f4c6a0-fcfe-4846-9263-d597e2f37a7c";
const quantityMinus =
  "https://www.figma.com/api/mcp/asset/71f859cd-4279-4ead-a4a4-48c67bb15d2c";
const deleteIcon =
  "https://www.figma.com/api/mcp/asset/edd8c0bc-fa11-42cd-ba50-aa707254ae82";
const searchIcon =
  "https://www.figma.com/api/mcp/asset/4ead8ba7-d1ba-4713-bec7-659cd90fb0c5";

const cartItems = Array.from({ length: 2 }, (_, index) => ({
  id: `cart-item-${index + 1}`,
  name: "VIS BANANA ROAST 454G X12 @2.91",
  unit: "₹ 300.00",
  weight: "5 Boxes x 10 kg",
  price: "₹ 300.00",
  quantity: "3",
  image: productImage,
}));

type CartFieldProps = {
  label: string;
  placeholder: string;
};

function CartField({ label, placeholder }: CartFieldProps) {
  return (
    <div className="cart-field">
      <label>{label}</label>
      <input placeholder={placeholder} type="text" />
    </div>
  );
}

type CartItemProps = {
  item: (typeof cartItems)[number];
};

function CartItem({ item }: CartItemProps) {
  return (
    <article className="cart-line-item">
      <div className="cart-line-item__media">
        <img alt={item.name} src={item.image} />
      </div>

      <div className="cart-line-item__content">
        <h3>{item.name}</h3>

        <dl className="cart-line-item__meta">
          <div>
            <dt>Unit</dt>
            <dd>{item.unit}</dd>
          </div>
          <div>
            <dt>Weight</dt>
            <dd>{item.weight}</dd>
          </div>
        </dl>

        <p className="cart-line-item__price">{item.price}</p>
      </div>

      <div className="cart-line-item__controls">
        <button className="cart-line-item__delete" type="button">
          <img alt="" src={deleteIcon} />
        </button>

        <div className="cart-line-item__quantity">
          <button
            className="cart-line-item__quantity-button cart-line-item__quantity-button--minus"
            type="button"
          >
            <img alt="" src={quantityMinus} />
          </button>
          <span>{item.quantity}</span>
          <button
            className="cart-line-item__quantity-button cart-line-item__quantity-button--plus"
            type="button"
          >
            <img alt="" src={quantityPlus} />
          </button>
        </div>
      </div>
    </article>
  );
}

export function CartPageScreen() {
  return (
    <section className="cart-page">
      <header className="cart-page__header">
        <div className="cart-page__brand">
          <img alt="Indo Asian Foods logo" className="cart-page__logo" src={brandLogo} />
          <p>INDO ASIAN FOODS LTD</p>
        </div>

        <div className="cart-page__header-actions">
          <label className="cart-page__search">
            <img alt="" src={searchIcon} />
            <input placeholder="Search" type="text" />
          </label>

          <button className="cart-page__cart" type="button">
            <img alt="" src={cartIcon} />
            <span>2</span>
          </button>
        </div>
      </header>

      <section className="cart-page__body">
        <div className="cart-form">
          <h1>Checkout Details</h1>

          <div className="cart-form__fields">
            <div className="cart-form__row">
              <CartField label="Name" placeholder="Enter your name" />
            </div>

            <div className="cart-form__row">
              <CartField
                label="Business Name"
                placeholder="Enter your business name"
              />
            </div>
          </div>

          <div className="cart-form__section">
            <h2>Shipping</h2>

            <div className="cart-form__fields">
              <div className="cart-form__row">
                <CartField
                  label="Address Line 1"
                  placeholder="Enter the address here"
                />
              </div>

              <div className="cart-form__row cart-form__row--double">
                <CartField
                  label="Address Line 2 Optional"
                  placeholder="Enter the address here"
                />
                <CartField label="Zip Code" placeholder="Enter the zip code" />
              </div>

              <div className="cart-form__row">
                <CartField
                  label="Additional Instructions"
                  placeholder="If there are anything to note please entere it here"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="cart-side">
          <section className="cart-card cart-summary">
            <h2>Order Summary</h2>

            <div className="cart-summary__rows">
              <div>
                <p>Subtotal</p>
                <p>₹ 300.00</p>
              </div>
              <div>
                <p>Shipping</p>
                <p>FREE</p>
              </div>
            </div>

            <div className="cart-summary__total">
              <p>Total</p>
              <p>₹ 300.00</p>
            </div>

            <button className="cart-summary__cta" type="button">
              <span>Place Order on Whatsapp</span>
              <img alt="" src={whatsappIcon} />
            </button>
          </section>

          <section className="cart-card cart-items">
            <h2>Cart</h2>

            <div className="cart-items__list">
              {cartItems.map((item) => (
                <CartItem item={item} key={item.id} />
              ))}
            </div>
          </section>
        </div>
      </section>
    </section>
  );
}
