# UI/UX Flow Document

## Visual Design Principles

### Utilitarian Aesthetic

- Clean, simple forms with clear labels
- High contrast for readability (black text on white)
- Minimal decorative elements
- Focus on clarity and usability over visual flair
- Monospace font for data display, sans-serif for forms

### Layout System

- **Max width**: 900px centered container
- **Spacing**: 16px base unit (1rem)
- **Typography**: System font stack for performance
- **Colors**: Grayscale + single accent color (green for success/progress)

### Color Palette

```css
--bg-primary: #ffffff
--bg-secondary: #f5f5f5
--bg-tertiary: #e5e5e5
--text-primary: #1a1a1a
--text-secondary: #666666
--border: #cccccc
--accent: #2d7a3e (forest green)
--warning: #856404 (dark yellow-brown)
--warning-bg: #fff3cd
--error: #721c24
--error-bg: #f8d7da
```

## Progress Navigation Bar

### Layout

```
┌────────────────────────────────────────────────────────────┐
│  [G] → [S] → [M] → [E] → [A] → [C] → [Review]             │
│  Ground  Situation  Mission  Execution  Admin  C&C         │
└────────────────────────────────────────────────────────────┘
```

### States

- **Current**: Bold, green background, white text
- **Completed**: Green checkmark, clickable
- **Pending**: Gray, clickable but no enforcement
- **Validation warning**: Yellow dot badge

### Behavior

- Always visible at top (sticky)
- Click any section to jump
- Shows warning badges for incomplete critical fields
- Collapses to icons only on mobile

## Section-by-Section UI Specification

---

## 1. Welcome / Overview

### Purpose

Introduce the GSMEAC method and start new trip.

### Layout

```
┌──────────────────────────────────────────┐
│  GSMEAC Backpacking Planner              │
│                                          │
│  [Brief explanation of GSMEAC method]    │
│                                          │
│  Trip Name: [_____________________]      │
│  Description: [___________________]      │
│              [___________________]      │
│                                          │
│  Start Date: [__________]                │
│  End Date:   [__________]                │
│                                          │
│  [Continue to Planning] button           │
│                                          │
│  --- OR ---                              │
│                                          │
│  [Load Previous Trip] button             │
│  [Import from JSON] button               │
└──────────────────────────────────────────┘
```

### Elements

- **H1**: "GSMEAC Backpacking Planner"
- **Info box**: 3-4 sentence explanation of GSMEAC
- **Form fields**: Trip name (required), description (optional), dates
- **Primary CTA**: "Continue to Planning" → shows Ground section
- **Secondary actions**: Load/Import (if localStorage has data)
- **Auto-save indicator**: Small text "Auto-saving..." (appears on change)

### Validation

- Warning if trip name empty (but can proceed)
- Info message showing calculated trip duration from dates

---

## 2. Ground Section

### Purpose

Define terrain and route characteristics.

### Layout

```
┌──────────────────────────────────────────┐
│  G - GROUND                              │
│  What is the terrain and route?          │
│                                          │
│  Terrain Type (select all that apply):   │
│  ☐ Flat     ☐ Hills                     │
│  ☐ Mountains  ☐ Alpine                   │
│                                          │
│  Vegetation:                             │
│  ○ Open   ○ Bush   ○ Mixed              │
│                                          │
│  Trail Type:                             │
│  ○ Established trail                     │
│  ○ Partial trail                         │
│  ○ Off-trail / cross-country             │
│                                          │
│  Route Coverage:                         │
│  ○ Section hike                          │
│  ○ Full trail / through-hike             │
│                                          │
│  Elevation Notes:                        │
│  [_____________________________]         │
│  [_____________________________]         │
│                                          │
│  Map Links:                              │
│  Link 1: [URL] [Description]  [Remove]   │
│  [+ Add Map Link]                        │
│                                          │
│  [< Back]  [Next: Situation >]           │
└──────────────────────────────────────────┘
```

### Elements

