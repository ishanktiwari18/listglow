# Task Management API - Full Stack Application

A production-ready REST API built with FastAPI featuring JWT authentication, role-based access control (RBAC), and a modern React frontend.

## 🚀 Features

### Backend (FastAPI)
- ✅ **User Authentication**: Secure registration and login with JWT tokens
- ✅ **Role-Based Access Control**: User and Admin roles with different permissions
- ✅ **Task Management**: Complete CRUD operations for tasks
- ✅ **API Versioning**: Structured as `/api/v1/` for future scalability
- ✅ **Input Validation**: Pydantic schemas for request/response validation
- ✅ **Error Handling**: Comprehensive error handling middleware
- ✅ **Logging**: Request/response logging with processing time tracking
- ✅ **Password Security**: bcrypt hashing with strong password requirements
- ✅ **Database**: PostgreSQL with SQLAlchemy ORM
- ✅ **Auto Documentation**: Interactive Swagger UI and ReDoc

### Frontend (React + Vite)
- ✅ **Modern UI**: Clean, responsive design with gradient themes
- ✅ **Authentication**: Login/Register pages with form validation
- ✅ **Protected Routes**: JWT-based route protection
- ✅ **Task Dashboard**: View, create, edit, delete tasks
- ✅ **Real-time Updates**: Instant UI updates after operations
- ✅ **Task Filtering**: Filter by status (All, To Do, In Progress, Completed)
- ✅ **Priority Management**: Low, Medium, High priority levels
- ✅ **Due Date Tracking**: Set and display task deadlines
- ✅ **Statistics**: Visual task statistics dashboard

## 🖼️ Screenshots

### 🔐 Authentication
![Login Page](screenshot/img.png)
![Register Page](screenshot/img1.png)

### 📊 Dashboard
![Dashboard Page](screenshot/img2.png)

### 📝 Task Dialog
![Dialogue Box](screenshot/img3.png)


## 📋 Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** - Production database
- **Pydantic** - Data validation
- **python-jose** - JWT token handling
- **passlib[bcrypt]** - Password hashing
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Modern styling

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/taskdb
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:3000
```

5. **Create PostgreSQL database**
```bash
# Using psql
psql -U postgres
CREATE DATABASE taskdb;
\q
```

6. **Run the application**
```bash
uvicorn app.main:app --reload
```

The API will be available at:
- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The frontend will be available at: http://localhost:3000

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123",
  "full_name": "John Doe"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "SecurePass123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### Register Admin (Testing Only)
```http
POST /api/v1/auth/register-admin
Content-Type: application/json

{
  "email": "admin@example.com",
  "username": "admin",
  "password": "AdminPass123",
  "full_name": "Admin User"
}
```

### User Endpoints

#### Get Current User
```http
GET /api/v1/users/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/v1/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "John Updated Doe",
  "email": "newemail@example.com"
}
```

#### Get All Users (Admin Only)
```http
GET /api/v1/users/?skip=0&limit=100
Authorization: Bearer <admin-token>
```

### Task Endpoints

#### Create Task
```http
POST /api/v1/tasks/
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "status": "todo",
  "priority": "high",
  "due_date": "2024-12-31T23:59:59"
}
```

#### Get Tasks
```http
GET /api/v1/tasks/?skip=0&limit=10&status=todo
Authorization: Bearer <token>
```

Query Parameters:
- `skip`: Number of records to skip (pagination)
- `limit`: Maximum records to return (1-100)
- `status`: Filter by status (todo, in_progress, completed)

#### Get Single Task
```http
GET /api/v1/tasks/{task_id}
Authorization: Bearer <token>
```

#### Update Task
```http
PUT /api/v1/tasks/{task_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "in_progress",
  "priority": "medium"
}
```

#### Delete Task
```http
DELETE /api/v1/tasks/{task_id}
Authorization: Bearer <token>
```

## 🔒 Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit

### JWT Authentication
- Tokens expire after 30 minutes (configurable)
- Secure token generation using HS256 algorithm
- Token validation on every protected endpoint

### Role-Based Access Control
- **User Role**: Can manage their own tasks
- **Admin Role**: Can manage all users and all tasks

### Input Sanitization
- All inputs validated using Pydantic schemas
- SQL injection prevention via SQLAlchemy ORM
- XSS protection through proper input/output handling

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    username VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    full_name VARCHAR,
    role VARCHAR NOT NULL DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    status VARCHAR NOT NULL DEFAULT 'todo',
    priority VARCHAR NOT NULL DEFAULT 'medium',
    due_date TIMESTAMP,
    is_completed BOOLEAN DEFAULT FALSE,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🎯 Usage Guide

### Testing with Admin Account

1. **Create admin account**:
```bash
curl -X POST http://localhost:8000/api/v1/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "username": "admin",
    "password": "Admin123",
    "full_name": "System Admin"
  }'
