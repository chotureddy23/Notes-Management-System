# SmartNotes — Authentication Guide

This document provides a guide for user authentication and session management in the SmartNotes Management System.

---

## 1. Authentication Architecture Overview

SmartNotes uses a secure, token-based authentication system:
- **Email & Password Authentication**: Email address normalization + Bcrypt password hashing + JWT session tokens.
- **Role-Based Profiles**: Automatically manages user roles (e.g., Student, Computer Science Student).
- **Default Category Provisioning**: First-time registered users are automatically provisioned with the 8 starter subject categories (Programming, Database, AI & Machine Learning, Web Development, Mathematics, Science, Personal, Other).
- **Session Protection**: All protected API endpoints (`/api/notes`, `/api/categories`, `/api/dashboard`, `/api/users`) require a valid Bearer token in the `Authorization` header.

---

## 2. API Endpoints

### Public Endpoints:
- `POST /api/auth/register`: Create a new user account with `name`, `email`, `password`, `confirmPassword`.
- `POST /api/auth/login`: Authenticate an existing user with `email` and `password`. Returns JWT token and user profile.

### Protected Endpoints:
- `GET /api/auth/me`: Get current authenticated user profile (`Authorization: Bearer <token>`).

---

## 3. Demo Account

For testing, evaluation, and demonstration purposes:
- **Email**: `demo@smartnotes.com`
- **Password**: `password123`
- The login page includes a collapsible "College Project Demo Account" helper providing one-click login for this demo account.
