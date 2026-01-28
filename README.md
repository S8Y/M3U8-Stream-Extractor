# Stream Extractor 🎬

Find and copy streaming links from any website with one click. No more digging through page source code or wrestling with developer tools.

## What It Does

- Scans any webpage for M3U and M3U8 streaming links
- Uses smart detection methods, starting with the most reliable ones
- Automatically copies the first link it finds to your clipboard
- Shows all discovered links in a sleek dark popup
- Click any link to instantly copy it

## Quick Start

1. **Install**: Download this repo as a ZIP, extract it
2. **Load Extension**: Firefox → `about:debugging` → "This Firefox" → "Load Temporary Add-on" → Select `manifest.json`
3. **Use**: Click the 🎬 icon in your toolbar, then "Extract Stream Links"
4. **Done**: Links are copied and ready to paste into your media player

## How It Works

The extension is smart - it tries different extraction methods in order of reliability and stops when it finds what you need:

1. **Direct Links** - Finds obvious M3U/M3U8 links in the page
2. **Playlist Files** - Searches JavaScript for hidden playlist URLs  
3. **Network Requests** - Checks browser activity for streaming files
4. **Iframe/Embed** - Looks inside embedded content
5. **Text Patterns** - Scans page text for stream URLs
6. **Meta Tags** - Checks meta tags for streaming info

## Who This Is For

Perfect for anyone who:
- Watches IPTV streams
- Catches live sports online
- Uses video platforms with HLS streaming
- Wants to watch streams in their favorite media player
- Hates digging through page source code

## Privacy First

This extension respects your privacy:
- Only reads the current tab you're on
- Doesn't track your browsing history
- Doesn't send data anywhere
- Works completely offline
- No ads, no analytics, no nonsense

## Browser Support

- Firefox (tested and working)
- Should work with Firefox-based browsers

## Contributing

Found a site where it doesn't work? Awesome! Open an issue or submit a pull request. The extraction logic lives in `content.js` if you want to add new detection methods.

## License

MIT License - use it however you want.

---

**Built for people who just want their streams, without the hassle** 🎯