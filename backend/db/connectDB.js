import { configDotenv } from "dotenv";
import mongoose from "mongoose";
configDotenv(); // Load environment variables from .env file
const connectDB = async () => {
    try {
        const dbUri = process.env.MONGO_URI; // Load the MongoDB URI from environment variables

        if (!dbUri) {
            throw new Error("MONGO_URI not defined in environment variables");
        }

        const conn = await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`\n\n MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit the process with failure
    }
};

export default connectDB;
