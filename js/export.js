// Export and Summary Generation for GSMEAC Backpacking Planner

/**
 * Generate a complete text summary of the trip plan
 * @returns {string} Formatted text summary
 */
function generateTextSummary() {
  if (!state) return 'No trip data available.';

  const lines = [];

  // Header
  lines.push('═══════════════════════════════════════════════════════════════');
  lines.push('           GSMEAC BACKPACKING PLAN');
  lines.push('═══════════════════════════════════════════════════════════════');
  lines.push('');

  // Trip Information
  if (state.trip.tripName) {
    lines.push(`TRIP: ${state.trip.tripName}`);
    lines.push('');
  }

  if (state.trip.description) {
    lines.push(`${state.trip.description}`);
    lines.push('');
  }

  if (state.trip.startDate && state.trip.endDate) {
    const duration = calculateTripDuration();
    lines.push(`DATES: ${formatDate(state.trip.startDate)} - ${formatDate(state.trip.endDate)}`);
    lines.push(`DURATION: ${duration} day${duration === 1 ? '' : 's'}`);
    lines.push('');
  }

  lines.push('───────────────────────────────────────────────────────────────');
  lines.push('');

  // Ground Section
  lines.push('G - GROUND');
  lines.push('───────────────────────────────────────────────────────────────');
  lines.push('');

  if (state.ground.terrainTypes && state.ground.terrainTypes.length > 0) {
    lines.push(`Terrain Types: ${state.ground.terrainTypes.join(', ')}`);
  }

  if (state.ground.vegetation) {
    lines.push(`Vegetation: ${state.ground.vegetation}`);
  }

  if (state.ground.trailType) {
    lines.push(`Trail Type: ${state.ground.trailType}`);
  }

  if (state.ground.routeCoverage) {
    lines.push(`Route Coverage: ${state.ground.routeCoverage}`);
  }

  if (state.ground.elevationNotes) {
    lines.push('');
    lines.push('Elevation & Terrain Notes:');
    lines.push(state.ground.elevationNotes);
  }

  if (state.ground.mapLinks && state.ground.mapLinks.length > 0) {
    lines.push('');
    lines.push('Map Links:');
    state.ground.mapLinks.forEach(link => {
      if (link.url) {
        lines.push(`  • ${link.description || 'Map'}: ${link.url}`);
      }
    });
  }

  lines.push('');
  lines.push('───────────────────────────────────────────────────────────────');
  lines.push('');

  // Situation & Season Section
  lines.push('S - SITUATION & SEASON');
  lines.push('───────────────────────────────────────────────────────────────');
  lines.push('');

  lines.push('Situation:');
  if (state.situation.travelType) {
    if (state.situation.travelType === 'solo') {
      lines.push('  Travel Type: Solo');
    } else if (state.situation.travelType === 'group') {
      lines.push(`  Travel Type: Group (${state.situation.groupSize || 'unspecified'} people)`);
    }
  }

  if (state.situation.experienceLevel) {
    lines.push(`  Experience Level: ${state.situation.experienceLevel}`);
  }

  if (state.situation.specialConsiderations) {
    lines.push('  Special Considerations:');
    lines.push(`    ${state.situation.specialConsiderations}`);
  }

  lines.push('');
  lines.push('Season:');
  if (state.season.season) {
    lines.push(`  Season: ${state.season.season}`);
  }

  if (state.season.expectedWeather) {
    lines.push('  Expected Weather:');
    lines.push(`    ${state.season.expectedWeather}`);
  }

  if (state.season.weatherRisks) {
    lines.push('  Weather Risks:');
    lines.push(`    ${state.season.weatherRisks}`);
  }

  lines.push('');
  lines.push('───────────────────────────────────────────────────────────────');
  lines.push('');

  // Mission Section
  lines.push('M - MISSION');
  lines.push('───────────────────────────────────────────────────────────────');
  lines.push('');

  if (state.mission.missionType) {
    lines.push(`Mission Type: ${state.mission.missionType}`);
    lines.push('');
  }

  if (state.mission.statement) {
    lines.push('Mission Statement:');
    lines.push(state.mission.statement);
  }

  lines.push('');
  lines.push('───────────────────────────────────────────────────────────────');
  lines.push('');

  // Execution Section
  lines.push('E - EXECUTION');
  lines.push('───────────────────────────────────────────────────────────────');
  lines.push('');

  if (state.execution.travelStyle) {
    lines.push(`Travel Style: ${state.execution.travelStyle}`);
  }

  if (state.execution.direction) {
    lines.push(`Direction: ${state.execution.direction}`);
  }

  if (state.execution.dailyPlan && state.execution.dailyPlan.length > 0) {
    lines.push('');
    lines.push('Daily Itinerary:');
    lines.push('');

    state.execution.dailyPlan.forEach(day => {
      const date = day.date ? ` (${formatDate(day.date)})` : '';
      lines.push(`Day ${day.day}${date}`);
      lines.push(`  From: ${day.from || 'Not specified'}`);
      lines.push(`  To: ${day.to || 'Not specified'}`);
      if (day.distance) {
        lines.push(`  Distance: ${day.distance} miles`);
      }
      if (day.notes) {
        lines.push(`  Notes: ${day.notes}`);
      }
      lines.push('');
    });

    const totalDistance = calculateTotalDistance();
    if (totalDistance > 0) {
      lines.push(`TOTAL DISTANCE: ${totalDistance.toFixed(1)} miles`);
      lines.push('');
    }
  }

  lines.push('───────────────────────────────────────────────────────────────');
  lines.push('');

  // Administration Section
  lines.push('A - ADMINISTRATION');
  lines.push('───────────────────────────────────────────────────────────────');
  lines.push('');

  // Travel
  lines.push('Travel & Transport:');
  if (state.administration.travel.transportToStart) {
    lines.push(`  To Start: ${state.administration.travel.transportToStart}`);
  }
  if (state.administration.travel.transportFromEnd) {
    lines.push(`  From End: ${state.administration.travel.transportFromEnd}`);
  }
  if (state.administration.travel.specialLogistics) {
    lines.push(`  Special Logistics: ${state.administration.travel.specialLogistics}`);
  }
  lines.push('');

  // Accommodation
  lines.push('Accommodation:');
  if (state.administration.accommodation.type) {
    lines.push(`  Type: ${state.administration.accommodation.type}`);
  }
  if (state.administration.accommodation.nightsRequired) {
    lines.push(`  Nights Required: ${state.administration.accommodation.nightsRequired}`);
  }
  if (state.administration.accommodation.bookingStatus) {
    lines.push(`  Booking Status: ${state.administration.accommodation.bookingStatus}`);
  }
  lines.push('');

  // Gear
  lines.push('Gear & Equipment:');
  if (state.administration.gear.checklist && state.administration.gear.checklist.length > 0) {
    const checkedItems = state.administration.gear.checklist.filter(item => item.checked);
    const uncheckedItems = state.administration.gear.checklist.filter(item => !item.checked);

    if (checkedItems.length > 0) {
      lines.push('  Packed:');
      checkedItems.forEach(item => {
        lines.push(`    ✓ ${item.name}`);
      });
    }

    if (uncheckedItems.length > 0) {
      lines.push('  Still needed:');
      uncheckedItems.forEach(item => {
        lines.push(`    ☐ ${item.name}`);
      });
    }
  }
  if (state.administration.gear.notes) {
    lines.push(`  Notes: ${state.administration.gear.notes}`);
  }
  lines.push('');

  // Food, Water & Fuel
  lines.push('Food, Water & Fuel:');
  if (state.administration.foodFuel.daysOfFood) {
    lines.push(`  Days of Food: ${state.administration.foodFuel.daysOfFood}`);
  }
  if (state.administration.foodFuel.emergencyDays) {
    lines.push(`  Emergency Days: ${state.administration.foodFuel.emergencyDays}`);
  }
  if (state.administration.foodFuel.caloriesPerDay) {
    lines.push(`  Calories per Day: ${state.administration.foodFuel.caloriesPerDay}`);
  }
  if (state.administration.foodFuel.waterPerPerson) {
    lines.push(`  Water per Person: ${state.administration.foodFuel.waterPerPerson} liters`);
  }
  if (state.administration.foodFuel.waterSources) {
    lines.push(`  Water Sources: ${state.administration.foodFuel.waterSources}`);
  }
  lines.push(`  Filtration Required: ${state.administration.foodFuel.filtrationRequired ? 'Yes' : 'No'}`);
  if (state.administration.foodFuel.fuelNotes) {
    lines.push(`  Notes: ${state.administration.foodFuel.fuelNotes}`);
  }
  lines.push('');

  // Permits
  lines.push('Permits & Regulations:');
  lines.push(`  Required: ${state.administration.permits.required ? 'Yes' : 'No'}`);
  if (state.administration.permits.bookingDeadlines) {
    lines.push(`  Deadlines: ${state.administration.permits.bookingDeadlines}`);
  }
  if (state.administration.permits.notes) {
    lines.push(`  Notes: ${state.administration.permits.notes}`);
  }
  lines.push('');

  // Navigation
  lines.push('Navigation:');
  lines.push(`  Map & Compass: ${state.administration.navigation.mapAndCompass ? 'Yes' : 'No'}`);
  if (state.administration.navigation.digitalTools) {
    lines.push(`  Digital Tools: ${state.administration.navigation.digitalTools}`);
  }
  lines.push('');

  // First Aid
  lines.push('First Aid & Emergency:');
  if (state.administration.firstAid.kitType) {
    lines.push(`  Kit Type: ${state.administration.firstAid.kitType}`);
  }
  lines.push(`  PLB Carried: ${state.administration.firstAid.plbCarried ? 'Yes' : 'No'}`);
  lines.push('');

  // Costing
  lines.push('Costing:');
  const costing = state.administration.costing;
  if (costing.travel) lines.push(`  Travel: $${parseFloat(costing.travel).toFixed(2)}`);
  if (costing.accommodation) lines.push(`  Accommodation: $${parseFloat(costing.accommodation).toFixed(2)}`);
  if (costing.food) lines.push(`  Food: $${parseFloat(costing.food).toFixed(2)}`);
  if (costing.permits) lines.push(`  Permits: $${parseFloat(costing.permits).toFixed(2)}`);
  if (costing.other) lines.push(`  Other: $${parseFloat(costing.other).toFixed(2)}`);

  const totalCost = calculateTotalCost();
  if (totalCost > 0) {
    lines.push(`  ─────────────`);
    lines.push(`  TOTAL: $${totalCost.toFixed(2)}`);
  }
  lines.push('');

  lines.push('───────────────────────────────────────────────────────────────');
  lines.push('');

  // Command & Control Section
  lines.push('C - COMMAND & CONTROL');
  lines.push('───────────────────────────────────────────────────────────────');
  lines.push('');

  if (state.commandControl.homeContactName) {
    lines.push(`Home Contact: ${state.commandControl.homeContactName}`);
  }

  if (state.commandControl.contactMethod) {
    lines.push(`Contact Method: ${state.commandControl.contactMethod}`);
  }

  if (state.commandControl.expectedCheckIn) {
    lines.push(`Expected Check-in: ${formatDate(state.commandControl.expectedCheckIn)}`);
  }

  if (state.commandControl.deviceCarried) {
    lines.push(`Emergency Device: ${state.commandControl.deviceCarried}`);
  }

  lines.push(`Group Briefed: ${state.commandControl.groupBriefed ? 'Yes' : 'No'}`);

  if (state.commandControl.emergencyInstructions) {
    lines.push('');
    lines.push('Emergency Instructions:');
    lines.push(state.commandControl.emergencyInstructions);
  }

  lines.push('');
  lines.push('═══════════════════════════════════════════════════════════════');
  lines.push('');
  lines.push(`Generated: ${new Date().toLocaleString()}`);
  lines.push('Generated with GSMEAC Backpacking Planner');
  lines.push('═══════════════════════════════════════════════════════════════');

  return lines.join('\n');
}

