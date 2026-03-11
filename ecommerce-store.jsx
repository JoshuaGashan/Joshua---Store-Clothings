import { useState, useEffect, useCallback } from "react";

// ============================================================
// 🔧 BACKEND SIMULATION (Flask API Layer)
// In a real app, these would be Flask endpoints like:
// GET /api/products, POST /api/cart, GET /api/cart, etc.
// ============================================================

const flaskDB = {
  products: [
    { id: 1, name: "Obsidian Sneakers", price: 129, category: "Footwear", stock: 12, image: "👟", rating: 4.8, reviews: 234, badge: "Bestseller" },
    { id: 2, name: "Merino Wool Jacket", price: 289, category: "Outerwear", stock: 5, image: "🧥", rating: 4.6, reviews: 89, badge: "Limited" },
    { id: 3, name: "Leather Tote Bag", price: 199, category: "Accessories", stock: 20, image: "👜", rating: 4.9, reviews: 412, badge: "New" },
    { id: 4, name: "Linen Shirt", price: 89, category: "Tops", stock: 30, image: "👔", rating: 4.4, reviews: 156, badge: null },
    { id: 5, name: "Canvas Backpack", price: 159, category: "Accessories", stock: 8, image: "🎒", rating: 4.7, reviews: 301, badge: "Sale" },
    { id: 6, name: "Silk Scarf", price: 69, category: "Accessories", stock: 15, image: "🧣", rating: 4.5, reviews: 78, badge: null },
    { id: 7, name: "Denim Trousers", price: 119, category: "Bottoms", stock: 22, image: "👖", rating: 4.3, reviews: 198, badge: null },
    { id: 8, name: "Wool Beanie", price: 45, category: "Accessories", stock: 40, image: "🧢", rating: 4.6, reviews: 512, badge: "Popular" },
  ],
  orders: [],
};

// Simulated Flask API responses
const flaskAPI = {
  getProducts: (category = "All") => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = category === "All"
          ? flaskDB.products
          : flaskDB.products.filter(p => p.category === category);
        resolve({ status: 200, data: filtered });
      }, 300);
    });
  },
  getProduct: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = flaskDB.products.find(p => p.id === id);
        resolve(product ? { status: 200, data: product } : { status: 404, error: "Not found" });
      }, 100);
    });
  },
  placeOrder: (cart, customer) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const order = {
          id: `ORD-${Date.now()}`,
          items: cart,
          customer,
          total: cart.reduce((sum, i) => sum + i.price * i.qty, 0),
          status: "confirmed",
          date: new Date().toISOString(),
        };
        flaskDB.orders.push(order);
        resolve({ status: 201, data: order });
      }, 600);
    });
  },
};

// ============================================================
// 🎨 FRONTEND — React Components
// ============================================================

const CATEGORIES = ["All", "Footwear", "Outerwear", "Accessories", "Tops", "Bottoms"];

const BADGE_COLORS = {
  Bestseller: "#d4a843",
  Limited: "#c0392b",
  New: "#27ae60",
  Sale: "#e67e22",
  Popular: "#8e44ad",
};

