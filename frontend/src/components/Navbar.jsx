// ============================================================
// 🧭 Navbar.jsx — Top navigation bar
// Props:
//   page       - current active page
//   setPage    - function to change page
//   cartCount  - number of items in cart
// ============================================================

import { styles } from "../styles/styles";

function Navbar({ page, setPage, cartCount }) {
  return (
    <nav style={styles.nav}>
      <div style={styles.navInner}>

        {/* Logo — clicking takes you to shop */}
        <div style={styles.logo} onClick={() => setPage("shop")}>
          <span style={styles.logoAccent}>◆</span> JOSHUA
        </div>

        {/* Navigation Links */}
        <div style={styles.navLinks}>
          <button
            style={{ ...styles.navBtn, ...(page === "shop" ? styles.navBtnActive : {}) }}
            onClick={() => setPage("shop")}
          >
            Shop
          </button>

          {/* Cart button shows item count badge */}
          <button style={styles.cartBtn} onClick={() => setPage("cart")}>
            Bag
            {cartCount > 0 && (
              <span style={styles.cartBadge}>{cartCount}</span>
            )}
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
