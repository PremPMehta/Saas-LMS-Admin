#!/bin/bash

# Set environment variables
export NODE_ENV=development
export PORT=5001
export MONGO_URI=mongodb://localhost:27017/lms-admin
export JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
export JWT_EXPIRE=30d

# Start the server
npm run dev 