export default function App() {
  const [page, setPage] = useState("shop"); // shop | cart | checkout | confirmation
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState("All");
  const [order, setOrder] = useState(null);
  const [notification, setNotification] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [placing, setPlacing] = useState(false);

  // Fetch from "Flask backend"
  useEffect(() => {
    setLoading(true);
    flaskAPI.getProducts(category).then(res => {
      setProducts(res.data);
      setLoading(false);
    });
  }, [category]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showNotification(`${product.name} added to cart`);
  }, []);

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev
      .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
      .filter(i => i.qty > 0)
    );
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const handleCheckout = async () => {
    if (!form.name || !form.email || !form.address) return;
    setPlacing(true);
    const res = await flaskAPI.placeOrder(cart, form);
    setOrder(res.data);
    setCart([]);
    setPlacing(false);
    setPage("confirmation");
  };

  return (
    <div style={styles.app}>
      <style>{globalStyles}</style>

      {/* Notification Toast */}
      {notification && (
        <div style={styles.toast}>{notification}</div>
      )}

      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.logo} onClick={() => setPage("shop")}>
            <span style={styles.logoAccent}>◆</span> JOSHUA
          </div>
          <div style={styles.navLinks}>
            <button style={{...styles.navBtn, ...(page==="shop" ? styles.navBtnActive : {})}} onClick={() => setPage("shop")}>Shop</button>
            <button style={styles.cartBtn} onClick={() => setPage("cart")}>
              Bag
              {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* PAGES */}
      {page === "shop" && (
        <ShopPage
          products={products}
          loading={loading}
          category={category}
          setCategory={setCategory}
          addToCart={addToCart}
        />
      )}
      {page === "cart" && (
        <CartPage
          cart={cart}
          cartTotal={cartTotal}
          updateQty={updateQty}
          removeFromCart={removeFromCart}
          setPage={setPage}
        />
      )}
      {page === "checkout" && (
        <CheckoutPage
          cart={cart}
          cartTotal={cartTotal}
          form={form}
          setForm={setForm}
          handleCheckout={handleCheckout}
          placing={placing}
          setPage={setPage}
        />
      )}
      {page === "confirmation" && order && (
        <ConfirmationPage order={order} setPage={setPage} />
      )}
    </div>
  );
}

// ---- Shop Page ----
function ShopPage({ products, loading, category, setCategory, addToCart }) {
  return (
    <main style={styles.main}>
      <div style={styles.hero}>
        <p style={styles.heroSub}>New Collection — JOSHUA</p>
        <h1 style={styles.heroTitle}>Crafted for the<br /><em>Discerning Few</em></h1>
        <p style={styles.heroDesc}>Premium essentials, thoughtfully curated.</p>
      </div>

      {/* Category Filter */}
      <div style={styles.filterBar}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            style={{ ...styles.filterBtn, ...(category === cat ? styles.filterBtnActive : {}) }}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div style={styles.loadingGrid}>
          {[...Array(4)].map((_, i) => <div key={i} style={styles.skeleton} className="skeleton" />)}
        </div>
      ) : (
        <div style={styles.grid}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      )}
    </main>
  );
}

function ProductCard({ product, addToCart }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ ...styles.card, ...(hovered ? styles.cardHovered : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {product.badge && (
        <span style={{ ...styles.badge, background: BADGE_COLORS[product.badge] || "#555" }}>
          {product.badge}
        </span>
      )}
      <div style={styles.cardEmoji}>{product.image}</div>
      <div style={styles.cardBody}>
        <p style={styles.cardCategory}>{product.category}</p>
        <h3 style={styles.cardName}>{product.name}</h3>
        <div style={styles.cardMeta}>
          <span style={styles.cardRating}>★ {product.rating} <span style={styles.cardReviews}>({product.reviews})</span></span>
          <span style={styles.cardStock}>{product.stock} left</span>
        </div>
        <div style={styles.cardFooter}>
          <span style={styles.cardPrice}>${product.price}</span>
          <button style={styles.addBtn} onClick={() => addToCart(product)}>
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Cart Page ----
function CartPage({ cart, cartTotal, updateQty, removeFromCart, setPage }) {
  return (
    <main style={styles.main}>
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>Your Bag</h2>
        <span style={styles.pageSub}>{cart.length} item{cart.length !== 1 ? "s" : ""}</span>
      </div>

      {cart.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyIcon}>🛍️</p>
          <p style={styles.emptyText}>Your bag is empty</p>
          <button style={styles.primaryBtn} onClick={() => setPage("shop")}>Continue Shopping</button>
        </div>
      ) : (
        <div style={styles.cartLayout}>
          <div style={styles.cartItems}>
            {cart.map(item => (
              <div key={item.id} style={styles.cartItem}>
                <div style={styles.cartItemEmoji}>{item.image}</div>
                <div style={styles.cartItemInfo}>
                  <p style={styles.cartItemName}>{item.name}</p>
                  <p style={styles.cartItemPrice}>${item.price}</p>
                </div>
                <div style={styles.qtyControl}>
                  <button style={styles.qtyBtn} onClick={() => updateQty(item.id, -1)}>−</button>
                  <span style={styles.qtyNum}>{item.qty}</span>
                  <button style={styles.qtyBtn} onClick={() => updateQty(item.id, 1)}>+</button>
                </div>
                <div style={styles.cartItemTotal}>${(item.price * item.qty).toFixed(2)}</div>
                <button style={styles.removeBtn} onClick={() => removeFromCart(item.id)}>✕</button>
              </div>
            ))}
          </div>
          <div style={styles.cartSummary}>
            <h3 style={styles.summaryTitle}>Order Summary</h3>
            <div style={styles.summaryRow}><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
            <div style={styles.summaryRow}><span>Shipping</span><span style={{color:"#27ae60"}}>Free</span></div>
            <div style={{...styles.summaryRow, ...styles.summaryTotal}}>
              <span>Total</span><span>${cartTotal.toFixed(2)}</span>
            </div>
            <button style={styles.primaryBtn} onClick={() => setPage("checkout")}>
              Proceed to Checkout →
            </button>
            <button style={styles.ghostBtn} onClick={() => setPage("shop")}>← Continue Shopping</button>
          </div>
        </div>
      )}
    </main>
  );
}

