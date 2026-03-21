# FlipHealth RBAC system

## Overview

This project is a scalable backend system for a healthcare platform similar to FlipHealth.

it support:

- Doctor Consultation

- Online Pharmacy

- Health Management

- Role-Based Access Control (RBAC)

## Tech Stack

- Node.js

- TypeScript

- Express.js

- MySQL

- Sequelize ORM

- JWT Authentication

- RBAC Authorization

## Architecture Overview

Client (Web / Mobile)
  ↓ 
API Gateway
  ↓ 
Auth Middleware (JWT) 
  ↓ 
RBAC Middleware 
  ↓ 
Controllers → Services → DB

## Authentication Flow

Login Request → 
  Validate User → 
  Verify Password → 
  Fetch Roles → 
  Fetch Permissions → 
  Build Policies → 
  Generate JWT → 
  Send Token

## Authorization (RBAC)

- User Type → High-level access (super_admin, admin, customer)

- Role → Business domain (pharmacy_management, user_management)

- Permission → Action-level access (create, update, view)

⚡ Super Admin Behavior

Stored in user_type

Bypasses all RBAC checks

No need to store permissions in JWT

if (user.user_type === "super_admin") {
  return next();
}

## High-Level Design (HLD)
## Low-Level Design (LLD)
## Database Design

* user Table:

Field	    Type	  Description
id	      int	    Primary Key
user_type	enum	  super_admin, admin, customer
name	    string	User name
email	    string	Unique
password	string	Hashed
status	  boolean	Active/Inactive

* Roles Table:

Field	  Type
id	    int
name	  string
code	  string

* User Roles Table:

Field	    Type
id         int
user_id	  int
role_id	  int

* Modules Table:

Field	    Type
id	      int
name	    string
code	    string

* Actions Table:

Field	   Type
id	    int
name	  string
code	  string

* Module Actions Table:

Field	      Type
module_id	  int
action_id	  int

* Permission Roles Table:

Field	            Type
role_id	          int
module_action_id	int

🔄 RBAC Flow
User →
  UserRoles →
    Roles →
      PermissionRoles →
        ModuleActions →
          Module + Action

## JWT Structure

{ 
  "id": 1,  
  "user_type": "admin", 
  "policies": [ 
    { 
      "module": "pharmacy", 
      "actions": ["create", "view"] 
    } 
  ] 
}

## Middleware Design
* userPolicy (Authentication)

Verifies JWT

Attaches user to request

req.user = decodedToken;

* userAccess (Authorization)

userAccess(module, action)

Checks if user has permission

Allows or blocks request

## Project Structure
src/ 
├── config/ 
├── models/ 
├── controllers/ 
├── services/ 
├── middlewares/ 
├── routes/ 
├── helpers/ 
└── utils/

## Key Features

✅ JWT Authentication

✅ RBAC Authorization

✅ Super Admin Bypass

✅ Scalable for Microservices

✅ Clean Sequelize Models

✅ Policy-based Access Control