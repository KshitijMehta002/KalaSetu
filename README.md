# KalaSetu (कलासेतु)
### Full-Stack AI-Driven Market Linkage & Smart Cataloging Platform for Marginalized Artisans

> **Tagline**: *"From Craft to Customers — Powered by AI"*
>
> KalaSetu bridges traditional Indian rural artisans, craft collectives, and micro-entrepreneurs directly with conscious global patrons. By eliminating digital literacy barriers through native-language voice auto-cataloging, professional AI image enhancement, and machine-learning fair pricing guidance, KalaSetu enables craft creators to sell authentic handcrafts without middleman exploitation.

---

## 1. Project Overview & Key Features

### 🏺 Three Core Roles (Role-Based Access Control)
1. **Artisan**:
   - Register with craft specialization, state, and studio bio.
   - 6-step guided **Add Product Wizard** (Photo → Voice Describe → AI Catalog → Production Costs → ML Pricing → Publish).
   - **AI Image Studio**: Side-by-side original vs. studio-enhanced view with contrast/lighting correction and edge sharpening.
   - **Multilingual Voice Auto-Cataloger**: Speak in Hindi, Bengali, or English to generate structured bilingual catalogs and tags.
   - **ML Dynamic Pricing Assistant**: Machine-learning fair market price recommendation with guaranteed living-wage cost floor.
   - Product Inventory Management (live publishing toggles, draft autosave).
   - Real-time Order Fulfillment & shipment status tracking (`Confirmed`, `Processing`, `Shipped`, `Delivered`).
2. **Customer / Art Patron**:
   - Explore marketplace with faceted filters: Category, Material, Craft Technique, Price Range, and Full-Text Search.
   - Rich product stories, artisan bio cards, and bilingual descriptions.
   - Cart with local storage persistence and server-side price recalculation.
   - Checkout with Cash on Delivery (COD) or Instant Online Payment mock.
   - Order history with live shipment tracking.
3. **Administrator**:
   - Platform telemetry: Total Artisans, Customers, Products, Orders, and Gross Sales.
   - AI Adoption Metrics: Images Enhanced, Catalogs Generated, Price Recommendations.
   - User account management and craft listing moderation (approve / unlist).

---

## 2. Architecture & Technology Stack

```
                                  Patron / Artisan Browser
                                             │
                        ┌────────────────────┴───────────────────┐
                        ▼                                        ▼
             React + Vite + Tailwind                    Static File Storage
             (Client: Port 5173)                       (/uploads: Port 5001)
                        │
                        ▼ REST APIs (with JWT RBAC)
             Node.js + Express Server (Port 5001)
             ┌──────────┴──────────┐
             ▼                     ▼
      MongoDB Database     Python FastAPI ML Service (Port 8000)
    (Local / In-Memory)            │
                                   ▼
                         Trained Scikit-Learn Pipeline
                         (LinearRegression / RandomForest / GB)
```

- **Frontend**: React 19, Vite, Tailwind CSS (Handicraft warm palette), React Router v7, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js, MongoDB / Mongoose with built-in `mongodb-memory-server` fallback, JWT Authentication, bcryptjs, Multer, Sharp.
- **Machine Learning Service**: Python 3.13, FastAPI, Uvicorn, scikit-learn, Pandas, NumPy, joblib.

---

## 3. Monorepo Folder Structure

```
/PS90
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── config/             # app.config.js (easy single-file branding)
│   │   ├── context/            # AuthContext, CartContext, ThemeContext
│   │   ├── layouts/            # Navbar, Footer, MainLayout, ArtisanLayout
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Landing page with cultural storytelling
│   │   │   ├── Marketplace.jsx # Faceted search & responsive grid
│   │   │   ├── ProductDetail.jsx# High-res gallery & artisan story
│   │   │   ├── Cart.jsx        # Shopping cart
│   │   │   ├── Checkout.jsx    # Secure checkout
│   │   │   ├── Login.jsx       # 1-click quick testing demo logins
│   │   │   ├── Register.jsx    # Artisan & Customer registration
│   │   │   ├── artisan/        # Dashboard, Products, Orders, AddProductWizard
│   │   │   ├── customer/       # Order tracking history
│   │   │   └── admin/          # Platform console & telemetry
│   │   ├── services/           # api.js
│   │   └── App.jsx             # Route guards & definitions
│   └── vite.config.js
├── server/                     # Backend REST API
│   ├── config/                 # db.js, app.config.js
│   ├── controllers/            # auth, product, artisan, ai, pricing, order, admin
│   ├── middleware/             # auth.js, rbac.js, upload.js, error.js
│   ├── models/                 # User.js, Product.js, Category.js, Order.js
│   ├── routes/                 # auth, product, artisan, ai, pricing, order, admin
│   ├── services/               # imageEnhancementService, aiCatalogService, mlClientService
│   ├── seeds/                  # seedData.js (16 authentic Indian handicraft items)
│   ├── uploads/                # Product images
│   └── server.js
├── ml-service/                 # Python Machine Learning Service
│   ├── data/                   # handicraft_pricing.csv (1,500 training samples)
│   ├── models/                 # best_pricing_model.joblib, model_metadata.joblib
│   ├── src/                    # generate_data.py
│   ├── train.py                # Comparative regression training & evaluation
│   ├── main.py                 # FastAPI /predict-price endpoint
│   └── requirements.txt
└── README.md
```

