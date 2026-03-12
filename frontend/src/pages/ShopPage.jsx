// ============================================================
// 🏪 ShopPage.jsx — Main shop page with product grid
// Props:
//   products   - array of product objects from Flask
//   loading    - boolean, true while fetching from backend
//   category   - currently selected category filter
//   setCategory - function to change category
//   addToCart  - function to add a product to cart
// ============================================================

import { styles } from "../styles/styles";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["All", "Footwear", "Outerwear", "Accessories", "Tops", "Bottoms"];

function ShopPage({ products, loading, category, setCategory, addToCart }) {
  return (
    <main style={styles.main}>

      {/* Hero Section */}
      <div style={styles.hero}>
        <p style={styles.heroSub}>New Collection — JOSHUA</p>
        <h1 style={styles.heroTitle}>
          Crafted for the<br /><em>Discerning Few</em>
        </h1>
        <p style={styles.heroDesc}>Premium essentials, thoughtfully curated.</p>
      </div>

      {/* Category Filter Buttons */}
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

      {/* Product Grid — shows skeletons while loading */}
      {loading ? (
        <div style={styles.loadingGrid}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={styles.skeleton} className="skeleton" />
          ))}
        </div>
      ) : (
        <div style={styles.grid}>
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      )}

    </main>
  );
}

export default ShopPage;
