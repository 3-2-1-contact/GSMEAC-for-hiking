// Main Application Controller for GSMEAC Backpacking Planner

// Gear Presets by Season and Trip Type
const GEAR_PRESETS = {
  dayhike: [
    'Daypack (20-30L)',
    'Water bottles/bladder',
    'Snacks/lunch',
    'Navigation (map, compass, GPS)',
    'Headlamp + batteries',
    'First aid kit',
    'Sun protection (hat, sunglasses, sunscreen)',
    'Insect repellent',
    'Rain jacket',
    'Extra warm layer',
    'Hiking clothes',
    'Knife/multitool',
    'Fire starter/matches',
    'Emergency whistle',
    'Emergency shelter (space blanket)',
    'Trekking poles',
    'Camera/phone',
    'Toiletries (TP, hand sanitizer)'
  ],
  summer: [
    'Backpack',
    'Tent / Shelter',
    'Sleeping bag (3-season)',
    'Sleeping pad',
    'Stove & fuel',
    'Cookware & utensils',
    'Water filter/purifier',
    'Water bottles/bladder',
    'Headlamp + batteries',
    'First aid kit',
    'Navigation (map, compass, GPS)',
    'Sun protection (hat, sunglasses, sunscreen)',
    'Insect repellent',
    'Lightweight rain jacket',
    'Rain pants',
    'Base layers',
    'Hiking clothes',
    'Extra socks & underwear',
    'Camp shoes',
    'Toiletries',
    'Trash bags',
    'Repair kit & duct tape',
    'Knife/multitool',
    'Fire starter'
  ],
  autumn: [
    'Backpack',
    'Tent / Shelter',
    'Sleeping bag (3-season)',
    'Sleeping pad',
    'Stove & fuel',
    'Cookware & utensils',
    'Water filter/purifier',
    'Water bottles/bladder',
    'Headlamp + batteries',
    'First aid kit',
    'Navigation (map, compass, GPS)',
    'Sun protection (hat, sunglasses, sunscreen)',
    'Rain jacket',
    'Rain pants',
    'Insulated jacket',
    'Warm base layers',
    'Beanie/warm hat',
    'Gloves',
    'Hiking clothes',
    'Extra socks & underwear',
    'Camp shoes',
    'Toiletries',
    'Trash bags',
    'Repair kit & duct tape',
    'Knife/multitool',
    'Fire starter'
  ],
  winter: [
    'Backpack (larger capacity)',
    '4-season tent',
    'Winter sleeping bag (-10°C or colder)',
    'Insulated sleeping pad',
    'Stove & extra fuel',
    'Insulated cookware',
    'Water filter/purifier',
    'Insulated water bottles',
    'Headlamp + extra batteries',
    'First aid kit (cold weather)',
    'Navigation (map, compass, GPS, altimeter)',
    'Avalanche transceiver (if applicable)',
    'Probe & shovel (if applicable)',
    'Goggles & sunglasses',
    'Heavy-duty rain/snow jacket',
    'Waterproof pants',
    'Down/synthetic insulated jacket',
    'Base layers (merino/synthetic)',
    'Mid layers (fleece)',
    'Winter beanie',
    'Warm gloves & liner gloves',
    'Balaclava/neck gaiter',
    'Gaiters',
    'Microspikes/crampons',
    'Ice axe (if needed)',
    'Insulated boots',
    'Extra socks (wool)',
    'Camp booties',
    'Toiletries',
    'Trash bags',
    'Repair kit & duct tape',
    'Knife/multitool',
    'Fire starter',
    'Emergency bivy/space blanket'
  ],
  spring: [
    'Backpack',
    'Tent / Shelter',
    'Sleeping bag (3-season)',
    'Sleeping pad',
    'Stove & fuel',
    'Cookware & utensils',
    'Water filter/purifier',
    'Water bottles/bladder',
    'Headlamp + batteries',
    'First aid kit',
    'Navigation (map, compass, GPS)',
    'Sun protection (hat, sunglasses, sunscreen)',
    'Rain jacket',
    'Rain pants',
    'Insulated jacket',
    'Warm layers',
    'Beanie/warm hat',
    'Gloves',
    'Hiking clothes',
    'Extra socks & underwear',
    'Camp shoes',
    'Toiletries',
    'Trash bags',
    'Repair kit & duct tape',
    'Knife/multitool',
    'Fire starter'
  ]
};

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', init);

/**
 * Initialize the application
 */
function init() {
  console.log('GSMEAC Backpacking Planner initializing...');

  // Load state from localStorage
  loadState();

  // Initialize navigation system
  initNavigation();

  // Set up event listeners
  setupEventListeners();

  // Populate form fields from state
  populateFormFields();

  // Run initial validation
  if (typeof runValidation === 'function') {
    runValidation(true); // immediate validation
  }

  console.log('Application initialized successfully');
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Input events for text fields (with debouncing)
  document.addEventListener('input', handleInput);

  // Change events for checkboxes, radios, selects
  document.addEventListener('change', handleChange);

  // Click events for buttons
  document.addEventListener('click', handleClick);

  console.log('Event listeners registered');
}

