# SaaS-LMS Admin - Developer Setup Guide

## 🚀 Quick Start for New Developers

This guide will help you set up the SaaS-LMS Admin project on your local machine.

## Prerequisites

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB Atlas Account** - [Sign up here](https://www.mongodb.com/atlas)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** (VS Code recommended)

## Project Overview

This is a full-stack Learning Management System (LMS) with:

- **Frontend**: React.js with Material-UI
- **Backend**: Node.js with Express
- **Database**: MongoDB Atlas
- **Authentication**: JWT-based with role management

## 📁 Project Structure

```
Saas-LMS-Admin/
├── client/                 # React frontend (Port 3000)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── contexts/      # React context providers
│   │   └── routes/        # Application routing
│   └── package.json
├── server/                 # Node.js backend (Port 5001)
│   ├── controllers/       # API request handlers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── package.json
└── README.md
```

## 🔧 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/PremPMehta/Saas-LMS-Admin.git
cd Saas-LMS-Admin
```

### 2. Backend Setup

```bash
cd server
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory:

```env
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb+srv://premarch567:YOUR_PASSWORD_HERE@cluster0.z1nwp7a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
```

**Important**: Replace `YOUR_PASSWORD_HERE` with the actual MongoDB Atlas password.

### 4. Database Setup

```bash
# Create admin user and seed sample data
node seed.js
node seedData.js
```

### 5. Start Backend Server

```bash
npm run dev
```

The backend will run on `http://localhost:5001`

### 6. Frontend Setup

Open a new terminal and navigate to the client directory:

```bash
cd ../client
npm install
npm start
```

The frontend will run on `http://localhost:3000`

## 🔐 Default Login Credentials

### Admin Account

- **Email**: `admin@multi-admin.com`
- **Password**: `Password@123`
- **Role**: Administrator (full access)

### Test User Account

- **Email**: `demouser@example.com`
- **Password**: `Password@123` (will be prompted to change on first login)
- **Role**: Administrator

## 🗄️ Database Information

### MongoDB Atlas Connection

- **Cluster**: `cluster0.z1nwp7a.mongodb.net`
- **Database**: `saasLmsAdmin`
- **Username**: `premarch567`
- **Password**: [Contact project owner for password]

### Database Collections

- `users` - User accounts and authentication
- `academies` - Educational institutions
- `plans` - Subscription plans
- `courses` - Course content
- `communities` - Community management
- `communityusers` - Community members
- `communityadmins` - Community administrators

## 🛠️ Available Scripts

### Backend Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Run database seeding
```

### Frontend Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm run build:production  # Build optimized for production
npm test           # Run tests
```

## 🔧 Development Workflow

### 1. Making Changes

- Frontend changes: Edit files in `client/src/`
- Backend changes: Edit files in `server/`
- Both servers support hot reload during development

### 2. API Testing

- Backend API runs on `http://localhost:5001`
- Use Postman or curl to test endpoints
- Check `server/routes/` for available endpoints

### 3. Database Management

- Use MongoDB Compass for visual database management
- Connection string: Use the same MONGO_URI from .env

## 🚨 Common Issues & Solutions

### 1. "Not authorized, token failed"

```bash
# Clear browser storage and login again
# Or restart both servers
```

### 2. "Network error. Please try again."

- Ensure backend is running on port 5001
- Check if .env file is properly configured
- Verify MongoDB connection

### 3. Database connection issues

- Verify MongoDB Atlas IP whitelist includes your IP
- Check if password in .env matches MongoDB Atlas password
- Ensure cluster is running (not paused)

### 4. Port already in use

```bash
# Kill process using port 5001
lsof -ti:5001 | xargs kill -9

# Kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

## 📋 Key Features to Understand

### Authentication System

- JWT-based authentication
- Role-based access control (Admin/User)
- First-time login password change requirement
- Automatic token refresh

### User Management

- Create/edit/delete users
- Role assignment (Admin/Standard User)
- Status management (Active/Inactive/Pending)
- Bulk operations support

### Academy Management

- Multi-academy support
- Customizable settings per academy
- Student/educator limit configuration
- Status tracking

### Plan Management

- Subscription plan creation
- Feature configuration
- Billing period options
- Popular plan highlighting

## 🔍 Code Structure

### Frontend Components

- `Dashboard/` - Main dashboard components
- `Layout/` - Navigation and layout components
- `Users/` - User management components
- `Academies/` - Academy management components
- `Plans/` - Plan management components

### Backend Structure

- `controllers/` - Business logic and request handling
- `models/` - MongoDB schema definitions
- `routes/` - API endpoint definitions
- `middleware/` - Authentication and validation middleware

## 📞 Support & Contact

If you encounter any issues:

1. Check this guide first
2. Review the main README.md
3. Contact the project owner for database credentials
4. Check GitHub issues for known problems

## 🎯 Next Steps After Setup

1. **Explore the UI**: Login and navigate through all sections
2. **Test API endpoints**: Use Postman to test backend functionality
3. **Review code structure**: Understand the component hierarchy
4. **Check database**: Explore the seeded data in MongoDB Compass
5. **Make a test change**: Try modifying a component to see hot reload

---

**Happy Coding! 🚀**

_This setup guide was created to help new developers get started quickly. Keep it updated as the project evolves._
