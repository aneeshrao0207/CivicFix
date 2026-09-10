# CivicFix

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JAVASCRIPT-JAVASCRIPT-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/REACT-REACT-61DAFB?style=for-the-badge&logo=react&logoColor=black)

![Node.js](https://img.shields.io/badge/NODE.JS-NODE.JS-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/EXPRESS-EXPRESS-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/POSTGRESQL-POSTGRESQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/AUTH-JWT-FF9800?style=for-the-badge)
![REST API](https://img.shields.io/badge/API-REST-6F42C1?style=for-the-badge)

![Responsive](https://img.shields.io/badge/RESPONSIVE-YES-3AAA00?style=for-the-badge)
![Dark Mode](https://img.shields.io/badge/DARK%20MODE-AVAILABLE-8E00A8?style=for-the-badge)
![Status](https://img.shields.io/badge/STATUS-COMPLETED-3AAA00?style=for-the-badge)

</div>

---

## Report. Track. Resolve.

CivicFix is a full-stack civic issue reporting and management platform designed to connect citizens, administrators, and responsible departments through a structured digital workflow.

---

## 📌 Overview

CivicFix is designed to make reporting, tracking, and managing civic problems simpler, faster, and more transparent.

Citizens can report issues such as:

- Potholes
- Garbage accumulation
- Drainage problems
- Damaged infrastructure
- Road-related issues
- Public maintenance problems
- Other civic issues

Administrators can review submitted reports, assign them to the appropriate department, update issue status, monitor activity, and analyze the overall issue landscape.

The complete journey of a civic issue is managed through one platform.

```text
Citizen
   ↓
Report an Issue
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

### 💡 Core Idea

> Citizens should not only be able to report a problem — they should be able to understand what happens after they report it.

CivicFix bridges the gap between **citizen reporting and administrative resolution** through a structured digital workflow.

---

# ✨ Why CivicFix?

Reporting a civic issue should not feel like shouting into the void.

Traditional complaint systems can make it difficult for citizens to know:

- Where to report a problem
- Whether their complaint was received
- Who is responsible for resolving it
- What stage the issue is currently in
- Whether any action has been taken
- When the issue is expected to be resolved

CivicFix approaches the problem as a complete **report-to-resolution workflow** rather than simply providing a complaint form.

### The Problem

```text
Civic Issue
     ↓
Citizen Reports It
     ↓
Limited Visibility
     ↓
Unclear Ownership
     ↓
Poor Status Tracking
     ↓
Limited Communication
```

### The CivicFix Approach

```text
Civic Issue
     ↓
Citizen Report
     ↓
Centralized Management
     ↓
Admin Review
     ↓
Department Assignment
     ↓
Status Tracking
     ↓
Citizen Notification
     ↓
Resolution
```

### What CivicFix Solves

| Problem                         | CivicFix Solution              |
| ------------------------------- | ------------------------------ |
| Difficult issue reporting       | Structured reporting interface |
| No visibility after reporting   | Issue status tracking          |
| Unclear responsibility          | Department assignment          |
| Poor communication              | Notification system            |
| Scattered issue management      | Centralized admin dashboard    |
| Limited operational visibility  | Analytics and map monitoring   |
| Poor experience during failures | User-friendly API error states |

---

# Objectives

CivicFix is built around five core objectives.

### 1. Simplify Civic Issue Reporting

Provide citizens with a clear and structured way to report problems in their surroundings.

### 2. Improve Issue Transparency

Allow citizens to track the progress of their submitted reports.

### 3. Centralize Issue Management

Give administrators a dedicated platform to view, organize, monitor, and manage civic issues.

### 4. Improve Communication

Keep citizens informed through notifications and status updates.

### 5. Connect Issues with Responsible Departments

Allow administrators to assign reported issues to the appropriate departments.

---

# 👥 User Roles

CivicFix has two primary user roles.

```text
                         CIVICFIX
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
        CITIZEN PORTAL              ADMIN PORTAL
              │                           │
       Report Issues                Manage Issues
       Track Reports                Assign Departments
       Notifications                Update Status
       Profile                      Analytics
                                    Map Monitoring
                                    Notifications
```

## 👤 Citizen

Citizens can:

- Register an account
- Log in
- Report civic issues
- View submitted reports
- Track issue status
- View issue details
- Receive notifications
- Manage their profile
- Change their password
- Log out
- Switch between light and dark mode

## 🛡️ Administrator

Administrators can:

- Log in securely
- View all reported issues
- Search and filter issues
- View issue details
- Assign departments
- Update issue status
- Monitor issues on a map
- View analytics
- Manage notifications
- Manage profile
- Change password
- Log out

---

# CivicFix Workflow

The complete issue lifecycle follows this workflow:

```text
                    ┌─────────────────┐
                    │     CITIZEN     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Report Issue   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    REST API     │
                    │  Authentication │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Issue Created  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ ADMIN DASHBOARD │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │Assign Department│
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Issue Processing│
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Update Status   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    NOTIFY       │
                    │     CITIZEN     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    RESOLVED     │
                    └─────────────────┘
```

---

# System Architecture

```text
┌──────────────────────────────────────────────────────┐
│                     CIVICFIX                         │
├──────────────────────────────────────────────────────┤
│                                                      │
│                     FRONTEND                         │
│                                                      │
│              React + Vite + Router                  │
│                                                      │
│       ┌────────────────┐  ┌────────────────┐         │
│       │ Citizen Portal │  │  Admin Portal  │         │
│       └───────┬────────┘  └───────┬────────┘         │
│               │                   │                  │
├───────────────┴───────────────────┴──────────────────┤
│                                                      │
│                    REST API                          │
│                                                      │
│                 Node.js + Express                    │
│                                                      │
│    ┌──────────┐ ┌──────────┐ ┌──────────────┐        │
│    │   Auth   │ │  Issues  │ │Notifications │        │
│    └──────────┘ └──────────┘ └──────────────┘        │
│                                                      │
│              ┌──────────────┐                        │
│              │ Departments  │                        │
│              └──────────────┘                        │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│                    DATABASE                          │
│                                                      │
│                    PostgreSQL                        │
│                                                      │
│     Users · Issues · Departments · Notifications     │
│                    Issue Updates                     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

| Technology   | Purpose                       |
| ------------ | ----------------------------- |
| React.js     | User interface                |
| Vite         | Development and build tooling |
| React Router | Application routing           |
| JavaScript   | Application logic             |
| CSS          | Responsive styling            |
| Lucide React | Interface icons               |

---

## Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

| Technology | Purpose                    |
| ---------- | -------------------------- |
| Node.js    | Server runtime             |
| Express.js | REST API                   |
| JWT        | Authentication             |
| bcryptjs   | Password hashing           |
| dotenv     | Environment configuration  |
| CORS       | Cross-origin communication |

---

## Database

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

| Technology | Purpose                |
| ---------- | ---------------------- |
| PostgreSQL | Relational database    |
| pg         | PostgreSQL integration |

---

## Development Tools

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![VS Code](https://img.shields.io/badge/VS%20Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)

- Git
- GitHub
- Visual Studio Code
- Postman
- pgAdmin

---

# Database Design

CivicFix uses PostgreSQL with a relational database structure.

## Main Tables

```text
users
│
├── issues
│    │
│    └── issue_updates
│
└── notifications

departments
│
└── issues
```

### Users

Stores citizen and administrator accounts.

### Issues

Stores civic reports submitted by citizens.

### Issue Updates

Stores updates associated with individual issues.

### Notifications

Stores notifications associated with users and issues.

### Departments

Stores departments responsible for handling civic issues.

---

# Database Relationships

```text
                         USERS
                           │
                 ┌─────────┴─────────┐
                 │                   │
                 ▼                   ▼
              ISSUES            NOTIFICATIONS
                 │                   │
        ┌────────┴────────┐          │
        │                 │          │
        ▼                 ▼          │
 DEPARTMENTS       ISSUE_UPDATES     │
                          │          │
                          └────┬─────┘
                               │
                              USERS
```

### Foreign Keys

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

# Authentication & Authorization

CivicFix uses role-based authentication.

```text
                  Authentication
                        │
               ┌────────┴────────┐
               │                 │
            Citizen             Admin
               │                 │
               ▼                 ▼
       Citizen Portal      Admin Portal
```

### Authentication Features

- User registration
- User login
- JWT-based authentication
- Password hashing
- Protected API routes
- Role-based authorization
- Admin-only functionality
- Citizen-only functionality
- Logout
- Password change

Passwords are hashed using `bcryptjs` before being stored in the database.

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

## Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
PATCH  /api/auth/profile
PATCH  /api/auth/password
```

## Notifications

```text
GET    /api/notifications
PATCH  /api/notifications/:id/read
```

## Health

```text
GET /api/health
```

The API is organized into separate modules for authentication, citizens, issues, departments, notifications, and system health.

---

# 👤 Citizen Portal

## Dashboard

Citizens can view an overview of their submitted issues.

The dashboard includes:

- Total reports
- Pending reports
- In-progress reports
- Resolved reports
- Recent reports
- Loading states
- Empty states
- Error states
- Retry functionality

---

## Report an Issue

Citizens can submit civic issues through a structured reporting interface.

A report can contain:

- Issue title
- Description
- Category
- Location
- Relevant information

Once submitted, the issue enters the CivicFix management workflow.

---

## My Reports

Citizens can view all issues they have submitted.

The interface provides:

- Report list
- Issue status
- Issue category
- Submission information
- Issue details navigation

---

## Issue Details

Citizens can open an individual report to view:

- Issue information
- Current status
- Issue details
- Progress information
- Relevant updates

---

## Notifications

Citizens receive notifications related to their submitted issues.

Examples include:

- Status changes
- Administrative updates
- Issue activity

Citizens can mark notifications as read.

---

## Profile

Citizens can:

- View profile information
- Update profile information
- Change password
- Log out
- Switch themes

---

# 🛡️ Admin Portal

## Admin Dashboard

The Admin Dashboard provides an operational overview of CivicFix.

It includes:

- Total issues
- Pending issues
- In-progress issues
- Resolved issues
- Recent activity
- Department information

---

## Issue Management

Administrators can:

- View all reported issues
- Search issues
- Filter issues
- Open issue details
- Monitor issue status
- Assign departments
- Update issue progress

---

## Issue Details

Administrators can:

- Review issue information
- Review reporter information
- Assign responsible departments
- Update issue status
- Monitor issue activity

---

## Map Monitoring

CivicFix includes a map-based monitoring interface for viewing reported civic issues geographically.

The map provides administrators with a spatial overview of reported problems.

---

## Analytics

The analytics interface provides visibility into civic issue data.

It can be used to understand:

- Issue distribution
- Status distribution
- Department workload
- Issue categories
- Resolution activity

---

## Admin Notifications

Administrators have a dedicated notification interface for monitoring relevant platform activity.

---

## Admin Profile

Administrators can manage:

- Profile information
- Password
- Account session
- Theme preferences

---

# UI/UX Design

CivicFix follows a modern product-oriented design philosophy.

### Design Principles

- Minimal
- Clean
- Consistent
- Responsive
- Accessible
- Product-focused
- Easy to navigate
- Clear information hierarchy

The interface is designed to feel like a real-world civic technology product rather than a basic academic CRUD application.

---

# Dark Mode

CivicFix supports:

- Light mode
- Dark mode

Theme switching is available across both:

- Citizen Portal
- Admin Portal

---

# Responsive Design

CivicFix is designed for:

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

---

# Error Handling

CivicFix includes frontend handling for API failures.

Instead of exposing raw browser errors such as:

```text
Failed to fetch
```

the application provides user-friendly feedback.

Example:

> Unable to connect to CivicFix. Please check your connection and try again.

Retry functionality is provided where appropriate.

---

# 📂 Project Structure

```text
CivicFix/
│
├── backend/
│   │
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── db/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── src/
│   │
│   ├── components/
│   ├── layouts/
│   │
│   ├── pages/
│   │   ├── citizen/
│   │   └── admin/
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── context/
│   ├── assets/
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── public/
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
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
- My Reports
- Issue Details
- Notifications
- Profile
- Password change
- API error states
- Retry functionality
- Responsive layouts
- Dark mode

## Admin Testing

- Login
- Logout
- Dashboard
- Issue management
- Issue details
- Department assignment
- Map
- Analytics
- Notifications
- Profile
- API error states
- Responsive layouts
- Dark mode

---

# Security Considerations

### Password Security

Passwords are hashed using `bcryptjs`.

### Authentication

JWT tokens are used to authenticate protected requests.

### Authorization

Role-based middleware restricts access to appropriate functionality.

### Environment Variables

Sensitive backend configuration is stored through environment variables.

### CORS

Cross-origin access is controlled through backend configuration.

---

# Product Thinking

CivicFix was designed around the complete lifecycle of a civic issue rather than simply creating a complaint form.

```text
PROBLEM
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
CITIZEN NOTIFICATION
   │
   ▼
RESOLUTION
```

The central product idea is:

> Citizens should not only be able to report a problem — they should be able to understand what happens after they report it.

---

# Potential Impact

CivicFix can improve civic issue management through:

### Better Citizen Experience

Citizens receive visibility into the progress of their reports.

### Better Administrative Visibility

Administrators receive a centralized operational view.

### Better Accountability

Issue updates create a clearer record of activity.

### Better Resource Allocation

Departments can understand where issues are concentrated.

### Better Civic Data

Aggregated issue data can help identify recurring infrastructure problems.

---

# Project Highlights

- Full-stack civic issue management platform
- Separate Citizen and Admin portals
- Role-based authentication
- JWT authentication
- Secure password hashing
- PostgreSQL database
- REST API architecture
- Civic issue lifecycle management
- Department assignment
- Notification system
- Map-based issue monitoring
- Analytics interface
- Responsive design
- Light/Dark theme support
- API error handling
- Retry states
- Loading states
- Empty states
- Modular React architecture
- Product-focused UI/UX

---

# What This Project Demonstrates

## Frontend Development

- React
- Component-based architecture
- React Router
- REST API integration
- State management
- Responsive UI
- Loading states
- Empty states
- Error states

## Backend Development

- Node.js
- Express.js
- REST APIs
- Middleware
- Authentication
- Authorization
- API architecture

## Database

- PostgreSQL
- Relational data modeling
- Foreign keys
- Database relationships
- CRUD operations

## UI/UX

- Product-oriented interface design
- Information hierarchy
- Responsive layouts
- Dark mode
- User feedback states
- Accessible interactions

## Product Thinking

- User roles
- End-to-end workflows
- Operational dashboards
- Issue lifecycle
- Citizen experience
- Administrative experience

---

# Future Improvements

Potential future improvements include:

- Image attachments for reports
- GPS-based location capture
- Real-time notifications
- Email notifications
- Push notifications
- AI-assisted issue categorization
- Duplicate issue detection
- Citizen feedback and ratings
- SLA and response-time tracking
- Advanced administrative analytics
- AI-based issue priority scoring
- Advanced GIS functionality
- Dedicated mobile application
- Public transparency dashboard
- Cloud deployment
- Advanced security controls

---

# Project Status

| Module               | Status      |
| -------------------- | ----------- |
| Frontend             | ✅ Complete |
| Backend              | ✅ Complete |
| Authentication       | ✅ Complete |
| Citizen Portal       | ✅ Complete |
| Admin Portal         | ✅ Complete |
| Responsive Design    | ✅ Complete |
| Dark Mode            | ✅ Complete |
| API Error Handling   | ✅ Complete |
| Database Integration | ✅ Complete |
| Testing              | 🔄 Ongoing  |
| Deployment           | ⏳ Planned  |

---

# Developer

## Aneesh Rao S V

**Frontend Developer · UI/UX Enthusiast**

Interested in building digital products that combine:

**Design + Engineering + Product Thinking**

---

# Project Vision

CivicFix is more than a complaint submission system.

It is an attempt to create a better connection between:

```text
              CITIZENS
                  │
                  ▼
            CIVIC ISSUES
                  │
                  ▼
            ADMINISTRATION
                  │
                  ▼
             DEPARTMENTS
                  │
                  ▼
             RESOLUTION
                  │
                  ▼
              CITIZENS
```

The long-term vision is to create a civic technology platform where reporting a problem is only the beginning — not the end of the citizen experience.

---

# 📜 License

This project is currently intended as a personal portfolio and academic project.

License information can be updated when the project is officially released as an open-source project.

---

<p align="center">

## CivicFix

### Report. Track. Resolve.

Built with ❤️ for better civic experiences.

</p>

https://github.com/aneeshrao0207/CivicFix
