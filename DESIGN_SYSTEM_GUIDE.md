# SaaS-LMS Admin - Design System Guide

## 🎨 Color Palette & Design System

This document outlines the complete design system, color palette, and styling guidelines for the SaaS-LMS Admin platform.

## 🌈 Primary Color Palette

### Material-UI Theme Colors

```javascript
// Primary Colors (Blue)
primary: {
  main: '#0F3C60',      // Main blue
  light: '#42a5f5',     // Light blue
  dark: '#1565c0',      // Dark blue
  contrastText: '#ffffff'
}

// Secondary Colors (Purple)
secondary: {
  main: '#9c27b0',      // Main purple
  light: '#ba68c8',     // Light purple
  dark: '#7b1fa2',      // Dark purple
  contrastText: '#ffffff'
}
```

### Google-Inspired Accent Colors

```javascript
// Status & Role Colors
const accentColors = {
  // Google Blue (Admin/System)
  adminBlue: "#0F3C60",

  // Google Green (Student/Success)
  studentGreen: "#34a853",

  // Google Yellow (Warning/Attention)
  warningYellow: "#fbbc04",

  // Google Red (Error/Danger)
  errorRed: "#ea4335",

  // Neutral Colors
  white: "#ffffff",
  black: "#000000",
  lightGray: "#f0f0f0",
  mediumGray: "#666666",
  darkGray: "#2d2d2d",
};
```

## 🌓 Light & Dark Mode Support

### Light Mode Colors

```css
/* Background Colors */
background: {
  default: '#f8fafc',    // Main background
  paper: '#ffffff',      // Card/paper background
  sidebar: 'rgba(255, 255, 255, 0.98)'
}

/* Text Colors */
text: {
  primary: '#1a202c',    // Main text
  secondary: '#4a5568',  // Secondary text
  disabled: '#a0aec0'    // Disabled text
}

/* Border Colors */
border: 'rgba(0, 0, 0, 0.08)'
divider: 'rgba(0, 0, 0, 0.08)'
```

### Dark Mode Colors

```css
/* Background Colors */
background: {
  default: '#0a0a0a',    // Main background
  paper: '#1a1a1a',      // Card/paper background
  sidebar: 'rgba(26, 26, 26, 0.98)'
}

/* Text Colors */
text: {
  primary: '#ffffff',    // Main text
  secondary: '#a0aec0',  // Secondary text
  disabled: 'rgba(255, 255, 255, 0.3)'
}

/* Border Colors */
border: 'rgba(255, 255, 255, 0.08)'
divider: 'rgba(255, 255, 255, 0.08)'
```

## 🎯 Component-Specific Colors

### User Role Colors

```javascript
// Avatar Background Colors
const roleColors = {
  student: "#34a853", // Green for students
  admin: "#0F3C60", // Blue for admins
  community: "#0F3C60", // Blue for community admins
};
```

### Status Colors

```javascript
// KPI Card Colors
const statusColors = {
  active: "#34a853", // Green for active items
  inactive: "#ea4335", // Red for inactive items
  pending: "#fbbc04", // Yellow for pending items
  onhold: "#666666", // Gray for on-hold items
};
```

### Interactive Element Colors

```javascript
// Hover & Focus States
const interactiveColors = {
  hover: {
    light: "#e0e0e0", // Light mode hover
    dark: "#505050", // Dark mode hover
  },
  focus: {
    light: "#f5f5f5", // Light mode focus
    dark: "#404040", // Dark mode focus
  },
};
```

## 🎨 Gradient Backgrounds

### Main Gradients

```css
/* Dashboard Background */
background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)  /* Light mode */
background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)  /* Dark mode */

/* Sidebar Logo Background */
background: linear-gradient(135deg, #0F3C60 0%, #42a5f5 100%)

/* Text Gradients */
background: linear-gradient(45deg, #0F3C60, #42a5f5)
background-clip: text
-webkit-background-clip: text
-webkit-text-fill-color: transparent
```

## 📐 Typography System

### Font Family

```css
font-family: "Lato", "Roboto", "Montserrat", "Arial", sans-serif;
```

### Font Weights

```css
font-weight: {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800
}
```

### Font Sizes