/**
 * Handle input events (text inputs, textareas)
 */
function handleInput(event) {
  const target = event.target;

  // Only process form inputs
  if (!target.matches('input[type="text"], input[type="date"], input[type="number"], textarea')) {
    return;
  }

  const fieldName = target.name || target.id;
  if (!fieldName) return;

  const value = target.value;

  // Update state
  updateState(fieldName, value);

  // Update trip duration if dates changed
  if (fieldName === 'trip.startDate' || fieldName === 'trip.endDate') {
    // For day hikes, auto-sync end date with start date
    if (fieldName === 'trip.startDate' && state.trip.tripType === 'dayhike') {
      state.trip.endDate = value;
      const endDateInput = document.getElementById('trip.endDate');
      if (endDateInput) {
        endDateInput.value = value;
      }
    }
    updateTripDuration();
    // Dates affect mission summary
    updateMissionSummary();
    // Update check-in date when end date changes
    updateCheckInDate();
  }

  // Update mission summary if relevant fields changed
  if (fieldName.startsWith('trip.') || fieldName.startsWith('ground.') ||
      fieldName.startsWith('situation.') || fieldName.startsWith('season.')) {
    updateMissionSummary();
  }

  // Update total cost if costing fields changed
  if (fieldName.startsWith('administration.costing.')) {
    updateTotalCost();
  }

  // Show saving indicator
  updateSaveIndicator('saving');
}

/**
 * Handle change events (checkboxes, radio buttons, selects)
 */
function handleChange(event) {
  const target = event.target;

  if (target.matches('input[type="checkbox"]')) {
    handleCheckboxChange(target);
  } else if (target.matches('input[type="radio"]')) {
    handleRadioChange(target);
  } else if (target.matches('select')) {
    handleSelectChange(target);
  }
}

/**
 * Handle checkbox changes
 */
function handleCheckboxChange(checkbox) {
  const fieldName = checkbox.name || checkbox.id;
  if (!fieldName) return;

  // Special handling for checkbox arrays (e.g., ground.terrainTypes)
  if (fieldName === 'ground.terrainTypes') {
    // Get all checked terrain type checkboxes
    const checkboxes = document.querySelectorAll('input[name="ground.terrainTypes"]:checked');
    const values = Array.from(checkboxes).map(cb => cb.value);
    updateState('ground.terrainTypes', values);
  } else {
    // Regular boolean checkbox
    const value = checkbox.checked;
    updateState(fieldName, value);
  }

  // Update mission summary if relevant fields changed
  if (fieldName.startsWith('ground.')) {
    updateMissionSummary();
  }

  // Show saving indicator
  updateSaveIndicator('saving');
}

/**
 * Handle radio button changes
 */
function handleRadioChange(radio) {
  const fieldName = radio.name;
  if (!fieldName) return;

  const value = radio.value;

  // Update state
  updateState(fieldName, value);

  // Handle conditional displays
  if (fieldName === 'trip.tripType') {
    toggleTripTypeVisibility(value);
  } else if (fieldName === 'situation.travelType') {
    toggleGroupSizeVisibility(value);
    // Update safety warning (solo + no device)
    updateSoloDeviceWarning();
  } else if (fieldName === 'season.season') {
    toggleWinterWarning(value);
    // Reload gear checklist when season changes
    loadGearChecklist();
  } else if (fieldName === 'commandControl.deviceCarried') {
    // Update safety warning when device selection changes
    updateSoloDeviceWarning();
  }

  // Update mission summary if relevant fields changed
  if (fieldName.startsWith('ground.') || fieldName.startsWith('situation.') ||
      fieldName.startsWith('season.')) {
    updateMissionSummary();
  }

  // Show saving indicator
  updateSaveIndicator('saving');
}

/**
 * Handle select changes
 */
function handleSelectChange(select) {
  const fieldName = select.name || select.id;
  if (!fieldName) return;

  const value = select.value;

  // Update state
  updateState(fieldName, value);

  // Show saving indicator
  updateSaveIndicator('saving');
}

/**
 * Handle click events
 */
