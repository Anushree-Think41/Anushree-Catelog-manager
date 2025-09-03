# 📦 Catalog Manager

AI-powered catalog optimizer for e-commerce teams.  
This tool integrates with **Shopify** and provides product CRUD, optimization using **Google Gemini**, and database persistence with **PostgreSQL + Alembic**.

---

## 🚀 Features
- ✅ **CRUD API** for managing products (FastAPI)
- ✅ **Shopify Integration** – fetch, create, update products
- ✅ **AI-Powered Optimization** – generate improved product titles, descriptions, tags
- ✅ **Database Persistence** – PostgreSQL with Alembic migrations
- ✅ **Modular Architecture** – services, APIs, and tools separated for maintainability

---

## 📂 Project Structure
backend/
│── main.py # FastAPI entry point
│── api/ # Routes
│ ├── init.py
│ ├── products.py # Product CRUD API
│ └── auth.py # Auth endpoints (optional)
│── services/ # Business logic
│ ├── init.py
│ ├── shopify_service.py # Shopify API wrapper
│ └── product_service.py # Internal product logic
│── db/ # Database models & migrations
│ ├── init.py
│ ├── models.py # SQLAlchemy models
│ ├── schemas.py # Pydantic schemas
│ └── migrations/ # Alembic migrations
│── utils/ # Helpers
│ └── logger.py



---

## ⚙️ Setup & Installation

### 1. Clone the Repo
    ```bash
    git clone https://github.com/yourusername/catalog-manager.git
    cd catalog-manager/backend
    ```

### 2. Create Virtual Environment
    ```bash 
    python -m venv .venv
    source .venv/bin/activate
    ```
### 3. Install Dependencies
    ```bash
    pip install -r requirements.txt
    ```

### 4. Setup Environment Variables
    Create a .env file in backend/:

    DATABASE_URL=postgresql+psycopg2://postgres:password@localhost:5432/catalog_db
    SHOPIFY_STORE_URL=yourstore.myshopify.com
    SHOPIFY_ACCESS_TOKEN=your_private_token
    GOOGLE_API_KEY=your_google_api_key

### 5. Run Database Migrations
    alembic upgrade head

### 6. Start Backend
    uvicorn main:app --reload


##    🛠️ Tech Stack

    Backend: FastAPI

    Database: PostgreSQL + SQLAlchemy + Alembic

    AI: Google ADK

    Integration: Shopify REST Admin API
