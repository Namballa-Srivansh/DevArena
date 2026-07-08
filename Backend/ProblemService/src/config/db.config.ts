import mongoose from "mongoose";
import logger from "./logger.config";
import { serverConfig } from ".";

export const connectDB = async () => {
    try {
        const dbUrl = serverConfig.DB_URL;

        await mongoose.connect(dbUrl)

        logger.info("Connected to mongodb successfully")

        mongoose.connection.on("error", (error) => {
            logger.error("Mongodb connection error", error);
        });

        mongoose.connection.on("disconnected", () => {
            logger.error("Mongodb disconnected");
        });

        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            logger.info("Mongodb connection closed");
            process.exit(0);
        });

    } catch (error) {
        logger.error("failed to connect to mongodb", error);
        process.exit(1);
    }
}