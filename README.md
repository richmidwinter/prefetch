# Prefetch on Hover

A lightweight Chrome/Brave extension that dramatically speeds up browsing by prefetching pages when you hover over links. Inspired by instant.page and Google's prefetching strategies.

## How It Works

The extension uses a three-tier prefetching strategy based on user intent:

- Visible: Link enters viewport - DNS prefetch (Very Low cost)
- Hover: Mouse enters link - Standard prefetch + Fetch API (Low-Medium cost)
- Hold: Hover for 300ms+ - Prerender if supported (High cost)

By the time you click, the page is already in cache - making navigation feel instant.

## Installation

### From Source (Developer Mode)

1. Download or clone this repository
2. Open Chrome/Brave and navigate to: chrome://extensions/ or brave://extensions/
3. Enable Developer Mode (toggle in top-right corner)
4. Click "Load unpacked" and select the extension folder
5. Verify installation - the extension icon should appear in your toolbar

## Features

- Instant Navigation: Pages load from cache before you click
- Smart Throttling: Max 10 prefetches per page, 3 concurrent requests
- Mobile Support: Touch events trigger prefetch on mobile devices
- Intelligent Detection: Only prefetches HTTP/HTTPS links, skips anchors and javascript
- Auto-Cleanup: Removes prefetch hints after 30 seconds to save memory
- Intersection Observer: Only monitors visible links for efficiency
- Privacy-First: Uses no-cors mode, doesn't execute prefetched JavaScript

## Configuration

Edit content.js to adjust behavior:

    const CONFIG = {
      hoverDelay: 100,        // ms to wait before prefetching
      maxPrefetches: 10,      // max prefetches per page session
      maxConcurrent: 3,       // max simultaneous prefetches
      cacheTimeout: 30000     // how long to keep prefetched data (ms)
    };

## Browser Support

Chrome: Full support (Manifest V3)
Brave: Full support (tested primary)
Edge: Full support (Chromium-based)
Firefox: Partial support (requires Manifest V2 port)
Safari: Not supported (Manifest V3 limitations)

## Performance Impact

Memory: ~2-5MB additional RAM per tab
Network: Only prefetches on hover (conservative)
CPU: Minimal - uses native browser prefetching APIs
Battery: Low impact due to throttling limits

## Troubleshooting

Extension won't load:
- Verify all files exist: manifest.json, content.js, background.js, and icons
- Check for hidden file extensions (e.g., content.js.txt)
- Ensure icons are valid PNG files

Prefetching not working:
- Open DevTools (F12) → Console
- Look for [Prefetch] log messages
- Check Network tab for prefetch requests (type: "Prefetch")

Too aggressive / data usage:
- Increase hoverDelay to 200-300ms
- Reduce maxPrefetches to 5

## Privacy & Security

- No data collection - Extension operates locally
- No external requests - Only fetches URLs you hover
- Respects cache headers - Honors server caching directives
- CORS-safe - Uses no-cors mode to prevent cross-origin issues
- No JS execution - Prefetched pages are not parsed or executed

## License

MIT License - feel free to use, modify, and distribute.
