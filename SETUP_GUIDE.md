# 🚀 SaaS LMS Admin - Local Development Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB Atlas Account** (for cloud database) or **Local MongoDB**

## 🔗 Repository Information

**Repository URL:** `https://github.com/your-username/Saas-LMS-Admin.git`  
**Branch:** `main` (or `master`)

## 📥 Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-username/Saas-LMS-Admin.git

# Navigate to the project directory
cd Saas-LMS-Admin

# Verify the project structure
ls -la
```

## 🗂️ Project Structure

```
Saas-LMS-Admin/
├── client/          # React frontend application
├── server/          # Node.js backend application
├── README.md        # Project documentation
└── SETUP_GUIDE.md  # This setup guide
```

## ⚙️ Step 2: Backend Setup

### 2.1 Navigate to Server Directory
```bash
cd server
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Environment Configuration
```bash
# Copy the environment template
cp env.example .env

# Edit the .env file with your MongoDB credentials
nano .env  # or use your preferred editor
```

### 2.4 Update Environment Variables
Edit the `.env` file with your MongoDB connection details:

```env
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/saas-lms-admin?retryWrites=true&w=majority&appName=YourApp
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
```

**Important:** Replace the following placeholders:
- `your_username`: Your MongoDB Atlas username
- `your_password`: Your MongoDB Atlas password
- `your_cluster`: Your MongoDB Atlas cluster name
- `YourApp`: Your application name

### 2.5 Seed the Database
```bash
# Create initial admin user
node seed.js
```

**Expected Output:**
```
Connected to MongoDB
Default admin user created successfully
Email: admin@multi-admin.com
Password: Password@123
Disconnected from MongoDB
```

### 2.6 Start the Backend Server
```bash
# Development mode with auto-restart
npm run dev

# OR Production mode
npm start
```

**Expected Output:**
```
🚀 Server running on port 5001
🌍 Environment: development
📊 Database: mongodb+srv://...
✅ MongoDB Connected: ...
✅ Default admin user already exists
📧 Email: admin@multi-admin.com
🎯 BBR Tek Admin Server is ready!
```

## 🎨 Step 3: Frontend Setup

### 3.1 Open a New Terminal Window
Keep the backend server running in the current terminal.

### 3.2 Navigate to Client Directory
```bash
cd client
```

### 3.3 Install Dependencies
```bash
npm install
```

### 3.4 Start the Frontend Application
```bash
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view client in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

## 🌐 Step 4: Access the Application

### 4.1 Backend API
- **URL:** http://localhost:5001
- **Status:** Check http://localhost:5001/api/health (if endpoint exists)

### 4.2 Frontend Application
- **URL:** http://localhost:3000
- **Login Credentials:**
  - **Email:** `admin@multi-admin.com`
  - **Password:** `Password@123`

## 🔧 Step 5: Development Workflow

### 5.1 Running Both Servers
You need **two terminal windows** running simultaneously:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm start
```

### 5.2 Available Scripts

**Backend (server/):**
```bash
npm run dev      # Start with nodemon (auto-restart)
npm start        # Start production server
npm test         # Run tests (if configured)
```

**Frontend (client/):**
```bash
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
npm run eject    # Eject from Create React App
```

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. Port Already in Use
```bash
# Check what's using the port
lsof -i :5001    # For backend
lsof -i :3000    # For frontend

# Kill the process
kill -9 <PID>
```

#### 2. MongoDB Connection Failed
- Verify your MongoDB Atlas credentials
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure the database name is correct in the connection string

#### 3. Dependencies Installation Failed
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. Frontend Build Errors
```bash
# Clear React cache
rm -rf node_modules/.cache
npm start
```

### 4. Network Error on Login
If you get "Network error" when trying to log in:
1. Ensure the backend server is running on port 5001
2. Check if the frontend can reach the backend
3. Verify the API endpoints in the frontend code

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user profile

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

## 🗄️ Database Models

### User Model
- `email`: String (unique, required)
- `password`: String (hashed, required)
- `role`: String (enum: 'admin', 'user')
- `status`: String (enum: 'active', 'inactive')

### Academy Model
- `name`: String (required)
- `description`: String
- `status`: String (enum: 'active', 'inactive')
- `maxStudents`: Number
- `maxEducators`: Number

### Plan Model
- `name`: String (required)
- `price`: Number (required)
- `period`: String (enum: 'month', 'year')
- `features`: Array of Strings
- `maxAcademies`: Number
- `maxStudentsPerAcademy`: Number
- `maxEducatorsPerAcademy`: Number

## 🚀 Deployment Notes

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5001
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRE=30d
```

### Build Commands
```bash
# Frontend
cd client
npm run build

# Backend
cd server
npm start
```

## 📞 Support

If you encounter any issues during setup:

1. **Check the logs** in both terminal windows
2. **Verify all prerequisites** are installed
3. **Ensure ports 3000 and 5001** are available
4. **Check MongoDB connection** credentials
5. **Review this guide** for troubleshooting steps

## 🎯 Quick Start Summary

```bash
# 1. Clone and setup
git clone <repository-url>
cd Saas-LMS-Admin

# 2. Backend setup
cd server
npm install
cp env.example .env
# Edit .env with your MongoDB credentials
node seed.js
npm run dev

# 3. Frontend setup (new terminal)
cd client
npm install
npm start

# 4. Access the app
# Backend: http://localhost:5001
# Frontend: http://localhost:3000
# Login: admin@multi-admin.com / Password@123
```

---

**Happy Coding! 🎉**

For additional support, refer to the main README.md file or contact the development team.
