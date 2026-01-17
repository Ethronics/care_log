# Log My Care - Backend API

FastAPI backend for Log My Care - Smart Edition.

## Tech Stack

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM
- **PostgreSQL** - Database
- **Alembic** - Database migrations
- **Pydantic** - Data validation
- **JWT** - Authentication

## Getting Started

### Prerequisites

- Python 3.9+
- PostgreSQL 14+

### Installation

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Configuration

1. Create PostgreSQL database:
```sql
CREATE DATABASE care_log;
```

2. Update `backend/.env` with your database credentials:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/care_log
SECRET_KEY=your-secret-key-change-in-production
```

### Running the Server

```bash
# Development server with auto-reload
uvicorn app.main:app --reload --port 8000

# Or use run.py
python run.py
```

Server runs on `http://localhost:8000`

### API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
app/
├── models/        # SQLAlchemy models
├── schemas/       # Pydantic schemas
├── api/           # API routes
│   └── routes/    # Route modules
├── utils/         # Utility functions
├── main.py        # FastAPI app
├── config.py      # Configuration
└── database.py    # Database setup
```
