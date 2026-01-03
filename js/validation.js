// Validation System for GSMEAC Backpacking Planner
// Handles field validation and warning display

// Critical fields that should not be empty
const CRITICAL_FIELDS = {
  ground: [
    { field: 'terrainTypes', message: 'Select at least one terrain type', type: 'array' },
    { field: 'trailType', message: 'Select a trail type', type: 'string' }
  ],
  situation: [
    { field: 'travelType', message: 'Specify if traveling solo or in a group', type: 'string' },
    { field: 'experienceLevel', message: 'Select your experience level', type: 'string' }
  ],
  season: [
    { field: 'season', message: 'Select the season for your trip', type: 'string' }
  ],
  mission: [
    { field: 'statement', message: 'Write a mission statement for your trip', type: 'string' }
  ],
  execution: [
    { field: 'dailyPlan', message: 'Add at least one day to your itinerary', type: 'array' }
  ],
  commandControl: [
    { field: 'homeContactName', message: 'Provide a home contact name', type: 'string' },
    { field: 'expectedCheckIn', message: 'Set an expected check-in date', type: 'string' }
  ]
};

// Debounce timer for validation
let validationDebounceTimer = null;
const VALIDATION_DEBOUNCE_DELAY = 300;

/**
 * Validate a single field
 * @param {*} value - Field value to validate
 * @param {string} type - Type of validation ('string', 'array', 'number')
 * @returns {boolean} True if valid, false otherwise
 */
function validateField(value, type) {
  switch (type) {
    case 'string':
      return typeof value === 'string' && value.trim() !== '';
    case 'array':
      return Array.isArray(value) && value.length > 0;
    case 'number':
      return typeof value === 'number' && value >= 0;
    default:
      return false;
  }
}

/**
 * Validate a specific section
 * @param {string} sectionName - Name of section to validate
 * @returns {Array} Array of warning messages
 */
function validateSection(sectionName) {
  const warnings = [];
  const criticalFields = CRITICAL_FIELDS[sectionName];

  if (!criticalFields) {
    return warnings;
  }

  criticalFields.forEach(fieldDef => {
    const fieldPath = `${sectionName}.${fieldDef.field}`;
    const value = getState(fieldPath);

    if (!validateField(value, fieldDef.type)) {
      warnings.push({
        field: fieldDef.field,
        message: fieldDef.message
      });
    }
  });

  return warnings;
}

/**
 * Validate all sections and update state
 * @param {boolean} immediate - Skip debouncing if true
 */
function runValidation(immediate = false) {
  if (immediate) {
    performValidation();
  } else {
    // Clear existing timer
    if (validationDebounceTimer) {
      clearTimeout(validationDebounceTimer);
    }

    // Set new timer
    validationDebounceTimer = setTimeout(performValidation, VALIDATION_DEBOUNCE_DELAY);
  }
}

/**
 * Perform the actual validation
 */
function performValidation() {
  if (!state) return;

  const validationWarnings = {};
  const sections = ['ground', 'situation', 'season', 'mission', 'execution', 'commandControl'];

  sections.forEach(section => {
    validationWarnings[section] = validateSection(section);
  });

  // Update state with validation warnings
  state.meta.validationWarnings = validationWarnings;

  // Update progress bar badges
  updateProgressBarBadges();

  console.log('Validation completed:', validationWarnings);
}

/**
 * Update progress bar warning badges
 */
function updateProgressBarBadges() {
  if (!state || !state.meta.validationWarnings) return;

  const sectionMap = {
    'ground': 'ground',
    'situation': 'situation',
    'season': 'situation', // Season warnings appear on situation section
    'mission': 'mission',
    'execution': 'execution',
    'administration': 'administration',
    'commandControl': 'commandcontrol' // Note: Different naming in DOM
  };

  // Clear all warning badges first
  document.querySelectorAll('.progress-step').forEach(step => {
    step.classList.remove('warning');
    step.removeAttribute('title');
  });

  // Add warning badges for sections with issues
  Object.keys(state.meta.validationWarnings).forEach(sectionKey => {
    const warnings = state.meta.validationWarnings[sectionKey];

    if (warnings.length > 0) {
      // Map section key to DOM element data-section attribute
      let domSectionKey = sectionMap[sectionKey] || sectionKey;

      const stepElement = document.querySelector(`.progress-step[data-section="${domSectionKey}"]`);

      if (stepElement) {
        stepElement.classList.add('warning');

        // Create tooltip with warning count
        const warningCount = warnings.length;
        const warningText = warningCount === 1
          ? '1 incomplete field'
          : `${warningCount} incomplete fields`;

        stepElement.setAttribute('title', warningText);
      }
    }
  });
}

