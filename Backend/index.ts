import { GoogleGenAI } from "@google/genai";
import express, { Router } from "express";
import dotenv from "dotenv";
import { gemini } from "./services/gemini";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Router_ } from "./routes/route";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
    cors({
        origin: "http://localhost:5173", // React/Vite
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());


if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set in the environment variables.");
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI as string)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

app.get("/",
    async (req, res) => {
        try {
            res.status(200).json({ message: "Server is running" });
        } catch (error) {
            console.error("Error generating content:", error);
            res.status(500).json({ message: "Internal server error" });
        }

    }
);

app.use("/api", Router_);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

