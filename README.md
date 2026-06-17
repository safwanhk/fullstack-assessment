# Full Stack Developer Assessment

A production-oriented user management application built with **Spring Boot** and **React**. The system provides a REST API for managing users and their addresses, paired with a Material UI dashboard for browsing, searching, editing, and administering user records.

---

## Project Overview

This application demonstrates end-to-end full stack development: a layered Spring Boot backend exposing a RESTful API, and a React single-page application that consumes that API through a dedicated service layer.

The backend uses an in-memory data store seeded with sample users at startup. The frontend presents a SaaS-style dashboard with list views, detail editing, address management, form validation, loading states, and user feedback via snackbar notifications.

**Intended use:** technical assessment, code review, and demonstration of full stack engineering practices.

---

## Features

### User Management
- View all users in a searchable, paginated DataGrid
- Navigate to individual user detail pages
- Update user profile fields (first name, last name, email)
- Dashboard summary with live user and address counts

### Address Management
- View all addresses associated with a user
- Create new addresses via modal dialog
- Edit existing addresses
- Delete addresses with confirmation dialog

### User Experience
- Responsive SaaS dashboard layout with sidebar navigation
- Loading skeletons during data fetch
- Empty states for users and addresses
- Success and error snackbar notifications
- Inline form validation with disabled submit on invalid input
- User avatars and statistics cards

### Backend
- Clean architecture with separated controller, service, DTO, and model layers
- Jakarta Bean Validation on request payloads
- CORS configured for the React development server
- In-memory seed data (5 users, 2 addresses each)

---

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Backend    | Java 17, Spring Boot 3.5, Spring Web, Jakarta Validation, Lombok |
| Frontend   | React 19, Vite 8, Material UI 9, MUI X DataGrid, React Router 7 |
| HTTP Client| Axios |
| Styling    | Emotion, MUI Theme |
| Build Tools| Maven (backend), npm (frontend) |

---

