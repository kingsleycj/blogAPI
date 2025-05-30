# Blog API with JWT & Refresh Tokens

This is a simple, secure authentication API built with Express.js, MongoDB, and JWT for handling user registration, login, password reset, and logout functionality. It also includes refresh tokens for managing user sessions and ensuring secure, long-lived sessions.

## Features

- **User Registration:** Allows users to register with their email and password.
- **User Login:** Allows users to log in with their email and password and receive a JWT for authorization.
- **Refresh Tokens:** A secure way to refresh JWT tokens and extend user sessions without requiring them to log in repeatedly.
- **Password Reset Flow:** Provides the ability for users to reset their password using a token sent via email.
- **Logout:** Allows users to securely log out and invalidate their refresh tokens.
- **Secure HTTP Headers & Cookies:** Using Helmet for security and cookies to store JWT tokens securely.

## Technologies Used

- **Node.js** - Backend runtime environment
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database
- **JWT (JSON Web Tokens)** - For creating and verifying tokens
- **Cookie-parser** - To parse cookies containing the tokens
- **Helmet** - For setting secure HTTP headers

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/kingsleycj/auth-api.git
cd auth-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environmental Variables

Create a .env file in the root directory and add the following variables:

```env
PORT=5000
MONGO_URI=your_mongo_database_url
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

Make sure to replace the values with your own secrets.

### 4. Run the Server

```bash
npm start
```

The server will start running on http://localhost:5000.

### 5. Test API Endpoints

You can use Postman or Insomnia to test the following routes:

- **POST** `/api/v1/auth/register` - Register a new user

- **POST** `/api/v1/auth/login` - Log in with email and password (returns access token)

- **GET** `/api/v1/auth/me` - View a profile

- **POST** `/api/v1/auth/refresh-token` - Get a new access token using the refresh token (stored in cookies)

- **POST** `/api/v1/auth/forgot-password` - Request a password reset link via email

- **POST** `/api/v1/auth/reset-password` - Reset the password using a reset token

### 6. Example Request for Login

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 7. Example Request for Refresh Token

**POST** `/api/v1/auth/refresh-token`

Make sure that the refresh token is stored in cookies after the login.

## To Do / Future Features

- Email verification

- Role-based access control

- OAuth integration with Google/GitHub

- Rate limiting and security enhancements
 

 ## Project Structure
 
 ```
 auth-api/
├── config/ # Configuration files
│ └── db.js # MongoDB connection setup
│
├── controllers/ # Route handlers (business logic)
│ └── auth.controller.js # Authentication logic (login, register, etc.)
│ └── profile.controller.js # Profile logic
│
├── models/ # Data models
│ └── user.model.js # User schema and model
│
├── routes/ # API endpoint definitions
│ └── auth.routes.js # Authentication routes
│
├── utils/ # Helper functions
│ ├── generateToken.js # Access token generation
│ └── generateRefreshToken.js # Refresh token generation
│
├── middleware/ # Express middleware
│ ├── protect.js # JWT verification for protected routes
│ └── rateLimiter.js # Request rate limiting
│
├── .env # Environment variables
├── .gitignore # Gitignore
├── app.js # Main application entry point
├── package.json # Project metadata and dependencies
└── README.md # Project documentation
```