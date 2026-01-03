# Data Schema Document

## Overview

Complete JSON schema for trip data stored in localStorage and exported files.

## Schema Version

Current version: `1.0`

All saved data includes schema version for future migration support.

---

## Complete Data Structure

```json
{
  "schemaVersion": "1.0",
  "createdAt": "2026-01-02T10:30:00.000Z",
  "lastModified": "2026-01-02T11:45:00.000Z",

  "trip": {
    "tripName": "String (required)",
    "description": "String (optional)",
    "startDate": "YYYY-MM-DD (optional)",
    "endDate": "YYYY-MM-DD (optional)"
  },

  "ground": {
    "terrainTypes": ["flat", "hills", "mountains", "alpine"],
    "vegetation": "open | bush | mixed | ''",
    "trailType": "established | partial | off-trail | ''",
    "routeCoverage": "section | full | ''",
    "elevationNotes": "String",
    "mapLinks": [
      {
        "url": "String",
        "description": "String"
      }
    ]
  },

  "situation": {
    "travelType": "solo | group | ''",
    "groupSize": 1,
    "experienceLevel": "novice | mixed | experienced | ''",
    "specialConsiderations": "String"
  },

  "season": {
    "season": "spring | summer | fall | winter | ''",
    "expectedWeather": "String",
    "weatherRisks": "String"
  },

  "mission": {
    "statement": "String",
    "missionType": "family | solo | shakeout | thru-hike | ''"
  },

  "execution": {
    "travelStyle": "moving | basecamp | hub-spoke | ''",
    "direction": "north | south | east | west | loop | ''",
    "dailyPlan": [
      {
        "day": 1,
        "start": "String",
        "end": "String",
        "distance": "Number (kilometers)",
        "notes": "String"
      }
    ]
  },

  "administration": {
    "travel": {
      "transportToStart": "String",
      "transportFromEnd": "String",
      "specialLogistics": "String"
    },
    "accommodation": {
      "type": "hut | tent | lodge | mixed | ''",
      "nightsRequired": 0,
      "bookingStatus": "String"
    },
    "gear": {
      "checklist": [
        {
          "item": "String",
          "checked": false
        }
      ],
      "notes": "String"
    },
    "foodFuel": {
      "daysOfFood": 0,
      "emergencyDays": 0,
      "caloriesPerDay": 0,
      "fuelNotes": "String"
    },
    "permits": {
      "required": false,
      "bookingDeadlines": "String",
      "notes": "String"
    },
    "navigation": {
      "mapAndCompass": false,
      "digitalTools": "String"
    },
    "firstAid": {
      "kitType": "String",
      "plbCarried": false
    },
    "costing": {
      "travel": 0,
      "accommodation": 0,
      "food": 0,
      "permits": 0,
      "other": 0
    }
  },

  "commandControl": {
    "homeContactName": "String",
    "contactMethod": "String",
    "expectedCheckIn": "YYYY-MM-DD",
    "emergencyInstructions": "String",
    "deviceCarried": "plb | inreach | zoleo | none | ''",
    "groupBriefed": false
  },

  "meta": {
    "currentSection": "welcome | ground | situation | mission | execution | administration | commandcontrol | review",
    "completedSections": ["ground", "situation"],
    "validationWarnings": {
      "ground": [],
      "situation": [],
      "mission": [],
      "execution": [],
      "administration": [],
      "commandControl": []
    }
  }
}
```

---

## Field Specifications

### Date Fields

- **Format**: ISO 8601 date string (`YYYY-MM-DD`)
- **Storage**: String
- **Input**: HTML date picker
- **Validation**: None (optional fields)

### Timestamp Fields

- **Format**: ISO 8601 with timezone (`YYYY-MM-DDTHH:mm:ss.sssZ`)
- **Storage**: String
- **Generation**: `new Date().toISOString()`

### Numeric Fields

- **Storage**: Number (not string)
- **Default**: 0 for counts, distances, costs
- **Validation**: Non-negative for counts/costs

### Enum Fields

All enum fields use lowercase strings with specific allowed values.

**Empty state**: Empty string `''` (not null or undefined)

### Array Fields

- **terrainTypes**: Array of strings (0-4 items)
- **mapLinks**: Array of objects
- **dailyPlan**: Array of objects (ordered by day)
- **checklist**: Array of objects
- **completedSections**: Array of strings

---

## Default / Initial State

```javascript
const DEFAULT_STATE = {
  schemaVersion: '1.0',
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString(),

  trip: {
    tripName: '',
    description: '',
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
```

---

## localStorage Structure

### Primary Key

```
gsmeac_trip_current
```

Stores the current/active trip as JSON string.

### Backup Keys

```
gsmeac_trip_backup_1
gsmeac_trip_backup_2
gsmeac_trip_backup_3
```

