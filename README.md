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
```

### 2. Frontend Setup
```bash
cd frontend
pnpm install
pnpm dev
```

### 3. Docker Commands to Start Application with Docker
```bash
Start the complete application:

docker compose up

Build images and start the application:

docker compose up --build

Start services in the background:

docker compose up -d

Stop and remove containers:

docker compose down

Stop containers and remove database volumes:

docker compose down -v

View running containers:

docker compose ps

View logs:

docker compose logs

View backend logs:

docker compose logs backend
```

### 4. Running the Test Suite
```bash
First make sure PostgreSQL is running:

docker compose up -d postgres

Then run:

docker compose run --rm backend-tests
```