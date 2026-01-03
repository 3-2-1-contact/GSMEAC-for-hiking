# GSMEAC Backpacking Planner

> Inspired by https://byland.co/blog/military-grade-planning-for-backpacking

A vanilla JavaScript web application for planning backpacking trips using the military GSMEAC (Ground, Situation, Mission, Execution, Administration, Command & Control) framework.

## Features

- **No frameworks or build tools** - Pure HTML, CSS, and vanilla JavaScript
- **Offline-capable** - All data stored locally in browser localStorage
- **Auto-save** - Changes automatically saved as you type
- **Mobile-friendly** - Responsive design works on all devices
- **Printable output** - Generate print-friendly trip plans
- **JSON export/import** - Backup and share your trip plans

## GSMEAC Framework

**G - Ground**: Define terrain, vegetation, trail type, and route characteristics

**S - Situation/Season**: Specify who's going, group size, experience level, and season

**M - Mission**: Clear trip objectives and mission statement

**E - Execution**: Day-by-day itinerary with start/end points and distances

**A - Administration**: Logistics including travel, accommodation, gear, food, permits, and costs

**C - Command & Control**: Emergency contacts, check-in dates, and communication plan

## Getting Started

Simply open `index.html` in a modern web browser. No build process or server required.

### Browser Requirements

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Project Structure

```
/
├── index.html          # Main application HTML
├── css/
│   ├── reset.css       # CSS reset
│   ├── layout.css      # Layout and structure
│   └── forms.css       # Form element styling
├── js/
│   ├── state.js        # State management and localStorage
│   ├── app.js          # Main application controller
│   ├── navigation.js   # Section navigation
│   ├── validation.js   # Field validation
│   └── export.js       # Summary generation and export
└── README.md
```

## Data Storage

All trip data is stored locally in your browser's localStorage under the key `gsmeac_trip_current`. No data is sent to any server.

### Backup Strategy

The application automatically maintains 3 backup copies of your trip data for recovery purposes.

## Development

This is a vanilla JavaScript project with no dependencies or build process.

To test locally:

1. Open `index.html` in a web browser
2. Use browser developer tools to inspect localStorage
3. All JavaScript is unminified for easy debugging

## License

This project is open source and available for personal use.

## Version

Current version: 1.0
