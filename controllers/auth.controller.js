const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateTokens");
const { generateRefreshToken } = require("../utils/generateRefreshToken");
const { json } = require("express");
const crypto = require("crypto");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already exits" });
    }

    // proceed to creating a new user
    const user = await User.create({ username, email, password });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log("Registration Error: ", error);
    res
      .status(500)
      .json({ message: "An Error Occurred when Creating New User" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(400).json({ message: "Invalid Credentials Inputed" });

    // Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only true in production
        sameSite: "Strict", // or 'Lax' for a more relaxed CSRF policy
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
      })
      .status(200)
      .json({
        message: "Login Successful",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          //   refreshToken: user.refreshToken,
        },
        token: generateToken(user._id),
        // refreshToken,
      });
  } catch (error) {
    console.error("Login Error: ", error);
    res.status(500).json({ messae: "Error Occurred While Attempting Login" });
  }
};

exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No Refresh Token Provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateToken(user._id);
    res.status(200).json({ token: newAccessToken });
  } catch (error) {
    console.log("Refresh Token Error: ", error);
    res.status(403).json({ message: "Invalid or expired refresh token. " });
  }
};

exports.logout = async (req, res) => {
  try {
    //Await database call
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User was not found" });
    }

    // Nullify refresh tokens
    user.refreshToken = null;
    await user.save();

    res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      })
      .status(200)
      .json({ message: "User Has been logged out" });
  } catch (err) {
    console.log("Logout Error: ", err);
    res
      .status(500)
      .json({ message: "Error occurred when trying to logout user" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No user with that email has been registered" });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // simulate sending email
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/reset-password/${resetToken}`;

    res.status(200).json({
      message: "Password Token Generated",
      resetUrl, //In production, this will be in the email
      resetToken,
    });
  } catch (err) {
    console.log("Forgot Password Error: ", err);
    res.status(500).json({
      message: "Something went wrong while trying to run forgot password",
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.log("Reset Password: ", err);
    res
      .status(500)
      .json({ message: "An error occurred. Could not reset password" });
  }
};