- **Section header**: "G - GROUND" with subtitle
- **Checkboxes**: Terrain types (multiple selection)
- **Radio buttons**: Vegetation, trail type, route coverage
- **Textarea**: Elevation notes (3-4 rows)
- **Dynamic list**: Map links with add/remove
- **Navigation**: Back to welcome, Next to Situation

### Validation Warnings

- No terrain types selected: "Consider selecting terrain type"
- No trail type selected: "Trail type helps plan navigation"

---

## 3. Situation / Season Section

### Purpose

Define who's going and when.

### Layout

```
┌──────────────────────────────────────────┐
│  S - SITUATION & SEASON                  │
│  Who's going and in what conditions?     │
│                                          │
│  === SITUATION ===                       │
│                                          │
│  Travel Type:                            │
│  ○ Solo   ○ Group                        │
│                                          │
│  Group Size: [___] people                │
│  (shown if Group selected)               │
│                                          │
│  Experience Level:                       │
│  ○ Novice                                │
│  ○ Mixed experience                      │
│  ○ Experienced                           │
│                                          │
│  Special Considerations:                 │
│  [_____________________________]         │
│  (ages, fitness, medical, etc.)          │
│                                          │
│  === SEASON ===                          │
│                                          │
│  Season:                                 │
│  ○ Spring  ○ Summer  ○ Fall  ○ Winter   │
│                                          │
│  [!] Winter warning (if selected)        │
│                                          │
│  Expected Weather:                       │
│  [_____________________________]         │
│                                          │
│  Known Weather Risks:                    │
│  [_____________________________]         │
│                                          │
│  [< Back]  [Next: Mission >]             │
└──────────────────────────────────────────┘
```

### Elements

- **Two sub-sections**: Visually separated
- **Conditional field**: Group size only shows if Group selected
- **Warning banner**: Yellow background if Winter selected
  - "Winter travel requires additional planning and experience"
- **Text areas**: Special considerations, weather notes

### Validation Warnings

- No travel type: "Select solo or group travel"
- No experience level: "Experience level helps plan difficulty"
- No season: "Season affects gear and planning"

---

## 4. Mission Section

### Purpose

Articulate the trip purpose in 1-2 sentences.

### Layout

```
┌──────────────────────────────────────────┐
│  M - MISSION                             │
│  What is the purpose of this trip?       │
│                                          │
│  Mission Statement:                      │
│  [_____________________________]         │
│  [_____________________________]         │
│  (1-2 sentences)                         │
│                                          │
│  Mission Type:                           │
│  ○ Family trip                           │
│  ○ Solo adventure                        │
│  ○ Shakeout / gear test                  │
│  ○ Through-hike / long distance          │
│                                          │
│  === AUTO-SUMMARY ===                    │
│  ┌────────────────────────────┐          │
│  │ Based on your inputs:      │          │
│  │                            │          │
│  │ Terrain: [summary]         │          │
│  │ Group: [summary]           │          │
│  │ Season: [summary]          │          │
│  └────────────────────────────┘          │
│                                          │
│  [< Back]  [Next: Execution >]           │
└──────────────────────────────────────────┘
```

### Elements

- **Textarea**: Mission statement (2-3 rows)
- **Radio buttons**: Mission type
- **Read-only summary**: Auto-generated from Ground/Situation/Season
- **Helper text**: Example mission statement

### Validation Warnings

- Empty mission statement: "Mission statement helps focus planning"

### Auto-summary Logic

```javascript
// Example output:
"3-day solo trip through mountainous terrain on established trails
during summer. Experienced hiker."
```

---

## 5. Execution Section

### Purpose

Create day-by-day itinerary.

### Layout

