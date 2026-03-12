// ============================================================
// 🛒 CartPage.jsx — Shopping cart with summary
// Props:
//   cart           - array of cart items
//   cartTotal      - total price number
//   updateQty      - function(id, delta)
//   removeFromCart - function(id)
//   setPage        - function to navigate to another page
// ============================================================

import { styles } from "../styles/styles";
import CartItem from "../components/CartItem";

function CartPage({ cart, cartTotal, updateQty, removeFromCart, setPage }) {
  return (
    <main style={styles.main}>

      {/* Page Header */}
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>Your Bag</h2>
        <span style={styles.pageSub}>
          {cart.length} item{cart.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Empty state */}
      {cart.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyIcon}>🛍️</p>
          <p style={styles.emptyText}>Your bag is empty</p>
          <button style={styles.primaryBtn} onClick={() => setPage("shop")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div style={styles.cartLayout}>

          {/* Left: List of cart items */}
          <div style={styles.cartItems}>
            {cart.map(item => (
              <CartItem
                key={item.id}
                item={item}
                updateQty={updateQty}
                removeFromCart={removeFromCart}
              />
            ))}
          </div>

          {/* Right: Order summary */}
          <div style={styles.cartSummary}>
            <h3 style={styles.summaryTitle}>Order Summary</h3>
            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span style={{ color: "#27ae60" }}>Free</span>
            </div>
            <div style={{ ...styles.summaryRow, ...styles.summaryTotal }}>
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button style={styles.primaryBtn} onClick={() => setPage("checkout")}>
              Proceed to Checkout →
            </button>
            <button style={styles.ghostBtn} onClick={() => setPage("shop")}>
              ← Continue Shopping
            </button>
          </div>

        </div>
      )}
    </main>
  );
}

export default CartPage;
