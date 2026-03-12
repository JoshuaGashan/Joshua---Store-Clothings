// ============================================================
// 💳 CheckoutPage.jsx — Customer details + order review
// Props:
//   cart          - array of cart items
//   cartTotal     - total price number
//   form          - { name, email, address }
//   setForm       - function to update form fields
//   handleCheckout - function to submit order to Flask
//   placing       - boolean, true while order is being placed
//   setPage       - function to navigate to another page
// ============================================================

import { styles } from "../styles/styles";

function CheckoutPage({ cart, cartTotal, form, setForm, handleCheckout, placing, setPage }) {
  const valid = form.name && form.email && form.address;

  return (
    <main style={styles.main}>

      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>Checkout</h2>
      </div>

      <div style={styles.checkoutLayout}>

        {/* Left: Customer form */}
        <div style={styles.checkoutForm}>
          <h3 style={styles.formSection}>Contact & Shipping</h3>

          {/* Input fields */}
          {[
            ["name", "Full Name", "👤"],
            ["email", "Email Address", "✉️"],
            ["address", "Delivery Address", "📍"],
          ].map(([field, label, icon]) => (
            <div key={field} style={styles.inputGroup}>
              <label style={styles.inputLabel}>{icon} {label}</label>
              <input
                style={styles.input}
                type={field === "email" ? "email" : "text"}
                placeholder={label}
                value={form[field]}
                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
              />
            </div>
          ))}

          {/* Demo payment info */}
          <h3 style={{ ...styles.formSection, marginTop: "2rem" }}>
            Payment <span style={styles.demoBadge}>Demo Mode</span>
          </h3>
          <div style={styles.demoCard}>
            <div style={styles.demoCardRow}>
              <span>Card Number</span>
              <span style={{ fontFamily: "monospace" }}>4242 4242 4242 4242</span>
            </div>
            <div style={styles.demoCardRow}>
              <span>Expiry</span><span>12/28</span>
              <span>CVV</span><span>123</span>
            </div>
          </div>

          {/* Submit button — disabled if form is incomplete */}
          <button
            style={{ ...styles.primaryBtn, opacity: valid ? 1 : 0.5, width: "100%" }}
            onClick={handleCheckout}
            disabled={!valid || placing}
          >
            {placing ? "Placing Order..." : `Place Order — $${cartTotal.toFixed(2)}`}
          </button>

          <button style={styles.ghostBtn} onClick={() => setPage("cart")}>
            ← Back to Bag
          </button>
        </div>

        {/* Right: Order review */}
        <div style={styles.orderReview}>
          <h3 style={styles.formSection}>Order Review</h3>
          {cart.map(item => (
            <div key={item.id} style={styles.reviewItem}>
              <span style={{ fontSize: "1.4rem" }}>{item.image}</span>
              <span style={{ flex: 1, fontSize: "0.9rem" }}>
                {item.name} × {item.qty}
              </span>
              <span style={{ fontWeight: 600 }}>
                ${(item.price * item.qty).toFixed(2)}
              </span>
            </div>
          ))}
          <div style={styles.reviewTotal}>
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </main>
  );
}

export default CheckoutPage;
