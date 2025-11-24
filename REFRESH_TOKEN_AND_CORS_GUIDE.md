# Refresh Token & CORS Implementation Guide

## 📚 Table of Contents

1. [Refresh Token Flow](#refresh-token-flow)
2. [CORS Configuration](#cors-configuration)
3. [Best Practices](#best-practices)
4. [Testing](#testing)

---

## 🔄 Refresh Token Flow

### What are Refresh Tokens?

**Access Token:**

- Short-lived (15 minutes)
- Used for API authentication
- Stored in: `localStorage` (accessible to JavaScript)
- Sent in: `Authorization: Bearer <token>` header

**Refresh Token:**

- Long-lived (7 days)
- Used to get new access tokens
- Stored in: HttpOnly cookie (NOT accessible to JavaScript - more secure!)
- Automatically sent with requests (browser handles it)

### Why Use Refresh Tokens?

1. **Security**: Access tokens expire quickly, limiting damage if stolen
2. **User Experience**: Users don't need to login every 15 minutes
3. **Revocation**: Can invalidate refresh token to logout user from all devices

---

## 🔐 Complete Token Flow

### 1. User Login

```
User logs in
    ↓
Backend generates:
  - accessToken (15 min) → Sent in JSON response
  - refreshToken (7 days) → Sent in HttpOnly cookie
    ↓
Frontend saves:
  - accessToken → localStorage
  - refreshToken → Automatically saved in cookie by browser
```

### 2. Making API Requests

```
Frontend makes API request
    ↓
Request Interceptor adds:
  - Authorization: Bearer <accessToken> (from localStorage)
  - Cookie: refreshToken (automatically sent by browser)
    ↓
Backend validates accessToken
    ↓
If valid → Process request
If expired → Return 401 error
```

### 3. Access Token Expires (401 Error)

```
API returns 401 (Token expired)
    ↓
Response Interceptor catches error
    ↓
Check: Are we already refreshing?
  - If YES → Queue this request
  - If NO → Start refresh process
    ↓
Call: POST /api/users/refresh-token
  - Refresh token automatically sent in cookie
    ↓
Backend validates refresh token
    ↓
If valid:
  - Generate new accessToken
  - Return new accessToken
    ↓
Frontend:
  - Save new accessToken to localStorage
  - Retry original request with new token
  - Process queued requests
    ↓
If invalid:
  - Clear localStorage
  - Redirect to /login
```

---

## 🌐 CORS Configuration

### What is CORS?

**CORS (Cross-Origin Resource Sharing)** is a security feature that:

- Prevents websites from making requests to different domains
- Must be explicitly allowed by the server
- Required when frontend and backend are on different ports/domains

### Our CORS Setup

#### Backend (server/app.js)

```javascript
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);

    // List of allowed origins
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:5173", // Vite
      "http://localhost:3000", // React default
      "http://localhost:5174", // Alternative Vite port
    ];

    // Check if origin is allowed
    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      process.env.NODE_ENV === "development"
    ) {
      callback(null, true); // Allow
    } else {
      callback(new Error("Not allowed by CORS")); // Block
    }
  },
  credentials: true, // CRITICAL: Allows cookies to be sent
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
```

#### Frontend (client/src/services/api.js)

```javascript
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // CRITICAL: Allows cookies to be sent/received
  headers: {
    "Content-Type": "application/json",
  },
});
```

### Why `credentials: true` and `withCredentials: true`?

**These are CRITICAL for refresh tokens!**

- Refresh token is stored in HttpOnly cookie
- Cookies are only sent if:
  - Backend: `credentials: true` in CORS
  - Frontend: `withCredentials: true` in axios
- Without these, refresh token cookie won't be sent/received!

---

## ✅ Best Practices

### 1. Token Storage

✅ **DO:**

- Access Token: `localStorage` (short-lived, can be accessed by JS)
- Refresh Token: HttpOnly cookie (long-lived, secure, not accessible to JS)

❌ **DON'T:**

- Store refresh token in localStorage (XSS vulnerability)
- Store access token in cookie without HttpOnly (XSS vulnerability)

### 2. Token Expiration

✅ **DO:**

- Access Token: 15-30 minutes (short-lived)
- Refresh Token: 7-30 days (long-lived)

❌ **DON'T:**

- Make access tokens too long (security risk)
- Make refresh tokens too short (bad UX)

### 3. Error Handling

✅ **DO:**

- Automatically refresh token on 401 error
- Queue requests while refreshing
- Clear tokens and redirect on refresh failure

❌ **DON'T:**

- Show error to user on token refresh
- Make multiple refresh requests simultaneously
- Keep expired tokens in storage

### 4. CORS Configuration

✅ **DO:**

- Whitelist specific origins in production
- Use environment variables for URLs
- Allow credentials for cookie-based auth

❌ **DON'T:**

- Allow all origins (`origin: "*"`) in production
- Forget `credentials: true` in CORS
- Forget `withCredentials: true` in axios

---

## 🧪 Testing

### Test Refresh Token Flow

1. **Login:**

   ```bash
   POST /api/users/signin
   # Check: accessToken in response, refreshToken in cookie
   ```

2. **Make API call:**

   ```bash
   GET /api/users/me
   Authorization: Bearer <accessToken>
   # Should work
   ```

3. **Wait 15 minutes (or manually expire token):**

   ```bash
   GET /api/users/me
   Authorization: Bearer <expiredToken>
   # Should return 401, then automatically refresh and retry
   ```

4. **Check refresh endpoint:**
   ```bash
   POST /api/users/refresh-token
   # Cookie: refreshToken (automatically sent)
   # Should return new accessToken
   ```

### Test CORS

1. **Check CORS headers in response:**

   ```bash
   curl -H "Origin: http://localhost:5173" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        http://localhost:5000/api/users/signin
   ```

2. **Expected headers:**
   ```
   Access-Control-Allow-Origin: http://localhost:5173
   Access-Control-Allow-Credentials: true
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Authorization
   ```

### Common Issues & Solutions

#### Issue 1: Refresh token not sent

**Problem:** Cookie not being sent with requests

**Solution:**

- ✅ Check `withCredentials: true` in axios config
- ✅ Check `credentials: true` in CORS config
- ✅ Check cookie domain/path settings
- ✅ Check browser console for CORS errors

#### Issue 2: CORS error

**Problem:** "Access to XMLHttpRequest blocked by CORS policy"

**Solution:**

- ✅ Add frontend URL to `allowedOrigins` array
- ✅ Check `credentials: true` in CORS
- ✅ Check `withCredentials: true` in axios
- ✅ Verify backend is running on correct port

#### Issue 3: Multiple refresh requests

**Problem:** Multiple API calls trigger multiple refresh requests

**Solution:**

- ✅ Use `isRefreshing` flag (already implemented)
- ✅ Queue failed requests while refreshing
- ✅ Process queue after refresh succeeds

#### Issue 4: Token refresh loop

**Problem:** Infinite refresh attempts

**Solution:**

- ✅ Check `_retry` flag on request
- ✅ Only refresh once per request
- ✅ Clear tokens if refresh fails

---

## 📝 Code Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    REFRESH TOKEN FLOW                        │
└─────────────────────────────────────────────────────────────┘

1. USER LOGIN
   ┌─────────────┐
   │  Frontend   │
   └──────┬──────┘
          │ POST /api/users/signin
          ▼
   ┌─────────────┐
   │  Backend    │
   └──────┬──────┘
          │
          ├─► Generate accessToken (15 min)
          ├─► Generate refreshToken (7 days)
          ├─► Save refreshToken to DB
          ├─► Set refreshToken in HttpOnly cookie
          │
          ▼
   ┌─────────────┐
   │  Response   │
   └──────┬──────┘
          │
          ├─► accessToken (in JSON body)
          └─► refreshToken (in HttpOnly cookie)
          │
          ▼
   ┌─────────────┐
   │  Frontend   │
   └──────┬──────┘
          │
          ├─► Save accessToken to localStorage
          └─► refreshToken automatically saved by browser

2. API REQUEST (Token Valid)
   ┌─────────────┐
   │  Frontend   │
   └──────┬──────┘
          │ GET /api/users/me
          │ Authorization: Bearer <accessToken>
          │ Cookie: refreshToken (auto)
          ▼
   ┌─────────────┐
   │  Backend    │
   └──────┬──────┘
          │ Validate accessToken
          │ ✅ Valid
          ▼
   ┌─────────────┐
   │  Response   │
   └─────────────┘
          │ 200 OK + Data

3. API REQUEST (Token Expired)
   ┌─────────────┐
   │  Frontend   │
   └──────┬──────┘
          │ GET /api/users/me
          │ Authorization: Bearer <expiredToken>
          │ Cookie: refreshToken (auto)
          ▼
   ┌─────────────┐
   │  Backend    │
   └──────┬──────┘
          │ Validate accessToken
          │ ❌ Expired
          ▼
   ┌─────────────┐
   │  Response   │
   └──────┬──────┘
          │ 401 Unauthorized
          ▼
   ┌─────────────┐
   │  Interceptor│
   └──────┬──────┘
          │
          ├─► Check: isRefreshing?
          │   ├─ YES → Queue request
          │   └─ NO → Start refresh
          │
          ▼
   ┌─────────────┐
   │  Frontend   │
   └──────┬──────┘
          │ POST /api/users/refresh-token
          │ Cookie: refreshToken (auto)
          ▼
   ┌─────────────┐
   │  Backend    │
   └──────┬──────┘
          │
          ├─► Get refreshToken from cookie
          ├─► Find user by refreshToken
          ├─► Validate refreshToken
          ├─► Generate new accessToken
          │
          ▼
   ┌─────────────┐
   │  Response   │
   └──────┬──────┘
          │ 200 OK + new accessToken
          ▼
   ┌─────────────┐
   │  Frontend   │
   └──────┬──────┘
          │
          ├─► Save new accessToken to localStorage
          ├─► Update original request with new token
          ├─► Retry original request
          └─► Process queued requests
```

---

## 🔒 Security Considerations

### 1. HttpOnly Cookies

- ✅ Refresh token in HttpOnly cookie = protected from XSS
- ✅ JavaScript cannot access HttpOnly cookies
- ✅ Only browser can send them automatically

### 2. Token Rotation (Optional)

- Generate new refresh token on each refresh
- Invalidate old refresh token
- More secure but more complex

### 3. Token Revocation

- Store refresh tokens in database
- Can invalidate specific tokens
- Useful for logout from all devices

### 4. CSRF Protection

- Use `sameSite: "lax"` or `"strict"` in cookie options
- Consider CSRF tokens for state-changing operations

---

## 📋 Checklist

### Backend

- [x] Refresh token endpoint created
- [x] Refresh token stored in HttpOnly cookie
- [x] CORS configured with `credentials: true`
- [x] Allowed origins whitelisted
- [x] Cookie options configured correctly

### Frontend

- [x] `withCredentials: true` in axios config
- [x] Response interceptor handles 401 errors
- [x] Automatic token refresh on expiration
- [x] Request queuing while refreshing
- [x] Error handling for refresh failures

### Testing

- [ ] Test login flow
- [ ] Test API calls with valid token
- [ ] Test token refresh on expiration
- [ ] Test multiple simultaneous requests
- [ ] Test CORS from different origins
- [ ] Test logout flow

---

**Koi confusion ho to poocho!** 🚀
