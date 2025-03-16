import mongoose from "mongoose";
import { dbName } from "../constant.js";

export const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`);
        console.log("Connected to MongoDB",connectionInstance.connection.host);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}