Stores last 3 saves with timestamps for recovery.

### Metadata Key

```
gsmeac_metadata
```

Stores app-level metadata:

```json
{
  "version": "1.0",
  "lastAccessed": "2026-01-02T10:30:00.000Z",
  "tripCount": 1
}
```

---

## Calculated/Derived Fields

These fields are calculated at runtime, not stored:

### Trip Duration

```javascript
function calculateTripDuration(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  return days;
}
```

### Total Distance

```javascript
function calculateTotalDistance(dailyPlan) {
  return dailyPlan.reduce((sum, day) => sum + (day.distance || 0), 0);
}
```

### Total Cost

```javascript
function calculateTotalCost(costing) {
  return costing.travel +
         costing.accommodation +
         costing.food +
         costing.permits +
         costing.other;
}
```

### Mission Auto-Summary

```javascript
function generateMissionSummary(state) {
  const { ground, situation, season, execution } = state;

  const duration = calculateTripDuration(
    state.trip.startDate,
    state.trip.endDate
  );

  const parts = [];

  if (duration) parts.push(`${duration}-day`);
  if (situation.travelType) parts.push(situation.travelType);
  parts.push('trip');

  if (ground.terrainTypes.length) {
    parts.push(`through ${ground.terrainTypes.join(' and ')} terrain`);
  }

  if (ground.trailType) {
    parts.push(`on ${ground.trailType} trails`);
  }

  if (season.season) {
    parts.push(`during ${season.season}`);
  }

  if (situation.experienceLevel) {
    parts.push(`(${situation.experienceLevel} level)`);
  }

  return parts.join(' ') + '.';
}
```

---

## Validation Rules

### Critical Fields (Warning if Empty)

```javascript
const CRITICAL_FIELDS = {
  ground: [
    'terrainTypes',  // array.length > 0
    'trailType'      // not empty
  ],
  situation: [
    'travelType',
    'experienceLevel'
  ],
  season: [
    'season'
  ],
  mission: [
    'statement'      // not empty
  ],
  execution: [
    'dailyPlan'      // array.length > 0
  ],
  commandControl: [
    'homeContactName',
    'expectedCheckIn'
  ]
};
```

### Data Type Validation

```javascript
function validateField(field, value, type) {
  switch(type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && value >= 0;
    case 'boolean':
      return typeof value === 'boolean';
    case 'array':
      return Array.isArray(value);
    case 'date':
      return /^\d{4}-\d{2}-\d{2}$/.test(value);
    case 'enum':
      return field.allowedValues.includes(value) || value === '';
  }
}
```

---

## Export Formats

### JSON Export

Full state object with metadata:

```json
{
  "exportVersion": "1.0",
  "exportDate": "2026-01-02T10:30:00.000Z",
  "application": "GSMEAC Backpacking Planner",
  "data": {
    /* full state object */
  }
}
```

Filename format: `gsmeac-trip-[tripName]-[date].json`

### Text Export (Print)

Human-readable formatted text, generated from state.

---

## Data Migration

### Future Schema Changes

Include migration functions:

```javascript
function migrateState(state) {
  const version = state.schemaVersion || '1.0';

  if (version === '1.0') {
    // No migration needed
    return state;
  }

  if (version === '1.1') {
    // Migrate from 1.0 to 1.1
    return migrate_1_0_to_1_1(state);
  }

  // etc.
}
```

---

## Size Estimates

Typical trip data size:

- **Minimal trip**: ~2 KB
- **Average trip**: ~5 KB
- **Detailed trip**: ~15 KB

localStorage quota: Typically 5-10 MB (browser dependent)

Capacity: ~500-1000 detailed trips

---

## Gear Checklist Presets

### Season-Based Checklists

```javascript
const GEAR_PRESETS = {
  summer: [
    'Tent/shelter',
    'Sleeping bag (3-season)',
    'Sleeping mat',
    'Backpack',
    'Stove and fuel',
    'Cookware',
    'Water filter/purification',
    'Headlamp + batteries',
    'Rain gear',
    'Warm layer (fleece/down)',
    'Hat and gloves',
    'Sunglasses',
    'Sunscreen',
    'First aid kit',
    'Map and compass',
    'Emergency shelter',
    'Fire starter',
    'Repair kit'
  ],

  winter: [
    '4-season tent',
    'Cold-rated sleeping bag (-10°C or lower)',
    'Insulated sleeping mat (R-value 4+)',
    'Backpack (60L+)',
    'Winter stove (liquid fuel)',
    'Insulated bottle',
    'Cookware',
    'Water bottle insulator',
    'Headlamp + extra batteries',
    'Waterproof shell (jacket/pants)',
    'Insulated jacket',
    'Base layers (thermal)',
    'Winter hat and gloves',
    'Goggles',
    'Sunscreen (high SPF)',
    'First aid kit',
    'Map and compass',
    'Emergency shelter',
    'Fire starter',
    'Repair kit',
    'Avalanche safety gear (if applicable)',
    'Ice axe (if applicable)',
    'Crampons (if applicable)'
  ],

  spring: [
    /* Similar to summer with additions */
    'Extra warm layers',
    'Waterproof boots',
    'Gaiters'
  ],

  fall: [
    /* Similar to summer with additions */
    'Extra warm layers',
    'Longer days of food (shorter daylight)'
  ]
};
```

