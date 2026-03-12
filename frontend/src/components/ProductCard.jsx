// ============================================================
// 🛍️ ProductCard.jsx — Single product display card
// Props:
//   product    - product object { id, name, price, image, ... }
//   addToCart  - function to add this product to cart
// ============================================================

import { useState } from "react";
import { styles } from "../styles/styles";

const BADGE_COLORS = {
  Bestseller: "#d4a843",
  Limited: "#c0392b",
  New: "#27ae60",
  Sale: "#e67e22",
  Popular: "#8e44ad",
};

function ProductCard({ product, addToCart }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ ...styles.card, ...(hovered ? styles.cardHovered : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Badge (Bestseller, New, Sale etc.) */}
      {product.badge && (
        <span style={{ ...styles.badge, background: BADGE_COLORS[product.badge] || "#555" }}>
          {product.badge}
        </span>
      )}

      {/* Product Image (emoji for now) */}
      <div style={styles.cardEmoji}>{product.image}</div>

      {/* Product Details */}
      <div style={styles.cardBody}>
        <p style={styles.cardCategory}>{product.category}</p>
        <h3 style={styles.cardName}>{product.name}</h3>

        <div style={styles.cardMeta}>
          <span style={styles.cardRating}>
            ★ {product.rating}
            <span style={styles.cardReviews}> ({product.reviews})</span>
          </span>
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

export default ProductCard;
