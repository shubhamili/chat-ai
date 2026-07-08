import { GoogleGenAI } from "@google/genai";
import express from "express";
import dotenv from "dotenv";
import { gemini } from "./services/gemini";
import { chatRouter } from "./routes/chat.controller";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use("/chat", chatRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

