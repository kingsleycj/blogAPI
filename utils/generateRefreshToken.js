const jwt = require("jsonwebtoken")

exports.generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId},
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    )
}