```
┌──────────────────────────────────────────┐
│  E - EXECUTION                           │
│  Day-by-day travel plan                  │
│                                          │
│  Travel Style:                           │
│  ○ Moving daily                          │
│  ○ Base camp                             │
│  ○ Hub & spoke                           │
│                                          │
│  Direction:                              │
│  ○ North  ○ South  ○ East  ○ West       │
│  ○ Loop / circular                       │
│                                          │
│  === DAILY PLAN ===                      │
│                                          │
│  ┌───┬─────────┬─────────┬─────┬───────┐│
│  │Day│  Start  │   End   │ Km  │ Notes ││
│  ├───┼─────────┼─────────┼─────┼───────┤│
│  │ 1 │ [_____] │ [_____] │ [_] │ [___] ││
│  │ 2 │ [_____] │ [_____] │ [_] │ [___] ││
│  │ 3 │ [_____] │ [_____] │ [_] │ [___] ││
│  └───┴─────────┴─────────┴─────┴───────┘│
│                                          │
│  [+ Add Day]  [- Remove Last Day]        │
│                                          │
│  Total Distance: XX km (auto-calc)       │
│                                          │
│  [< Back]  [Next: Administration >]      │
└──────────────────────────────────────────┘
```

### Elements

- **Radio buttons**: Travel style and direction
- **Dynamic table**: Add/remove rows for each day
- **Auto-calculation**: Sum total distance
- **Pre-populated days**: Based on trip dates if available

### Table Behavior

- Default: Pre-populate days from trip dates
- Add Day: Append new row
- Remove: Delete last row (confirm if >1 day)
- Tab navigation through table cells

### Validation Warnings

- No daily plan entries: "Add at least one day to your itinerary"
- Missing start/end locations: "Complete locations for navigation"

---

## 6. Administration Section

### Purpose

Handle logistics, gear, food, costs.

### Layout

```
┌──────────────────────────────────────────┐
│  A - ADMINISTRATION                      │
│  Logistics and preparation               │
│                                          │
│  ▼ TRAVEL                                │
│    Transport to start: [____________]    │
│    Transport from end: [____________]    │
│    Special logistics: [_____________]    │
│                                          │
│  ▼ ACCOMMODATION                         │
│    Type: ○ Hut  ○ Tent  ○ Lodge  ○ Mixed│
│    Nights required: [__]                 │
│    Booking status: [________________]    │
│                                          │
│  ▼ GEAR                                  │
│    [Season-based checklist]              │
│    Additional notes: [______________]    │
│                                          │
│  ▼ FOOD & FUEL                           │
│    Days of food: [__]                    │
│    Emergency days: [__]                  │
│    Calories/day: [____]                  │
│    Fuel notes: [____________________]    │
│                                          │
│  ▼ PERMITS & BOOKINGS                    │
│    ☐ Permit required                     │
│    Booking deadlines: [_____________]    │
│    Notes: [_________________________]    │
│                                          │
│  ▼ NAVIGATION                            │
│    ☐ Map & compass                       │
│    Digital tools: [_________________]    │
│                                          │
│  ▼ FIRST AID                             │
│    Kit type: [______________________]    │
│    ☐ PLB carried                         │
│                                          │
│  ▼ COSTING                               │
│    Travel: $[____]                       │
│    Accommodation: $[____]                │
│    Food: $[____]                         │
│    Permits: $[____]                      │
│    Other: $[____]                        │
│    ────────────────                      │
│    TOTAL: $XXX (auto-calc)               │
│                                          │
│  [< Back]  [Next: Command & Control >]   │
└──────────────────────────────────────────┘
```

### Elements

- **Collapsible sections**: Click header to expand/collapse
- **Default state**: All sections expanded on first view
- **Checkboxes**: Boolean items (permit required, PLB, map/compass)
- **Number inputs**: Costs, days, nights
- **Auto-calculations**:
  - Total cost
  - Days of food (suggested from execution days)

### Gear Checklist

```javascript
// Season-based pre-populated checklist
const gearChecklists = {
  summer: ['Tent/shelter', 'Sleeping bag', 'Mat', 'Stove', 'Water filter', ...],
  winter: ['4-season tent', 'Cold-rated bag', 'Insulated mat', 'Winter stove', ...],
  // etc.
};
```

Rendered as checkboxes with ability to add custom items.

### Validation Warnings

- No transport to start: "Plan how you'll reach the trailhead"
- Food days < execution days: "Food duration seems short"

---

## 7. Command & Control Section

### Purpose

Emergency contacts and communication plan.

### Layout

