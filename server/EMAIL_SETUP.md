# Email Setup Guide for Forget Password Feature

## Problem

If you're getting the error: `Missing credentials for "PLAIN"`, it means your email credentials are not configured in the `.env` file.

## Solution: Set up Gmail App Password

### Step 1: Create a `.env` file in the `server` directory

Create a file named `.env` in the `server` folder with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/lms

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Email Configuration (Gmail)
USER_EMAIL=your-email@gmail.com
USER_PASSWORD=your-gmail-app-password
```

### Step 2: Get Gmail App Password

**IMPORTANT:** You cannot use your regular Gmail password. You need to create an App Password.

1. **Enable 2-Step Verification** (if not already enabled):

   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Click on "Security" in the left sidebar
   - Under "Signing in to Google", enable "2-Step Verification"

2. **Generate App Password**:

   - Go to [Google Account Settings > Security](https://myaccount.google.com/security)
   - Under "Signing in to Google", click on "App passwords"
   - Select "Mail" as the app and "Other (Custom name)" as the device
   - Enter a name like "LMS Password Reset"
   - Click "Generate"
   - Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

3. **Add to `.env` file**:
   - Replace `your-email@gmail.com` with your actual Gmail address
   - Replace `your-gmail-app-password` with the 16-character app password (remove spaces)

### Step 3: Restart your server

After creating/updating the `.env` file, restart your server:

```bash
# Stop the server (Ctrl+C)
# Then restart it
npm run dev
```

## Example `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/lms
JWT_SECRET=my-super-secret-jwt-key-12345
JWT_EXPIRES_IN=15m
FRONTEND_URL=http://localhost:5173
USER_EMAIL=john.doe@gmail.com
USER_PASSWORD=abcdefghijklmnop
```

## Troubleshooting

### Error: "Invalid login"

- Make sure you're using an App Password, not your regular Gmail password
- Make sure 2-Step Verification is enabled
- Make sure there are no spaces in the App Password

### Error: "Less secure app access"

- Gmail no longer supports "Less secure app access"
- You MUST use App Passwords instead

### Alternative: Use a different email service

If you don't want to use Gmail, you can modify `server/config/sendMail.js` to use:

- Outlook/Office365
- SendGrid
- Mailgun
- Amazon SES
- Other SMTP providers

## Testing

After setting up, test the forget password feature:

1. Go to the login page
2. Click "forget your password?"
3. Enter your email
4. Check your email for the OTP
5. Enter the OTP to verify
6. Reset your password

If you still get errors, check the server console for detailed error messages.