// ---- Checkout Page ----
function CheckoutPage({ cart, cartTotal, form, setForm, handleCheckout, placing, setPage }) {
  const valid = form.name && form.email && form.address;
  return (
    <main style={styles.main}>
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>Checkout</h2>
      </div>
      <div style={styles.checkoutLayout}>
        <div style={styles.checkoutForm}>
          <h3 style={styles.formSection}>Contact & Shipping</h3>
          {[["name","Full Name","👤"],["email","Email Address","✉️"],["address","Delivery Address","📍"]].map(([field, label, icon]) => (
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

          <h3 style={{...styles.formSection, marginTop: "2rem"}}>Payment <span style={styles.demoBadge}>Demo Mode</span></h3>
          <div style={styles.demoCard}>
            <div style={styles.demoCardRow}>
              <span>Card Number</span><span style={{fontFamily:"monospace"}}>4242 4242 4242 4242</span>
            </div>
            <div style={styles.demoCardRow}>
              <span>Expiry</span><span>12/28</span>
              <span>CVV</span><span>123</span>
            </div>
          </div>

          <button
            style={{ ...styles.primaryBtn, opacity: valid ? 1 : 0.5, marginTop: "1.5rem", width: "100%" }}
            onClick={handleCheckout}
            disabled={!valid || placing}
          >
            {placing ? "Placing Order..." : `Place Order — $${cartTotal.toFixed(2)}`}
          </button>
          <button style={styles.ghostBtn} onClick={() => setPage("cart")}>← Back to Bag</button>
        </div>

        <div style={styles.orderReview}>
          <h3 style={styles.formSection}>Order Review</h3>
          {cart.map(item => (
            <div key={item.id} style={styles.reviewItem}>
              <span style={{fontSize:"1.4rem"}}>{item.image}</span>
              <span style={{flex:1, fontSize:"0.9rem"}}>{item.name} × {item.qty}</span>
              <span style={{fontWeight:600}}>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div style={styles.reviewTotal}>
            <span>Total</span><span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}

// ---- Confirmation Page ----
function ConfirmationPage({ order, setPage }) {
  return (
    <main style={{ ...styles.main, textAlign: "center", paddingTop: "4rem" }}>
      <div style={styles.confirmBox}>
        <div style={styles.confirmIcon}>✓</div>
        <h2 style={styles.confirmTitle}>Order Confirmed!</h2>
        <p style={styles.confirmSub}>Thank you, <strong>{order.customer.name}</strong>. Your order is on its way.</p>
        <div style={styles.confirmDetails}>
          <div style={styles.confirmRow}><span>Order ID</span><span style={{fontFamily:"monospace", fontWeight:600}}>{order.id}</span></div>
          <div style={styles.confirmRow}><span>Email</span><span>{order.customer.email}</span></div>
          <div style={styles.confirmRow}><span>Total Paid</span><span style={{fontWeight:700, color:"#d4a843"}}>${order.total.toFixed(2)}</span></div>
          <div style={styles.confirmRow}><span>Status</span><span style={{color:"#27ae60", fontWeight:600, textTransform:"capitalize"}}>{order.status}</span></div>
        </div>
        <button style={{ ...styles.primaryBtn, marginTop: "2rem" }} onClick={() => setPage("shop")}>
          Continue Shopping
        </button>
      </div>
    </main>
  );
}

// ============================================================
// 💅 STYLES
// ============================================================
const styles = {
  app: { minHeight: "100vh", background: "#0d0d0d", color: "#f0ede8", fontFamily: "'Georgia', 'Times New Roman', serif" },
  nav: { position: "sticky", top: 0, zIndex: 100, background: "rgba(13,13,13,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #2a2a2a", padding: "0 2rem" },
  navInner: { maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 },
  logo: { fontSize: "1.2rem", letterSpacing: "0.25em", fontWeight: 700, cursor: "pointer", userSelect: "none" },
  logoAccent: { color: "#d4a843", marginRight: 8 },
  navLinks: { display: "flex", alignItems: "center", gap: "1rem" },
  navBtn: { background: "none", border: "none", color: "#888", fontSize: "0.9rem", cursor: "pointer", letterSpacing: "0.1em", padding: "0.5rem 0.75rem", transition: "color 0.2s" },
  navBtnActive: { color: "#f0ede8" },
  cartBtn: { background: "none", border: "1px solid #3a3a3a", color: "#f0ede8", fontSize: "0.85rem", cursor: "pointer", letterSpacing: "0.12em", padding: "0.5rem 1.2rem", borderRadius: 2, position: "relative", transition: "border-color 0.2s" },
  cartBadge: { position: "absolute", top: -8, right: -8, background: "#d4a843", color: "#000", borderRadius: "50%", width: 18, height: 18, fontSize: "0.7rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" },
  main: { maxWidth: 1200, margin: "0 auto", padding: "0 2rem 4rem" },
  hero: { padding: "5rem 0 3rem", borderBottom: "1px solid #1e1e1e" },
  heroSub: { color: "#d4a843", fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1rem" },
  heroTitle: { fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 400, lineHeight: 1.15, marginBottom: "1rem", fontStyle: "normal" },
  heroDesc: { color: "#888", fontSize: "1.05rem", letterSpacing: "0.05em" },
  filterBar: { display: "flex", gap: "0.5rem", flexWrap: "wrap", padding: "2rem 0 1rem" },
  filterBtn: { background: "none", border: "1px solid #2a2a2a", color: "#888", padding: "0.4rem 1rem", borderRadius: 2, cursor: "pointer", fontSize: "0.8rem", letterSpacing: "0.1em", transition: "all 0.2s" },
  filterBtnActive: { borderColor: "#d4a843", color: "#d4a843" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem", paddingTop: "1rem" },
  loadingGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem", paddingTop: "1rem" },
  skeleton: { height: 380, borderRadius: 4, background: "#1a1a1a" },
  card: { background: "#111", border: "1px solid #1e1e1e", borderRadius: 4, overflow: "hidden", transition: "all 0.3s", position: "relative", cursor: "default" },
  cardHovered: { border: "1px solid #3a3a3a", transform: "translateY(-4px)", boxShadow: "0 16px 40px rgba(0,0,0,0.5)" },
  badge: { position: "absolute", top: 12, left: 12, color: "#fff", fontSize: "0.65rem", letterSpacing: "0.12em", fontFamily: "sans-serif", textTransform: "uppercase", padding: "3px 8px", borderRadius: 2, fontWeight: 700, zIndex: 1 },
  cardEmoji: { fontSize: "4rem", textAlign: "center", padding: "2.5rem 1rem 1.5rem", background: "#161616" },
  cardBody: { padding: "1.2rem" },
  cardCategory: { color: "#555", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.4rem", fontFamily: "sans-serif" },
  cardName: { fontSize: "1.05rem", fontWeight: 500, marginBottom: "0.6rem", lineHeight: 1.3 },
  cardMeta: { display: "flex", justifyContent: "space-between", marginBottom: "1rem", alignItems: "center" },
  cardRating: { color: "#d4a843", fontSize: "0.8rem", fontFamily: "sans-serif" },
  cardReviews: { color: "#555" },
  cardStock: { color: "#555", fontSize: "0.75rem", fontFamily: "sans-serif" },
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardPrice: { fontSize: "1.2rem", fontWeight: 600 },
  addBtn: { background: "#d4a843", color: "#000", border: "none", padding: "0.5rem 1rem", fontSize: "0.75rem", letterSpacing: "0.1em", fontWeight: 700, fontFamily: "sans-serif", cursor: "pointer", borderRadius: 2, transition: "opacity 0.2s" },
  toast: { position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#d4a843", color: "#000", padding: "0.75rem 1.75rem", borderRadius: 3, fontFamily: "sans-serif", fontWeight: 600, fontSize: "0.85rem", zIndex: 999, boxShadow: "0 8px 24px rgba(0,0,0,0.4)", letterSpacing: "0.05em" },
  pageHeader: { padding: "3rem 0 1.5rem", display: "flex", alignItems: "baseline", gap: "1rem", borderBottom: "1px solid #1e1e1e" },
  pageTitle: { fontSize: "2rem", fontWeight: 400 },
  pageSub: { color: "#555", fontSize: "0.9rem", fontFamily: "sans-serif" },
  empty: { textAlign: "center", padding: "5rem 0" },
  emptyIcon: { fontSize: "3rem", marginBottom: "1rem" },
  emptyText: { color: "#555", marginBottom: "2rem", fontFamily: "sans-serif" },
  cartLayout: { display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", paddingTop: "2rem", alignItems: "start" },
  cartItems: { display: "flex", flexDirection: "column", gap: "1rem" },
  cartItem: { display: "flex", alignItems: "center", gap: "1rem", background: "#111", border: "1px solid #1e1e1e", borderRadius: 4, padding: "1rem 1.2rem" },
  cartItemEmoji: { fontSize: "2.2rem", width: 44, textAlign: "center" },
  cartItemInfo: { flex: 1 },
  cartItemName: { fontWeight: 500, marginBottom: "0.2rem" },
  cartItemPrice: { color: "#888", fontSize: "0.85rem", fontFamily: "sans-serif" },
  qtyControl: { display: "flex", alignItems: "center", gap: "0.5rem", background: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: 2, padding: "0.2rem 0.5rem" },
  qtyBtn: { background: "none", border: "none", color: "#f0ede8", cursor: "pointer", fontSize: "1rem", lineHeight: 1, padding: "0 4px" },
  qtyNum: { minWidth: 20, textAlign: "center", fontFamily: "sans-serif", fontSize: "0.9rem" },
  cartItemTotal: { minWidth: 60, textAlign: "right", fontWeight: 600, fontFamily: "sans-serif" },
  removeBtn: { background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: "0.8rem", padding: "4px 6px", transition: "color 0.2s" },
  cartSummary: { background: "#111", border: "1px solid #1e1e1e", borderRadius: 4, padding: "1.5rem", position: "sticky", top: 80 },
  summaryTitle: { fontWeight: 500, marginBottom: "1.5rem", fontSize: "1.1rem" },
  summaryRow: { display: "flex", justifyContent: "space-between", marginBottom: "0.8rem", color: "#888", fontFamily: "sans-serif", fontSize: "0.9rem" },
  summaryTotal: { color: "#f0ede8", fontWeight: 600, fontSize: "1rem", borderTop: "1px solid #2a2a2a", paddingTop: "0.8rem", marginTop: "0.4rem" },
  primaryBtn: { display: "block", width: "100%", background: "#d4a843", color: "#000", border: "none", padding: "0.9rem 1.5rem", fontWeight: 700, fontFamily: "sans-serif", fontSize: "0.85rem", letterSpacing: "0.1em", cursor: "pointer", borderRadius: 2, marginTop: "1.5rem", transition: "opacity 0.2s" },
  ghostBtn: { display: "block", width: "100%", background: "none", color: "#555", border: "none", padding: "0.8rem", fontFamily: "sans-serif", fontSize: "0.8rem", cursor: "pointer", marginTop: "0.5rem", letterSpacing: "0.08em" },
  checkoutLayout: { display: "grid", gridTemplateColumns: "1fr 360px", gap: "2rem", paddingTop: "2rem", alignItems: "start" },
  checkoutForm: { background: "#111", border: "1px solid #1e1e1e", borderRadius: 4, padding: "2rem" },
  formSection: { fontSize: "1rem", fontWeight: 500, letterSpacing: "0.1em", marginBottom: "1.2rem", color: "#d4a843", display: "flex", alignItems: "center", gap: "0.75rem" },
  demoBadge: { background: "#222", color: "#888", fontSize: "0.65rem", fontFamily: "sans-serif", padding: "2px 8px", borderRadius: 10, letterSpacing: "0.1em" },
  inputGroup: { marginBottom: "1rem" },
  inputLabel: { display: "block", color: "#888", fontSize: "0.75rem", letterSpacing: "0.1em", fontFamily: "sans-serif", marginBottom: "0.4rem" },
  input: { width: "100%", background: "#0d0d0d", border: "1px solid #2a2a2a", color: "#f0ede8", padding: "0.75rem 1rem", borderRadius: 2, fontFamily: "Georgia, serif", fontSize: "0.95rem", boxSizing: "border-box", outline: "none" },
  demoCard: { background: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: 4, padding: "1rem 1.2rem", fontSize: "0.85rem", fontFamily: "sans-serif", color: "#555" },
  demoCardRow: { display: "flex", gap: "1.5rem", marginBottom: "0.4rem", alignItems: "center", flexWrap: "wrap" },
  orderReview: { background: "#111", border: "1px solid #1e1e1e", borderRadius: 4, padding: "1.5rem", position: "sticky", top: 80 },
  reviewItem: { display: "flex", alignItems: "center", gap: "0.75rem", paddingBottom: "0.75rem", borderBottom: "1px solid #1a1a1a", marginBottom: "0.75rem", fontFamily: "sans-serif" },
  reviewTotal: { display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.05rem", paddingTop: "0.5rem" },
  confirmBox: { maxWidth: 480, margin: "0 auto", background: "#111", border: "1px solid #1e1e1e", borderRadius: 4, padding: "3rem 2.5rem" },
  confirmIcon: { width: 60, height: 60, borderRadius: "50%", background: "#d4a843", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", fontWeight: 700, margin: "0 auto 1.5rem", fontFamily: "sans-serif" },
  confirmTitle: { fontSize: "1.8rem", fontWeight: 400, marginBottom: "0.5rem" },
  confirmSub: { color: "#888", fontFamily: "sans-serif", marginBottom: "2rem" },
  confirmDetails: { background: "#0d0d0d", borderRadius: 4, padding: "1.2rem", textAlign: "left" },
  confirmRow: { display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #1a1a1a", fontFamily: "sans-serif", fontSize: "0.85rem", color: "#888" },
};

const globalStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0d0d0d; }
  .skeleton { animation: pulse 1.5s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
  button:hover { opacity: 0.85; }
  input:focus { border-color: #d4a843 !important; }
  ::-webkit-scrollbar { width: 6px; } 
  ::-webkit-scrollbar-track { background: #0d0d0d; }
  ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 3px; }
`;
