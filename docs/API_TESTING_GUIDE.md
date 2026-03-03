# API Testing Guide

This guide provides step-by-step instructions for testing all API endpoints.

## Prerequisites

- Backend server running on `http://localhost:8000`
- Tool for making HTTP requests (curl, Postman, or HTTPie)

## Testing Workflow

### 1. Health Check

First, verify the API is running:

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

### 2. User Registration

#### Register a Regular User

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "username": "johndoe",
    "password": "JohnPass123",
    "full_name": "John Doe"
  }'
```

Expected response (201 Created):
```json
{
  "id": 1,
  "email": "john@example.com",
  "username": "johndoe",
  "full_name": "John Doe",
  "role": "user",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

#### Register an Admin User (Testing Only)

```bash
curl -X POST http://localhost:8000/api/v1/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "username": "admin",
    "password": "Admin123",
    "full_name": "Admin User"
  }'
```

### 3. User Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "JohnPass123"
  }'
```

Expected response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Important**: Save the `access_token` - you'll need it for authenticated requests!

### 4. Get Current User Profile

```bash
curl http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected response:
```json
{
  "id": 1,
  "email": "john@example.com",
  "username": "johndoe",
  "full_name": "John Doe",
  "role": "user",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

### 5. Update User Profile

```bash
curl -X PUT http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Updated Doe"
  }'
```

### 6. Create Tasks

#### Create a Simple Task

```bash
curl -X POST http://localhost:8000/api/v1/tasks/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation"
  }'
```

#### Create a Detailed Task

```bash
curl -X POST http://localhost:8000/api/v1/tasks/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review pull requests",
    "description": "Review and merge pending PRs for the authentication module",
    "status": "todo",
    "priority": "high",
    "due_date": "2024-12-31T23:59:59"
  }'
```

Expected response (201 Created):
```json
{
  "id": 1,
  "title": "Review pull requests",
  "description": "Review and merge pending PRs for the authentication module",
  "status": "todo",
  "priority": "high",
  "due_date": "2024-12-31T23:59:59",
  "is_completed": false,
  "owner_id": 1,
  "created_at": "2024-01-15T10:35:00",
  "updated_at": "2024-01-15T10:35:00"
}
```

### 7. Get Tasks

#### Get All Tasks

```bash
curl http://localhost:8000/api/v1/tasks/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Get Tasks with Pagination

```bash
curl "http://localhost:8000/api/v1/tasks/?skip=0&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Filter Tasks by Status

```bash
curl "http://localhost:8000/api/v1/tasks/?status=todo" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected response:
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Review pull requests",
      "description": "Review and merge pending PRs",
      "status": "todo",
      "priority": "high",
      "due_date": "2024-12-31T23:59:59",
      "is_completed": false,
      "owner_id": 1,
      "created_at": "2024-01-15T10:35:00",
      "updated_at": "2024-01-15T10:35:00"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 10
}
```

### 8. Get Single Task

```bash
curl http://localhost:8000/api/v1/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 9. Update Task

```bash
curl -X PUT http://localhost:8000/api/v1/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "priority": "medium"
  }'
```

### 10. Delete Task

```bash
curl -X DELETE http://localhost:8000/api/v1/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected response: 204 No Content

## Admin-Only Operations

These operations require admin privileges. First, login as admin user:

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin123"
  }'
```

### Get All Users

```bash
curl "http://localhost:8000/api/v1/users/?skip=0&limit=100" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

### Get User by ID

```bash
curl http://localhost:8000/api/v1/users/2 \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

### Delete User

```bash
curl -X DELETE http://localhost:8000/api/v1/users/2 \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

## Error Handling Testing

### Test Invalid Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "WrongPassword"
  }'
```

Expected response (401 Unauthorized):
```json
{
  "detail": "Incorrect username or password"
}
```

### Test Duplicate Registration

Try registering with the same username:
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "another@example.com",
    "username": "johndoe",
    "password": "NewPass123"
  }'
```

Expected response (400 Bad Request):
```json
{
  "detail": "Username already taken"
}
```

### Test Unauthorized Access

Try accessing protected endpoint without token:
```bash
curl http://localhost:8000/api/v1/users/me
```

Expected response (403 Forbidden):
```json
{
  "detail": "Not authenticated"
}
```

### Test Accessing Other User's Task

As a regular user, try to access another user's task (should fail):
```bash
curl http://localhost:8000/api/v1/tasks/999 \
  -H "Authorization: Bearer USER_TOKEN"
```

Expected response (403 Forbidden or 404 Not Found):
```json
{
  "detail": "Not enough permissions to access this task"
}
```

## Using Postman

1. Import the collection from `docs/Task_Management_API.postman_collection.json`
2. Create an environment with:
   - `base_url`: `http://localhost:8000`
   - `auth_token`: (will be auto-populated after login)
3. Run the "Login" request - token will be saved automatically
4. All subsequent requests will use the saved token

## Using HTTPie

HTTPie is a user-friendly HTTP client:

### Installation
```bash
pip install httpie
```

### Example Commands

```bash
# Register
http POST localhost:8000/api/v1/auth/register \
  email=john@example.com \
  username=johndoe \
  password=JohnPass123 \
  full_name="John Doe"

# Login
http POST localhost:8000/api/v1/auth/login \
  username=johndoe \
  password=JohnPass123

# Create task (with token)
http POST localhost:8000/api/v1/tasks/ \
  Authorization:"Bearer YOUR_TOKEN" \
  title="My Task" \
  priority=high

# Get tasks
http GET localhost:8000/api/v1/tasks/ \
  Authorization:"Bearer YOUR_TOKEN"
```

## Testing Checklist

- [ ] Server is running and health check passes
- [ ] User can register with valid data
- [ ] Duplicate registration is rejected
- [ ] User can login with correct credentials
- [ ] Invalid login is rejected
- [ ] Authenticated user can view their profile
- [ ] User can update their profile
- [ ] User can create tasks
- [ ] User can view their tasks
- [ ] User can filter tasks by status
- [ ] User can update tasks
- [ ] User can delete tasks
- [ ] User cannot access other users' tasks
- [ ] Admin can view all users
- [ ] Admin can view all tasks
- [ ] Admin can delete users
- [ ] Unauthorized requests are rejected
- [ ] Invalid tokens are rejected
- [ ] Input validation works correctly

## Automated Testing Script

Create a file `test_api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:8000"
API_URL="$BASE_URL/api/v1"

echo "Testing Task Management API..."

# Test health check
echo -e "\n1. Testing health check..."
curl -s $BASE_URL/health | jq

# Register user
echo -e "\n2. Registering user..."
curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test123",
    "full_name": "Test User"
  }' | jq

# Login
echo -e "\n3. Logging in..."
TOKEN=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test123"
  }' | jq -r '.access_token')

echo "Token: $TOKEN"

# Create task
echo -e "\n4. Creating task..."
curl -s -X POST $API_URL/tasks/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "priority": "high"
  }' | jq

# Get tasks
echo -e "\n5. Getting tasks..."
curl -s $API_URL/tasks/ \
  -H "Authorization: Bearer $TOKEN" | jq

echo -e "\nAll tests completed!"
```

Run it:
```bash
chmod +x test_api.sh
./test_api.sh
```

## Performance Testing

Use Apache Bench or similar tools:

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test login endpoint
ab -n 1000 -c 10 -p login.json -T application/json \
  http://localhost:8000/api/v1/auth/login

# Test authenticated endpoint (more complex)
# First get a token, then use it
```
