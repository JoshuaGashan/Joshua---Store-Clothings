# JOSHUA Store 🛍️

A full-stack e-commerce app built with **React** (frontend) + **Flask** (backend).

## Project Structure
```
joshua-store/
├── backend/          ← Flask (Python)
│   ├── app.py        ← Main server & all API routes
│   └── requirements.txt
└── frontend/         ← React
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ProductCard.jsx
        │   └── CartItem.jsx
        ├── pages/
        │   ├── ShopPage.jsx
        │   ├── CartPage.jsx
        │   ├── CheckoutPage.jsx
        │   └── ConfirmationPage.jsx
        ├── styles/
        │   └── styles.js
        ├── api.js     ← All Flask API calls
        ├── App.jsx    ← Root component
        └── index.js   ← React entry point
```

## How to Run

### Terminal 1 — Start Flask Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
python app.py
# Running at http://localhost:5000
```

### Terminal 2 — Start React Frontend
```bash
cd frontend
npm install
npm start
# Running at http://localhost:3000
```

## API Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/products | Get all products |
| GET | /api/products?category=Footwear | Filter by category |
| GET | /api/products/:id | Get single product |
| POST | /api/orders | Place an order |
| GET | /api/orders | Get all orders |
