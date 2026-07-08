import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();


if (!process.env.GEMINI_API_KEY) {
    console.log("GEMINI_API_KEY is set in the environment variables.");
    throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}

export const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});
