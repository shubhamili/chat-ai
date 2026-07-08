import express from "express";
import { gemini } from "../services/gemini";


const Chat = new Map<string, any[]>();




export const chatController = async (req: express.Request, res: express.Response) => {
    try {
        const { userSaid, userId } = req.body;

        if (!userSaid?.trim() || !userId?.trim()) {
            return res.status(400).json({
                message: "Message and user ID are required",
            });
        }

        const existingChat = Chat.get(userId) || [];
        const contents = [
            ...existingChat,
            {
                role: "user",
                parts: [{ text: userSaid }]
            }
        ];
        // console.log("Existing chat for user:", existingChat);
        // console.log("chat for user:", Chat);

       

        const response = await gemini.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
        });

       
        Chat.set(userId, [
            ...contents,
            {
                role: "model",
                parts: [{ text: response.text }]
            }
        ]);

        console.log('Chat', Chat)
        res.status(200).json({ reply: response.text, });

    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}