```

2. **Login to get token**:
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin123"
  }'
```

3. **Use token for authenticated requests**:
```bash
curl -X GET http://localhost:8000/api/v1/users/ \
  -H "Authorization: Bearer <your-token>"
```

### Frontend Usage

1. **Register/Login**: Navigate to http://localhost:3000
2. **Dashboard**: View task statistics and your tasks
3. **Create Task**: Click "+ New Task" button
4. **Manage Tasks**: Edit, delete, or change status of tasks
5. **Filter Tasks**: Use dropdown to filter by status

## 🚀 Scalability Considerations

### Current Architecture
- Modular code structure for easy feature addition
- API versioning (`/api/v1/`) for backwards compatibility
- Separation of concerns (CRUD, schemas, models, routes)
- Middleware-based logging and error handling

### Future Scaling Options

#### 1. **Microservices Architecture**
- Split into separate services: Auth Service, Task Service, User Service
- Use API Gateway for routing
- Inter-service communication via gRPC or REST

#### 2. **Caching Layer**
- Implement Redis for:
  - Session management
  - Frequently accessed data caching
  - Rate limiting
- Cache invalidation strategies

#### 3. **Database Optimization**
- Read replicas for scaling reads
- Database connection pooling (already implemented)
- Query optimization and indexing
- Consider sharding for very large datasets

#### 4. **Load Balancing**
- Deploy multiple API instances
- Use NGINX or AWS ALB for load distribution
- Session persistence via Redis

#### 5. **Message Queue**
- Implement Celery + Redis/RabbitMQ for:
  - Async task processing
  - Email notifications
  - Scheduled jobs

#### 6. **Monitoring & Observability**
- Prometheus for metrics
- Grafana for visualization
- ELK stack for log aggregation
- Sentry for error tracking

#### 7. **Containerization**
- Docker containers for consistent deployment
- Kubernetes for orchestration
- Horizontal pod autoscaling

#### 8. **CDN & Static Assets**
- CloudFront/CloudFlare for frontend assets
- S3 for file storage
- Separate static and dynamic content
## 🐳 Docker Deployment (Production-Ready)

This application is **fully containerized and deployed using Docker Compose**, including the backend, frontend, PostgreSQL database, and Redis cache.

---

### 🧱 Services Overview
- **FastAPI Backend** – REST API with JWT authentication
- **React Frontend** – Vite-powered UI
- **PostgreSQL** – Primary relational database
- **Redis** – Caching / background services
- **Docker Volumes & Network** – Persistent storage and service isolation

---

### 📦 Docker Compose Configuration

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    container_name: task_db
    environment:
      POSTGRES_USER: taskuser
      POSTGRES_PASSWORD: taskpass123
      POSTGRES_DB: taskdb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U taskuser -d taskdb"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - task-network

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: task_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - task-network

  # FastAPI Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: task_backend
    environment:
      DATABASE_URL: postgresql://taskuser:taskpass123@db:5432/taskdb
      REDIS_URL: redis://redis:6379/0
      SECRET_KEY: your-production-secret-key-change-this
      ALLOWED_ORIGINS: http://localhost:3000,http://localhost:5173
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - ./backend:/app
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    networks:
      - task-network

  # React Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: task_frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:8000
    networks:
      - task-network

volumes:
  postgres_data:
  redis_data:

networks:
  task-network:
    driver: bridge

#Run with Docker
docker-compose up --build

#Detached mode:
docker-compose up -d --build

#Service URL
Frontend	http://localhost:3000
Backend API	http://localhost:8000
Swagger Docs	http://localhost:8000/docs
PostgreSQL	localhost:5432
Redis	localhost:6379

```

## 📝 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] User registration with valid data
- [ ] Registration with duplicate email/username fails
- [ ] Login with correct credentials
- [ ] Login with incorrect credentials fails
- [ ] Password validation (uppercase, lowercase, digit)

**Authorization:**
- [ ] Regular user can create tasks
- [ ] Regular user can only see their tasks
- [ ] Regular user cannot access other users' tasks
- [ ] Admin can see all tasks
- [ ] Admin can manage all users

**Task Management:**
- [ ] Create task with all fields
- [ ] Create task with minimal fields
- [ ] Update task status
- [ ] Update task priority
- [ ] Delete task
- [ ] Filter tasks by status