function handleClick(event) {
  const target = event.target;

  // Continue to Planning button
  if (target.id === 'btn-continue') {
    event.preventDefault();
    // Navigate to first planning section (Ground)
    navigateToSection('ground');
  }

  // Load Previous Trip button
  if (target.id === 'btn-load') {
    event.preventDefault();
    console.log('Load previous trip - to be implemented');
  }

  // Import JSON button
  if (target.id === 'btn-import') {
    event.preventDefault();
    console.log('Import JSON - to be implemented');
  }

  // Add Map Link button
  if (target.id === 'btn-add-map-link') {
    event.preventDefault();
    addMapLink();
  }

  // Remove Map Link button
  if (target.classList.contains('btn-remove-map-link')) {
    event.preventDefault();
    const index = parseInt(target.dataset.index);
    removeMapLink(index);
  }

  // Add Day button (Execution section)
  if (target.id === 'btn-add-day') {
    event.preventDefault();
    addDay();
  }

  // Remove Last Day button (Execution section)
  if (target.id === 'btn-remove-day') {
    event.preventDefault();
    removeLastDay();
  }

  // Collapsible section headers
  if (target.closest('.collapsible-header')) {
    event.preventDefault();
    const section = target.closest('.collapsible-section');
    toggleCollapsibleSection(section);
  }

  // Add Custom Gear button
  if (target.id === 'btn-add-custom-gear') {
    event.preventDefault();
    addCustomGearItem();
  }

  // Remove custom gear item
  if (target.classList.contains('btn-remove-gear')) {
    event.preventDefault();
    const itemName = target.dataset.item;
    removeCustomGearItem(itemName);
  }

  // Print Plan button
  if (target.id === 'btn-print-plan') {
    event.preventDefault();
    printPlan();
  }

  // Download JSON button
  if (target.id === 'btn-download-json') {
    event.preventDefault();
    downloadJSON();
  }

  // Start New Trip button
  if (target.id === 'btn-start-new-trip') {
    event.preventDefault();
    startNewTrip();
  }
}

// ============================================================================
// Trip Type - Conditional Display Logic
// ============================================================================

/**
 * Toggle sections visibility based on trip type
 * @param {string} tripType - 'backpacking' or 'dayhike'
 */
function toggleTripTypeVisibility(tripType) {
  // Hide/show end date field
  const endDateContainer = document.getElementById('end-date-container');
  if (endDateContainer) {
    if (tripType === 'dayhike') {
      endDateContainer.style.display = 'none';
      // Auto-set end date to match start date for day hikes
      if (state.trip.startDate) {
        state.trip.endDate = state.trip.startDate;
        updateState('trip.endDate', state.trip.startDate);
      }
    } else {
      endDateContainer.style.display = 'block';
    }
  }

  // Hide/show accommodation section
  const accommodationSection = document.querySelector('.collapsible-section[data-section="accommodation"]');
  if (accommodationSection) {
    if (tripType === 'dayhike') {
      accommodationSection.style.display = 'none';
      // Auto-set nights required to 0 for day hikes
      state.administration.accommodation.nightsRequired = 0;
      updateState('administration.accommodation.nightsRequired', 0);
    } else {
      accommodationSection.style.display = 'block';
    }
  }

  // Update gear checklist when trip type changes
  loadGearChecklist();
}

// ============================================================================
// Situation & Season Section - Conditional Display Logic
// ============================================================================

/**
 * Toggle group size field visibility based on travel type
 * @param {string} travelType - 'solo' or 'group'
 */
function toggleGroupSizeVisibility(travelType) {
  const groupSizeContainer = document.getElementById('group-size-container');
  if (!groupSizeContainer) return;

  if (travelType === 'group') {
    groupSizeContainer.style.display = 'block';
  } else {
    groupSizeContainer.style.display = 'none';
  }
}

/**
 * Toggle winter warning banner visibility based on season
 * @param {string} season - 'summer', 'autumn', 'winter', or 'spring'
 */
function toggleWinterWarning(season) {
  const winterWarning = document.getElementById('winter-warning');
  if (!winterWarning) return;

  if (season === 'winter') {
    winterWarning.style.display = 'block';
  } else {
    winterWarning.style.display = 'none';
  }
}

// ============================================================================
// Form Population
// ============================================================================

/**
 * Populate form fields from state
 */
