# Settings Module Testing Guide

## Issues Fixed:

### 1. ✅ 413 Payload Too Large Error
- **Fixed**: Increased Express body parser limit to 50MB in `server/app.js`
- **Test**: Upload large images in Company Profile and Document Branding
- **Expected**: No more 413 errors, images upload successfully

### 2. ✅ Company Profile Logo Upload
- **Fixed**: Improved error handling and logo upload logic
- **Test**: 
  1. Open Settings → Company Profile
  2. Upload a logo image
  3. Save the form
- **Expected**: Logo uploads and displays correctly

### 3. ✅ Document Branding Upload
- **Fixed**: Separated logo upload from form save, better error handling
- **Test**:
  1. Open Settings → Document Branding
  2. Upload primary/secondary/favicon logos
  3. Save settings
- **Expected**: Logos upload and settings save successfully

### 4. ✅ Backup & Restore Error Handling
- **Fixed**: Added MongoDB tools availability check and better error messages
- **Test**:
  1. Open Settings → Data Backup & Restore
  2. Click "Create Manual Backup"
- **Expected**: 
  - If mongodump is installed: Backup creates successfully
  - If mongodump is NOT installed: Clear error message about missing MongoDB tools

### 5. ✅ Theme Toggle Functionality
- **Fixed**: Added global theme application and persistence
- **Test**:
  1. Open Settings → Theme & Appearance
  2. Switch to Dark mode
  3. Save changes
  4. Refresh the page
- **Expected**: 
  - Dark mode applies to entire website immediately
  - Theme persists after page refresh
  - CSS classes are applied to html and body elements

## Quick Test Commands:

### Test Company Profile:
```bash
curl -X GET -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/settings/company-profile
```

### Test Theme Settings:
```bash
curl -X GET -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/settings/theme-settings
```

### Test Backup (if mongodump is installed):
```bash
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/settings/backup
```

## MongoDB Tools Installation (for backup/restore):

### Windows:
```bash
# Download MongoDB Database Tools from:
# https://www.mongodb.com/try/download/database-tools
# Extract and add to PATH
```

### macOS:
```bash
brew install mongodb/brew/mongodb-database-tools
```

### Linux:
```bash
# Ubuntu/Debian
wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2004-x86_64-100.7.4.deb
sudo dpkg -i mongodb-database-tools-ubuntu2004-x86_64-100.7.4.deb
```

## Notes:
- All Settings modules now have proper error handling
- Theme changes apply globally and persist across sessions
- Large file uploads are supported (up to 50MB)
- Backup/restore provides clear error messages if MongoDB tools are missing
