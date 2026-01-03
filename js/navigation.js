// Navigation System for GSMEAC Backpacking Planner

// Section order definition
const SECTIONS = [
  'welcome',
  'ground',
  'situation',
  'mission',
  'execution',
  'administration',
  'commandcontrol',
  'review'
];

// Current section tracking
let currentSection = 'welcome';

/**
 * Initialize navigation system
 */
function initNavigation() {
  console.log('Navigation system initializing...');

  // Set up hash change listener for URL routing
  window.addEventListener('hashchange', handleHashChange);

  // Set up progress bar click handlers
  setupProgressBarHandlers();

  // Set up Back/Next button handlers
  setupNavigationButtonHandlers();

  // Check if there's a hash in URL on load
  const hash = window.location.hash.substring(1); // Remove the #
  if (hash && SECTIONS.includes(hash)) {
    navigateToSection(hash);
  } else if (state && state.meta && state.meta.currentSection) {
    // Load last visited section from state
    navigateToSection(state.meta.currentSection);
  } else {
    // Default to welcome
    navigateToSection('welcome');
  }

  console.log('Navigation system initialized');
}

/**
 * Navigate to a specific section
 * @param {string} sectionId - The section to navigate to (without 'section-' prefix)
 */
function navigateToSection(sectionId) {
  if (!SECTIONS.includes(sectionId)) {
    console.error(`Invalid section: ${sectionId}`);
    return;
  }

  console.log(`Navigating to section: ${sectionId}`);

  // Hide all sections
  hideAllSections();

  // Show target section
  showSection(sectionId);

  // Update progress bar
  updateProgressBar(sectionId);

  // Update current section tracking
  currentSection = sectionId;

  // Save current section to state
  updateState('meta.currentSection', sectionId);

  // Update URL hash (without triggering hashchange event)
  if (window.location.hash !== `#${sectionId}`) {
    window.history.replaceState(null, null, `#${sectionId}`);
  }

  // Scroll to top
  window.scrollTo(0, 0);
}

/**
 * Show a specific section
 * @param {string} sectionId - The section to show
 */
function showSection(sectionId) {
  const section = document.getElementById(`section-${sectionId}`);
  if (!section) {
    console.error(`Section not found: section-${sectionId}`);
    return;
  }

  // Show the section
  section.classList.add('active');

  // Show/hide progress bar based on section
  const progressNav = document.getElementById('progress-nav');
  if (progressNav) {
    if (sectionId === 'welcome') {
      progressNav.classList.add('hidden');
    } else {
      progressNav.classList.remove('hidden');
    }
  }

  // Section-specific initialization
  if (sectionId === 'administration') {
    // Update food days suggestion when entering administration section
    if (typeof updateFoodDaysSuggestion === 'function') {
      updateFoodDaysSuggestion();
    }
  }

  if (sectionId === 'review') {
    // Update review summary when entering review section
    if (typeof updateReviewSummary === 'function') {
      updateReviewSummary();
    }
  }

  // Display validation warnings for this section
  if (typeof displaySectionWarnings === 'function') {
    displaySectionWarnings(sectionId);
  }
}

/**
 * Hide all sections
 */
function hideAllSections() {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.classList.remove('active');

    // Clear validation warnings for each section
    const sectionId = section.id.replace('section-', '');
    if (typeof clearSectionWarnings === 'function') {
      clearSectionWarnings(sectionId);
    }
  });
}

/**
 * Update progress bar highlighting
 * @param {string} sectionId - The current section
 */
function updateProgressBar(sectionId) {
  const progressSteps = document.querySelectorAll('.progress-step');

  progressSteps.forEach(step => {
    const stepSection = step.getAttribute('data-section');

    // Remove all state classes
    step.classList.remove('active', 'completed');

    if (stepSection === sectionId) {
      // Highlight current section
      step.classList.add('active');
    } else if (isSectionCompleted(stepSection, sectionId)) {
      // Mark earlier sections as completed
      step.classList.add('completed');
    }
  });
}

/**
 * Check if a section is completed (i.e., comes before current section)
 * @param {string} sectionId - Section to check
 * @param {string} currentSectionId - Current section
 * @returns {boolean}
 */
function isSectionCompleted(sectionId, currentSectionId) {
  const sectionIndex = SECTIONS.indexOf(sectionId);
  const currentIndex = SECTIONS.indexOf(currentSectionId);

  // Section is completed if it comes before current section
  // Exclude welcome from completion tracking
  return sectionIndex > 0 && sectionIndex < currentIndex;
}

/**
 * Handle hash change events (browser back/forward)
 */
function handleHashChange() {
  const hash = window.location.hash.substring(1); // Remove the #

  if (hash && SECTIONS.includes(hash)) {
    navigateToSection(hash);
  }
}

/**
 * Set up progress bar click handlers
 */
function setupProgressBarHandlers() {
  const progressSteps = document.querySelectorAll('.progress-step');

  progressSteps.forEach(step => {
    step.addEventListener('click', () => {
      const targetSection = step.getAttribute('data-section');
      if (targetSection) {
        navigateToSection(targetSection);
      }
    });
  });
}

/**
 * Set up Back/Next navigation button handlers
 */
function setupNavigationButtonHandlers() {
  document.addEventListener('click', (event) => {
    const target = event.target;

    // Handle Back button
    if (target.hasAttribute('data-nav') && target.getAttribute('data-nav') === 'back') {
      event.preventDefault();
      navigateToPreviousSection();
    }

    // Handle Next button
    if (target.hasAttribute('data-nav') && target.getAttribute('data-nav') === 'next') {
      event.preventDefault();
      navigateToNextSection();
    }
  });
}

/**
 * Navigate to the next section
 */
function navigateToNextSection() {
  const currentIndex = SECTIONS.indexOf(currentSection);

  if (currentIndex < SECTIONS.length - 1) {
    const nextSection = SECTIONS[currentIndex + 1];
    navigateToSection(nextSection);
  }
}

/**
 * Navigate to the previous section
 */
function navigateToPreviousSection() {
  const currentIndex = SECTIONS.indexOf(currentSection);

  if (currentIndex > 0) {
    const previousSection = SECTIONS[currentIndex - 1];
    navigateToSection(previousSection);
  }
}

/**
 * Get the next section ID
 * @returns {string|null}
 */
function getNextSection() {
  const currentIndex = SECTIONS.indexOf(currentSection);

  if (currentIndex < SECTIONS.length - 1) {
    return SECTIONS[currentIndex + 1];
  }

  return null;
}

/**
 * Get the previous section ID
 * @returns {string|null}
 */
function getPreviousSection() {
  const currentIndex = SECTIONS.indexOf(currentSection);

  if (currentIndex > 0) {
    return SECTIONS[currentIndex - 1];
  }

  return null;
}
