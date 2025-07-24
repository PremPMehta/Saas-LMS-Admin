# BBR Tek Admin Panel

A modern React-based admin panel built with Material-UI (MUI) featuring a responsive design with dark/light theme support.

## Features

- 🎨 **Material-UI Design**: Modern and responsive UI components
- 🌓 **Theme Support**: Toggle between light and dark modes
- 📱 **Responsive Layout**: Works on desktop, tablet, and mobile devices
- 🧭 **Navigation**: Sidebar with main navigation links
- 🔍 **Search Functionality**: Global search in the navbar
- 👤 **User Profile**: Profile dropdown with settings and logout options
- 📊 **Dashboard**: Overview with statistics and quick actions

## Tech Stack

- React 18
- Material-UI (MUI) v5
- React Router DOM
- Axios (for API calls)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the client directory:
   ```bash
   cd client
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/
│   └── layout/
│       ├── Sidebar.js      # Main navigation sidebar
│       └── Navbar.js       # Top navigation bar
├── contexts/
│   └── ThemeContext.js     # Theme management context
├── pages/
│   └── Dashboard.js        # Dashboard page component
├── App.js                  # Main application component
└── index.js               # Application entry point
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Customization

### Brand Colors

The primary brand color is set to `rgb(255, 111, 12)` (orange). You can modify this in the `ThemeContext.js` file.

### Adding New Pages

1. Create a new component in the `src/pages/` directory
2. Add a route in `App.js`
3. Add a navigation item in `Sidebar.js`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