function populateFormFields() {
  if (!state) return;

  // Trip fields
  setFieldValue('trip.tripName', state.trip.tripName);
  setFieldValue('trip.description', state.trip.description);

  // Trip type (radio)
  if (state.trip.tripType) {
    const radio = document.querySelector(`input[name="trip.tripType"][value="${state.trip.tripType}"]`);
    if (radio) radio.checked = true;
    // Update conditional display
    toggleTripTypeVisibility(state.trip.tripType);
  }

  setFieldValue('trip.startDate', state.trip.startDate);
  setFieldValue('trip.endDate', state.trip.endDate);

  // Ground fields
  // Terrain types (checkboxes)
  if (state.ground.terrainTypes && state.ground.terrainTypes.length > 0) {
    state.ground.terrainTypes.forEach(type => {
      const checkbox = document.querySelector(`input[name="ground.terrainTypes"][value="${type}"]`);
      if (checkbox) checkbox.checked = true;
    });
  }

  // Vegetation (radio)
  if (state.ground.vegetation) {
    const radio = document.querySelector(`input[name="ground.vegetation"][value="${state.ground.vegetation}"]`);
    if (radio) radio.checked = true;
  }

  // Trail type (radio)
  if (state.ground.trailType) {
    const radio = document.querySelector(`input[name="ground.trailType"][value="${state.ground.trailType}"]`);
    if (radio) radio.checked = true;
  }

  // Route coverage (radio)
  if (state.ground.routeCoverage) {
    const radio = document.querySelector(`input[name="ground.routeCoverage"][value="${state.ground.routeCoverage}"]`);
    if (radio) radio.checked = true;
  }

  // Elevation notes
  setFieldValue('ground.elevationNotes', state.ground.elevationNotes);

  // Map links
  renderMapLinks();

  // Situation fields
  // Travel type (radio)
  if (state.situation.travelType) {
    const radio = document.querySelector(`input[name="situation.travelType"][value="${state.situation.travelType}"]`);
    if (radio) radio.checked = true;
    // Update conditional display
    toggleGroupSizeVisibility(state.situation.travelType);
  }

  // Group size
  setFieldValue('situation.groupSize', state.situation.groupSize);

  // Experience level (radio)
  if (state.situation.experienceLevel) {
    const radio = document.querySelector(`input[name="situation.experienceLevel"][value="${state.situation.experienceLevel}"]`);
    if (radio) radio.checked = true;
  }

  // Special considerations
  setFieldValue('situation.specialConsiderations', state.situation.specialConsiderations);

  // Season fields
  // Season (radio)
  if (state.season.season) {
    const radio = document.querySelector(`input[name="season.season"][value="${state.season.season}"]`);
    if (radio) radio.checked = true;
    // Update conditional display
    toggleWinterWarning(state.season.season);
  }

  // Expected weather
  setFieldValue('season.expectedWeather', state.season.expectedWeather);

  // Weather risks
  setFieldValue('season.weatherRisks', state.season.weatherRisks);

  // Mission fields
  // Mission type (radio)
  if (state.mission.missionType) {
    const radio = document.querySelector(`input[name="mission.missionType"][value="${state.mission.missionType}"]`);
    if (radio) radio.checked = true;
  }

  // Mission statement
  setFieldValue('mission.statement', state.mission.statement);

  // Execution fields
  // Travel style (radio)
  if (state.execution.travelStyle) {
    const radio = document.querySelector(`input[name="execution.travelStyle"][value="${state.execution.travelStyle}"]`);
    if (radio) radio.checked = true;
  }

  // Direction (radio)
  if (state.execution.direction) {
    const radio = document.querySelector(`input[name="execution.direction"][value="${state.execution.direction}"]`);
    if (radio) radio.checked = true;
  }

  // Daily plan table
  renderDailyPlanTable();

  // Administration fields
  // Travel
  setFieldValue('administration.travel.transportToStart', state.administration.travel.transportToStart);
  setFieldValue('administration.travel.transportFromEnd', state.administration.travel.transportFromEnd);
  setFieldValue('administration.travel.specialLogistics', state.administration.travel.specialLogistics);

  // Accommodation
  if (state.administration.accommodation.type) {
    const radio = document.querySelector(`input[name="administration.accommodation.type"][value="${state.administration.accommodation.type}"]`);
    if (radio) radio.checked = true;
  }
  setFieldValue('administration.accommodation.nightsRequired', state.administration.accommodation.nightsRequired);
  setFieldValue('administration.accommodation.bookingStatus', state.administration.accommodation.bookingStatus);

  // Gear - will be loaded by loadGearChecklist()
  setFieldValue('administration.gear.notes', state.administration.gear.notes);

  // Food/Fuel
  setFieldValue('administration.foodFuel.daysOfFood', state.administration.foodFuel.daysOfFood);
  setFieldValue('administration.foodFuel.emergencyDays', state.administration.foodFuel.emergencyDays);
  setFieldValue('administration.foodFuel.caloriesPerDay', state.administration.foodFuel.caloriesPerDay);
  setFieldValue('administration.foodFuel.waterPerPerson', state.administration.foodFuel.waterPerPerson);
  setFieldValue('administration.foodFuel.waterSources', state.administration.foodFuel.waterSources);
  setFieldValue('administration.foodFuel.filtrationRequired', state.administration.foodFuel.filtrationRequired);
  setFieldValue('administration.foodFuel.fuelNotes', state.administration.foodFuel.fuelNotes);

  // Permits
  setFieldValue('administration.permits.required', state.administration.permits.required);
  setFieldValue('administration.permits.bookingDeadlines', state.administration.permits.bookingDeadlines);
  setFieldValue('administration.permits.notes', state.administration.permits.notes);

  // Navigation
  setFieldValue('administration.navigation.mapAndCompass', state.administration.navigation.mapAndCompass);
  setFieldValue('administration.navigation.digitalTools', state.administration.navigation.digitalTools);

  // First Aid
  setFieldValue('administration.firstAid.kitType', state.administration.firstAid.kitType);
  setFieldValue('administration.firstAid.plbCarried', state.administration.firstAid.plbCarried);

  // Costing
  setFieldValue('administration.costing.travel', state.administration.costing.travel);
  setFieldValue('administration.costing.accommodation', state.administration.costing.accommodation);
  setFieldValue('administration.costing.food', state.administration.costing.food);
  setFieldValue('administration.costing.permits', state.administration.costing.permits);
  setFieldValue('administration.costing.other', state.administration.costing.other);

  // Load gear checklist based on season
  loadGearChecklist();

  // Command & Control fields
  setFieldValue('commandControl.homeContactName', state.commandControl.homeContactName);
  setFieldValue('commandControl.contactMethod', state.commandControl.contactMethod);
  setFieldValue('commandControl.expectedCheckIn', state.commandControl.expectedCheckIn);
  setFieldValue('commandControl.emergencyInstructions', state.commandControl.emergencyInstructions);

  // Device carried (radio)
  if (state.commandControl.deviceCarried) {
    const radio = document.querySelector(`input[name="commandControl.deviceCarried"][value="${state.commandControl.deviceCarried}"]`);
    if (radio) radio.checked = true;
  }

  // Group briefed (checkbox)
  setFieldValue('commandControl.groupBriefed', state.commandControl.groupBriefed);

  // Calculate and display trip duration if dates are set
  updateTripDuration();

  // Update mission summary
  updateMissionSummary();

  // Update total cost
  updateTotalCost();

  // Auto-populate check-in date if not set
  updateCheckInDate();

  // Update safety warning
  updateSoloDeviceWarning();
}

