// State Management for GSMEAC Backpacking Planner
// Handles state persistence with localStorage

const STORAGE_KEY = 'gsmeac_trip_current';
const METADATA_KEY = 'gsmeac_metadata';
const BACKUP_KEYS = ['gsmeac_trip_backup_1', 'gsmeac_trip_backup_2', 'gsmeac_trip_backup_3'];

// Default initial state structure
const DEFAULT_STATE = {
  schemaVersion: '1.0',
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString(),

  trip: {
    tripName: '',
    description: '',
    tripType: 'backpacking', // 'backpacking' or 'dayhike'
    startDate: '',
    endDate: ''
  },

  ground: {
    terrainTypes: [],
    vegetation: '',
    trailType: '',
    routeCoverage: '',
    elevationNotes: '',
    mapLinks: []
  },

  situation: {
    travelType: '',
    groupSize: 1,
    experienceLevel: '',
    specialConsiderations: ''
  },

  season: {
    season: '',
    expectedWeather: '',
    weatherRisks: ''
  },

  mission: {
    statement: '',
    missionType: ''
  },

  execution: {
    travelStyle: '',
    direction: '',
    dailyPlan: []
  },

  administration: {
    travel: {
      transportToStart: '',
      transportFromEnd: '',
      specialLogistics: ''
    },
    accommodation: {
      type: '',
      nightsRequired: 0,
      bookingStatus: ''
    },
    gear: {
      checklist: [],
      notes: ''
    },
    foodFuel: {
      daysOfFood: 0,
      emergencyDays: 0,
      caloriesPerDay: 0,
      waterPerPerson: 0,
      waterSources: '',
      filtrationRequired: false,
      fuelNotes: ''
    },
    permits: {
      required: false,
      bookingDeadlines: '',
      notes: ''
    },
    navigation: {
      mapAndCompass: false,
      digitalTools: ''
    },
    firstAid: {
      kitType: '',
      plbCarried: false
    },
    costing: {
      travel: 0,
      accommodation: 0,
      food: 0,
      permits: 0,
      other: 0
    }
  },

  commandControl: {
    homeContactName: '',
    contactMethod: '',
    expectedCheckIn: '',
    emergencyInstructions: '',
    deviceCarried: '',
    groupBriefed: false
  },

  meta: {
    currentSection: 'welcome',
    completedSections: [],
    validationWarnings: {
      ground: [],
      situation: [],
      mission: [],
      execution: [],
      administration: [],
      commandControl: []
    }
  }
};

// Global state object
let state = null;

// Debounce timer for auto-save
let saveDebounceTimer = null;
const SAVE_DEBOUNCE_DELAY = 500;

/**
 * Initialize state from localStorage or use default
 * @returns {Object} The initialized state
 */
function loadState() {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);

    if (savedState) {
      const parsed = JSON.parse(savedState);
      // Update lastModified timestamp
      parsed.lastModified = new Date().toISOString();
      state = parsed;
      console.log('State loaded from localStorage');
      return state;
    }
  } catch (e) {
    console.error('Error loading state from localStorage:', e);
  }

  // Return fresh default state
  state = JSON.parse(JSON.stringify(DEFAULT_STATE));
  console.log('Using default state');
  return state;
}

/**
 * Save state to localStorage with debouncing
 * @param {boolean} immediate - Skip debouncing if true
 */
function saveState(immediate = false) {
  if (immediate) {
    performSave();
  } else {
    // Clear existing timer
    if (saveDebounceTimer) {
      clearTimeout(saveDebounceTimer);
    }

    // Set new timer
    saveDebounceTimer = setTimeout(performSave, SAVE_DEBOUNCE_DELAY);
  }
}

/**
 * Perform the actual save operation
 */
