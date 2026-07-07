import { configDotenv } from "dotenv";
import mongoose from "mongoose";

configDotenv();

const url = process.env.DB_URL

const connectDb = async () => {
    try {
        const db = await mongoose.connect(url);
        console.log(`MONGO CONNECTED DB HOST :${db.connection.host}`)


    } catch (error) {
        return console.log('Db Error ', error);

    }
}


export default connectDb;