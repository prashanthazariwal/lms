# LMS Backend Server

## Setup Instructions

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Create .env file**

   - Copy `.env.example` to `.env`
   - Update the values according to your setup

3. **Start MongoDB**

   - Make sure MongoDB is running on your system
   - Or use MongoDB Atlas (cloud database)

4. **Run the Server**

   ```bash
   # Development mode (with auto-restart)
   npm run dev

   # Production mode
   npm start
   ```

5. **Server will run on** `http://localhost:5000`

## API Endpoints

### Public Routes

- `POST /api/users/signup` - User registration
- `POST /api/users/signin` - User login
- `POST /api/users/signout` - User logout

### Protected Routes (Require Authentication)

- `GET /api/users/me` - Get current user profile

## Environment Variables

See `.env.example` for all required environment variables.
