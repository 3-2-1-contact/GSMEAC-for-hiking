// Calculations and Auto-generation for GSMEAC Backpacking Planner

/**
 * Generate an auto-summary for the Mission section
 * Pulls data from Ground, Situation, Season, and Trip sections
 * @returns {string} Formatted summary text
 */
function generateMissionSummary() {
  if (!state) return 'No trip data available.';

  const parts = [];

  // Trip Type
  if (state.trip.tripType) {
    if (state.trip.tripType === 'dayhike') {
      parts.push('Day Hike');
    } else {
      parts.push('Backpacking Trip');
    }
  }

  // Trip Duration
  if (state.trip.startDate && state.trip.endDate) {
    const start = new Date(state.trip.startDate);
    const end = new Date(state.trip.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (days > 0) {
      const startFormatted = formatDate(state.trip.startDate);
      if (state.trip.tripType === 'dayhike') {
        parts.push(`Date: ${startFormatted}`);
      } else {
        const endFormatted = formatDate(state.trip.endDate);
        parts.push(`${days} day${days === 1 ? '' : 's'} (${startFormatted} - ${endFormatted})`);
      }
    }
  }

  // Trip Name
  if (state.trip.tripName) {
    parts.push(`Trip: ${state.trip.tripName}`);
  }

  // Travel Type
  if (state.situation.travelType) {
    if (state.situation.travelType === 'solo') {
      parts.push('Solo trip');
    } else if (state.situation.travelType === 'group' && state.situation.groupSize) {
      parts.push(`Group trip (${state.situation.groupSize} people)`);
    } else {
      parts.push('Group trip');
    }
  }

  // Experience Level
  if (state.situation.experienceLevel) {
    const levelLabels = {
      'beginner': 'Beginner experience level',
      'intermediate': 'Intermediate experience level',
      'advanced': 'Advanced experience level'
    };
    parts.push(levelLabels[state.situation.experienceLevel] || state.situation.experienceLevel);
  }

  // Season
  if (state.season.season) {
    const seasonLabels = {
      'summer': 'Summer conditions',
      'autumn': 'Autumn conditions',
      'winter': 'Winter conditions',
      'spring': 'Spring conditions'
    };
    parts.push(seasonLabels[state.season.season] || state.season.season);
  }

  // Terrain Types
  if (state.ground.terrainTypes && state.ground.terrainTypes.length > 0) {
    const terrainLabels = {
      'flat': 'flat terrain',
      'hills': 'hills',
      'mountains': 'mountains',
      'alpine': 'alpine terrain'
    };
    const terrains = state.ground.terrainTypes.map(t => terrainLabels[t] || t);

    if (terrains.length === 1) {
      parts.push(`Terrain: ${terrains[0]}`);
    } else {
      parts.push(`Terrain: ${terrains.join(', ')}`);
    }
  }

  // Trail Type
  if (state.ground.trailType) {
    const trailLabels = {
      'established': 'Established trail',
      'partial': 'Partial trail',
      'off-trail': 'Off-trail navigation required'
    };
    parts.push(trailLabels[state.ground.trailType] || state.ground.trailType);
  }

  // Vegetation
  if (state.ground.vegetation) {
    const vegLabels = {
      'open': 'Open vegetation (grassland/tussock)',
      'bush': 'Bush/forest',
      'mixed': 'Mixed vegetation'
    };
    parts.push(vegLabels[state.ground.vegetation] || state.ground.vegetation);
  }

  // If no data yet, show helpful message
  if (parts.length === 0) {
    return 'Complete the Ground, Situation, and Season sections to see an auto-generated summary here.';
  }

  // Format as bullet points
  return parts.map(part => `• ${part}`).join('\n');
}

/**
 * Format a date string for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Calculate trip duration in days
 * @returns {number} Number of days, or 0 if dates not set
 */
function calculateTripDuration() {
  if (!state || !state.trip.startDate || !state.trip.endDate) {
    return 0;
  }

  const start = new Date(state.trip.startDate);
  const end = new Date(state.trip.endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  return days > 0 ? days : 0;
}

/**
 * Calculate total distance from daily plan
 * @returns {number} Total distance in miles
 */
function calculateTotalDistance() {
  if (!state || !state.execution.dailyPlan) {
    return 0;
  }

  return state.execution.dailyPlan.reduce((total, day) => {
    const distance = parseFloat(day.distance) || 0;
    return total + distance;
  }, 0);
}

/**
 * Calculate total cost from administration section
 * @returns {number} Total cost
 */
function calculateTotalCost() {
  if (!state || !state.administration.costing) {
    return 0;
  }

  const costing = state.administration.costing;
  return (
    (parseFloat(costing.travel) || 0) +
    (parseFloat(costing.accommodation) || 0) +
    (parseFloat(costing.food) || 0) +
    (parseFloat(costing.permits) || 0) +
    (parseFloat(costing.other) || 0)
  );
}

/**
 * Update the mission summary display in the DOM
 */
function updateMissionSummary() {
  const summaryElement = document.getElementById('mission-auto-summary');
  if (!summaryElement) return;

  const summary = generateMissionSummary();
  summaryElement.textContent = summary;
}

/**
 * Calculate suggested days of food based on trip duration
 * @returns {number} Suggested days of food
 */
function calculateSuggestedFoodDays() {
  const tripDays = calculateTripDuration();

  // If we have a daily plan, use that count
  if (state && state.execution.dailyPlan && state.execution.dailyPlan.length > 0) {
    return state.execution.dailyPlan.length;
  }

  // Otherwise use trip duration
  return tripDays;
}

/**
 * Update food days suggestion hint
 */
function updateFoodDaysSuggestion() {
  const suggestedDays = calculateSuggestedFoodDays();

  if (suggestedDays > 0) {
    const hintElement = document.querySelector('input[name="administration.foodFuel.daysOfFood"]')?.nextElementSibling;
    if (hintElement && hintElement.classList.contains('form-hint')) {
      const currentValue = state.administration.foodFuel.daysOfFood;
      if (!currentValue || currentValue === 0) {
        hintElement.innerHTML = `Days of food to carry <strong>(suggested: ${suggestedDays} days based on your itinerary)</strong>`;
      } else {
        hintElement.textContent = 'Days of food to carry';
      }
    }
  }
}
