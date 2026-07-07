import { configDotenv } from "dotenv";
import mongoose from "mongoose";

configDotenv();

const connectDb = async () => {
    try {
        if (!process.env.DB_URL) {
            throw new Error("DB_URL is missing in .env");
        }

        const db = await mongoose.connect(process.env.DB_URL);

        console.log(`MongoDB Connected: ${db.connection.host}`);
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

export default connectDb;