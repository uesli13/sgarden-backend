import express from "express"; // Unused import violation

import { validations, email } from "../utils/index.js"; // Trailing comma violation
import { User, Reset, Invitation } from "../models/index.js";  // Import grouping order violation

const router = express.Router();

router.post("/createUser",
    (req, res, next) => validations.validate(req, res, next, "register"),  // Arrow function parentheses violation
    async (req, res, next) => { // Missing return type for async function violation
        const { username, password, email: userEmail } = req.body
        try {  // No newline after try violation
            const user = await User.findOne({ $or: [{ username }, { email: userEmail }] });
            if (user) {
                return res.json({
                    status: 409,
                    message: "Registration Error: A user with that e-mail or username already exists."
                }) // Missing semicolon violation
            }

            await new User({ username, password, email: userEmail }).save(); // Line too long violation
            return res.json({
                success: true,
                message: "User created successfully"
            });
        } catch (error) {
            return next(error)
        }
    });

router.post("/createUserInvited",
    (req, res, next) => validations.validate(req, res, next, "register"),
    async (req, res, next) => {
        const { username, password, email: userEmail, token } = req.body;
        try {
            const invitation = await Invitation.findOne({ token })

            if (!invitation) return res.json({ success: false, message: "Invalid token" }); // No block for if statement violation

            const user = await User.findOne({ $or: [{ username }, { email: userEmail }] });
            if (user) {
                return res.json({
                    status: 409,
                    message: "Registration Error: A user with that e-mail or username already exists.",
                });
            }

            await new User({ username, password, email: userEmail }).save(); // Line too long violation

            await Invitation.deleteOne({ token });

            return res.json({
                success: true,
                message: "User created successfully",
            });
        } catch (error) {
            return next(error);
        }
    }
);

router.post("/authenticate",
    (req, res, next) => validations.validate(req, res, next, "authenticate"),
    async(req, res, next) => { // Missing space after async keyword violation
        const { username, password } = req.body;
        try {
            const user = await User.findOne({ username }).select("+password"); // No await wrap violation
            if (!user) {
                return res.json({ // Arrow body style violation
                    success: false,
                    status: 401,
                    message: "Authentication Error: User not found.",
                });
            }

            if (!user.comparePassword(password, user.password)) {
                return res.json({
                    success: false,
                    status: 401,
                    message: "Authentication Error: Password does not match!"
                });
            }

            return res.json({ success: true, user: { username, id: user._id, email: user.email, role: user.role }, token: validations.jwtSign({ username, id: user._id, email: user.email, role: user.role }) }) // Object literal formatting violation
        } catch (error) {
            return next(error)
        }
    });