function performSave() {
  try {
    // Update lastModified timestamp
    state.lastModified = new Date().toISOString();

    // Save current state
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    // Create backup (rotate backups)
    rotateBackups();

    // Update metadata
    updateMetadata();

    console.log('State saved to localStorage');

    // Trigger save indicator update
    if (typeof updateSaveIndicator === 'function') {
      updateSaveIndicator('saved');
    }

    return true;
  } catch (e) {
    console.error('Error saving state:', e);

    // Handle quota exceeded error
    if (e.name === 'QuotaExceededError') {
      if (typeof showWarning === 'function') {
        showWarning('Storage full. Please export your plan.');
      }
      console.error('localStorage quota exceeded');
    }

    // Trigger save indicator error
    if (typeof updateSaveIndicator === 'function') {
      updateSaveIndicator('error');
    }

    return false;
  }
}

/**
 * Rotate backup copies of the state
 */
function rotateBackups() {
  try {
    // Get current state
    const currentState = localStorage.getItem(STORAGE_KEY);
    if (!currentState) return;

    // Rotate backups (3 -> 2, 2 -> 1, current -> 3)
    const backup2 = localStorage.getItem(BACKUP_KEYS[1]);
    if (backup2) {
      localStorage.setItem(BACKUP_KEYS[2], backup2);
    }

    const backup1 = localStorage.getItem(BACKUP_KEYS[0]);
    if (backup1) {
      localStorage.setItem(BACKUP_KEYS[1], backup1);
    }

    localStorage.setItem(BACKUP_KEYS[0], currentState);
  } catch (e) {
    console.warn('Error rotating backups:', e);
  }
}

/**
 * Update app metadata
 */
function updateMetadata() {
  try {
    const metadata = {
      version: '1.0',
      lastAccessed: new Date().toISOString(),
      tripCount: 1
    };
    localStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
  } catch (e) {
    console.warn('Error updating metadata:', e);
  }
}

/**
 * Update a nested property in state using dot notation
 * @param {string} path - Dot-separated path (e.g., 'trip.tripName')
 * @param {*} value - Value to set
 */
function updateState(path, value) {
  const keys = path.split('.');
  let current = state;

  // Navigate to the parent of the target property
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }

  // Set the value
  current[keys[keys.length - 1]] = value;

  // Trigger save
  saveState();

  // Trigger validation
  if (typeof runValidation === 'function') {
    runValidation();
  }

  console.log(`State updated: ${path} =`, value);
}

/**
 * Get state value by path
 * @param {string} path - Dot-separated path
 * @returns {*} The value at that path
 */
function getState(path) {
  const keys = path.split('.');
  let current = state;

  for (let key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[key];
  }

  return current;
}

/**
 * Reset state to default values
 * @param {boolean} keepBackup - Whether to save current state as backup
 */
function resetState(keepBackup = true) {
  if (keepBackup) {
    try {
      const currentState = JSON.stringify(state);
      localStorage.setItem('gsmeac_trip_before_reset', currentState);
    } catch (e) {
      console.warn('Could not save backup before reset:', e);
    }
  }

  state = JSON.parse(JSON.stringify(DEFAULT_STATE));
  saveState(true);
  console.log('State reset to default');
}

/**
 * Export state as JSON string
 * @returns {string} JSON representation of state
 */
function exportStateJSON() {
  const exportData = {
    exportVersion: '1.0',
    exportDate: new Date().toISOString(),
    application: 'GSMEAC Backpacking Planner',
    data: state
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Import state from JSON string
 * @param {string} jsonString - JSON string to import
 * @returns {boolean} Success status
 */
function importStateJSON(jsonString) {
  try {
    const imported = JSON.parse(jsonString);

    // Validate structure
    if (!imported.data || !imported.data.schemaVersion) {
      console.error('Invalid import format');
      return false;
    }

    // Update timestamps
    imported.data.lastModified = new Date().toISOString();

    // Set as current state
    state = imported.data;
    saveState(true);

    console.log('State imported successfully');
    return true;
  } catch (e) {
    console.error('Error importing state:', e);
    return false;
  }
}
