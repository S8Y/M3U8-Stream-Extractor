# Installation Guide for Firefox Store Submission

## Preparation Steps

### 1. Create Extension Icons
You'll need to create actual PNG icon files in the `icons/` folder:
- `icon16.png` (16x16 pixels)
- `icon32.png` (32x32 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

Design suggestion: Dark theme with a play button or streaming symbol

### 2. Test Extension
```bash
# Install web-ext globally
npm install -g web-ext

# Test extension
web-ext run

# Build for submission
web-ext build
```

### 3. Store Submission
1. Go to [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)
2. Upload the built `.xpi` file from `web-ext-artifacts/`
3. Use information from `store.txt` for listing
4. Submit for review

## Requirements Met
✅ Permissions are minimal and justified  
✅ Privacy-focused (no data collection)  
✅ Clean user interface  
✅ No external dependencies  
✅ No ads or analytics  
✅ Works offline  
✅ Follows Mozilla guidelines  

## Store Categories
- Primary: Utilities
- Secondary: Video & Audio

## Expected Review Process
- Should pass automated checks
- Manual review typically 1-3 days
- No policy violations expected