/**
 * Set a form field value by name
 */
function setFieldValue(fieldName, value) {
  const element = document.querySelector(`[name="${fieldName}"], #${fieldName}`);
  if (!element) return;

  if (element.type === 'checkbox') {
    element.checked = value;
  } else {
    element.value = value || '';
  }
}

/**
 * Update trip duration display
 */
function updateTripDuration() {
  const startDate = state.trip.startDate;
  const endDate = state.trip.endDate;
  const durationElement = document.getElementById('trip-duration');

  if (!durationElement) return;

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (days > 0) {
      durationElement.textContent = `Trip duration: ${days} day${days === 1 ? '' : 's'}`;
      durationElement.style.display = 'block';
    } else {
      durationElement.textContent = '';
      durationElement.style.display = 'none';
    }
  } else {
    durationElement.textContent = '';
    durationElement.style.display = 'none';
  }
}

/**
 * Update save indicator UI
 * @param {string} status - 'saving', 'saved', or 'error'
 */
function updateSaveIndicator(status) {
  const indicator = document.getElementById('save-indicator');
  if (!indicator) return;

  // Remove all status classes
  indicator.classList.remove('saving', 'saved', 'error');

  // Add new status class
  indicator.classList.add(status);

  // Update text
  switch (status) {
    case 'saving':
      indicator.textContent = 'Saving...';
      break;
    case 'saved':
      indicator.textContent = 'Saved';
      // Auto-hide after 2 seconds
      setTimeout(() => {
        indicator.textContent = '';
        indicator.classList.remove('saved');
      }, 2000);
      break;
    case 'error':
      indicator.textContent = 'Save failed';
      break;
  }
}

/**
 * Show warning message to user
 * @param {string} message - Warning message to display
 */
function showWarning(message) {
  // Simple console warning for now
  // Can be enhanced with UI modal in Phase 12
  console.warn('Warning:', message);
  alert(message);
}

// ============================================================================
// Ground Section - Map Links Management
// ============================================================================

/**
 * Add a new map link to the state and re-render
 */
function addMapLink() {
  if (!state.ground.mapLinks) {
    state.ground.mapLinks = [];
  }

  state.ground.mapLinks.push({
    url: '',
    description: ''
  });

  updateState('ground.mapLinks', state.ground.mapLinks);
  renderMapLinks();
}

/**
 * Remove a map link by index
 * @param {number} index - Index of map link to remove
 */
function removeMapLink(index) {
  if (!state.ground.mapLinks) return;

  state.ground.mapLinks.splice(index, 1);
  updateState('ground.mapLinks', state.ground.mapLinks);
  renderMapLinks();
}

/**
 * Render all map links from state
 */
