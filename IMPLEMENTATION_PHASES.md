# Implementation Phases Document

## Overview

Break down implementation into logical, testable phases. Each phase produces working functionality that can be tested independently.

---

## Phase 1: Foundation & Welcome Screen

### Goal

Basic app structure, state management, and welcome screen functioning.

### Deliverables

1. **File Structure**
   - Create directory structure (css/, js/)
   - Create all HTML/CSS/JS files
   - Set up basic HTML5 boilerplate

2. **State Management** (`js/state.js`)
   - DEFAULT_STATE constant
   - loadState() function
   - saveState() function with debouncing
   - updateState() function
   - resetState() function
   - localStorage error handling

3. **Welcome Screen** (`index.html`)
   - HTML structure for welcome section
   - Trip name, description, date inputs
   - "Continue to Planning" button
   - Load/Import buttons (disabled for now)
   - Auto-save indicator

4. **Basic Styling** (`css/`)
   - reset.css
   - layout.css (container, sections)
   - forms.css (basic input styling)
   - Utilitarian color scheme applied

5. **App Initialization** (`js/app.js`)
   - DOMContentLoaded handler
   - State initialization
   - Event listener setup
   - Auto-save indicator logic

### Test Criteria

- [ ] Welcome screen displays correctly
- [ ] Trip name/description/dates save to localStorage
- [ ] Auto-save indicator shows "Saving..." then "Saved"
- [ ] Page reload preserves entered data
- [ ] Console shows no errors

### Estimated Files

- index.html
- css/reset.css
- css/layout.css
- css/forms.css
- js/app.js
- js/state.js

---

## Phase 2: Navigation System

### Goal

Progress bar navigation and section showing/hiding.

### Deliverables

1. **Progress Bar** (`index.html`)
   - Sticky navigation at top
   - G, S, M, E, A, C, Review buttons
   - Current section highlighting
   - Completed section indicators

