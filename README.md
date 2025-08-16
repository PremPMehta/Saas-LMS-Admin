# SaaS-LMS Admin - Technical Documentation

## Project Overview

SaaS-LMS Admin is a comprehensive Learning Management System (LMS) administration platform designed for educational institutions and training organizations. The system provides centralized management of academies, courses, users, and learning plans with role-based access control and real-time analytics.

The platform enables administrators to manage multiple academies, create subscription plans, monitor user activities, and generate insights through an intuitive dashboard interface. It supports scalable operations with configurable limits, automated user provisioning, and a secure first-time login experience.

## 🚀 Latest Updates (v2.0)

### New Features Added:
- **First-Time Login System**: Mandatory password change for new users with strength validation
- **Dynamic KPI Cards**: Real-time data display from database instead of static values
- **Enhanced User Creation**: Professional modal with default password notification
- **Token Management**: Automatic token refresh and error handling
- **Database Seeding**: Complete sample data population scripts
- **Security Improvements**: Enhanced JWT validation and password policies
- **UI/UX Enhancements**: Modern, responsive design with better user feedback

## Core Features

### User Management
- **Role-based Access Control**: Admin, Standard User roles with granular permissions
- **User Registration & Authentication**: Secure login with JWT token-based sessions
- **First-Time Login Flow**: Mandatory password change with strength validation
- **Profile Management**: User profile updates and status management
- **Default Password System**: Secure initial password setup (Password@123)
- **Bulk Operations**: Mass user creation and management capabilities

### Academy Management
- **Multi-Academy Support**: Manage multiple educational institutions
- **Academy Configuration**: Customizable settings per academy
- **Student & Educator Limits**: Configurable capacity management
- **Status Tracking**: Active/Inactive academy status monitoring

### Plan Management
- **Subscription Plans**: Flexible pricing tiers (Basic, Pro, Premium, Enterprise)
- **Feature Configuration**: Customizable plan features and limitations
- **Billing Periods**: Monthly/Annual subscription options
- **Popular Plan Highlighting**: Featured plan designation

### Dashboard & Analytics
- **Real-time KPIs**: Dynamic user counts, academy statistics, plan metrics from database
- **Visual Analytics**: Interactive charts and data visualization
- **Performance Monitoring**: System health and usage statistics
- **Dynamic Descriptions**: Contextual KPI descriptions (e.g., "3 active, 1 inactive")
- **Export Capabilities**: Data export in multiple formats

### Security & Authentication
- **JWT Token Authentication**: Secure API access control with automatic expiration handling
- **Protected Routes**: Role-based endpoint protection
- **Session Management**: Automatic token refresh and validation
- **First-Time Password Security**: Mandatory password change with strength requirements
- **Password Policies**: Uppercase, lowercase, number, special character requirements
- **Token Error Handling**: Automatic cleanup and redirect on authentication failures
- **Data Encryption**: Sensitive data protection with bcrypt hashing

## Tech Stack

### Frontend
- **React.js**: Component-based UI framework
- **Material-UI (MUI)**: Design system and component library
- **React Router**: Client-side routing and navigation
- **Context API**: State management for themes and authentication
- **Axios**: HTTP client for API communication

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **JWT**: JSON Web Token authentication
- **bcryptjs**: Password hashing and security
- **CORS**: Cross-origin resource sharing

### Database
- **MongoDB**: NoSQL document database
- **Mongoose**: MongoDB object modeling
- **MongoDB Compass**: Database management tool

### Development Tools
- **ESLint**: Code quality and consistency
- **Git**: Version control system
- **npm**: Package management

## Folder Structure

```
lms-admin/
├── client/                          # React frontend application
│   ├── public/                      # Static assets and HTML template
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── dashboard/           # Dashboard-specific components
│   │   │   ├── layout/              # Layout and navigation components
│   │   │   └── users/               # User management components
│   │   ├── contexts/                # React context providers
│   │   ├── features/                # Redux slices and state management
│   │   ├── pages/                   # Main application pages
│   │   └── routes/                  # Application routing configuration
│   └── package.json                 # Frontend dependencies
├── server/                          # Node.js backend application
│   ├── config/                      # Database and configuration files
│   ├── controllers/                 # Request handlers and business logic
│   ├── middleware/                  # Custom middleware functions
│   ├── models/                      # MongoDB schema definitions
│   ├── routes/                      # API route definitions
│   ├── seed.js                      # Database seeding scripts
│   └── server.js                    # Main server entry point
└── README.md                        # Project documentation
```

## System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React UI Components]
        Router[React Router]
        Context[Context Providers]
    end
    
    subgraph "API Layer"
        Auth[Authentication Middleware]
        Controllers[API Controllers]
        Routes[Express Routes]
    end
    
    subgraph "Data Layer"
        Models[Mongoose Models]
        DB[(MongoDB Database)]
    end
    
    UI --> Router
    Router --> Context
    Context --> Auth
    Auth --> Controllers
    Controllers --> Routes
    Routes --> Models
    Models --> DB
    
    style UI fill:#e1f5fe
    style Auth fill:#fff3e0
    style DB fill:#f3e5f5
