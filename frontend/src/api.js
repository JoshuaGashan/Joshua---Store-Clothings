// ============================================================
// 🔗 api.js — All communication with the Flask backend
// In development: Flask runs at http://localhost:5000
// Replace BASE_URL with your deployed backend URL in production
// ============================================================

const BASE_URL = "http://localhost:5000";

// GET /api/products?category=Footwear
export const getProducts = async (category = "All") => {
  const url = category === "All"
    ? `${BASE_URL}/api/products`
    : `${BASE_URL}/api/products?category=${category}`;
  const res = await fetch(url);
  return res.json();
};

// GET /api/products/:id
export const getProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/api/products/${id}`);
  return res.json();
};

// POST /api/orders
export const placeOrder = async (cart, customer) => {
  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cart, customer }),
  });
  return res.json();
};

// GET /api/orders
export const getOrders = async () => {
  const res = await fetch(`${BASE_URL}/api/orders`);
  return res.json();
};
