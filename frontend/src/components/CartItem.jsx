// ============================================================
// 🛒 CartItem.jsx — Single item row inside the Cart page
// Props:
//   item           - cart item { id, name, price, image, qty }
//   updateQty      - function(id, delta) to increase/decrease qty
//   removeFromCart - function(id) to remove item completely
// ============================================================

import { styles } from "../styles/styles";

function CartItem({ item, updateQty, removeFromCart }) {
  return (
    <div style={styles.cartItem}>

      {/* Emoji image */}
      <div style={styles.cartItemEmoji}>{item.image}</div>

      {/* Name & unit price */}
      <div style={styles.cartItemInfo}>
        <p style={styles.cartItemName}>{item.name}</p>
        <p style={styles.cartItemPrice}>${item.price}</p>
      </div>

      {/* Quantity controls: − qty + */}
      <div style={styles.qtyControl}>
        <button style={styles.qtyBtn} onClick={() => updateQty(item.id, -1)}>−</button>
        <span style={styles.qtyNum}>{item.qty}</span>
        <button style={styles.qtyBtn} onClick={() => updateQty(item.id, 1)}>+</button>
      </div>

      {/* Line total */}
      <div style={styles.cartItemTotal}>
        ${(item.price * item.qty).toFixed(2)}
      </div>

      {/* Remove button */}
      <button style={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
        ✕
      </button>

    </div>
  );
}

export default CartItem;
