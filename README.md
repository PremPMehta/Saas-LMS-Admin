# LMS Admin Dashboard

A comprehensive Learning Management System (LMS) admin dashboard for managing multiple academies.

## Features

### Academy Management
- **Create Academies**: Add new academies with comprehensive details
- **Edit Academies**: Update existing academy information
- **View Academy Details**: Preview academy information with a beautiful card layout
- **Delete Academies**: Remove academies with confirmation
- **Search & Filter**: Find academies by name, subdomain, plan, or status

### Academy Status Management
- **Active**: Academy is fully operational (Green indicator)
- **Inactive**: Academy is temporarily disabled (Red indicator)
- **Onhold**: Academy is on hold/pending (Orange indicator)

### Preview Card System
- **Add/Edit Modal**: Live preview card shows academy details as you fill the form
- **View Dialog**: Same preview card layout when viewing academy details
- **Real-time Updates**: Preview updates as you type and select options

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Nodemon** for development

### Frontend
- **React.js** with functional components and hooks
- **Material-UI (MUI)** for beautiful, responsive UI
- **Context API** for state management
- **React Router** for navigation

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lms-admin
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # In the server directory, create a .env file or use the start script
   cd ../server
   ./start.sh
   ```

4. **Start the development servers**
   ```bash
   # Start the backend server (from server directory)
   npm run dev
   
   # Start the frontend server (from client directory)
   npm start
   ```

### Default Admin Credentials
- **Email**: admin@multi-admin.com
- **Password**: Password@123

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Academies
- `GET /api/academies` - Get all academies
- `POST /api/academies` - Create new academy
- `GET /api/academies/:id` - Get academy by ID
- `PUT /api/academies/:id` - Update academy
- `DELETE /api/academies/:id` - Delete academy

## Academy Fields

### Required Fields
- **Name**: Academy name (max 100 characters)
- **Address**: Complete academy address (max 500 characters)
- **Contact Name**: Point of contact person
- **Contact Number**: Phone number with country code
- **Subdomain**: Unique subdomain (3-20 characters, lowercase, numbers, hyphens only)
- **Logo**: Academy logo (JPEG, PNG, GIF, WebP, max 2MB)
- **Subscription Plan**: Basic, Standard, or Premium

### Optional Fields
- **Status**: Active, Inactive, or Onhold (defaults to Active)
- **Students**: Number of students (defaults to 0)
- **Courses**: Number of courses (defaults to 0)

## UI Features

### Responsive Design
- Mobile-friendly interface
- Adaptive layouts for different screen sizes
- Touch-friendly interactions

### Modern UI/UX
- Material Design principles
- Smooth animations and transitions
- Intuitive navigation
- Beautiful gradient backgrounds
- Card-based layouts

### Interactive Elements
- Real-time form validation
- Live preview cards
- Confirmation dialogs
- Loading states
- Error handling

## Development

### Project Structure
```
lms-admin/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   └── features/      # Redux slices
│   └── public/            # Static assets
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── config/           # Configuration files
└── README.md
```

### Key Components

#### AcademiesList
- Displays all academies in a table format
- Search and pagination functionality
- Action buttons for view, edit, and delete
- Status indicators with colors and icons

#### AddAcademyModal
- Comprehensive form for creating/editing academies
- Real-time validation
- Live preview card
- File upload for academy logo
- Status selection with visual cards

#### Preview Card
- Consistent design across add/edit and view modes
- Shows academy logo, name, and domain
- Displays contact information
- Shows subscription plan and status chips
- Responsive layout

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
