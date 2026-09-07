# ShopAdmin Dashboard

A full-stack SaaS Admin Dashboard for inventory, customer management, and order fulfillment.

## Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, Lucide Icons, Recharts
- **Backend:** FastAPI, SQLAlchemy, Pydantic
- **Database:** PostgreSQL

## Getting Started

### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload