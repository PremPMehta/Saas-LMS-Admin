#!/bin/bash

echo "🚀 LMS System Deployment Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install git first."
    exit 1
fi

# Check if node is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Checking current directory..."
if [ ! -f "package.json" ] && [ ! -f "client/package.json" ]; then
    print_error "Please run this script from the project root directory."
    exit 1
fi

print_status "Installing dependencies..."

# Install backend dependencies
print_status "Installing backend dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install backend dependencies"
    exit 1
fi
cd ..

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install frontend dependencies"
    exit 1
fi
cd ..

print_status "Building frontend for production..."
cd client
npm run build
if [ $? -ne 0 ]; then
    print_error "Failed to build frontend"
    exit 1
fi
cd ..

print_status "✅ Local build completed successfully!"
echo ""
print_status "Next steps for deployment:"
echo ""
echo "1. 🖥️  Deploy Backend to Render:"
echo "   - Go to https://render.com"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repository"
echo "   - Set Root Directory to: server"
echo "   - Set Build Command to: npm install"
echo "   - Set Start Command to: npm start"
echo ""
echo "2. 🌐 Deploy Frontend to Netlify:"
echo "   - Go to https://netlify.com"
echo "   - Drag & drop the client/build folder"
echo "   - Or connect GitHub and set build settings"
echo ""
echo "3. 🔧 Update API URL:"
echo "   - After backend deployment, update the API URL in client/src/config/api.js"
echo "   - Replace 'your-render-backend-url.onrender.com' with your actual Render URL"
echo ""
echo "4. 🔄 Redeploy Frontend:"
echo "   - After updating API URL, rebuild and redeploy frontend"
echo ""

print_warning "Make sure to set up environment variables in your hosting platform!"
print_warning "Backend environment variables needed:"
echo "   - NODE_ENV=production"
echo "   - MONGO_URI=your-mongodb-connection-string"
echo "   - JWT_SECRET=your-jwt-secret"
echo "   - JWT_EXPIRE=30d"
echo ""
print_warning "Frontend environment variables needed:"
echo "   - REACT_APP_API_URL=https://your-backend-url.onrender.com"
echo ""

print_status "🎉 Deployment script completed! Follow the steps above to go live."
