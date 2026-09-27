// src/components/Header.jsx

import "../styles/header.css";

function Header() {
  return (
    <header className="site-header">

      <div className="header-shell">

        {/* Left: Brand */}
        <div className="brand-area">

          <div className="brand-logo-wrap">
            <img
              src="/logo.jpeg"
              alt="Jeevamu Gala Thandri Sannidhi"
              className="brand-logo"
            />
          </div>

          <div className="brand-text">

            <div className="brand-kicker">
              ✦ BIBLE QUIZ 2026
            </div>

            <h1>
              <h1>
   జీవముగల దేవుని సంఘము
</h1>
            </h1>

            <p>
              Bible Knowledge Challenge
            </p>

          </div>

        </div>

        {/* Right: Status */}
        <div className="header-status">

          <div className="status-dot"></div>

          <div className="status-text">
            <span>EVENT</span>
            <strong>QUIZ LIVE</strong>
          </div>

        </div>

      </div>

      {/* Decorative line */}
      <div className="header-line">
        <span></span>
      </div>

    </header>
  );
}

export default Header;