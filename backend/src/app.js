import express from "express";

import { createServer } from "node:http";

import { Server } from "socket.io";

import mongoose from "mongoose"

import { connectToSocket } from "./controllers/socketManager.js";

import cors from "cors"

import userRoutes from "./routes/userRoutes.js"

import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = createServer(app);
const io = connectToSocket(server);


app.set("port", (process.env.PORT || 8000))

app.use(cors());
app.use(express.json({ limit: "40kb" }))
app.use(express.urlencoded({ limit: "40kb", extended: true }))
app.use("/api/v1/users", userRoutes);

const start = async () => {

    const connectionDb = await mongoose.connect("mongodb+srv://rahulverma3037:Apna2026@cluster0.ktz2lzr.mongodb.net/?appName=Cluster0")
    console.log(`MONGO CONNECTED DB HOST :${connectionDb.connection.host}`)
    server.listen(app.get("port"), () => {
        console.log("LISTENIN ON 8000");

    })
}

start();