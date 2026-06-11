import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// REGISTER USER
export const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            city,
            state,
            country,
            occupation,
            phoneNumber,
        } = req.body;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: passwordHash,
            city: city || "",
            state: state || "",
            country: country || "",
            occupation: occupation || "Administrator",
            phoneNumber: phoneNumber || "",
            role: "admin", // default role is admin for dashboard login
            transactions: []
        });

        const savedUser = await newUser.save();
        
        // Remove password from returned object
        const userObj = savedUser.toObject();
        delete userObj.password;

        res.status(201).json(userObj);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// LOGIN USER
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist." });
        }

        // Compare password
        let isMatch = false;
        if (user.password.startsWith('$2') || user.password.startsWith('$2b$')) {
            // Decrypt bcrypt password
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            // Fallback plain-text check for pre-seeded database users
            isMatch = password === user.password;
        }

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET || "dashboard_super_secret_key"
        );

        // Remove password from returned object
        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({ token, user: userObj });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
