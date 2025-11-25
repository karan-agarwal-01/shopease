const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const jwt = require('jsonwebtoken');

const setTokenCookies = (res, _id) => {
    const accessToken = generateAccessToken(_id);
    const refreshToken = generateRefreshToken(_id);

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 60 * 60 * 1000
    })
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}

exports.registerUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Please enter all fields" })
        }

        const userExits = await User.findOne({ email })
        if (userExits) {
            return res.status(400).json({ message: "User already exists" })
        }

        const user = await User.create({ email, password })
        await user.save()

        if (user) {
            setTokenCookies(res, user._id);
            return res.status(201).json({message: "User registered successfully", user: { _id: user._id, email: user.email } })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" })
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({message: "Invalid Credentials or user not found"});
        }
        if (user && (await user.matchPassword(password))) {
            setTokenCookies(res, user._id);
            return res.status(200).json({ message: "User login successfully", user: {_id: user._id, email: user.email} })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" })   
    }
}

exports.refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" })
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const _id = decoded.id;
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).json({ message: 'User associated with token not found' })
        }

        const newAccessToken = generateAccessToken(_id);
        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 60 * 60 * 1000
        });

        res.json({ message: 'Access token refreshed successfully' })
    } catch (error) {
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.status(403).json({ message: 'Invalid or expired refresh token. please log in again' })
    }
}

exports.logoutUser = (req, res) => {
    res.clearCookie('accessToken', { httpOnly: true, secure: isProduction, sameSite: isProduction ? "none" : "lax" });
    res.clearCookie('refreshToken', { httpOnly: true, secure: isProduction, sameSite: isProduction ? "none" : "lax" });
    res.json({ message: 'Logged out successfully' });
};

exports.verifyUser = async (req, res) => {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized - No token found" });
      }  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id) 
      return res.status(200).json({ success: true, user });
    } catch (error) {
      res.status(403).json({ message: "Invalid or expired token" });
    }
};