function renderMapLinks() {
  const container = document.getElementById('map-links-container');
  if (!container) return;

  container.innerHTML = '';

  if (!state.ground.mapLinks || state.ground.mapLinks.length === 0) {
    return;
  }

  state.ground.mapLinks.forEach((link, index) => {
    const linkDiv = document.createElement('div');
    linkDiv.className = 'map-link-item';
    linkDiv.innerHTML = `
      <div class="form-row">
        <div class="form-group" style="flex: 2;">
          <input
            type="url"
            placeholder="https://..."
            value="${link.url || ''}"
            data-map-link-index="${index}"
            data-field="url"
            class="map-link-input"
          >
        </div>
        <div class="form-group" style="flex: 2;">
          <input
            type="text"
            placeholder="Description (e.g., Topo map, Route details)"
            value="${link.description || ''}"
            data-map-link-index="${index}"
            data-field="description"
            class="map-link-input"
          >
        </div>
        <div class="form-group" style="flex: 0;">
          <button
            type="button"
            class="btn btn-danger btn-remove-map-link"
            data-index="${index}"
            title="Remove this link"
          >×</button>
        </div>
      </div>
    `;

    container.appendChild(linkDiv);
  });

  // Add event listeners for map link inputs
  const mapLinkInputs = container.querySelectorAll('.map-link-input');
  mapLinkInputs.forEach(input => {
    input.addEventListener('input', handleMapLinkInput);
  });
}

/**
 * Handle input changes for map link fields
 * @param {Event} event - Input event
 */
function handleMapLinkInput(event) {
  const input = event.target;
  const index = parseInt(input.dataset.mapLinkIndex);
  const field = input.dataset.field;
  const value = input.value;

  if (!state.ground.mapLinks[index]) return;

  state.ground.mapLinks[index][field] = value;
  updateState('ground.mapLinks', state.ground.mapLinks);
}

// ============================================================================
// Execution Section - Daily Plan Table Management
// ============================================================================

/**
 * Pre-populate daily plan table based on trip dates
 * If trip dates are set, create a row for each day
 */
function prepopulateDailyPlan() {
  const tripDuration = calculateTripDuration();

  // Only pre-populate if we have trip dates and the daily plan is empty
  if (tripDuration > 0 && (!state.execution.dailyPlan || state.execution.dailyPlan.length === 0)) {
    state.execution.dailyPlan = [];

    const startDate = new Date(state.trip.startDate);

    for (let i = 0; i < tripDuration; i++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + i);

      state.execution.dailyPlan.push({
        day: i + 1,
        date: dayDate.toISOString().split('T')[0],
        from: '',
        to: '',
        distance: '',
        notes: ''
      });
    }

    updateState('execution.dailyPlan', state.execution.dailyPlan);
  }
}

/**
 * Add a new day to the daily plan
 */
function addDay() {
  if (!state.execution.dailyPlan) {
    state.execution.dailyPlan = [];
  }

  const dayNumber = state.execution.dailyPlan.length + 1;

  // Calculate date if we have a start date
  let dayDate = '';
  if (state.trip.startDate && dayNumber > 0) {
    const startDate = new Date(state.trip.startDate);
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + (dayNumber - 1));
    dayDate = newDate.toISOString().split('T')[0];
  }

  state.execution.dailyPlan.push({
    day: dayNumber,
    date: dayDate,
    from: '',
    to: '',
    distance: '',
    notes: ''
  });

  updateState('execution.dailyPlan', state.execution.dailyPlan);
  renderDailyPlanTable();
  updateTotalDistance();
}

/**
 * Remove the last day from the daily plan
 */
function removeLastDay() {
  if (!state.execution.dailyPlan || state.execution.dailyPlan.length === 0) {
    return;
  }

  // Confirm before removing
  if (state.execution.dailyPlan.length > 0) {
    const lastDay = state.execution.dailyPlan[state.execution.dailyPlan.length - 1];

    // Only confirm if the row has data
    if (lastDay.from || lastDay.to || lastDay.distance || lastDay.notes) {
      if (!confirm(`Remove Day ${lastDay.day}? This will delete all data for this day.`)) {
        return;
      }
    }
  }

  state.execution.dailyPlan.pop();
  updateState('execution.dailyPlan', state.execution.dailyPlan);
  renderDailyPlanTable();
  updateTotalDistance();
}

/**
 * Render the daily plan table from state
 */