Loaded into `administration.gear.checklist` when season is selected.

---

## Sample Data (Complete Example)

```json
{
  "schemaVersion": "1.0",
  "createdAt": "2026-01-02T10:00:00.000Z",
  "lastModified": "2026-01-02T11:30:00.000Z",

  "trip": {
    "tripName": "Routeburn Track",
    "description": "Classic 3-day Great Walk",
    "startDate": "2026-02-15",
    "endDate": "2026-02-17"
  },

  "ground": {
    "terrainTypes": ["mountains", "hills"],
    "vegetation": "bush",
    "trailType": "established",
    "routeCoverage": "full",
    "elevationNotes": "Harris Saddle at 1255m, significant elevation gain",
    "mapLinks": [
      {
        "url": "https://www.doc.govt.nz/routeburn",
        "description": "DOC official map"
      }
    ]
  },

  "situation": {
    "travelType": "group",
    "groupSize": 4,
    "experienceLevel": "mixed",
    "specialConsiderations": "One member has knee issues - plan shorter days"
  },

  "season": {
    "season": "summer",
    "expectedWeather": "Variable mountain weather, possible rain",
    "weatherRisks": "Sudden weather changes, high winds at Harris Saddle"
  },

  "mission": {
    "statement": "Complete the Routeburn Track as a family group, enjoying the scenery while building backcountry experience.",
    "missionType": "family"
  },

  "execution": {
    "travelStyle": "moving",
    "direction": "north",
    "dailyPlan": [
      {
        "day": 1,
        "start": "Routeburn Shelter",
        "end": "Routeburn Falls Hut",
        "distance": 8.5,
        "notes": "Gradual climb, arrive early afternoon"
      },
      {
        "day": 2,
        "start": "Routeburn Falls Hut",
        "end": "Lake Mackenzie Hut",
        "distance": 11.5,
        "notes": "Harris Saddle - check weather"
      },
      {
        "day": 3,
        "start": "Lake Mackenzie Hut",
        "end": "The Divide",
        "distance": 12.8,
        "notes": "Long descent, arrange shuttle"
      }
    ]
  },

  "administration": {
    "travel": {
      "transportToStart": "Drive to Glenorchy, park at Routeburn Shelter",
      "transportFromEnd": "Tracknet shuttle from The Divide to Glenorchy",
      "specialLogistics": "Shuttle booked for 4pm pickup"
    },
    "accommodation": {
      "type": "hut",
      "nightsRequired": 2,
      "bookingStatus": "Booked and confirmed via DOC website"
    },
    "gear": {
      "checklist": [
        {"item": "Tent/shelter", "checked": false},
        {"item": "Sleeping bag (3-season)", "checked": true},
        {"item": "Sleeping mat", "checked": true}
      ],
      "notes": "Staying in huts, no tent needed"
    },
    "foodFuel": {
      "daysOfFood": 3,
      "emergencyDays": 1,
      "caloriesPerDay": 2500,
      "fuelNotes": "Gas canister stove, one canister sufficient"
    },
    "permits": {
      "required": true,
      "bookingDeadlines": "Booked 3 months in advance",
      "notes": "Great Walk pass required, already purchased"
    },
    "navigation": {
      "mapAndCompass": true,
      "digitalTools": "Gaia GPS app with offline maps"
    },
    "firstAid": {
      "kitType": "Comprehensive group kit",
      "plbCarried": true
    },
    "costing": {
      "travel": 80,
      "accommodation": 260,
      "food": 150,
      "permits": 0,
      "other": 50
    }
  },

  "commandControl": {
    "homeContactName": "Sarah Johnson",
    "contactMethod": "Mobile: +64 21 555 1234",
    "expectedCheckIn": "2026-02-17",
    "emergencyInstructions": "If not contacted by 8pm on 17 Feb, contact DOC Queenstown and police. PLB carried for emergency.",
    "deviceCarried": "plb",
    "groupBriefed": true
  },

  "meta": {
    "currentSection": "review",
    "completedSections": [
      "ground",
      "situation",
      "mission",
      "execution",
      "administration",
      "commandControl"
    ],
    "validationWarnings": {
      "ground": [],
      "situation": [],
      "mission": [],
      "execution": [],
      "administration": [],
      "commandControl": []
    }
  }
}
```

---

End of Data Schema Document
