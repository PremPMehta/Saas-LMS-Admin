# Database Credentials

## MongoDB Atlas Connection Details

**Connection String:**

```
mongodb+srv://premarch567:reGzH94BB9DmqLPJ@cluster0.lyzxobt.mongodb.net/saas-lms-admin?retryWrites=true&w=majority&appName=Cluster0
```

**Username:** `premarch567`
**Password:** `reGzH94BB9DmqLPJ`
**Cluster:** `cluster0.lyzxobt.mongodb.net`
**Database:** `saas-lms-admin`

## Environment Variables

The server uses the following environment variables:

```env
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb+srv://premarch567:reGzH94BB9DmqLPJ@cluster0.lyzxobt.mongodb.net/saas-lms-admin?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
```

## Notes

- The server is currently running on port 5001
- Database connection is working successfully
- The `.env` file should be created in the `/server` directory
- Make sure to keep these credentials secure and not commit them to version control

## Troubleshooting

If you encounter database connection issues:

1. Check if the `.env` file exists in the server directory
2. Verify the MongoDB Atlas cluster is running
3. Ensure the IP address is whitelisted in MongoDB Atlas
4. Check if the password is correct (updated: reGzH94BB9DmqLPJ)

## Database Information

**Current Active Database:** `saas-lms-admin`
**Communities:** 1 (Crypto Manji Academy)
**Courses:** 16 courses available
**Users:** 9 community users

## Last Updated

January 2025