function renderDailyPlanTable() {
  const tbody = document.getElementById('daily-plan-tbody');
  if (!tbody) return;

  // Pre-populate if needed
  if (calculateTripDuration() > 0 && (!state.execution.dailyPlan || state.execution.dailyPlan.length === 0)) {
    prepopulateDailyPlan();
  }

  tbody.innerHTML = '';

  if (!state.execution.dailyPlan || state.execution.dailyPlan.length === 0) {
    // Show empty state message
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `
      <td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 2rem;">
        No days planned yet. Click "Add Day" to start building your itinerary.
      </td>
    `;
    tbody.appendChild(emptyRow);
    updateTotalDistance();
    return;
  }

  state.execution.dailyPlan.forEach((day, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="day-number">${day.day}</td>
      <td>
        <input
          type="date"
          value="${day.date || ''}"
          data-day-index="${index}"
          data-field="date"
          class="daily-plan-input"
        >
      </td>
      <td>
        <input
          type="text"
          placeholder="Starting location"
          value="${day.from || ''}"
          data-day-index="${index}"
          data-field="from"
          class="daily-plan-input"
        >
      </td>
      <td>
        <input
          type="text"
          placeholder="Ending location"
          value="${day.to || ''}"
          data-day-index="${index}"
          data-field="to"
          class="daily-plan-input"
        >
      </td>
      <td>
        <input
          type="number"
          placeholder="0"
          value="${day.distance || ''}"
          data-day-index="${index}"
          data-field="distance"
          class="daily-plan-input input-small"
          step="0.1"
          min="0"
        >
      </td>
      <td>
        <input
          type="text"
          placeholder="Optional notes"
          value="${day.notes || ''}"
          data-day-index="${index}"
          data-field="notes"
          class="daily-plan-input"
        >
      </td>
    `;

    tbody.appendChild(row);
  });

  // Add event listeners for daily plan inputs
  const dailyPlanInputs = tbody.querySelectorAll('.daily-plan-input');
  dailyPlanInputs.forEach(input => {
    input.addEventListener('input', handleDailyPlanInput);
  });

  // Update total distance
  updateTotalDistance();
}

/**
 * Handle input changes for daily plan table fields
 * @param {Event} event - Input event
 */
function handleDailyPlanInput(event) {
  const input = event.target;
  const index = parseInt(input.dataset.dayIndex);
  const field = input.dataset.field;
  const value = input.value;

  if (!state.execution.dailyPlan[index]) return;

  state.execution.dailyPlan[index][field] = value;
  updateState('execution.dailyPlan', state.execution.dailyPlan);

  // Update total distance if distance field changed
  if (field === 'distance') {
    updateTotalDistance();
  }

  // Show saving indicator
  updateSaveIndicator('saving');
}

/**
 * Update the total distance display
 */
function updateTotalDistance() {
  const totalDistanceElement = document.getElementById('total-distance-value');
  if (!totalDistanceElement) return;

  const total = calculateTotalDistance();
  totalDistanceElement.textContent = total.toFixed(1);
}

// ============================================================================
// Administration Section - Collapsible Sections
// ============================================================================

/**
 * Toggle a collapsible section open/closed
 * @param {HTMLElement} section - The collapsible section element
 */
function toggleCollapsibleSection(section) {
  if (!section) return;

  section.classList.toggle('collapsed');
}

// ============================================================================
// Administration Section - Gear Checklist Management
// ============================================================================

/**
 * Load and render gear checklist based on current season or trip type
 */
function loadGearChecklist() {
  const tripType = state.trip.tripType;
  const season = state.season.season;

  // For day hikes, use day hike preset regardless of season
  let presetItems = [];
  if (tripType === 'dayhike') {
    presetItems = GEAR_PRESETS['dayhike'] || [];
  } else {
    // For backpacking trips, use season-based preset
    // If no season selected yet, don't populate
    if (!season) {
      renderGearChecklist([]);
      return;
    }
    presetItems = GEAR_PRESETS[season] || [];
  }

  // If checklist is empty or doesn't match current season, initialize with preset
  if (!state.administration.gear.checklist || state.administration.gear.checklist.length === 0) {
    // Initialize with unchecked preset items
    state.administration.gear.checklist = presetItems.map(item => ({
      name: item,
      checked: false,
      custom: false
    }));
    updateState('administration.gear.checklist', state.administration.gear.checklist);
  } else {
    // Merge preset items with existing checklist
    // Keep checked state for existing items, add new preset items if any
    const existingNames = state.administration.gear.checklist.map(item => item.name);
    const newPresetItems = presetItems
      .filter(name => !existingNames.includes(name))
      .map(name => ({ name, checked: false, custom: false }));

    if (newPresetItems.length > 0) {
      state.administration.gear.checklist = [
        ...state.administration.gear.checklist.filter(item => !item.custom),
        ...newPresetItems,
        ...state.administration.gear.checklist.filter(item => item.custom)
      ];
      updateState('administration.gear.checklist', state.administration.gear.checklist);
    }
  }

  renderGearChecklist(state.administration.gear.checklist);
}

/**
 * Render the gear checklist from state
 * @param {Array} checklist - Array of gear items
 */
function renderGearChecklist(checklist) {
  const container = document.getElementById('gear-checklist-container');
  if (!container) return;

  container.innerHTML = '';

  if (!checklist || checklist.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.style.padding = 'var(--spacing-md)';
    emptyMessage.style.color = 'var(--text-secondary)';
    emptyMessage.textContent = 'Select a season in the Situation/Season section to load a gear checklist.';
    container.appendChild(emptyMessage);
    return;
  }

  checklist.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = `gear-checklist-item${item.custom ? ' custom' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `gear-${index}`;
    checkbox.checked = item.checked || false;
    checkbox.dataset.index = index;

    const label = document.createElement('label');
    label.htmlFor = `gear-${index}`;
    label.textContent = item.name;

    itemDiv.appendChild(checkbox);
    itemDiv.appendChild(label);

    // Add remove button for custom items
    if (item.custom) {
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn-danger btn-small btn-remove-gear';
      removeBtn.textContent = '×';
      removeBtn.dataset.item = item.name;
      removeBtn.title = 'Remove custom item';
      removeBtn.style.marginLeft = 'auto';
      itemDiv.appendChild(removeBtn);
    }

    container.appendChild(itemDiv);
  });

  // Add event listeners for checkboxes
  const checkboxes = container.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', handleGearCheckboxChange);
  });
}

