import "./style.scss";

const LoginPage = () => {
  return (
    <div className="login-page-container-main flex min-h-screen items-center justify-center bg-pure-white">
      <div className="login-page-container container">
        <section className="login-card">
          <div className="login-card__brand">
            <div className="login-card__logo" aria-hidden="true">
              <span>INDO</span>
              <span>ASIAN</span>
              <span>FOOD</span>
            </div>
          </div>

          <div className="login-card__content">
            <h1 className="login-card__title">INDO ASIAN FOODS LTD</h1>
            <p className="login-card__description">
              The store is password protected. Use the password to enter the
              store
            </p>

            <form className="login-form" action="#">
              <label className="login-form__label" htmlFor="store-password">
                Password
              </label>

              <input
                id="store-password"
                className="login-form__input"
                type="password"
                placeholder="Enter the password here"
              />

              <button className="login-form__submit" type="button">
                Enter
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
