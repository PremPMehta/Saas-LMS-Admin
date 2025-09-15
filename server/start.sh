#!/bin/bash

# Set environment variables
export NODE_ENV=development
export PORT=5001
export MONGO_URI=mongodb+srv://premarch567:Z6qcWJ8m6iv4ZqRW@cluster0.lyzxobt.mongodb.net/saas-lms-admin?retryWrites=true&w=majority&appName=Cluster0
export JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
export JWT_EXPIRE=30d

# Start the server
npm run dev 