/**
 * Update the review section summary display
 */
function updateReviewSummary() {
  const summaryElement = document.getElementById('review-summary');
  if (!summaryElement) return;

  const summary = generateTextSummary();
  summaryElement.textContent = summary;
}

/**
 * Download trip plan as JSON file
 */
function downloadJSON() {
  if (!state) {
    alert('No trip data to export.');
    return;
  }

  try {
    // Get JSON string from exportStateJSON() function in state.js
    const jsonString = exportStateJSON();

    // Create filename with trip name and date
    const tripName = state.trip.tripName || 'trip';
    const sanitizedName = tripName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const dateStamp = new Date().toISOString().split('T')[0];
    const filename = `gsmeac-${sanitizedName}-${dateStamp}.json`;

    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`JSON exported: ${filename}`);
  } catch (e) {
    console.error('Error exporting JSON:', e);
    alert('Failed to export JSON. Please try again.');
  }
}

/**
 * Print the trip plan
 */
function printPlan() {
  // Update summary before printing
  updateReviewSummary();

  // Small delay to ensure summary is rendered
  setTimeout(() => {
    window.print();
  }, 100);
}

/**
 * Start a new trip (reset state)
 */
function startNewTrip() {
  // Confirm with user
  const confirmMessage =
    'Are you sure you want to start a new trip?\n\n' +
    'Your current trip will be saved as a backup, but all fields will be reset.\n\n' +
    'Consider downloading your plan as JSON before starting a new trip.';

  if (!confirm(confirmMessage)) {
    return;
  }

  // Reset state (with backup)
  resetState(true);

  // Navigate back to welcome screen
  navigateToSection('welcome');

  console.log('Started new trip');
}

/**
 * Go back to editing (navigate to last section)
 */
function backToEdit() {
  // Navigate to command & control section (last editable section)
  navigateToSection('commandcontrol');
}
