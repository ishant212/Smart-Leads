# API Documentation

## Auth Routes

### Register
POST /api/auth/register

Body:
{
  "name": "Ishant",
  "email": "ishant@gmail.com",
  "password": "123456",
  "role": "admin"
}

---

### Login
POST /api/auth/login

Body:
{
  "email": "ishant@gmail.com",
  "password": "123456"
}

---

## Lead Routes

### Get Leads
GET /api/leads

### Create Lead
POST /api/leads

### Update Lead
PUT /api/leads/:id

### Delete Lead
DELETE /api/leads/:id

### Get Single Lead
GET /api/leads/:id