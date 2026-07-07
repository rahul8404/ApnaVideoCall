import { User } from "../models/userModel.js";
import httpStatus from "http-status"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Meeting } from "../models/meetingModel.js";



//login 

const login = async (req, res) => {
    const { username, password } = req.body;

    if (
        typeof username !== "string" ||
        typeof password !== "string" ||
        !username.trim() ||
        !password.trim()
    ) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "Please provide username and password",
        });
    }

    try {

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User Not Found" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign({
            id: user._id,
            username: user.username,
        },

            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }

        );


        return res.status(httpStatus.OK).json({
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                username: user.username,
            },
        });

    } catch (error) {
        console.error(error);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
        });
    }

}








//register
const register = async (req, res) => {
    const { name, username, password } = req.body;

    if (
        typeof name !== "string" ||
        typeof username !== "string" ||
        typeof password !== "string" ||
        !username.trim() ||
        !password.trim()
    ) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "Please provide username and password",
        });
    }

    if (password.length < 6) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "Password must be at least 6 characters",
        });
    }

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(httpStatus.CONFLICT).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username,
            password: hashedPassword,
        });

        await newUser.save();

        return res.status(httpStatus.CREATED).json({
            message: "User registered successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
        });
    }
};



// GET USER HISTORY
const getUserHistory = async (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "User not found",
            });
        }

        const meetings = await Meeting.find({
            user_id: user.username,
        });

        return res.status(httpStatus.OK).json(meetings);
    } catch (error) {
        console.error(error);

        return res.status(httpStatus.UNAUTHORIZED).json({
            message: "Invalid or expired token",
        });
    }
};


// ADD TO HISTORY
const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "User not found",
            });
        }

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code,
        });

        await newMeeting.save();

        return res.status(httpStatus.CREATED).json({
            message: "Meeting added to history",
        });
    } catch (error) {
        console.error(error);

        return res.status(httpStatus.UNAUTHORIZED).json({
            message: "Invalid or expired token",
        });
    }
};

export {
    login,
    register,
    getUserHistory,
    addToHistory,
};