```
┌──────────────────────────────────────────┐
│  C - COMMAND & CONTROL                   │
│  Emergency contacts and check-in         │
│                                          │
│  Home Contact Name:                      │
│  [_____________________________]         │
│                                          │
│  Contact Method:                         │
│  [_____________________________]         │
│  (phone, email, etc.)                    │
│                                          │
│  Expected Check-in Date:                 │
│  [__________]                            │
│                                          │
│  Emergency Trigger Instructions:         │
│  [_____________________________]         │
│  [_____________________________]         │
│  (what should contact do if overdue?)    │
│                                          │
│  Device Carried:                         │
│  ○ PLB (Personal Locator Beacon)         │
│  ○ InReach / Garmin                      │
│  ○ Zoleo                                 │
│  ○ None / phone only                     │
│                                          │
│  ☐ I have briefed my group on:          │
│    • Emergency procedures                │
│    • Communication plan                  │
│    • Contingency plans                   │
│                                          │
│  [< Back]  [Next: Review & Export >]     │
└──────────────────────────────────────────┘
```

### Elements

- **Text inputs**: Contact name, method
- **Date picker**: Check-in date (defaults to trip end date + 1)
- **Textarea**: Emergency instructions
- **Radio buttons**: Device type
- **Checkbox**: Group briefing confirmation

### Validation Warnings

- No contact name: "Emergency contact is critical for safety"
- No check-in date: "Set expected return date"
- Device "none" + solo travel: "Consider carrying emergency device"

---

## 8. Review & Export Section

### Purpose

View complete plan and export options.

### Layout

```
┌──────────────────────────────────────────┐
│  REVIEW & EXPORT                         │
│  Your complete GSMEAC plan               │
│                                          │
│  [Generated summary displayed here]      │
│  (formatted text version of all data)    │
│                                          │
│  === EXPORT OPTIONS ===                  │
│                                          │
│  [Print Plan] button                     │
│  (opens print dialog)                    │
│                                          │
│  [Download JSON] button                  │
│  (saves full data file)                  │
│                                          │
│  [Start New Trip] button                 │
│  (resets to welcome, keeps backup)       │
│                                          │
│  [< Back to Edit]                        │
└──────────────────────────────────────────┘
```

### Elements

- **Read-only summary**: All sections formatted for readability
- **Print button**: Triggers window.print() with print.css
- **Download JSON**: Triggers file download
- **Start new**: Confirms, then resets state
- **Edit link**: Returns to last viewed section

### Summary Format

```
═══════════════════════════════════════
GSMEAC BACKPACKING PLAN
═══════════════════════════════════════

TRIP: [name]
DATES: [start] to [end] ([X] days)

───────────────────────────────────────
MISSION
───────────────────────────────────────
[mission statement]

Type: [mission type]

───────────────────────────────────────
GROUND
───────────────────────────────────────
Terrain: [types]
Vegetation: [type]
Trail: [type]
Route: [coverage]

Elevation: [notes]

Maps: [links]

[... continues for all sections ...]
```

---

## Responsive Behavior

### Desktop (> 768px)

- Full layout as shown above
- Progress bar with full labels
- Two-column layout for simple forms

### Mobile (≤ 768px)

- Single column layout
- Progress bar shows icons only (G S M E A C R)
- Collapsible sections default to collapsed
- Larger touch targets (48px minimum)
- Table becomes vertically stacked cards

---

## Interaction Patterns

### Auto-save Indicator

```
Top-right corner:
● Saving...     (yellow dot, during save)
✓ Saved         (green checkmark, after save)
⚠ Save failed   (red warning, if error)
```

### Warning Messages

```
┌────────────────────────────────────┐
│ ⚠ Warning                          │
│ [Message text]                     │
│ [Optional action link]             │
└────────────────────────────────────┘
```

Yellow background, dismissible, non-blocking.

### Confirmation Dialogs

Use native `confirm()` for destructive actions:
- Reset trip
- Remove last day
- Clear section

### Loading States

Minimal - only for:
- localStorage read/write errors
- JSON import parsing

---

End of UI/UX Flow Document
