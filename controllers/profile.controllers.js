const User = require("../models/User");

exports.createProfile = async (req, res) => {
    const { fullname, address, phone  } = req.body;
    try {
        if (!fullname || !address || !phone) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const updated = await User.findByIdAndUpdate(req.user._id, {fullname, address, phone}, { new: true} ).select('-password')
        if (!updated) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Profile updated successfully", user: updated })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });   
    }
}

exports.fetchProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password')
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Profile fetched successfully", user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}