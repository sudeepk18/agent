# AgentBlazer Dedicated Backend API

A production-ready Express + TypeScript backend server for the AgentBlazer Club platform, supporting JWT authentication, MongoDB data persistence, Cloudinary media storage, and automated event registration notifications.

---

## Features
- **Express & TypeScript**: Strongly typed schemas, controllers, and routes.
- **JWT Authentication**: Secure admin login with bcrypt password hashing and 7-day tokens.
- **Security Middleware**: `helmet` security headers, CORS origin whitelisting, and `express-rate-limit` brute-force protection.
- **MongoDB + Mongoose**: Schemas for Guests, Faculty, Student Team, Committee, Events, Registrations, and Inauguration.
- **Media Uploads**: Cloudinary direct upload with automated fallbacks to local disk storage.
- **Event Registrations**: Zod validation with automated confirmation email dispatch (via Resend).
- **Graceful Fallbacks**: Works even before MongoDB is connected, providing mock/fallback responses so the frontend remains operational.

---

## Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your MongoDB connection string (e.g. from MongoDB Atlas) and JWT secret:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/agentblazer?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
DEFAULT_ADMIN_EMAIL=admin@agentblazer.sjec.ac.in
DEFAULT_ADMIN_PASSWORD=AgentBlazer@2026
```

### 3. Seed Initial Database Content
```bash
npm run seed
```
This will populate your MongoDB database with the default admin account and the existing inauguration, guest, faculty, and committee data.

### 4. Start Development Server
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

---

## API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server health check |
| `GET` | `/api/public/content` | Returns inauguration, guests, faculty, committee, and events |
| `POST` | `/api/public/events/register` | Register a student attendee for an upcoming event & send confirmation email |

### Authentication Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Admin login with rate limiting; returns JWT token |
| `GET` | `/api/auth/me` | Validates session Bearer token |
| `POST` | `/api/auth/change-password` | Updates admin password |

### Admin Endpoints (Require `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/content` | Returns complete editable store data |
| `PUT` | `/api/admin/inauguration` | Update launch / symposium text |
| `POST/PUT/DELETE` | `/api/admin/guests[/:id]` | Manage honored guests |
| `POST/PUT/DELETE` | `/api/admin/faculty[/:id]` | Manage faculty advisors |
| `POST/PUT/DELETE` | `/api/admin/members[/:id]` | Manage core team & committee members |
| `POST/PUT/DELETE` | `/api/admin/events[/:id]` | Manage events & workshops |
| `POST` | `/api/admin/upload` | Upload poster or profile photo (multipart/form-data) |
| `GET` | `/api/admin/registrations[/:eventId]` | View registered attendees |
