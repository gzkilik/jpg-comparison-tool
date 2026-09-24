# JPG Comparison Panel

A web-based image comparison tool for loading, comparing, and analyzing JPG files side-by-side with synchronized zoom and pan controls.

## Features

- **Multiple Image Support**: Load any number of JPG files in a responsive layout
  - Row layout is selected by default
  - Optional grid layout is available from the top bar

- **Synchronized Controls**:
  - Zoom in/out applied to all images simultaneously
  - Pan/move all images together
  - All view changes synchronized across all displayed images

- **Intuitive Controls**:
  - File browser dialog or drag-and-drop file loading
  - Mouse wheel zoom
  - Click-and-drag panning
  - Keyboard shortcuts for quick actions

- **Undo/Redo History**:
  - Full undo/redo stack (up to 50 steps)
  - Revert zoom/pan changes easily
  - Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Y (redo)

- **Session Persistence**:
  - Browser automatically saves your zoom/pan state
  - View state is restored on page refresh
  - Metadata about loaded images is preserved

## How to Use

### Opening the Tool
1. Open `index.html` in any modern web browser
2. Allow browser to show the drop zone

### Loading Images
**Option 1 - File Dialog:**
1. Click "Open Images" button
2. Select 1-4 JPG files
3. Images appear in grid layout

**Option 2 - Drag & Drop:**
1. Drag JPG files from your file explorer
2. Drop them onto the drop zone
3. Images load automatically

### Zoom Controls
- **Zoom In**: Click 🔍+ button, press `+`, or scroll wheel up
- **Zoom Out**: Click 🔍− button, press `-`, or scroll wheel down
- **Fit to Screen**: Click "Fit" button to reset zoom to 100%
- **Zoom Range**: 10% to 500%

### Pan/Move Images
- **Mouse Drag**: Click and drag on any image to pan all images together
- **Arrow Keys**: Use ← → ↑ ↓ keys for fine-tuned panning
- **Reset Pan**: Press `R` to reset panning to center

### Undo/Redo
- **Undo**: Click "↶ Undo" or press `Ctrl+Z`
- **Redo**: Click "↷ Redo" or press `Ctrl+Y`
- **Undo Stack**: Stores up to 50 zoom/pan actions

### Other Actions
- **Remove Image**: Click ✕ button on any image thumbnail to remove it
- **Clear All**: Click "Clear All" to remove all images and start fresh
- **Help**: Click "?" button to view keyboard shortcuts
- **Session Save**: Current zoom/pan state is automatically saved to browser storage

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `+` | Zoom In |
| `-` | Zoom Out |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `↑ ↓ ← →` | Pan / Move |
| `R` | Reset Pan to Center |
| Mouse Wheel | Zoom In/Out |
| Click & Drag | Pan on Images |

## Technical Details

### Architecture
- **index.html**: Structure and UI components
- **styles.css**: Responsive grid layout and styling
- **state.js**: Centralized state management (zoom, pan, undo/redo, session storage)
- **app.js**: Event handling, UI logic, and image rendering

### Browser Requirements
- Modern browser with ES6+ support (Chrome, Firefox, Safari, Edge)
- Local file access (no server required)
- Browser local storage (for session persistence)

### File Size Limits
- Typical JPG files: Unlimited
- Large files (>50MB): May impact zoom/pan performance on lower-end machines
- Recommendation: Optimize large images before loading

## Tips

1. **For Detailed Comparisons**: Zoom in to 200-300% for pixel-level analysis
2. **For Quick Overview**: Use Fit button to see all details at once
3. **Session Recovery**: Close and reopen browser tab to restore previous zoom/pan state
4. **Performance**: If panning/zooming feels slow, try with fewer/smaller images

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Drag/pan not working | Ensure mouse cursor is over an image, not the gray area |
| Zoom limits reached | Zoom range is 10%-500%; use Fit to reset |
| Images not loading | Check that files are valid JPG/JPEG format |
| Session not saved | Verify browser allows localStorage (privacy/incognito mode may block it) |

## Future Enhancements

Potential features for future versions:
- Brightness/contrast adjustment
- Image rotation
- Filter presets (grayscale, inverted, etc.)
- Measurement tools
- Side-by-side diff highlighting
- Image annotation and drawing
- Export comparison report

---

**Version**: 1.0  
**Last Updated**: September 2026