/**
 * Display inline validation warnings for a specific section
 * @param {string} sectionName - Name of section to show warnings for
 */
function displaySectionWarnings(sectionName) {
  if (!state || !state.meta.validationWarnings) return;

  // Handle combined sections (e.g., situation includes both situation and season)
  let warningsToShow = [];

  // Get warnings for the main section
  const sectionWarnings = state.meta.validationWarnings[sectionName];
  if (sectionWarnings && sectionWarnings.length > 0) {
    warningsToShow = warningsToShow.concat(sectionWarnings.map(w => ({ ...w, section: sectionName })));
  }

  // For situation section, also include season warnings
  if (sectionName === 'situation') {
    const seasonWarnings = state.meta.validationWarnings['season'];
    if (seasonWarnings && seasonWarnings.length > 0) {
      warningsToShow = warningsToShow.concat(seasonWarnings.map(w => ({ ...w, section: 'season' })));
    }
  }

  if (warningsToShow.length === 0) return;

  // Get the section element
  const sectionElement = document.getElementById(`section-${sectionName}`);
  if (!sectionElement) return;

  // Remove existing warning messages
  const existingWarnings = sectionElement.querySelectorAll('.field-warning');
  existingWarnings.forEach(warning => warning.remove());

  // Add warning messages below critical empty fields
  warningsToShow.forEach(warning => {
    const fieldName = `${warning.section}.${warning.field}`;

    // Try to find the field element
    let fieldElement = document.querySelector(`[name="${fieldName}"], #${fieldName}`);

    // For arrays like dailyPlan, show warning in a different location
    if (!fieldElement && warning.field === 'dailyPlan') {
      // Show warning near the daily plan table
      const tableContainer = document.querySelector('.table-container');
      if (tableContainer) {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'field-warning';
        warningDiv.textContent = `⚠ ${warning.message}`;
        warningDiv.style.cssText = 'color: var(--warning); font-size: 0.875rem; margin-top: 0.5rem;';
        tableContainer.parentNode.insertBefore(warningDiv, tableContainer);
      }
      return;
    }

    // For terrain types (checkboxes)
    if (!fieldElement && warning.field === 'terrainTypes') {
      fieldElement = document.querySelector('input[name="ground.terrainTypes"]');
    }

    if (fieldElement) {
      // Find the parent form group
      let formGroup = fieldElement.closest('.form-group, .form-fieldset');

      if (formGroup) {
        // Check if warning already exists
        const existingWarning = formGroup.querySelector('.field-warning');
        if (!existingWarning) {
          const warningDiv = document.createElement('div');
          warningDiv.className = 'field-warning';
          warningDiv.textContent = `⚠ ${warning.message}`;
          warningDiv.style.cssText = 'color: var(--warning); font-size: 0.875rem; margin-top: 0.25rem;';

          // Insert after the field or after form-hint if exists
          const formHint = formGroup.querySelector('.form-hint');
          if (formHint) {
            formHint.parentNode.insertBefore(warningDiv, formHint.nextSibling);
          } else {
            formGroup.appendChild(warningDiv);
          }
        }
      }
    }
  });
}

/**
 * Check if a section is complete (no warnings)
 * @param {string} sectionName - Name of section to check
 * @returns {boolean} True if complete, false otherwise
 */
function isSectionComplete(sectionName) {
  if (!state || !state.meta.validationWarnings) return false;

  const warnings = state.meta.validationWarnings[sectionName];
  return !warnings || warnings.length === 0;
}

/**
 * Get validation summary for all sections
 * @returns {Object} Summary of validation status
 */
function getValidationSummary() {
  if (!state || !state.meta.validationWarnings) return null;

  const summary = {
    totalWarnings: 0,
    sectionSummaries: {}
  };

  Object.keys(state.meta.validationWarnings).forEach(section => {
    const warnings = state.meta.validationWarnings[section];
    summary.sectionSummaries[section] = {
      warningCount: warnings.length,
      complete: warnings.length === 0
    };
    summary.totalWarnings += warnings.length;
  });

  return summary;
}

/**
 * Clear validation warnings for a section
 * @param {string} sectionName - Name of section to clear warnings for
 */
function clearSectionWarnings(sectionName) {
  const sectionElement = document.getElementById(`section-${sectionName}`);
  if (!sectionElement) return;

  const existingWarnings = sectionElement.querySelectorAll('.field-warning');
  existingWarnings.forEach(warning => warning.remove());
}
