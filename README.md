# CivicFix

<div align="center">

<img src="https://img.shields.io/badge/REACT-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
<img src="https://img.shields.io/badge/VITE-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
<img src="https://img.shields.io/badge/JAVASCRIPT-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
<img src="https://img.shields.io/badge/CSS3-RESPONSIVE-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
<img src="https://img.shields.io/badge/NODE.JS-22+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
<img src="https://img.shields.io/badge/EXPRESS-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
<br>
<img src="https://img.shields.io/badge/POSTGRESQL-DATABASE-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
<img src="https://img.shields.io/badge/JWT-AUTH-FF9800?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
<img src="https://img.shields.io/badge/LEAFLET-MAPS-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet" />
<img src="https://img.shields.io/badge/RECHARTS-ANALYTICS-8884D8?style=for-the-badge" alt="Recharts" />
<img src="https://img.shields.io/badge/CLOUDINARY-MEDIA-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
<br>
<img src="https://img.shields.io/badge/STATUS-DEPLOYED-22C55E?style=for-the-badge" alt="Status" />
<img src="https://img.shields.io/badge/RESPONSIVE-YES-16A34A?style=for-the-badge" alt="Responsive" />
<img src="https://img.shields.io/badge/DARK%20MODE-SUPPORTED-8B5CF6?style=for-the-badge" alt="Dark Mode" />

</div>

---

## Report. Track. Resolve.

**CivicFix** is a full-stack civic issue reporting and management platform that connects citizens with administrators and responsible departments through a structured **report-to-resolution workflow**.

Instead of treating civic complaints as simple form submissions, CivicFix focuses on what happens **after an issue is reported**.

Citizens can report problems, track their progress, receive updates, and view issue history.

Administrators can review reports, assign departments, update statuses, monitor issues geographically, and analyze civic issue data through an operational dashboard.

---

## Live Application