```css
/* Heading Sizes */
h1: 2.5rem (40px)
h2: 2rem (32px)
h3: 1.75rem (28px)
h4: 1.5rem (24px)
h5: 1.25rem (20px)
h6: 1rem (16px)

/* Body Text */
body1: 1rem (16px)
body2: 0.875rem (14px)
caption: 0.75rem (12px)
```

## 🎭 Component Styling Guidelines

### Cards & Containers

```css
/* Card Styling */
.card {
  background: white (light) / #1a1a1a (dark)
  border: 1px solid rgba(0, 0, 0, 0.08) (light) / rgba(255, 255, 255, 0.08) (dark)
  border-radius: 12px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
  padding: 24px
}
```

### Buttons

```css
/* Primary Button */
.primary-button {
  background: #0F3C60
  color: #ffffff
  border-radius: 8px
  padding: 12px 24px
  font-weight: 600
  transition: all 0.2s ease
}

.primary-button:hover {
  background: #1565c0
  transform: translateY(-1px)
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3)
}
```

### Form Elements

```css
/* Text Field */
.text-field {
  background: transparent
  border: 1px solid rgba(0, 0, 0, 0.23)
  border-radius: 8px
  padding: 16px
  transition: all 0.2s ease
}

.text-field:focus {
  border-color: #0F3C60
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2)
}
```

## 🎪 Animation & Transitions

### Standard Transitions

```css
/* Hover Effects */
transition: all 0.2s ease

/* Scale Effects */
transform: scale(1.05)

/* Slide Effects */
transform: translateX(4px)
transform: translateY(-1px)

/* Shadow Effects */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)
```

### Loading Animations

```css
/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Grow Animation */
@keyframes grow {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

## 📱 Responsive Design

### Breakpoints

```css
/* Material-UI Breakpoints */
xs: 0px      // Extra small devices
sm: 600px    // Small devices
md: 900px    // Medium devices
lg: 1200px   // Large devices
xl: 1536px   // Extra large devices
```

### Responsive Typography

```css
/* Responsive Font Sizes */
fontSize: {
  xs: '0.8rem',    // Mobile
  sm: '0.9rem',    // Tablet
  md: '1rem',      // Desktop
  lg: '1.5rem'     // Large desktop
}
```

## 🎨 Icon System

### Icon Colors

```javascript
// Status Icons
const iconColors = {
  success: "#34a853", // CheckCircle, School
  info: "#0F3C60", // Info, Admin
  warning: "#fbbc04", // Warning, Security
  error: "#ea4335", // Error, Person
  neutral: "#666666", // Default icons
};
```

### Icon Sizes

```css
/* Standard Icon Sizes */
small: 16px
medium: 24px
large: 32px
xlarge: 40px
```

## 🎯 Usage Guidelines

### Color Usage Rules

1. **Primary Blue (#0F3C60)**: Use for main actions, links, and primary elements
2. **Secondary Purple (#9c27b0)**: Use for secondary actions and accents
3. **Success Green (#34a853)**: Use for success states, positive metrics
4. **Warning Yellow (#fbbc04)**: Use for warnings and attention-grabbing elements
5. **Error Red (#ea4335)**: Use for errors, deletions, and negative states

### Accessibility

- Ensure sufficient color contrast (4.5:1 minimum)
- Don't rely solely on color to convey information
- Provide alternative indicators for color-blind users

### Dark Mode Considerations

- Always test components in both light and dark modes
- Use theme-aware colors from the Material-UI theme
- Ensure text remains readable in both modes

## 🛠️ Implementation

### Using Colors in Components

```javascript
// In Material-UI components
sx={{
  color: 'primary.main',           // Theme color
  backgroundColor: '#34a853',      // Direct color
  borderColor: theme => theme.palette.mode === 'light' ? '#e0e0e0' : '#404040'
}}

// In CSS
.custom-component {
  background: var(--primary-color);
  color: var(--text-primary);
}
```

### Theme Integration

```javascript
// Access theme colors
const theme = useTheme();
const primaryColor = theme.palette.primary.main;
const isDarkMode = theme.palette.mode === "dark";
```

---

**Design System Version**: 2.0  
**Last Updated**: Current  
**Maintained By**: Development Team

_This design system ensures consistency across all components and provides a solid foundation for future development._