```

## Role-Based Access Flow

```mermaid
flowchart TD
    A[User Login] --> B{Authentication}
    B -->|Valid Credentials| C[Role Check]
    B -->|Invalid| D[Login Failed]
    
    C -->|Admin Role| E[Admin Dashboard]
    C -->|Standard User| F[User Dashboard]
    
    E --> G[Manage Academies]
    E --> H[Manage Plans]
    E --> I[Manage Users]
    E --> J[View Analytics]
    
    F --> K[View Academies]
    F --> L[View Plans]
    F --> M[Limited Analytics]
    
    G --> N[Create/Edit Academies]
    H --> O[Create/Edit Plans]
    I --> P[Create/Edit Users]
    J --> Q[Full System Access]
    
    K --> R[Read-Only Access]
    L --> S[Read-Only Access]
    M --> T[Limited Data Access]
    
    style E fill:#4caf50
    style F fill:#2196f3
    style D fill:#f44336
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication (returns isFirstLogin status)
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/change-first-password` - First-time password change (protected)

### Academies
- `GET /api/academies` - List all academies
- `POST /api/academies` - Create new academy
- `PUT /api/academies/:id` - Update academy
- `DELETE /api/academies/:id` - Delete academy

### Plans
- `GET /api/plans` - List all plans
- `POST /api/plans` - Create new plan
- `PUT /api/plans/:id` - Update plan
- `DELETE /api/plans/:id` - Delete plan

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Data Models

### User Model
- `email`: String (unique, required)
- `password`: String (hashed, required)
- `firstName`: String (required)
- `lastName`: String (required)
- `phoneNumber`: String
- `countryCode`: String (default: '+91')
- `role`: String (enum: 'admin', 'user')
- `status`: String (enum: 'active', 'inactive', 'pending')
- `isFirstLogin`: Boolean (default: true)
- `lastLoginAt`: Date
- `isProfileComplete`: Boolean (default: false)
- `createdAt`: Date
- `updatedAt`: Date

### Academy Model
- `name`: String (required)
- `address`: String (required)
- `contactName`: String (required)
- `contactNumber`: String (required)
- `countryCode`: String (required)
- `subdomain`: String (unique, required)
- `fullDomain`: String (unique, required)
- `logo`: String (required, URL)
- `subscriptionPlan`: String (required)
- `status`: String (enum: 'Active', 'Inactive', 'Onhold')
- `students`: Number (default: 0)
- `courses`: Number (default: 0)
- `createdBy`: ObjectId (ref: User)
- `createdAt`: Date
- `updatedAt`: Date

### Plan Model
- `name`: String (required)
- `price`: String (required, e.g., "$29")
- `period`: String (enum: 'month', 'year', 'quarter')
- `features`: Array of Strings (required)
- `limits`: String (required, e.g., "1 academy, 100 students")
- `maxAcademies`: Number (required)
- `maxStudentsPerAcademy`: Number (required)
- `maxEducatorsPerAcademy`: Number (required)
- `popular`: Boolean (default: false)
- `status`: String (enum: 'Active', 'Inactive', 'Onhold')
- `createdBy`: ObjectId (ref: User)
- `createdAt`: Date
- `updatedAt`: Date

## Security Considerations

- **Password Hashing**: All passwords are hashed using bcryptjs
- **JWT Tokens**: Secure token-based authentication with expiration
- **Protected Routes**: Role-based middleware for API endpoint protection
- **Input Validation**: Server-side validation for all user inputs
- **CORS Configuration**: Proper cross-origin request handling
- **Environment Variables**: Sensitive configuration stored in environment files

## Performance Optimization

- **Component Optimization**: React.memo and useMemo for expensive operations
- **Lazy Loading**: Code splitting for better initial load times
- **Database Indexing**: Optimized MongoDB queries with proper indexing
- **Caching**: Client-side caching for frequently accessed data
- **Bundle Optimization**: Minimized and compressed production builds

## Quick Setup Guide

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Saas-LMS-Admin.git
   cd Saas-LMS-Admin
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cp env.example .env
   # Edit .env file with your MongoDB URI and JWT secret
   node seed.js          # Create admin user
   node seedData.js      # Populate sample data
   npm run dev           # Start backend server (port 5001)
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   npm start            # Start frontend server (port 3000)
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - Default Admin: admin@multi-admin.com / Password@123

### Environment Variables

Create a `.env` file in the `server` directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/saasLmsAdmin
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
PORT=5001
```

### First-Time User Experience

1. **Admin Creates User**: Default password is `Password@123`
2. **User First Login**: Mandatory password change modal appears
3. **Password Change**: Strong password required (8+ chars, mixed case, numbers, symbols)
4. **System Access**: Full access granted after successful password change

## Demo Credentials

### Admin Account
- **Email**: admin@multi-admin.com
- **Password**: Password@123
- **Role**: Administrator (full access)

### Test User Account
- **Email**: demouser@example.com
- **Password**: DemoPassword@456 (after first-time password change)
- **Role**: Administrator

## Troubleshooting

### Common Issues

1. **"Not authorized, token failed"**
   - Clear browser local storage
   - Login again to get fresh token

2. **"Network error. Please try again."**
   - Ensure backend is running on port 5001
   - Check CORS configuration

3. **Database connection issues**
   - Verify MongoDB URI in .env file
   - Check IP whitelist in MongoDB Atlas
   - Ensure database name matches URI

4. **KPI Cards showing 0**
   - Clear browser storage for fresh authentication
   - Verify database has seeded data

### Debug Steps

1. Check backend logs for errors
2. Verify database connection
3. Test API endpoints with curl/Postman
4. Clear browser cache and storage
5. Restart both frontend and backend servers

