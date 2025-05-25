const User = require("../models/user.model")


exports.viewProfile = async (req, res) => {
    try {
        // req.user.id comes from the middleware
        const user = await User.findById(req.user._id).select("-password")
        if (!user) return res.status(404).json({ message: "User not found" })
            res.status(200).json({ message: "User profile fetched", user })
    } catch (err) {
        console.log("Fetch profile error: ", err);
        res.status(500).json({ message: "Server error fetching profile" })
    }
}