**Frontend:**  
[https://civicfix-three-rouge.vercel.app/](https://civicfix-three-rouge.vercel.app/)

**Backend API:**  
Hosted on Render

**Database:**  
PostgreSQL hosted on Neon

---

## 📌 Overview

CivicFix is designed around a simple idea:

> **Reporting a civic problem should be the beginning of the process, not the end.**

Traditional complaint systems can make it difficult for citizens to understand:

- Where to report an issue
- Whether the report was successfully received
- Who is responsible for the issue
- Whether action has been taken
- What stage the issue is currently in
- Whether the issue has been resolved

CivicFix creates a structured digital workflow that connects:

```text
Citizen
   ↓
Report Issue
   ↓
Issue Created
   ↓
Admin Review
   ↓
Department Assignment
   ↓
Issue Processing
   ↓
Status Updates
   ↓
Citizen Notification
   ↓
Resolution
```

---

# Problem Statement

Civic problems are common in everyday life:

- Potholes
- Garbage accumulation
- Water leakage
- Damaged roads
- Broken infrastructure
- Drainage problems
- Public property damage
- Street-level maintenance issues

The problem is not always the absence of a way to complain.

The larger problem is **lack of visibility and structured follow-up**.

A citizen may report an issue but have limited information about:

```text
Who received the report?
        ↓
Who is responsible?
        ↓
What action was taken?
        ↓
What is the current status?
        ↓
Has the issue been resolved?
```

CivicFix addresses this gap by providing an end-to-end issue lifecycle.

---

# CivicFix Approach

```text
                    CIVIC ISSUE
                         │
                         ▼
                  CITIZEN REPORT
                         │
                         ▼
                  ISSUE CREATED
                         │
                         ▼
                    ADMIN REVIEW
                         │
                         ▼
                DEPARTMENT ASSIGNMENT
                         │
                         ▼
                  ISSUE PROCESSING
                         │
                         ▼
                   STATUS UPDATE
                         │
                         ▼
                     NOTIFICATION
                         │
                         ▼
                     RESOLUTION
```

The platform provides visibility to both sides of the workflow.

### Citizen

Report → Track → Receive Updates → View Resolution

### Administration

Receive → Review → Assign → Update → Monitor → Analyze

---

# Core Objectives

## 1. Simplify Civic Issue Reporting

Provide citizens with a structured and easy-to-use interface for reporting civic problems.

## 2. Improve Transparency

Allow citizens to track what is happening with their submitted issues.

## 3. Centralize Issue Management

Provide administrators with a centralized operational dashboard.

## 4. Improve Communication

Provide notifications and status updates throughout the issue lifecycle.

## 5. Connect Issues With Departments

Allow administrators to assign issues to the appropriate responsible department.

---

# User Roles

CivicFix provides two primary application roles.

```text
                         CIVICFIX
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       CITIZEN PORTAL                ADMIN PORTAL
              │                           │
       Report Issues                 Manage Issues
       Track Reports                 Assign Departments
       Notifications                 Update Status
       Issue Details                 Monitor Map
       Profile                       View Analytics
       Password                      Notifications
       Theme                         Profile
```

---

# 👤 Citizen Portal

## Citizen Registration

New users can create a CivicFix account.

Registration includes:

- Name
- Email
- Password
- Citizen account creation
- Password hashing
- Validation

---

## Citizen Login

Citizens can securely log into the platform using their credentials.

Authentication uses:

- JWT tokens
- Protected routes
- Role-based authorization
- Secure password hashing

---

## Citizen Dashboard

The dashboard provides an overview of the citizen's reported issues.

It includes:

- Total reports
- Pending reports
- In-progress reports
- Resolved reports
- Recent reports
- Quick actions
- Loading states
- Empty states
- Error states
- Retry functionality

---

## Report an Issue

Citizens can create a structured civic issue report.

A report can include:

- Issue title
- Description
- Category
- Location
- Supporting information
- Photo evidence

Uploaded evidence is handled through the backend media pipeline.

The report is then stored in the CivicFix database and becomes available to administrators.

---

## My Reports

Citizens can view the issues they have submitted.

The page provides:

- Report list
- Issue status
- Issue category
- Submission information
- Issue identification
- Navigation to issue details

---

## Issue Details

Citizens can open an individual issue and view:

- Issue title
- Description
- Category
- Location
- Current status
- Evidence
- Progress information
- Issue updates
- Timeline/history

This provides visibility into the lifecycle of a reported issue.

---

## Notifications

Citizens receive notifications related to their issues.

Notifications can include:

- Issue status changes
- Administrative updates
- Issue activity
- Resolution updates

Citizens can mark notifications as read.

---

## Citizen Profile

Citizens can manage:

- Profile information
- Password
- Account session
- Theme preference
- Logout

---

# 🛡️ Admin Portal

## Admin Login

Administrators have a separate login experience.

Admin access is protected through role-based authorization.

Only authorized administrator accounts can access administrative functionality.

---

## Admin Dashboard

The dashboard provides an operational overview of CivicFix.

It includes:

- Total issues
- Pending issues
- In-progress issues
- Resolved issues
- Recent activity
- Department information
- Operational statistics

---

## Issue Management

Administrators can:

- View reported issues
- Search issues
- Filter issues
- View issue details
- Monitor issue status
- Assign departments
- Update issue progress

---

## Admin Issue Details

Administrators can review:

- Issue information
- Reporter information
- Category
- Location
- Evidence
- Current status
- Issue history
- Department assignment

Administrators can also update the issue lifecycle from the issue details interface.

---

## Department Assignment

Administrators can assign reported issues to responsible departments.

Example departments can include:

- Roads
- Sanitation
- Water
- Electrical
- Public Works
- Other civic service departments

This creates clearer ownership for issue resolution.

---

# Map Monitoring

CivicFix includes a map-based monitoring interface using **Leaflet**.

Administrators can use the map to:

- View reported issues geographically
- Understand issue distribution
- Monitor issue locations
- Identify spatial concentrations of civic problems

The map provides an additional operational view beyond traditional issue lists.

---

# Analytics

CivicFix includes an analytics interface designed to provide administrators with a high-level understanding of issue data.

Analytics can be used to understand:

- Issue distribution
- Issue categories
- Status distribution
- Department workload
- Resolution activity
- Overall issue trends

Charts are implemented using **Recharts**.

---

# Admin Notifications

Administrators have a dedicated notification interface for relevant platform activity.

This helps provide visibility into:

- New reports
- Issue updates
- Administrative activity
- Issue lifecycle events

---

# Admin Profile

Administrators can manage:

- Profile information
- Password
- Account session
- Theme preferences
- Logout

---

# Complete Issue Lifecycle

The central CivicFix workflow is:

```text
┌───────────────────────┐
│       CITIZEN         │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│     REPORT ISSUE      │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│      REST API         │
│ Authentication        │
│ Validation            │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│     ISSUE CREATED     │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│    ADMIN DASHBOARD    │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ DEPARTMENT ASSIGNMENT │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│   ISSUE PROCESSING    │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│     STATUS UPDATE     │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│      NOTIFICATION     │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│       RESOLVED        │
└───────────────────────┘
```

---

# System Architecture

CivicFix follows a three-layer production architecture.

```text
                         USERS
                           │
                           ▼
                ┌────────────────────┐
                │      VERCEL        │
                │ React + Vite       │
                │ Frontend           │
                └─────────┬──────────┘
                          │
                          │ HTTPS / REST API
                          ▼
                ┌────────────────────┐
                │      RENDER        │
                │ Node.js + Express  │
                │ Backend API        │
                └─────────┬──────────┘
                          │
                          │ PostgreSQL
                          ▼
                ┌────────────────────┐
                │       NEON         │
                │ PostgreSQL         │
                │ Production DB      │
                └────────────────────┘
```

### Production Stack

```text
Frontend
   ↓
Vercel

Backend
   ↓
Render

Database
   ↓
Neon PostgreSQL
```

---

# Technology Stack

## Frontend

| Technology    | Purpose                          |
| ------------- | -------------------------------- |
| React         | Component-based user interface   |
| Vite          | Development and build tooling    |
| JavaScript    | Application logic                |
| React Router  | Client-side routing              |
| CSS           | Responsive interface styling     |
| Lucide React  | UI icons                         |
| React Leaflet | Map integration                  |
| Recharts      | Analytics and data visualization |

---

## Backend

| Technology | Purpose                    |
| ---------- | -------------------------- |
| Node.js    | Server runtime             |
| Express.js | REST API framework         |
| JWT        | Authentication             |
| bcryptjs   | Password hashing           |
| pg         | PostgreSQL integration     |
| dotenv     | Environment configuration  |
| CORS       | Cross-origin communication |
| Multer     | File upload handling       |
| Cloudinary | Media storage              |

---

## Database

| Technology | Purpose                         |
| ---------- | ------------------------------- |
| PostgreSQL | Relational application database |
| Neon       | Production PostgreSQL hosting   |
| pg         | Node.js PostgreSQL client       |

---

## Deployment

| Platform   | Responsibility                  |
| ---------- | ------------------------------- |
| GitHub     | Source code repository          |
| Vercel     | React frontend hosting          |
| Render     | Node.js/Express backend hosting |
| Neon       | PostgreSQL production database  |
| Cloudinary | Uploaded media storage          |

---

# Authentication & Authorization

CivicFix uses role-based authentication.

```text
                    AUTHENTICATION
                          │
                ┌─────────┴─────────┐
                │                   │
                ▼                   ▼
             CITIZEN              ADMIN
                │                   │
                ▼                   ▼
        Citizen Portal        Admin Portal
```

### Authentication Features

- User registration
- User login
- JWT-based authentication
- Password hashing
- Protected API routes
- Role-based authorization
- Citizen-only functionality
- Admin-only functionality
- Logout
- Password change

Passwords are hashed using `bcryptjs` before being stored.

JWT tokens are used to authenticate protected API requests.

---

# REST API

The backend follows a modular REST API architecture.

```text
/api/auth
/api/citizen
/api/issues
/api/departments
/api/notifications
/api/health
```

---

## Authentication Endpoints

```text
POST   /api/auth/register
POST   /api/auth/login
PATCH  /api/auth/profile
PATCH  /api/auth/password
```

---

## Citizen Endpoints

```text
/api/citizen/*
```

Citizen-specific operations are protected using authentication and role-based authorization.

---

## Issue Endpoints

```text
/api/issues/*
```

Issue functionality includes:

- Creating reports
- Retrieving reports
- Viewing issue details
- Updating issue status
- Department assignment
- Issue updates
- Issue management

---

## Department Endpoints

```text
/api/departments/*
```

Used for department-related operations and issue assignment.

---

## Notification Endpoints

```text
GET    /api/notifications
PATCH  /api/notifications/:id/read
```

---

## Health Check

```text
GET /api/health
```

Example successful response:

```json
{
  "success": true,
  "message": "CivicFix API is running",
  "database": "connected",
  "serverTime": "..."
}
```

The health endpoint verifies that the backend is running and that the PostgreSQL database is accessible.

---

# Database Design

CivicFix uses a relational PostgreSQL database.

The primary entities are:

```text
users
   │
   ├── issues
   │      │
   │      └── issuesupdates
   │
   └── notifications

departments
   │
   └── issues
```

---

## Main Tables

### Users

Stores:

- Citizen accounts
- Administrator accounts
- Authentication information
- Profile information
- User roles

---

### Issues

Stores:

- Civic issue reports
- Issue descriptions
- Categories
- Locations
- Status
- Reporter
- Department assignment
- Evidence information
- Timestamps

---

### Issue Updates

Stores the history associated with individual issues.

This allows CivicFix to maintain a timeline of issue activity.

---

### Notifications

Stores notifications associated with:

- Users
- Issues
- Issue activity
- Status changes

---

### Departments

Stores the departments responsible for handling civic issues.

---

# Database Relationships

```text
                         USERS
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
           ISSUES                  NOTIFICATIONS
             │                           │
             │                           │
             ▼                           ▼
       DEPARTMENTS                    USERS
             │
             │
             ▼
      ISSUE UPDATES
```

### Key Relationships

```text
issues.reported_by
        ↓
users.id

issues.assigned_department
        ↓
departments.id

issue_updates.issue_id
        ↓
issues.id

issue_updates.updated_by
        ↓
users.id

notifications.issue_id
        ↓
issues.id

notifications.user_id
        ↓
users.id
```

---

# 📁 Project Structure

```text
CivicFix/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │
│   ├── middleware/
│   │
│   ├── routes/
│   │
│   ├── db/
│   │
│   ├── .env
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │
│   ├── context/
│   │
│   ├── layouts/
│   │
│   ├── pages/
│   │   ├── citizen/
│   │   └── admin/
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

# Local Development

## Prerequisites

Before running CivicFix locally, install:

- Node.js
- npm
- PostgreSQL
- Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/aneeshrao0207/CivicFix.git
```

Move into the project:

```bash
cd CivicFix
```

---

## 2. Install Dependencies

Install the frontend/root dependencies:

```bash
npm install
```

Install backend dependencies if required by your environment:

```bash
cd backend
npm install
cd ..
```

---

# Environment Variables

Create a backend environment file:

```text
backend/.env
```

Example structure:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

If media uploads are configured through Cloudinary, also provide the required Cloudinary environment variables used by the backend.

### Important

Never commit:

```text
.env
.env.local
.env.*.local
```

to GitHub.

The project already excludes environment files through `.gitignore`.

---

# Run the Application Locally

## Start the Frontend

From the project root:

```bash
npm run dev
```

The Vite development server will normally run on:

```text
http://localhost:5173
```

---

## Start the Backend

In another terminal:

```bash
npm run server:dev
```

The Express API will normally run on:

```text
http://localhost:5000
```

---

## Backend Production Command

The production backend can be started with:

```bash
npm run server
```

---

# Testing

CivicFix has been tested across the major application workflows.

## Citizen Testing

- Registration
- Login
- Logout
- Dashboard
- Issue reporting
- Photo evidence upload
- My Reports
- Issue Details
- Issue timeline
- Notifications
- Profile
- Password change
- Protected routes
- API error states
- Retry functionality
- Loading states
- Empty states
- Responsive layouts
- Dark mode

---

## Admin Testing

- Login
- Logout
- Dashboard
- Issue management
- Issue search
- Issue filtering
- Issue details
- Department assignment
- Status updates
- Map monitoring
- Analytics
- Notifications
- Profile
- Password change
- Protected routes
- API error states
- Responsive layouts
- Dark mode

---

# Security Considerations

## Password Security

Passwords are hashed using `bcryptjs`.

Plain-text passwords are not stored in the database.

---

## JWT Authentication

Protected requests use JWT-based authentication.

---

## Role-Based Authorization

Backend middleware restricts access based on the user's role.

This prevents citizens from accessing administrative functionality.

---

## Environment Variables

Production secrets and database credentials are stored through environment variables.

Sensitive credentials are not included in the repository.

---

## CORS

Cross-origin requests are handled through backend CORS configuration.

---

# UI/UX Design

CivicFix was designed as a **real product interface**, rather than a basic CRUD academic application.

The design focuses on:

- Clear information hierarchy
- Simple navigation
- Consistent components
- Responsive layouts
- Accessible interactions
- Useful feedback states
- Visual consistency
- Product-oriented workflows

---

# Theme Support

CivicFix supports:

- Light mode
- Dark mode

Theme switching is available across both:

- Citizen Portal
- Admin Portal

---

# Responsive Design

The application is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

Responsive behavior is implemented across:

- Navigation
- Dashboards
- Forms
- Cards
- Tables
- Issue views
- Admin interfaces
- Citizen interfaces
- Map interfaces

---

# Error Handling

CivicFix includes frontend handling for common API failures.

Instead of exposing raw technical messages such as:

```text
Failed to fetch
```

the application provides user-friendly feedback.

Example:

> Unable to connect to CivicFix. Please check your connection and try again.

Where appropriate, users are provided with retry functionality.

The application also includes:

- Loading states
- Empty states
- Error states
- Retry states
- Protected-route handling

---

# Production Deployment

CivicFix is deployed using a modern cloud architecture.

```text
                         GITHUB
                            │
                            │
                 Source Repository
                            │
             ┌──────────────┴──────────────┐
             │                             │
             ▼                             ▼
          VERCEL                         RENDER
             │                             │
             │ React + Vite                │ Node + Express
             │                             │
             │                             ▼
             │                           NEON
             │                             │
             │                        PostgreSQL
             │
             └───────────────┐
                             │
                         CIVICFIX
```

### Frontend

Hosted on:

**Vercel**

Responsible for:

- React application
- Vite production build
- Client-side routing
- Static assets

---

### Backend

Hosted on:

**Render**

Responsible for:

- Express server
- REST APIs
- Authentication
- Authorization
- Issue management
- Notifications
- Database communication

---

### Database

Hosted on:

**Neon PostgreSQL**

Responsible for:

- Users
- Issues
- Departments
- Issue updates
- Notifications

---

# Production Health Check

The deployed backend exposes:

```text
GET /api/health
```

A successful production response confirms:

```text
Backend
   ↓
Database Connection
   ↓
PostgreSQL
```

Example:

```json
{
  "success": true,
  "message": "CivicFix API is running",
  "database": "connected"
}
```

---

# Product Thinking

CivicFix was designed around the **complete lifecycle of a civic issue**.

The goal was not simply:

```text
Create Form → Save Data
```

Instead, the product workflow is:

```text
PROBLEM
   ↓
CITIZEN REPORT
   ↓
ISSUE CREATED
   ↓
ADMIN REVIEW
   ↓
DEPARTMENT ASSIGNMENT
   ↓
ISSUE PROCESSING
   ↓
STATUS UPDATE
   ↓
CITIZEN NOTIFICATION
   ↓
RESOLUTION
```

This approach treats the application as an operational product rather than a basic CRUD system.

---

# Potential Product Impact

CivicFix can help improve civic issue management through:

### Better Citizen Experience

Citizens receive greater visibility into their submitted reports.

### Better Administrative Visibility

Administrators receive a centralized view of civic issues.

### Better Accountability

Issue updates create a clearer activity history.

### Better Resource Allocation

Department-level data can help identify areas requiring attention.

### Better Civic Data

Aggregated issue information can help identify recurring infrastructure problems.

---

# Project Highlights

- Full-stack civic issue management platform
- React + Vite frontend
- Node.js + Express backend
- PostgreSQL database
- Neon production database
- Vercel frontend deployment
- Render backend deployment
- JWT authentication
- bcrypt password hashing
- Role-based authorization
- Citizen portal
- Admin portal
- Civic issue reporting
- Photo evidence upload
- Cloud media storage
- Department assignment
- Issue lifecycle management
- Issue timeline/history
- Notification system
- Map-based issue monitoring
- Analytics dashboard
- Responsive design
- Light/Dark mode
- Loading states
- Empty states
- Error states
- Retry functionality
- REST API architecture
- Modular backend architecture
- Product-focused UI/UX

---

# What This Project Demonstrates

## Frontend Development

- React
- Vite
- Component-based architecture
- React Router
- REST API integration
- Client-side state management
- Responsive UI
- Protected routes
- Loading states
- Empty states
- Error states
- Dark mode
- Map integration
- Data visualization

---

## Backend Development

- Node.js
- Express.js
- REST API architecture
- Controllers
- Routes
- Middleware
- JWT authentication
- Role-based authorization
- Password hashing
- File upload handling
- Cloud media integration
- Error handling
- Environment configuration

---

## Database

- PostgreSQL
- Relational data modeling
- Foreign keys
- Database relationships
- CRUD operations
- Production database deployment
- Neon PostgreSQL

---

## UI/UX

- Product-oriented interface design
- Information hierarchy
- Responsive layouts
- Dark mode
- User feedback states
- Form design
- Dashboard design
- Data visualization
- Map-based interfaces
- Consistent interaction patterns

---

## Product Thinking

- User role definition
- End-to-end workflows
- Citizen experience
- Administrative experience
- Operational dashboards
- Issue lifecycle management
- Department ownership
- Notifications
- Transparency
- Accountability

---

# Future Improvements

The current version of CivicFix is deployed and functional. Future product iterations could include:

- Real-time WebSocket notifications
- Email notifications
- Push notifications
- AI-assisted issue categorization
- Duplicate issue detection
- AI-based issue priority scoring
- Citizen feedback and ratings
- SLA and response-time tracking
- Advanced administrative analytics
- Heatmaps for issue density
- Advanced GIS functionality
- Public transparency dashboard
- Citizen engagement features
- Mobile application
- Advanced security controls
- Audit logging
- Automated issue routing
- Department performance metrics

---

# Project Status

| Module                  | Status      |
| ----------------------- | ----------- |
| Frontend                | ✅ Complete |
| Backend                 | ✅ Complete |
| Authentication          | ✅ Complete |
| Authorization           | ✅ Complete |
| Citizen Portal          | ✅ Complete |
| Admin Portal            | ✅ Complete |
| Issue Reporting         | ✅ Complete |
| Photo Evidence          | ✅ Complete |
| Notifications           | ✅ Complete |
| Department Assignment   | ✅ Complete |
| Issue Timeline          | ✅ Complete |
| Map Monitoring          | ✅ Complete |
| Analytics               | ✅ Complete |
| Responsive Design       | ✅ Complete |
| Dark Mode               | ✅ Complete |
| API Error Handling      | ✅ Complete |
| Database Integration    | ✅ Complete |
| Production Database     | ✅ Deployed |
| Backend Deployment      | ✅ Deployed |
| Frontend Deployment     | ✅ Deployed |
| Production Health Check | ✅ Verified |

---

# Developer

## Aneesh Rao S V

**Frontend Developer · UI/UX Enthusiast**

Interested in building digital products that combine:

**Design + Engineering + Product Thinking**

### Areas of Interest

- Frontend Development
- UI/UX Design
- Product Development
- Web Development
- Startups
- Product Thinking

---

# 🔗 Links

### GitHub

[github.com/aneeshrao0207/CivicFix](https://github.com/aneeshrao0207/CivicFix)

### Live Application

[Open CivicFix](https://civicfix-three-rouge.vercel.app/)

---

# 📜 License

CivicFix is currently developed as a personal portfolio and academic project.

The project is not currently intended to represent an officially deployed government service.

License information can be updated if the project is later released as an open-source project.

---

<div align="center">

## CivicFix

### Report. Track. Resolve.

Built with ❤️ and Passion by **Aneesh Rao S V**

</div>
```
