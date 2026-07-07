import { User } from "../models/userModel.js";
import httpStatus from "http-status"
import bcrypt, { hash } from "bcrypt"
import jwt from "jsonwebtoken";
import { Meeting } from "../models/meetingModel.js";



//login 

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Please provide username and password" })
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
        return res.status(500).json({ message: `Something went wrong ${error}` })

    }

}






//register
const register = async (req, res) => {
    const { name, username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username,
            password: hashedPassword
        });

        await newUser.save();
        res.status(httpStatus.CREATED).json({ message: "User registered" })


    } catch (e) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: `Something went wrong ${e.message}` });
    }
}



const getUserHistory = async (req, res) => {
    const { token } = req.query;
    try {
        const user = await User.findOne({ token: token })
        const meetings = await Meeting.find({ user_id: user.username });
        res.json(meetings)
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })


    }
}

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;
    try {
        const user = await User.findOne({ token: token });

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code
        })

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({ message: "Added code to history" })
    } catch (error) {
        res.json({ message: `Something went wrong ${error}` })

    }
}
export { login, register, getUserHistory, addToHistory };