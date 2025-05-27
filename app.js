const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/db");
const dotenv = require("dotenv");
dotenv.config();

// setup express server
const app = express();
const PORT = process.env.PORT || 5000;

// middleware to parse JSON requests
app.use(express.json());

// Set Secure HTTP Headers
app.use(helmet());

// Parse cookies
app.use(cookieParser());

// Routes
const authRoutes = require("./routes/auth.routes");
app.use("/api/v1/auth", authRoutes);

// Connect to MongoDB
connectDB();

// root route
app.get("/", (req, res) => {
  res.send("Blog API is running...");
});

// catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404).json({ message: "An error occurred" });
});

// start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
