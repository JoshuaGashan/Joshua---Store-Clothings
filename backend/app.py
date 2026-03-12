# ============================================================
# 🐍 app.py — Flask Backend (Main Server File)
# Run with: python app.py
# Server starts at: http://localhost:5000
# ============================================================

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow React (localhost:3000) to talk to Flask (localhost:5000)

# ------------------------------------------------------------
# 🗄️ Fake Database (replace with real DB later)
# ------------------------------------------------------------
products = [
    {"id": 1, "name": "Obsidian Sneakers", "price": 129, "category": "Footwear",    "stock": 12, "image": "👟", "rating": 4.8, "reviews": 234, "badge": "Bestseller"},
    {"id": 2, "name": "Merino Wool Jacket","price": 289, "category": "Outerwear",   "stock": 5,  "image": "🧥", "rating": 4.6, "reviews": 89,  "badge": "Limited"},
    {"id": 3, "name": "Leather Tote Bag",  "price": 199, "category": "Accessories", "stock": 20, "image": "👜", "rating": 4.9, "reviews": 412, "badge": "New"},
    {"id": 4, "name": "Linen Shirt",       "price": 89,  "category": "Tops",        "stock": 30, "image": "👔", "rating": 4.4, "reviews": 156, "badge": None},
    {"id": 5, "name": "Canvas Backpack",   "price": 159, "category": "Accessories", "stock": 8,  "image": "🎒", "rating": 4.7, "reviews": 301, "badge": "Sale"},
    {"id": 6, "name": "Silk Scarf",        "price": 69,  "category": "Accessories", "stock": 15, "image": "🧣", "rating": 4.5, "reviews": 78,  "badge": None},
    {"id": 7, "name": "Denim Trousers",    "price": 119, "category": "Bottoms",     "stock": 22, "image": "👖", "rating": 4.3, "reviews": 198, "badge": None},
    {"id": 8, "name": "Wool Beanie",       "price": 45,  "category": "Accessories", "stock": 40, "image": "🧢", "rating": 4.6, "reviews": 512, "badge": "Popular"},
]

orders = []  # Will store placed orders in memory

# ------------------------------------------------------------
# 📦 ROUTES (Endpoints the React frontend can call)
# ------------------------------------------------------------

# GET /api/products
# Optional query param: /api/products?category=Footwear
@app.route("/api/products", methods=["GET"])
def get_products():
    category = request.args.get("category", "All")
    if category == "All":
        return jsonify(products)
    filtered = [p for p in products if p["category"] == category]
    return jsonify(filtered)


# GET /api/products/<id>
# Example: /api/products/1
@app.route("/api/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = next((p for p in products if p["id"] == product_id), None)
    if product:
        return jsonify(product)
    return jsonify({"error": "Product not found"}), 404


# POST /api/orders
# Body: { "cart": [...], "customer": { "name", "email", "address" } }
@app.route("/api/orders", methods=["POST"])
def place_order():
    data = request.get_json()
    cart = data.get("cart", [])
    customer = data.get("customer", {})

    # Calculate total
    total = sum(item["price"] * item["qty"] for item in cart)

    # Build order
    order = {
        "id": f"ORD-{len(orders) + 1001}",
        "items": cart,
        "customer": customer,
        "total": total,
        "status": "confirmed",
    }
    orders.append(order)

    return jsonify(order), 201  # 201 = Created


# GET /api/orders
@app.route("/api/orders", methods=["GET"])
def get_orders():
    return jsonify(orders)


# ------------------------------------------------------------
# 🚀 Start the server
# ------------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)  # debug=True = auto-restart on file changes
