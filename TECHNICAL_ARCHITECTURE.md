# Technical Architecture Document

## Overview

Single-page vanilla JavaScript application with no build tools or frameworks. All state management, routing, and persistence handled in plain JavaScript.

## File Structure

```
/
├── index.html          # Main HTML structure, all sections inline
├── css/
│   ├── reset.css       # Basic CSS reset
│   ├── layout.css      # Grid, sections, navigation
│   ├── forms.css       # Form elements styling
│   └── print.css       # Print-specific styles
├── js/
│   ├── app.js          # Main application controller
│   ├── state.js        # State management and localStorage
│   ├── navigation.js   # Section navigation logic
│   ├── validation.js   # Field validation warnings
│   └── export.js       # Summary generation and export
└── README.md
```

## State Management

### Core State Object

```javascript
const state = {
  trip: {
    tripName: '',
    description: '',
    startDate: '',
    endDate: '',
    createdAt: timestamp,
    lastModified: timestamp
  },
  ground: {
    terrainTypes: [],      // ['flat', 'hills', 'mountains', 'alpine']
    vegetation: '',         // 'open' | 'bush' | 'mixed'
    trailType: '',         // 'established' | 'partial' | 'off-trail'
    routeCoverage: '',     // 'section' | 'full'
    elevationNotes: '',
    mapLinks: []           // [{url: '', description: ''}]
  },
  situation: {
    travelType: '',        // 'solo' | 'group'
    groupSize: 1,
    experienceLevel: '',   // 'novice' | 'mixed' | 'experienced'
    specialConsiderations: ''
  },
  season: {
    season: '',            // 'spring' | 'summer' | 'fall' | 'winter'
    expectedWeather: '',
    weatherRisks: ''
  },
  mission: {
    statement: '',
    missionType: ''        // 'family' | 'solo' | 'shakeout' | 'thru-hike'
  },
  execution: {
    travelStyle: '',       // 'moving' | 'basecamp' | 'hub-spoke'
    direction: '',         // 'north' | 'south' | 'east' | 'west' | 'loop'
    dailyPlan: []          // [{day: 1, start: '', end: '', distance: '', notes: ''}]
  },
  administration: {
    travel: {
      transportToStart: '',
      transportFromEnd: '',
      specialLogistics: ''
    },
    accommodation: {
      type: '',            // 'hut' | 'tent' | 'lodge' | 'mixed'
      nightsRequired: 0,
      bookingStatus: ''
    },
    gear: {
      checklist: [],       // Season-based
      notes: ''
    },
    foodFuel: {
      daysOfFood: 0,
      emergencyDays: 0,
      caloriesPerDay: 0,
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
    deviceCarried: '',     // 'plb' | 'inreach' | 'zoleo' | 'none'
    groupBriefed: false
  },
  meta: {
    currentSection: 'welcome',
    completedSections: []
  }
};
```

### State Persistence

- **Auto-save**: Debounced localStorage write on any state change (500ms delay)
- **Storage key**: `gsmeac_trip_current`
- **Backup strategy**: Keep last 3 saves with timestamps
- **Storage quota check**: Warn if localStorage approaching limit

### State Operations

```javascript
// Core functions in state.js
function loadState()           // Load from localStorage on init
function saveState()           // Debounced save to localStorage
function updateState(path, value)  // Update nested state property
function resetState()          // Clear current trip
function exportStateJSON()     // Export as downloadable JSON
function importStateJSON(json) // Import from JSON
```

## Navigation System

### Section Flow

```
Welcome → Ground → Situation/Season → Mission → Execution → Administration → Command & Control → Review
```

### Navigation Methods

- **Progress bar**: Visual indicator at top showing GSMEAC sections
- **Next/Previous buttons**: Linear navigation
- **Direct section links**: Click progress bar to jump (no enforcement)
- **URL hash routing**: `#ground`, `#situation`, etc. for bookmarking

### Section Visibility

```javascript
function showSection(sectionId) {
  // Hide all sections
  // Show requested section
  // Update progress bar
  // Update URL hash
  // Scroll to top
  // Update meta.currentSection
}
```

## Validation System

### Warning Types

- **Empty critical fields**: Yellow warning badge
- **Incomplete sections**: Summary shows missing items
- **No enforcement**: Users can proceed anyway

### Critical Fields

```javascript
const criticalFields = {
  ground: ['terrainTypes', 'trailType'],
  situation: ['travelType', 'experienceLevel'],
  season: ['season'],
  mission: ['statement'],
  execution: ['dailyPlan.length > 0'],
  commandControl: ['homeContactName', 'expectedCheckIn']
};
```

## Auto-calculation Features

### Automatic Calculations

1. **Trip duration**: From startDate/endDate
2. **Total cost**: Sum of all administration.costing fields
3. **Food requirements**: execution.dailyPlan.length + foodFuel.emergencyDays
4. **Mission summary**: Auto-generated from Ground + Situation + Season

### Calculation Triggers

- Recalculate on any relevant field change
- Display in read-only fields
- Include in export summary

## Export System

### Print View

- Trigger via Print button
- Load print.css media query
- Format: Single-page summary with all key info
- Include QR code to emergency contact (optional)

### JSON Export

```javascript
{
  "version": "1.0",
  "exported": "2026-01-02T10:30:00Z",
  "trip": { /* full state object */ }
}
```

### Summary Generation

Generate human-readable summary:

```
=== GSMEAC TRIP PLAN ===

MISSION: [statement]

GROUND:
- Terrain: [types]
- Trail: [type]
- [elevation notes]

SITUATION:
- [travelType], [groupSize] people
- Experience: [level]

SEASON: [season]
- Weather: [expected]

EXECUTION:
[Daily plan table]

ADMINISTRATION:
[Checklist format]

COMMAND & CONTROL:
- Contact: [name] via [method]
- Check-in: [date]
- Device: [type]
```

## Event Handling

### Input Events

- Use event delegation on form container
- Debounce text inputs (500ms)
- Immediate updates for checkboxes/radios/selects

### Event Listeners

```javascript
// Central event handler in app.js
document.addEventListener('DOMContentLoaded', init);
document.addEventListener('input', handleInput);
document.addEventListener('change', handleChange);
document.addEventListener('click', handleClick);
```

## Browser Support

### Target Browsers

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### Required Features

- ES6 (const, let, arrow functions, template literals)
- localStorage API
- FormData API
- CSS Grid
- CSS Custom Properties

### Polyfills

None required for target browsers.

## Performance Considerations

- **Debouncing**: All auto-save and calculation operations
- **Lazy initialization**: Load sections on first view
- **Minimal reflows**: Batch DOM updates
- **No large libraries**: Keep total page weight < 100KB

## Security Considerations

- **No server communication**: All data client-side only
- **localStorage only**: No cookies, no external storage
- **XSS prevention**: Use textContent, not innerHTML for user data
- **Input sanitization**: Basic sanitization before localStorage write

## Offline Capability

- **No service worker initially**: Keep it simple
- **All assets inline or local**: No CDN dependencies
- **Future enhancement**: Add service worker for true PWA

## Error Handling

```javascript
// Graceful degradation
try {
  localStorage.setItem(key, value);
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    showWarning('Storage full. Export your plan.');
  }
}
```

## Initialization Flow

```javascript
// On page load
1. Check localStorage for existing trip
2. If exists: Load and populate forms
3. If not: Initialize empty state
4. Set up event listeners
5. Show welcome section
6. Run validation check
7. Update progress indicators
```

---

End of Technical Architecture Document
