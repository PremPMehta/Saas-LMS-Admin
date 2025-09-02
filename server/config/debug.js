// Debug Configuration
// Set this to false to disable all debug logging
const DEBUG_MODE = false;

// Debug levels
const DEBUG_LEVELS = {
  ERROR: true,        // Always show errors
  WARN: DEBUG_MODE,   // Show warnings only in debug mode
  INFO: DEBUG_MODE,   // Show info only in debug mode
  DEBUG: DEBUG_MODE,  // Show debug only in debug mode
  API: DEBUG_MODE,    // Show API logs only in debug mode
  DB: DEBUG_MODE,     // Show database logs only in debug mode
  AUTH: DEBUG_MODE,   // Show authentication logs only in debug mode
  COURSE: DEBUG_MODE, // Show course logs only in debug mode
  UPLOAD: DEBUG_MODE, // Show upload logs only in debug mode
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
  
  db: (message, ...args) => {
    if (DEBUG_LEVELS.DB) {
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
  
  upload: (message, ...args) => {
    if (DEBUG_LEVELS.UPLOAD) {
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

module.exports = {
  DEBUG_MODE,
  DEBUG_LEVELS,
  debugLogger
};
