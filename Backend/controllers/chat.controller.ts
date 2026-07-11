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
        const streamResult = await gemini.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: contents,
        });

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Transfer-Encoding", "chunked");
        res.flushHeaders();
        let fullResponse : string = "";
        for await (const chunk of streamResult) {
            const text = chunk.text ?? "";
            fullResponse += text;
            res.write(text);
        }
        res.end();
        Chat.set(userId, [
            ...contents,
            {
                role: "model",
                parts: [{ text: fullResponse }]
            }
        ]);
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}