---

## 4. Quick Start & Local Setup

### Prerequisites
- Node.js (v18+ or v24+) & npm
- Python (v3.10+ or v3.13+) & pip

### Step 1: Clone & Setup Backend
```bash
cd server
npm install
cp .env.example .env

# Optional: seed data manually (server will also auto-seed on first start if database is empty)
npm run seed

# Run Backend
npm start
# Server listens on http://localhost:5001
```

### Step 2: Setup Python ML Pricing Service
```bash
cd ../ml-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Train candidate models & select best pipeline
python train.py

# Launch FastAPI Server
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
# Service active on http://127.0.0.1:8000
```

### Step 3: Setup Frontend Client
```bash
cd ../client
npm install
npm run dev
# Frontend open at http://localhost:5173
```

---

## 5. Demo Credentials for Rapid Evaluation

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Artisan 1** | `ramprasad@kalasetu.org` | `password123` | Ramprasad Kumbhakar (Bishnupur, Bankura Terracotta) |
| **Artisan 2** | `shanti@kalasetu.org` | `password123` | Shanti Devi Ansari (Chanderi, Handloom Silk Weaving) |
| **Artisan 3** | `kripal@kalasetu.org` | `password123` | Kripal Singh Rathore (Jaipur, Blue Pottery & Ceramics) |
| **Customer** | `aarav@customer.com` | `password123` | Aarav Sharma (Patron with active orders) |
| **Admin** | `admin@kalasetu.org` | `admin123` | KalaSetu System Administrator |

> *Tip: The Login page (`/login`) includes 1-click demo login buttons for instant role testing.*

---

## 6. Machine Learning Pricing Model Details

Supervised regression models were trained on 1,500 curated handicraft entries across 8 categories:
- **Candidate Models**:
  - `LinearRegression`
  - `RandomForestRegressor` (`n_estimators=100`, `max_depth=12`)
  - `GradientBoostingRegressor` (`n_estimators=120`, `learning_rate=0.08`)
- **Evaluation Metrics** (Held-out 20% test set):
  - LinearRegression: **MAE ₹24.53** | **RMSE ₹48.37** | **R² 0.9998**
  - GradientBoosting: **MAE ₹36.28** | **RMSE ₹64.78** | **R² 0.9996**
  - RandomForest: **MAE ₹45.45** | **RMSE ₹99.38** | **R² 0.9990**
- **Safety Guardrails**:
  - Recommended price is constrained to never fall below `productionCost + 15%`.
  - The artisan maintains final authority with the "Set My Own Price" override.

---

## 7. API Reference Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register artisan or customer (admin registration blocked).
- `POST /api/auth/login` — Authenticate and receive JWT token.
- `GET /api/auth/me` — Current user profile.

### Marketplace Products (`/api/products`)
- `GET /api/products` — Filter by category, material, craft type, search, sort, page.
- `GET /api/products/categories` — Categories with live product counts.
- `GET /api/products/featured-artisans` — Top artisan masters and sample works.
- `GET /api/products/:slug` — Single listing with artisan details and related items.

### Artisan Studio (`/api/artisan`)
- `GET /api/artisan/dashboard` — Stats (products, live, orders, gross revenue).
- `GET /api/artisan/products` — Artisan's catalog with draft/live filters.
- `POST /api/artisan/products` — Create new listing (ownership bound to JWT).
- `POST /api/artisan/products/:id/publish` — Toggle public marketplace visibility.
- `DELETE /api/artisan/products/:id` — Delete artisan's own listing.

### AI Studio & Voice (`/api/ai`)
- `POST /api/ai/enhance-image` — Contrast, lighting, sharpening, and framing.
- `POST /api/ai/generate-catalog` — Voice transcript to structured bilingual JSON.
- `POST /api/ai/transcribe` — Speech recognition & language detection.

### ML Pricing (`/api/pricing`)
- `POST /api/pricing/predict` — Proxies to FastAPI service with fallback.

### Orders & Commerce (`/api/orders`)
- `POST /api/orders` — Checkout with server-side price recalculation.
- `GET /api/orders/my-orders` — Customer order history.
- `GET /api/orders/artisan-orders` — Orders containing artisan's products.
- `PATCH /api/orders/:id/status` — Update order status.

### Administration (`/api/admin`)
- `GET /api/admin/stats` — Platform KPI metrics and AI usage telemetry.
- `GET /api/admin/users` — User management.
- `GET /api/admin/products` — Moderation list.
- `PATCH /api/admin/products/:id/moderation` — Moderate / unlist products.

---

## 8. License & Cultural Heritage Acknowledgement
KalaSetu is built with deep reverence for India's traditional craftspeople, preserving centuries of cultural heritage through ethical, human-centric technology.
