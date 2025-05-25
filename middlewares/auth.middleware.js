const jwt = require("jsonwebtoken");
require("dotenv").config();

function protect(req, res, next) {
  console.log("REQ HEADERS:", req.headers);
  const authHeader = req.headers.authorization;

  // If missing or not in "Bearer <token>" format, reject
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token provided, Authorisation denied." });
  }

  // Extract the toke part
  const token = authHeader.split(" ")[1];

  try {
    // Verify token and extract payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info for downstream handlers
    req.user = { _id: decoded.id };
    next();
  } catch (err) {
    console.log("Auth middleware error: ", err);
    return res
      .status(401)
      .json({ message: "Token Invalid or expired, authorisation denied. " });
  }
}

module.exports = protect;
