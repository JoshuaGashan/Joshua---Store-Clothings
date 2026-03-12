// ============================================================
// ⚛️ App.jsx — Root component
// This is the brain of the frontend. It:
//   - Holds all global state (cart, page, products)
//   - Fetches data from Flask backend via api.js
//   - Passes data down to pages as props
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { getProducts, placeOrder } from "./api";
import { globalStyles } from "./styles/styles";

import Navbar from "./components/Navbar";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmationPage from "./pages/ConfirmationPage";

function App() {
  // ----------------------------------------------------------
  // 🗂️ Global State
  // ----------------------------------------------------------
  const [page, setPage] = useState("shop");         // which page to show
  const [products, setProducts] = useState([]);      // products from Flask
  const [loading, setLoading] = useState(true);      // loading spinner
  const [cart, setCart] = useState([]);              // items in cart
  const [category, setCategory] = useState("All");  // active filter
  const [order, setOrder] = useState(null);          // confirmed order
  const [notification, setNotification] = useState(null); // toast message
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [placing, setPlacing] = useState(false);    // order submitting

  // ----------------------------------------------------------
  // 📡 Fetch products from Flask whenever category changes
  // In real app: calls GET http://localhost:5000/api/products
  // ----------------------------------------------------------
  useEffect(() => {
    setLoading(true);
    getProducts(category)
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  // ----------------------------------------------------------
  // 🔔 Show a brief toast notification
  // ----------------------------------------------------------
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  // ----------------------------------------------------------
  // ➕ Add item to cart (or increase qty if already in cart)
  // ----------------------------------------------------------
  const addToCart = useCallback((product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showNotification(`${product.name} added to cart`);
  }, []);

  // ----------------------------------------------------------
  // ➖ Update quantity (delta = +1 or -1), remove if qty hits 0
  // ----------------------------------------------------------
  const updateQty = (id, delta) => {
    setCart(prev =>
      prev
        .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    );
  };

  // ----------------------------------------------------------
  // 🗑️ Remove an item from cart completely
  // ----------------------------------------------------------
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  // ----------------------------------------------------------
  // 💳 Submit order to Flask backend
  // In real app: calls POST http://localhost:5000/api/orders
  // ----------------------------------------------------------
  const handleCheckout = async () => {
    if (!form.name || !form.email || !form.address) return;
    setPlacing(true);
    try {
      const data = await placeOrder(cart, form);
      setOrder(data);
      setCart([]);
      setPage("confirmation");
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  // Derived values
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  // ----------------------------------------------------------
  // 🖼️ Render
  // ----------------------------------------------------------
  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", color: "#f0ede8", fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <style>{globalStyles}</style>

      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "#d4a843", color: "#000", padding: "0.75rem 1.75rem",
          borderRadius: 3, fontFamily: "sans-serif", fontWeight: 600,
          fontSize: "0.85rem", zIndex: 999, boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
        }}>
          {notification}
        </div>
      )}

      {/* Navigation */}
      <Navbar page={page} setPage={setPage} cartCount={cartCount} />

      {/* Pages — only one renders at a time */}
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

export default App;
