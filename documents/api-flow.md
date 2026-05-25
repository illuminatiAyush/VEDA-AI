# VedaAI — API Flow Specifications

All remote requests go to the Fastify server. Protected routes require a JSON Web Token (JWT) sent in the HTTP Authorization header: `Authorization: Bearer <JWT_TOKEN>`.

---

## 🔐 1. Authentication Endpoints

### A. Register Teacher
- **Endpoint**: `POST /api/auth/register`
- **Request Body**:
```json
{
  "name": "Delhi Public School Teacher",
  "email": "teacher@dps.edu.in",
  "password": "securepassword123"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "603d2e9f3b5c1c001f3e9a0c",
    "name": "Delhi Public School Teacher",
    "email": "teacher@dps.edu.in"
  }
}
```

### B. Login Teacher
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
```json
{
  "email": "teacher@dps.edu.in",
  "password": "securepassword123"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "603d2e9f3b5c1c001f3e9a0c",
    "name": "Delhi Public School Teacher",
    "email": "teacher@dps.edu.in"
  }
}
```

---

## 🧠 2. AI Question Generation Flow

### Step 1: Queuing an AI Generation Job
- **Endpoint**: `POST /api/generate-test`
- **Headers**: `Content-Type: multipart/form-data`, `Authorization: Bearer <token>`
- **Request Parameters**:
  - `file`: (Binary PDF file, PNG, or JPEG image)
  - `difficulty`: `easy` | `medium` | `hard`
  - `numQuestions`: Integer (typically `5` to `30`)
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Job queued successfully",
  "jobId": "2bf29a67-27b0-468b-944a-9774a3f24bf7"
}
```

### Step 2: Polling Generation Job Status
- **Endpoint**: `GET /api/generate-test/status/:jobId`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK - Processing)**:
```json
{
  "success": true,
  "status": "active",
  "progress": 40
}
```
- **Response (200 OK - Completed)**:
```json
{
  "success": true,
  "status": "completed",
  "data": {
    "questions": [
      {
        "question": "What is the powerhouse of the cell?",
        "options": ["Nucleus", "Ribosome", "Mitochondria", "Lysosome"],
        "answer": "Mitochondria",
        "type": "mcq",
        "sort_order": 1
      }
    ]
  }
}
```

---

## 📝 3. Test & Assignment Management

### A. Create Test (Save Draft)
- **Endpoint**: `POST /api/tests`
- **Request Body**:
```json
{
  "title": "Science Quiz - Electricity",
  "difficulty": "medium",
  "duration_minutes": 30,
  "total_marks": 20,
  "is_ai_generated": true,
  "status": "draft",
  "questions": [
    {
      "question": "Calculate the current flowing in a 10 ohm resistor...",
      "type": "short",
      "answer": "Use Ohm's Law: I = V/R...",
      "sort_order": 0
    }
  ]
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "603d3f1a3b5c1c001f3e9a0d",
    "title": "Science Quiz - Electricity",
    "status": "draft",
    "questions": [...]
  }
}
```

### B. Update & Schedule Test
- **Endpoint**: `PATCH /api/tests/:id`
- **Request Body**:
```json
{
  "duration_minutes": 45,
  "start_time": "2026-05-27T08:00:00.000Z",
  "end_time": "2026-05-27T08:45:00.000Z",
  "status": "scheduled"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "603d3f1a3b5c1c001f3e9a0d",
    "status": "scheduled",
    "start_time": "2026-05-27T08:00:00.000Z",
    "end_time": "2026-05-27T08:45:00.000Z"
  }
}
```

### C. Delete Test
- **Endpoint**: `PUT /api/tests/:id/status`
- **Request Body**:
```json
{
  "status": "delete"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Test deleted successfully"
}
```

### D. Get Token & API Usage Analytics
- **Endpoint**: `GET /api/ai/usage`
- **Response (200 OK)**:
```json
{
  "success": true,
  "summary": {
    "totalTokens": 24500,
    "generationCount": 12,
    "limit": 100000
  },
  "dailyBreakdown": [
    { "date": "2026-05-25", "tokens": 8500 }
  ]
}
```
