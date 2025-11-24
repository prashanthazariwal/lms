# Frontend Flow - Complete Explanation

## 📋 Table of Contents

1. [Initial App Load](#1-initial-app-load)
2. [User Registration Flow](#2-user-registration-flow)
3. [User Login Flow](#3-user-login-flow)
4. [Protected Routes Flow](#4-protected-routes-flow)
5. [Token Management](#5-token-management)
6. [Role-Based Navigation](#6-role-based-navigation)

---

## 1. Initial App Load

```
User opens browser → http://localhost:5173
    ↓
main.jsx loads
    ↓
Redux Provider wraps App
    ↓
App.jsx checks routes
    ↓
If no token → Redirect to /login
If token exists → Check if valid → Show Home or Login
```

### Step-by-Step:

1. **main.jsx** starts the app

   - Wraps entire app with `<Provider store={store}>`
   - This makes Redux store available to all components

2. **App.jsx** sets up routing

   - Checks current URL path
   - Routes to appropriate page

3. **Redux Store Initialization**
   - Checks `localStorage` for existing token
   - If token exists → `isAuthenticated = true`
   - If no token → `isAuthenticated = false`

---

## 2. User Registration Flow

```
User clicks "Sign up" → /signup page
    ↓
User fills form (userName, email, password, role)
    ↓
User clicks "Sign Up" button
    ↓
Signup.jsx → dispatch(signup(formData))
    ↓
authSlice.js → signup thunk
    ↓
api.js → POST /api/users/signup
    ↓
Backend creates user → Returns success
    ↓
Redux updates state (signup.fulfilled)
    ↓
Alert: "Signup successful! Please login."
    ↓
Navigate to /login page
```

### Detailed Flow:

#### Step 1: User fills Signup form

```jsx
// Signup.jsx
const [formData, setFormData] = useState({
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "student", // or "instructor"
});
```

#### Step 2: Form submission

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate passwords match
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // Dispatch signup action
  const result = await dispatch(signup(signupData));

  // If successful, redirect to login
  if (signup.fulfilled.match(result)) {
    alert("Signup successful! Please login.");
    navigate("/login");
  }
};
```

#### Step 3: Redux Thunk executes

```jsx
// authSlice.js - signup thunk
export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.signup(userData);
      // Backend returns: { message, statusCode, data: user }
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

#### Step 4: API call

```jsx
// api.js
export const signup = async (userData) => {
  const response = await api.post("/users/signup", userData);
  return response.data;
};
```

#### Step 5: Redux updates state

```jsx
// authSlice.js - reducer
.addCase(signup.fulfilled, (state, action) => {
  state.loading = false;
  state.error = null;
  // Note: Signup doesn't auto-login user
})
```

**Important:** Signup ke baad user automatically login nahi hota. User ko manually login karna padta hai.

---

## 3. User Login Flow

```
User on /login page
    ↓
User enters email & password
    ↓
User clicks "Login" button
    ↓
Login.jsx → dispatch(signin({ email, password }))
    ↓
authSlice.js → signin thunk
    ↓
api.js → POST /api/users/signin
    ↓
Backend validates credentials
    ↓
Backend generates accessToken & refreshToken
    ↓
Backend returns: { user, accessToken }
    ↓
authSlice saves to localStorage
    ↓
Redux updates state: isAuthenticated = true
    ↓
Navigate to / (Home page)
```

### Detailed Flow:

#### Step 1: User fills Login form

```jsx
// Login.jsx
const [formData, setFormData] = useState({
  email: "",
  password: "",
});
```

#### Step 2: Form submission

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();

  // Dispatch signin action
  const result = await dispatch(signin(formData));

  // If successful, navigate to home
  if (signin.fulfilled.match(result)) {
    navigate("/");
  }
};
```

#### Step 3: Redux Thunk executes

```jsx
// authSlice.js - signin thunk
export const signin = createAsyncThunk(
  "auth/signin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.signin(email, password);
      // Backend returns: { message, statusCode, data: { user, accessToken } }

      // Save to localStorage
      if (response.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data; // { user, accessToken }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

#### Step 4: API call

```jsx
// api.js
export const signin = async (email, password) => {
  const response = await api.post("/users/signin", { email, password });
  return response.data;
};
```

#### Step 5: Backend response

```json
{
  "message": "Signed in successfully",
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "...",
      "userName": "John",
      "email": "john@example.com",
      "role": "student"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Step 6: Redux updates state

```jsx
// authSlice.js - reducer
.addCase(signin.fulfilled, (state, action) => {
  state.loading = false;
  state.error = null;
  state.user = action.payload.user; // Save user object
  state.accessToken = action.payload.accessToken; // Save token
  state.isAuthenticated = true; // Mark as authenticated
})
```

#### Step 7: Navigation

- Login.jsx detects `isAuthenticated = true`
- Automatically navigates to `/` (Home page)

---

## 4. Protected Routes Flow

```
User tries to access / (Home page)
    ↓
App.jsx → ProtectedRoute component
    ↓
ProtectedRoute checks Redux state
    ↓
If isAuthenticated = false → Redirect to /login
If isAuthenticated = true → Show Home component
    ↓
Home.jsx loads
    ↓
Home.jsx → dispatch(getCurrentUser())
    ↓
API call: GET /api/users/me (with token in header)
    ↓
Backend validates token → Returns user data
    ↓
Redux updates user state
    ↓
Home page displays user info
```

### Detailed Flow:

#### Step 1: User tries to access protected route

```jsx
// App.jsx
<Route
  path="/"
  element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  }
/>
```

#### Step 2: ProtectedRoute checks authentication

```jsx
// ProtectedRoute.jsx
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children; // Show protected content
}
```

#### Step 3: Home component loads

```jsx
// Home.jsx
useEffect(() => {
  // Fetch latest user data
  dispatch(getCurrentUser());
}, [dispatch]);
```

#### Step 4: API call with token

```jsx
// api.js - Request Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### Step 5: Backend validates token

- Backend receives: `Authorization: Bearer <token>`
- Middleware verifies token
- If valid → Returns user data
- If invalid → Returns 401 error

#### Step 6: Response handling

```jsx
// api.js - Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

---

## 5. Token Management

### How Tokens Work:

1. **Access Token (JWT)**

   - Stored in: `localStorage`
   - Expires in: 15 minutes (configurable)
   - Used for: Authenticating API requests
   - Sent in: `Authorization: Bearer <token>` header

2. **Refresh Token**
   - Stored in: HttpOnly cookie (backend manages)
   - Expires in: 7 days
   - Used for: Getting new access token when it expires
   - Not accessible to JavaScript (more secure)

### Token Flow:

```
User logs in
    ↓
Backend generates:
  - accessToken (15 min) → Sent in response
  - refreshToken (7 days) → Sent in httpOnly cookie
    ↓
Frontend saves accessToken to localStorage
    ↓
Every API request:
  - Request Interceptor adds token to header
  - Backend validates token
    ↓
If token expired (401 error):
  - Response Interceptor catches error
  - Clears localStorage
  - Redirects to /login
```

### Automatic Token Addition:

```jsx
// api.js - Request Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**This means:** Har API call mein automatically token add ho jata hai. Aapko manually add karne ki zarurat nahi!

---

## 6. Role-Based Navigation

### Current Implementation:

Right now, sabhi users (student/instructor/admin) ko same Home page dikhta hai. Aap role-based navigation add kar sakte ho:

### How to Add Role-Based Navigation:

#### Option 1: Different Routes for Different Roles

```jsx
// App.jsx
<Route
  path="/"
  element={
    <ProtectedRoute>
      <RoleBasedRedirect />
    </ProtectedRoute>
  }
/>;

// RoleBasedRedirect.jsx
function RoleBasedRedirect() {
  const { user } = useAppSelector((state) => state.auth);

  if (user?.role === "student") {
    return <Navigate to="/student/dashboard" />;
  } else if (user?.role === "instructor") {
    return <Navigate to="/instructor/dashboard" />;
  } else if (user?.role === "admin") {
    return <Navigate to="/admin/dashboard" />;
  }

  return <Home />;
}
```

#### Option 2: Same Page, Different Content

```jsx
// Home.jsx
function Home() {
  const { user } = useAppSelector((state) => state.auth);

  if (user?.role === "student") {
    return <StudentDashboard />;
  } else if (user?.role === "instructor") {
    return <InstructorDashboard />;
  }

  return <AdminDashboard />;
}
```

#### Option 3: Protected Routes by Role

```jsx
// components/RoleProtectedRoute.jsx
function RoleProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

// Usage in App.jsx
<Route
  path="/admin/dashboard"
  element={
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboard />
    </RoleProtectedRoute>
  }
/>;
```

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER JOURNEY FLOW                         │
└─────────────────────────────────────────────────────────────┘

1. NEW USER REGISTRATION
   ┌─────────────┐
   │  /signup    │
   └──────┬──────┘
          │
          ▼
   ┌─────────────────┐
   │ Fill Form       │
   │ (userName,      │
   │  email, pwd,    │
   │  role)          │
   └──────┬──────────┘
          │
          ▼
   ┌─────────────────┐      ┌──────────────┐
   │ dispatch(signup)│─────▶│ Backend API  │
   └──────┬──────────┘      └──────┬───────┘
          │                        │
          │                        ▼
          │                 ┌──────────────┐
          │                 │ Create User  │
          │                 └──────┬───────┘
          │                        │
          │                        ▼
          │                 ┌──────────────┐
          │                 │ Return Success│
          │                 └──────┬───────┘
          │                        │
          ▼                        │
   ┌─────────────────┐             │
   │ Navigate to     │◀────────────┘
   │ /login          │
   └─────────────────┘

2. USER LOGIN
   ┌─────────────┐
   │  /login     │
   └──────┬──────┘
          │
          ▼
   ┌─────────────────┐
   │ Enter Email &   │
   │ Password        │
   └──────┬──────────┘
          │
          ▼
   ┌─────────────────┐      ┌──────────────┐
   │ dispatch(signin)│─────▶│ Backend API  │
   └──────┬──────────┘      └──────┬───────┘
          │                        │
          │                        ▼
          │                 ┌──────────────┐
          │                 │ Validate     │
          │                 │ Credentials  │
          │                 └──────┬───────┘
          │                        │
          │                        ▼
          │                 ┌──────────────┐
          │                 │ Generate     │
          │                 │ Tokens       │
          │                 └──────┬───────┘
          │                        │
          │                        ▼
          │                 ┌──────────────┐
          │                 │ Return:      │
          │                 │ {user, token}│
          │                 └──────┬───────┘
          │                        │
          ▼                        │
   ┌─────────────────┐             │
   │ Save to         │◀────────────┘
   │ localStorage    │
   └──────┬──────────┘
          │
          ▼
   ┌─────────────────┐
   │ Update Redux    │
   │ isAuthenticated │
   │ = true          │
   └──────┬──────────┘
          │
          ▼
   ┌─────────────────┐
   │ Navigate to /   │
   │ (Home)          │
   └─────────────────┘

3. ACCESSING PROTECTED ROUTE
   ┌─────────────┐
   │  / (Home)   │
   └──────┬──────┘
          │
          ▼
   ┌─────────────────┐
   │ ProtectedRoute  │
   │ checks auth     │
   └──────┬──────────┘
          │
          ├─── No token? ──▶ Redirect to /login
          │
          ▼
   ┌─────────────────┐
   │ Token exists?   │
   └──────┬──────────┘
          │
          ▼
   ┌─────────────────┐      ┌──────────────┐
   │ GET /users/me   │─────▶│ Backend API  │
   │ (with token)    │      └──────┬───────┘
   └──────┬──────────┘             │
          │                        ▼
          │                 ┌──────────────┐
          │                 │ Validate     │
          │                 │ Token        │
          │                 └──────┬───────┘
          │                        │
          │                        ▼
          │                 ┌──────────────┐
          │                 │ Return User  │
          │                 │ Data         │
          │                 └──────┬───────┘
          │                        │
          ▼                        │
   ┌─────────────────┐             │
   │ Update Redux    │◀────────────┘
   │ with user data  │
   └──────┬──────────┘
          │
          ▼
   ┌─────────────────┐
   │ Show Home Page  │
   │ with user info  │
   └─────────────────┘
```

---

## Key Concepts Summary

### 1. **Redux State Management**

- Global state store (user, token, isAuthenticated)
- Actions update state
- Components read state using hooks

### 2. **API Interceptors**

- Request Interceptor: Automatically adds token to every request
- Response Interceptor: Handles errors (like token expiration)

### 3. **Protected Routes**

- Check authentication before showing content
- Redirect to login if not authenticated

### 4. **Token Storage**

- Access Token: localStorage (accessible to JavaScript)
- Refresh Token: HttpOnly cookie (more secure, backend manages)

### 5. **Navigation Flow**

- Signup → Login → Home
- Login → Home (if authenticated)
- Protected route → Login (if not authenticated)

---

## Next Steps (Optional Enhancements)

1. **Refresh Token Endpoint**: Access token expire hone par automatically naya token fetch karo
2. **Role-Based Routes**: Different dashboards for student/instructor/admin
3. **Remember Me**: Longer token expiration
4. **Auto-logout**: Inactive user ko automatically logout karo

---

**Koi confusion ho to poocho!** 🚀
