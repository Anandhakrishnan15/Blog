const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Signup
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // check if user exists
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "Email already registered" });

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        // create user
        const user = await User.create({ name, email, password: hashed });

        // generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // return full user object
        res.status(201).json({
            token,
            user: user // sends full user document (including createdAt, updatedAt)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({
            token,
            user: user // sends full user document
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user info (protected)
const getUserInfo = async (req, res) => {
    try {
        const userId = req.user.id; // set by auth middleware
        const user = await User.findById(userId).select("-password"); // exclude password
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { signup, login, getUserInfo };