## Application Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (SPA)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────────┐ │
│  │  Pages   │  │Components│  │  services/api.js (Axios)  │ │
│  └──────────┘  └──────────┘  └──────────────────────────┘ │
└─────────────────────────────┬───────────────────────────────┘
                              │ HTTP (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Spring Boot Backend (REST)                 │
│  ┌────────────┐  ┌────────────┐  ┌──────┐  ┌───────────┐  │
│  │ Controller │→ │  Service   │→ │ DTO  │  │   Model   │  │
│  └────────────┘  └────────────┘  └──────┘  └───────────┘  │
│                              │                              │
│                    In-Memory Data Store                     │
└─────────────────────────────────────────────────────────────┘
```

### Backend Structure

```
backend/src/main/java/com/safouane/backend/
├── BackendApplication.java
├── controller/
│   └── UserController.java
├── service/
│   └── UserService.java
├── dto/
│   ├── UserDTO.java
│   └── AddressDTO.java
└── model/
    ├── User.java
    └── Address.java
```

**Design decisions:**
- **Controller** handles HTTP routing, status codes, and CORS. No business logic.
- **Service** owns all domain operations and in-memory persistence.
- **DTO** decouples API contracts from internal models and carries validation annotations.
- **Model** represents the internal domain entity.

### Frontend Structure

```
frontend/src/
├── main.jsx                 # App entry, theme provider, router
├── App.jsx                  # Route definitions
├── theme.js                 # MUI theme configuration
├── layout/
│   └── DashboardLayout.jsx  # Sidebar + app shell
├── pages/
│   ├── UsersPage.jsx        # User list + search
│   └── UserDetailPage.jsx   # User edit + address management
├── components/
│   ├── AddressManagement.jsx
│   ├── AppSnackbar.jsx
│   ├── EmptyState.jsx
│   └── LoadingState.jsx
└── services/
    └── api.js               # Axios API client
```

**Design decisions:**
- **Pages** own route-level state and data fetching.
- **Components** encapsulate reusable UI patterns (snackbars, empty states, address CRUD).
- **services/api.js** centralizes all HTTP communication with the backend.

---

## Backend Setup

### Prerequisites
- Java 17 or later
- Maven (or use the included Maven Wrapper)

### Run the Application

```bash
cd backend
./mvnw spring-boot:run
```

The API starts at **http://localhost:8080**.

### Verify

```bash
curl http://localhost:8080/api/users
```

You should receive a JSON array of 5 seeded users, each with 2 addresses.

### Run Tests

```bash
./mvnw test
```

---

## Frontend Setup

### Prerequisites
- Node.js 18 or later
- npm

### Install Dependencies

```bash
cd frontend
npm install
```

### Run Development Server

```bash
npm run dev
```

The application starts at **http://localhost:5173**.

> **Note:** The backend must be running on port 8080 for the frontend to load data.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## API Endpoints

Base URL: `http://localhost:8080/api`

| Method | Endpoint | Description | Success Status |
|--------|----------|-------------|----------------|
| `GET` | `/users` | List all users with addresses | `200 OK` |
| `GET` | `/users/{id}` | Get a single user by ID | `200 OK` |
| `PUT` | `/users/{id}` | Update user profile fields | `200 OK` |
| `POST` | `/users/{id}/addresses` | Add an address to a user | `201 Created` |
| `PUT` | `/users/{id}/addresses/{addressId}` | Update an address | `200 OK` |
| `DELETE` | `/users/{id}/addresses/{addressId}` | Delete an address | `204 No Content` |

### Example: Get All Users

```bash
curl http://localhost:8080/api/users
```

### Example: Update a User

```bash
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john.doe@example.com"}'
```

### Example: Add an Address

```bash
curl -X POST http://localhost:8080/api/users/1/addresses \
  -H "Content-Type: application/json" \
  -d '{"street":"10 Main St","city":"London","country":"UK"}'
```

### Error Responses

| Status | Condition |
|--------|-----------|
| `404 Not Found` | User or address ID does not exist |
| `400 Bad Request` | Validation failure on request body |

---

## Validation Rules

### Backend (Jakarta Bean Validation)

**UserDTO**

| Field | Rule |
|-------|------|
| `firstName` | Required (`@NotBlank`) |
| `lastName` | Required (`@NotBlank`) |
| `email` | Required (`@NotBlank`), valid email format (`@Email`) |

**AddressDTO**

| Field | Rule |
|-------|------|
| `street` | Required (`@NotBlank`) |
| `city` | Required (`@NotBlank`) |
| `country` | Required (`@NotBlank`) |

### Frontend (Client-Side)

The frontend mirrors backend validation rules and provides inline error messages before submission:

- Required field checks on blur and submit
- Email format validation using a standard pattern
- Submit buttons are disabled when the form is invalid or a request is in progress

---

## Assumptions Made

1. **In-memory persistence is sufficient.** Data resets on application restart. A database was intentionally omitted to keep scope focused on API design and frontend integration.

2. **No authentication or authorization.** The application is a demonstration tool, not a production system. All endpoints are publicly accessible.

3. **Users cannot be created or deleted via the API.** The assessment scope covers read, update, and address CRUD only. User creation and deletion were not required.

4. **Single-tenant, single-user frontend.** There is no login, session management, or role-based access control.

5. **CORS is restricted to `http://localhost:5173`.** This matches the Vite development server default. Production deployment would require environment-specific CORS configuration.

6. **API base URL is hardcoded in the frontend.** The Axios client points to `http://localhost:8080/api`. Environment-based configuration would be introduced for deployment.

7. **Seed data is deterministic.** Five users with two addresses each are created at startup via `@PostConstruct`. IDs are auto-incremented.

---

## Future Improvements

If this were extended toward production, the following enhancements would be prioritized:

### Backend
- Replace in-memory store with a relational database (PostgreSQL) and JPA/Hibernate
- Add global exception handling with structured error responses
- Introduce user creation and deletion endpoints
- Add pagination and sorting support on list endpoints
- Implement API versioning (`/api/v1/...`)
- Add integration and unit test coverage beyond the default Spring Boot test
- Externalize configuration via `application.yml` and environment variables

### Frontend
- Environment-based API URL configuration (`.env` files)
- Route-level code splitting to reduce initial bundle size
- Optimistic UI updates for address operations
- Confirmation dialog for destructive actions at the page level
- Accessibility audit (ARIA labels, keyboard navigation, focus management)
- End-to-end tests with Playwright or Cypress

### DevOps
- Docker Compose for one-command local startup
- CI/CD pipeline with build, lint, and test stages
- API documentation via OpenAPI/Swagger

---

## Project Structure

```
fullstack-assessment/
├── backend/          # Spring Boot REST API
│   ├── src/
│   ├── pom.xml
│   └── mvnw
├── frontend/         # React SPA
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## License

This project was created as part of a Full Stack Developer technical assessment.
