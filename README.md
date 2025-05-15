# Hospital DBMS Backend

## Project Overview

This project is a backend implementation of a simple Hospital Database Management System (DBMS). The goal is to manage key hospital entities such as Patients, Doctors, Appointments, Treatments, Medications, and Departments efficiently. The system exposes RESTful API endpoints to interact with the data, supporting CRUD operations and basic business logic like cost calculations.

The backend is built with **Python** using the **FastAPI** framework and connects to a **PostgreSQL** database. We use **SQLAlchemy** for ORM (Object-Relational Mapping), **Alembic** for database migrations, and **Pydantic** models for data validation.

---

## Current Project Structure

hospital_backend/
├── app/
│ ├── main.py # Application entry point, initializes FastAPI app and routes
│ ├── models/ # SQLAlchemy ORM models representing database tables
│ ├── schemas/ # Pydantic schemas for request validation and response serialization
│ ├── crud/ # Business logic: functions for Create, Read, Update, Delete operations
│ ├── api/ # API route definitions, grouped by entity
│ ├── db.py # Database connection setup and session management
│ └── utils/ # Utility helper functions (e.g., cost calculation)
├── alembic/ # Alembic migration files to manage database schema changes
├── requirements.txt # List of Python dependencies for the project
├── README.md # Project overview and instructions (this file)
└── .env # Environment variables (database URL, secrets, etc.)

### Key directories and files explained:

- **app/main.py**: Starts the FastAPI server and includes all API routers.
- **app/models/**: Contains SQLAlchemy classes that map to the database tables (Patient, Doctor, Appointment, etc.).
- **app/schemas/**: Pydantic models that define how data is validated coming into and out of the API.
- **app/crud/**: Implements the database operations with minimal business logic, e.g. creating or fetching patients, assigning doctors to appointments, etc.
- **app/api/**: Organizes API endpoints logically by entity (e.g., patient.py, doctor.py) to keep routes maintainable.
- **app/db.py**: Manages the database engine and session lifecycle.
- **app/utils/**: Contains helper functions such as calculating treatment costs based on related entities.
- **alembic/**: Contains migration scripts for incremental schema changes to the database.
- **.env**: Holds sensitive information such as database connection string, not tracked by Git.

---

## What Has Been Implemented So Far

- Basic project structure set up with FastAPI and SQLAlchemy.
- Connection to PostgreSQL database configured via environment variables.
- Initial SQLAlchemy models defined for all core entities: Patient, Doctor, Appointment, Treatment, Medication, Department.
- Basic CRUD operations created for these entities, with API routes limited to 3–4 per entity.
- Minimal business logic included, such as treatment cost calculation based on medications.
- Alembic initialized for handling database migrations.
- Git repository set up and connected to GitHub for collaborative development.

---

## Next Steps

- Implement API endpoints for the remaining entities.
- Add authentication and user management (optional for this project).
- Expand business logic as needed for treatment and appointment workflows.
- Write tests for API endpoints and database operations.
- Connect frontend with backend APIs for a complete system.

---

## How to Run the Project Locally

1. Clone the repository.
2. Create a `.env` file with your PostgreSQL connection string, e.g.: DATABASE_URL=postgresql://username:password@localhost/hospital_db
3. Install dependencies:

```bash
pip install -r requirements.txt
```
4. Initialize the database migrations and upgrade the database schema:
alembic upgrade head

5. Run the FastAPI server:
uvicorn app.main:app --reload

