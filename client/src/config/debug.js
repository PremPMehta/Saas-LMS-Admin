// Frontend Debug Configuration
// Set this to false to disable all debug logging
const DEBUG_MODE = false;

// Debug levels
const DEBUG_LEVELS = {
  ERROR: true,        // Always show errors
  WARN: DEBUG_MODE,   // Show warnings only in debug mode
  INFO: DEBUG_MODE,   // Show info only in debug mode
  DEBUG: DEBUG_MODE,  // Show debug only in debug mode
  API: DEBUG_MODE,    // Show API logs only in debug mode
  AUTH: DEBUG_MODE,   // Show authentication logs only in debug mode
  COURSE: DEBUG_MODE, // Show course logs only in debug mode
  USER: DEBUG_MODE,   // Show user logs only in debug mode
  SETTINGS: DEBUG_MODE, // Show settings logs only in debug mode
};

// Debug logger functions
const debugLogger = {
  error: (message, ...args) => {
    if (DEBUG_LEVELS.ERROR) {
      console.error(message, ...args);
    }
  },
  
  warn: (message, ...args) => {
    if (DEBUG_LEVELS.WARN) {
      console.warn(message, ...args);
    }
  },
  
  info: (message, ...args) => {
    if (DEBUG_LEVELS.INFO) {
      console.log(message, ...args);
    }
  },
  
  debug: (message, ...args) => {
    if (DEBUG_LEVELS.DEBUG) {
      console.log(message, ...args);
    }
  },
  
  api: (message, ...args) => {
    if (DEBUG_LEVELS.API) {
      console.log(message, ...args);
    }
  },
  
  auth: (message, ...args) => {
    if (DEBUG_LEVELS.AUTH) {
      console.log(message, ...args);
    }
  },
  
  course: (message, ...args) => {
    if (DEBUG_LEVELS.COURSE) {
      console.log(message, ...args);
    }
  },
  
  user: (message, ...args) => {
    if (DEBUG_LEVELS.USER) {
      console.log(message, ...args);
    }
  },
  
  settings: (message, ...args) => {
    if (DEBUG_LEVELS.SETTINGS) {
      console.log(message, ...args);
    }
  },
  
  // Legacy console.log replacement
  log: (message, ...args) => {
    if (DEBUG_MODE) {
      console.log(message, ...args);
    }
  }
};

export { DEBUG_MODE, DEBUG_LEVELS, debugLogger };
export default debugLogger;
