import express from "express";
import { createServer } from "node:http";
import cors from "cors";
import dotenv from "dotenv";

import connectDb from "./models/db.js";
import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const server = createServer(app);

// Database Connection
connectDb();

// Socket.IO
connectToSocket(server);

// Middleware
app.use(
    cors({
        origin:[
            "http://localhost:5173",
            "https://apnavideocallfrontend-xjyp.onrender.com"
        ],
        methods:["GET","POST"],
        credentials:true
    })
);

app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));

// Health Check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend is running successfully",
    });
});

// Routes
app.use("/api/v1/users", userRoutes);

// 404 Route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});