/**
 * Handle gear checkbox changes
 * @param {Event} event - Change event
 */
function handleGearCheckboxChange(event) {
  const checkbox = event.target;
  const index = parseInt(checkbox.dataset.index);

  if (!state.administration.gear.checklist[index]) return;

  state.administration.gear.checklist[index].checked = checkbox.checked;
  updateState('administration.gear.checklist', state.administration.gear.checklist);

  updateSaveIndicator('saving');
}

/**
 * Add a custom gear item
 */
function addCustomGearItem() {
  const itemName = prompt('Enter custom gear item name:');

  if (!itemName || itemName.trim() === '') {
    return;
  }

  // Check if item already exists
  const existingItem = state.administration.gear.checklist.find(
    item => item.name.toLowerCase() === itemName.trim().toLowerCase()
  );

  if (existingItem) {
    alert('This item already exists in your checklist.');
    return;
  }

  // Add custom item
  if (!state.administration.gear.checklist) {
    state.administration.gear.checklist = [];
  }

  state.administration.gear.checklist.push({
    name: itemName.trim(),
    checked: false,
    custom: true
  });

  updateState('administration.gear.checklist', state.administration.gear.checklist);
  renderGearChecklist(state.administration.gear.checklist);
}

/**
 * Remove a custom gear item
 * @param {string} itemName - Name of item to remove
 */
function removeCustomGearItem(itemName) {
  if (!confirm(`Remove "${itemName}" from checklist?`)) {
    return;
  }

  state.administration.gear.checklist = state.administration.gear.checklist.filter(
    item => item.name !== itemName
  );

  updateState('administration.gear.checklist', state.administration.gear.checklist);
  renderGearChecklist(state.administration.gear.checklist);
}

// ============================================================================
// Administration Section - Total Cost Calculation
// ============================================================================

/**
 * Update the total cost display
 */
function updateTotalCost() {
  const totalCostElement = document.getElementById('total-cost-value');
  if (!totalCostElement) return;

  const total = calculateTotalCost();
  totalCostElement.textContent = `$${total.toFixed(2)}`;
}

// ============================================================================
// Command & Control Section - Auto-population and Warnings
// ============================================================================

/**
 * Auto-populate check-in date to trip end date + 1 day
 * Only updates if check-in date is not already set
 */
function updateCheckInDate() {
  const endDate = state.trip.endDate;
  const checkInInput = document.getElementById('commandControl.expectedCheckIn');

  if (!endDate || !checkInInput) return;

  // Only auto-populate if check-in date is empty or if end date changes
  const currentCheckIn = state.commandControl.expectedCheckIn;

  // Calculate end date + 1 day
  const tripEndDate = new Date(endDate);
  const checkInDate = new Date(tripEndDate);
  checkInDate.setDate(tripEndDate.getDate() + 1);
  const checkInDateString = checkInDate.toISOString().split('T')[0];

  // Update if empty or different
  if (!currentCheckIn || currentCheckIn < endDate) {
    state.commandControl.expectedCheckIn = checkInDateString;
    checkInInput.value = checkInDateString;
    // Don't trigger a full save here to avoid recursion, just update the field
  }
}

/**
 * Show/hide safety warning for solo travel with no emergency device
 */
function updateSoloDeviceWarning() {
  const warningElement = document.getElementById('solo-no-device-warning');
  if (!warningElement) return;

  const travelType = state.situation.travelType;
  const deviceCarried = state.commandControl.deviceCarried;

  // Show warning if solo AND no device (or device is 'none')
  if (travelType === 'solo' && deviceCarried === 'none') {
    warningElement.style.display = 'block';
  } else {
    warningElement.style.display = 'none';
  }
}
