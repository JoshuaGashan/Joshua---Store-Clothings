// ============================================================
// ✅ ConfirmationPage.jsx — Order success screen
// Props:
//   order    - order object returned from Flask
//   setPage  - function to navigate back to shop
// ============================================================

import { styles } from "../styles/styles";

function ConfirmationPage({ order, setPage }) {
  return (
    <main style={{ ...styles.main, textAlign: "center", paddingTop: "4rem" }}>
      <div style={styles.confirmBox}>

        {/* Green checkmark */}
        <div style={styles.confirmIcon}>✓</div>

        <h2 style={styles.confirmTitle}>Order Confirmed!</h2>
        <p style={styles.confirmSub}>
          Thank you, <strong>{order.customer.name}</strong>. Your order is on its way.
        </p>

        {/* Order details */}
        <div style={styles.confirmDetails}>
          <div style={styles.confirmRow}>
            <span>Order ID</span>
            <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{order.id}</span>
          </div>
          <div style={styles.confirmRow}>
            <span>Email</span>
            <span>{order.customer.email}</span>
          </div>
          <div style={styles.confirmRow}>
            <span>Total Paid</span>
            <span style={{ fontWeight: 700, color: "#d4a843" }}>
              ${order.total.toFixed(2)}
            </span>
          </div>
          <div style={styles.confirmRow}>
            <span>Status</span>
            <span style={{ color: "#27ae60", fontWeight: 600, textTransform: "capitalize" }}>
              {order.status}
            </span>
          </div>
        </div>

        <button
          style={{ ...styles.primaryBtn, marginTop: "2rem" }}
          onClick={() => setPage("shop")}
        >
          Continue Shopping
        </button>

      </div>
    </main>
  );
}

export default ConfirmationPage;
