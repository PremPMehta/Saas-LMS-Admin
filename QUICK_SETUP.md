# 🚀 SaaS LMS Admin - Quick Setup

## 📥 Clone & Setup
```bash
git clone https://github.com/PremPMehta/Saas-LMS-Admin.git
cd Saas-LMS-Admin
```

## ⚙️ Backend (Terminal 1)
```bash
cd server
npm install
cp env.example .env
# Edit .env with your MongoDB credentials
node seed.js
npm run dev
```

## 🎨 Frontend (Terminal 2)
```bash
cd client
npm install
npm start
```

## 🌐 Access
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5001
- **Login:** admin@multi-admin.com / Password@123

## 🔑 MongoDB Credentials
- **Username:** premarch567
- **Password:** Z6qcWJ8m6iv4ZqRW
- **Cluster:** cluster0.lyzxobt.mongodb.net

## 📱 .env Template
```env
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb+srv://premarch567:Z6qcWJ8m6iv4ZqRW@cluster0.lyzxobt.mongodb.net/saas-lms-admin?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
```

## 🐛 Common Issues
- **Port in use:** `lsof -i :5001` or `lsof -i :3000`
- **Network error:** Ensure both servers are running
- **MongoDB error:** Check credentials and IP whitelist

---
**Full Guide:** See `SETUP_GUIDE.md` for detailed instructions
