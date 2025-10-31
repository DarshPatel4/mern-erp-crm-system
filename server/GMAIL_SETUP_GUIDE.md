# Gmail Setup Guide - Fix "Invalid login" Error

## Quick Fix Steps

If you're getting this error:
```
Invalid login: 535-5.7.8 Username and Password not accepted
```

Follow these steps:

### Step 1: Enable 2-Step Verification

1. Go to https://myaccount.google.com/security
2. Find "2-Step Verification" and click it
3. Follow the prompts to enable it (you'll need your phone)

### Step 2: Generate App Password

1. Go to https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords
2. Select app: Choose "Mail"
3. Select device: Choose "Other (Custom name)"
4. Enter name: "NexusERP Contact Form"
5. Click "Generate"
6. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

### Step 3: Update .env File

Open `server/.env` and add:

```env
GMAIL_USER=darshpatel2531@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

**Important:**
- Replace `abcdefghijklmnop` with your actual 16-character App Password
- Remove any spaces from the App Password
- Do NOT use quotes around the values
- Do NOT use your regular Gmail password

### Step 4: Restart Server

After updating `.env`, restart your server:
```bash
# Stop the server (Ctrl+C)
# Then start again
npm start
# or
npm run dev
```

### Verify It's Working

When you start the server, you should see:
```
✓ Email service configured and verified successfully
```

If you see this, emails will now be sent! 🎉

---

## Common Issues

**Still getting authentication error?**
- ✅ Make sure 2-Step Verification is ENABLED (not just turned on, but fully set up)
- ✅ Make sure you're using the App Password (16 characters, no spaces), not your regular password
- ✅ Make sure there are no extra spaces in your .env file
- ✅ Make sure the email address in GMAIL_USER matches your Gmail account exactly
- ✅ Try generating a NEW App Password and updating .env

**Can't find App Passwords option?**
- Make sure 2-Step Verification is fully enabled and active
- You might need to wait a few minutes after enabling 2-Step Verification
- Try accessing: https://myaccount.google.com/apppasswords directly

---

## Test Your Configuration

1. Fill out the contact form on your website
2. Submit it
3. Check the server console - you should see:
   ```
   ✓ Email service configured and verified successfully
   ✓ Contact form email sent successfully to darshpatel2531@gmail.com
   ```
4. Check your email inbox (darshpatel2531@gmail.com) - you should receive the email!