2. **Navigation Logic** (`js/navigation.js`)
   - showSection(sectionId) function
   - updateProgressBar() function
   - URL hash routing (#ground, etc.)
   - Section visibility toggle

3. **Section Containers**
   - HTML structure for all 7 GSMEAC sections
   - Initially hidden except welcome
   - Each has Back/Next buttons

4. **Navigation Styling**
   - Progress bar CSS
   - Active/completed/pending states
   - Mobile responsive (icons only)

### Test Criteria

- [ ] Progress bar displays at top
- [ ] Clicking section in progress bar shows that section
- [ ] Back/Next buttons navigate correctly
- [ ] URL hash updates on navigation
- [ ] Direct URL with hash loads correct section
- [ ] Current section highlighted in progress bar

### Estimated Files

- js/navigation.js (new)
- Update: index.html, css/layout.css

---

## Phase 3: Ground Section

### Goal

Complete Ground section with all inputs functioning.

### Deliverables

1. **Ground HTML**
   - Terrain type checkboxes (4 types)
   - Vegetation radio buttons (3 options)
   - Trail type radio buttons (3 options)
   - Route coverage radio buttons (2 options)
   - Elevation notes textarea
   - Map links dynamic list (add/remove)

2. **Ground State Binding**
   - Connect inputs to state.ground
   - Handle checkbox arrays
   - Handle radio button changes
   - Handle textarea input
   - Handle map links array manipulation

3. **Map Links UI**
   - Add link button
   - Remove link button per entry
   - URL and description inputs

### Test Criteria

- [ ] All inputs save to state.ground
- [ ] Checkboxes support multiple selection
- [ ] Radio buttons enforce single selection
- [ ] Map links can be added/removed
- [ ] State persists after reload
- [ ] All inputs display saved values

### Estimated Files

- Update: index.html (ground section)
- Update: css/forms.css
- Update: js/app.js (event handlers)

---

## Phase 4: Situation & Season Section

### Goal

Complete Situation/Season section.

### Deliverables

1. **Situation HTML**
   - Travel type radio buttons
   - Group size number input (conditional)
   - Experience level radio buttons
   - Special considerations textarea

2. **Season HTML**
   - Season radio buttons (4 seasons)
   - Expected weather textarea
   - Weather risks textarea
   - Winter warning banner (conditional)

3. **Conditional Logic**
   - Show group size only if "Group" selected
   - Show winter warning if "Winter" selected
   - Warning banner styling (yellow background)

4. **State Binding**
   - Connect all inputs to state.situation
   - Connect all inputs to state.season
   - Handle conditional field visibility

### Test Criteria

- [ ] All inputs save to state
- [ ] Group size shows/hides based on travel type
- [ ] Winter warning appears when winter selected
- [ ] State persists after reload
- [ ] Section accessible via navigation

### Estimated Files

- Update: index.html (situation section)
- Update: css/forms.css (warning banner)
- Update: js/app.js (conditional logic)

---

## Phase 5: Mission Section

### Goal

Mission section with auto-summary generation.

### Deliverables

1. **Mission HTML**
   - Mission statement textarea
   - Mission type radio buttons (4 types)
   - Auto-summary display (read-only)

2. **Auto-Summary Generation**
   - generateMissionSummary() function
   - Pulls data from Ground, Situation, Season
   - Updates on any upstream data change
   - Display in formatted box

3. **Summary Styling**
   - Read-only summary box
   - Distinguished from input fields
   - Clear visual hierarchy

### Test Criteria

- [ ] Mission statement saves to state
- [ ] Mission type saves to state
- [ ] Auto-summary generates correctly
- [ ] Summary updates when Ground/Situation/Season change
- [ ] Summary displays trip duration if dates set

### Estimated Files

- Update: index.html (mission section)
- js/calculations.js (new - for all auto-calculations)
- Update: js/app.js (trigger summary updates)

---

## Phase 6: Execution Section

### Goal

Day-by-day itinerary with dynamic table.

### Deliverables

1. **Execution HTML**
   - Travel style radio buttons
   - Direction radio buttons
   - Daily plan table
   - Add Day button
   - Remove Last Day button
   - Total distance display

2. **Dynamic Table Logic**
   - addDay() function
   - removeDay() function
   - Pre-populate from trip dates
   - Update state.execution.dailyPlan array

3. **Distance Calculation**
   - calculateTotalDistance() function
   - Auto-update on any distance change
   - Display total below table

4. **Table Styling**
   - Clean table layout
   - Mobile responsive (stack on small screens)
   - Tab navigation through cells

### Test Criteria

- [ ] Table pre-populates with correct day count from trip dates
- [ ] Add Day button adds new row
- [ ] Remove Last Day button removes row (with confirmation)
- [ ] All table inputs save to state
- [ ] Total distance calculates correctly
- [ ] Total updates in real-time

### Estimated Files

- Update: index.html (execution section)
- Update: css/forms.css (table styling)
- Update: js/calculations.js
- Update: js/app.js (table manipulation)

---

## Phase 7: Administration Section (Part 1)

### Goal

First half of Administration: Travel, Accommodation, Gear, Food/Fuel.

### Deliverables

1. **Collapsible Sections UI**
   - Collapsible header component
   - Expand/collapse functionality
   - Default: all expanded

2. **Travel Subsection**
   - Transport to start input
   - Transport from end input
   - Special logistics textarea

3. **Accommodation Subsection**
   - Type radio buttons (4 types)
   - Nights required number input
   - Booking status input

4. **Gear Subsection**
   - Season-based checklist (from state.season)
   - Checkboxes for each item
   - Custom item add functionality
   - Additional notes textarea

5. **Food/Fuel Subsection**
   - Days of food number input
   - Emergency days number input
   - Calories/day number input
   - Fuel notes textarea

6. **Gear Preset Logic**
   - loadGearChecklist() function
   - Reads GEAR_PRESETS based on season
   - Populates checklist on season change

### Test Criteria

- [ ] All subsections collapsible
- [ ] All inputs save to state.administration
- [ ] Gear checklist loads based on selected season
- [ ] Custom gear items can be added
- [ ] Days of food suggests value from execution days

### Estimated Files

- Update: index.html (administration section)
- Update: css/forms.css (collapsible sections)
- Update: js/app.js (collapsible logic, gear presets)
- Update: js/calculations.js (food days suggestion)

---

## Phase 8: Administration Section (Part 2)

### Goal

Second half of Administration: Permits, Navigation, First Aid, Costing.

### Deliverables

1. **Permits Subsection**
   - Required checkbox
   - Booking deadlines input
   - Notes textarea

2. **Navigation Subsection**
   - Map & compass checkbox
   - Digital tools input

3. **First Aid Subsection**
   - Kit type input
   - PLB carried checkbox

4. **Costing Subsection**
   - Travel cost number input
   - Accommodation cost number input
   - Food cost number input
   - Permits cost number input
   - Other cost number input
   - Total cost display (auto-calculated)

5. **Cost Calculation**
   - calculateTotalCost() function
   - Auto-update on any cost field change
   - Display with separator line above

### Test Criteria

- [ ] All inputs save to state.administration
- [ ] Total cost calculates correctly
- [ ] Total updates in real-time
- [ ] Number inputs only accept valid numbers
- [ ] All subsections maintain collapsed state

### Estimated Files

- Update: index.html (administration section)
- Update: js/calculations.js
- Update: js/app.js

---

## Phase 9: Command & Control Section

### Goal

Emergency contacts and communication plan.

### Deliverables

1. **Command & Control HTML**
   - Home contact name input
   - Contact method input
   - Expected check-in date picker
   - Emergency instructions textarea
   - Device carried radio buttons (4 types)
   - Group briefed checkbox

2. **Auto-populate Check-in Date**
   - Default to trip end date + 1 day
   - Update if trip dates change

3. **Safety Warning**
   - If solo + device "none", show warning
   - Non-blocking, just advisory

### Test Criteria

- [ ] All inputs save to state.commandControl
- [ ] Check-in date defaults to end date + 1
- [ ] Warning shows for solo + no device
- [ ] State persists after reload

### Estimated Files

- Update: index.html (commandControl section)
- Update: js/app.js (default check-in date logic)

---

## Phase 10: Validation System

### Goal

Warning badges and incomplete field indicators.

### Deliverables

1. **Validation Logic** (`js/validation.js`)
   - validateSection() function for each section
   - checkCriticalFields() function
   - updateValidationWarnings() function
   - Store warnings in state.meta.validationWarnings

2. **Warning Display**
   - Yellow badge on progress bar for incomplete sections
   - Warning message below critical empty fields
   - Non-blocking (informational only)

3. **Critical Field Checks**
   - Implement checks for all critical fields per DATA_SCHEMA
   - Display count of warnings per section

4. **Real-time Validation**
   - Run validation on state change
   - Update badges immediately
   - Debounce for performance

### Test Criteria

- [ ] Progress bar shows warning badges for incomplete sections
- [ ] Warning messages display below empty critical fields
- [ ] Warnings update in real-time
- [ ] Warnings don't block navigation
- [ ] Warning count accurate

### Estimated Files

- js/validation.js (new)
- Update: js/app.js (trigger validation)
- Update: css/layout.css (warning badge styling)

---

## Phase 11: Review & Export Section

### Goal

Summary generation and export functionality.

### Deliverables

1. **Summary Generation** (`js/export.js`)
   - generateTextSummary() function
   - Format all sections into readable text
   - Include all key data points
   - Use ASCII formatting for structure

2. **Review Section HTML**
   - Display area for generated summary
   - Print button
   - Download JSON button
   - Start New Trip button
   - Back to Edit link

3. **Print Functionality**
   - window.print() implementation
   - print.css media query
   - Format summary for printing
   - Hide UI elements in print view

4. **JSON Export**
   - exportStateJSON() function
   - Create downloadable file
   - Filename: gsmeac-trip-[name]-[date].json
   - Include export metadata

5. **Start New Trip**
   - Confirmation dialog
   - Save current to backup
   - Reset to default state
   - Return to welcome screen

### Test Criteria

- [ ] Summary displays all entered data
- [ ] Summary formats correctly
- [ ] Print button opens print dialog
- [ ] Print view shows only summary
- [ ] JSON download works
- [ ] Downloaded JSON is valid
- [ ] Start New Trip resets state after confirmation

### Estimated Files

- js/export.js (new)
- css/print.css (new)
- Update: index.html (review section)
- Update: js/app.js (export/reset handlers)

---

## Phase 12: Polish & Refinement

### Goal

Final touches, responsive design, error handling.

### Deliverables

1. **Responsive Design**
   - Test and fix mobile layouts
   - Progress bar mobile view (icons only)
   - Table → card layout on mobile
   - Touch target sizes (48px minimum)

2. **Error Handling**
   - localStorage quota exceeded handling
   - Invalid JSON import handling
   - Network offline detection (future)
   - Graceful degradation

3. **Performance Optimization**
   - Audit debounce delays
   - Minimize reflows
   - Test with large data sets

4. **Accessibility**
   - ARIA labels for icon buttons
   - Focus management
   - Keyboard navigation
   - Screen reader testing

5. **Documentation**
   - README.md with usage instructions
   - Inline code comments
   - JSDoc for main functions

6. **Cross-browser Testing**
   - Test in Chrome, Firefox, Safari
   - Fix any compatibility issues
   - Verify localStorage behavior

### Test Criteria

- [ ] Works on mobile (iOS Safari, Android Chrome)
- [ ] All error states handled gracefully
- [ ] No console errors or warnings
- [ ] Keyboard navigation works throughout
- [ ] WCAG AA compliant
- [ ] README complete

### Estimated Files

- README.md
- Update: all CSS files (responsive)
- Update: all JS files (error handling, comments)

---

## Phase 13: JSON Import (Optional Enhancement)

### Goal

Allow importing previously exported JSON files.

### Deliverables

1. **Import UI**
   - File input button on welcome screen
   - Drag-and-drop zone (optional)

2. **Import Logic**
   - importStateJSON() function
   - JSON validation
   - Schema version checking
   - Merge with current state or replace

3. **Error Handling**
   - Invalid JSON error
   - Wrong schema version warning
   - Corrupt data handling

### Test Criteria

- [ ] Can import previously exported JSON
- [ ] Invalid JSON shows error message
- [ ] Imported data populates all sections
- [ ] Import doesn't break existing state

### Estimated Files

- Update: js/state.js (import function)
- Update: index.html (file input)
- Update: js/app.js (file handling)

---

## Testing Checklist (All Phases)

### Functionality

- [ ] All inputs save to state
- [ ] All state loads from localStorage
- [ ] Navigation works in all directions
- [ ] Auto-calculations update correctly
- [ ] Dynamic lists (days, map links) work
- [ ] Validation shows appropriate warnings
- [ ] Export produces correct output
- [ ] Print layout is usable

### Data Persistence

- [ ] Data persists across page reloads
- [ ] Auto-save doesn't lose data
- [ ] localStorage quota exceeded handled
- [ ] State structure matches schema

### UI/UX

- [ ] Layout is clean and readable
- [ ] Forms are easy to fill out
- [ ] Navigation is intuitive
- [ ] Progress bar clearly shows status
- [ ] Warnings are visible but not intrusive
- [ ] Mobile layout is usable

### Performance

- [ ] Page loads quickly (<1s)
- [ ] No janky scrolling or input lag
- [ ] Auto-save doesn't block UI
- [ ] Large datasets handled well

### Browser Compatibility

- [ ] Works in Chrome 90+
- [ ] Works in Firefox 88+
- [ ] Works in Safari 14+
- [ ] Works on iOS Safari
- [ ] Works on Android Chrome

---

## Build Order Summary

```
Phase 1:  Foundation & Welcome        [1-2 hours]
Phase 2:  Navigation System           [1-2 hours]
Phase 3:  Ground Section             [1 hour]
Phase 4:  Situation & Season         [1 hour]
Phase 5:  Mission Section            [1 hour]
Phase 6:  Execution Section          [2 hours]
Phase 7:  Administration Part 1      [2 hours]
Phase 8:  Administration Part 2      [1 hour]
Phase 9:  Command & Control          [1 hour]
Phase 10: Validation System          [1-2 hours]
Phase 11: Review & Export            [2 hours]
Phase 12: Polish & Refinement        [2-3 hours]
Phase 13: JSON Import (optional)     [1 hour]

Total estimated: 17-21 hours
```

---

## Success Criteria (Overall)

- User can complete full GSMEAC plan in < 30 minutes
- All data persists reliably
- Output is printable and useful
- No frameworks or build tools required
- Works offline
- Mobile-friendly
- Clean, utilitarian interface

---

End of Implementation Phases Document
