import express from "express";
import { gemini } from "../services/gemini";
import { Conversation, Message } from "../models/chat.models";


const Chat = new Map<string, any[]>();

export const chatController = async (req: express.Request, res: express.Response) => {
    try {
        const { userSaid, conversationId } = req.body;
        const { id, username } = (req as any).user;

        console.log("Authenticated user:", { id, username });

        if (!userSaid?.trim() || !id?.trim()) {
            return res.status(400).json({
                message: "Message and user ID are required",
            });
        }
        // const existingChat = Chat.get(id) || [];
        // const contents = [
        //     ...existingChat,
        //     {
        //         role: "user",
        //         parts: [{ text: userSaid }]
        //     }
        // ];


        let conversation;
        if (conversationId) {
            conversation = await Conversation.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({
                    message: "Conversation not found",
                });
            }
        } else {
            conversation = await Conversation.create({
                userId: id,
                title: userSaid.slice(0, 50),
            });
        }

        const allMesaages = await Message.find({
            conversationId: conversation._id
        }).sort({ createdAt: -1 })

        const newMessage = await Message.create({
            conversationId: conversation._id,
            role: "user",
            content: userSaid
        })

        if (!newMessage) {
            return res.status(500).json({
                message: "Failed to create message",
            })
        }

        console.log("allMesaages", allMesaages)

        const prevAllMessagesInOrder = allMesaages.map((message =>
        ({
            role: message.role,
            parts: [{ text: message.content }]
        })
        ))
        const contents = [
            ...prevAllMessagesInOrder,
            {
                role: newMessage.role,
                parts: [{ text: newMessage.content }]
            }
        ]
        const streamResult = await gemini.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: contents,
        });
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Transfer-Encoding", "chunked");
        res.flushHeaders();
        let fullResponse: string = "";
        for await (const chunk of streamResult) {
            const text = chunk.text ?? "";
            fullResponse += text;
            res.write(text);
        }
        console.log("Full Chat from Chat:", Array.from(Chat.values()));
        res.end();
        // Chat.set(id, [
        //     ...contents,
        //     {
        //         role: "model",
        //         parts: [{ text: fullResponse }]
        //     }
        // ]);

        const messageFromModel = await Message.create({
            conversationId: conversation._id,
            role: "model",
            content: fullResponse
        })

        console.log("messageFromModel", messageFromModel)

        if (!messageFromModel) {
            return res.status(500).json({ message: "Error in saving model response" });
        }

    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllConversations = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = (req as any).user;
        const conversations = await Conversation.find({ userId: id }).sort({ createdAt: -1 })

        if (!conversations) {
            return res.status(404).json({ message: "No conversations found" });
        }

        return res.status(200).json({
            success: true,
            data: conversations
        });
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getConversationMessages = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = (req as any).user;
        const { conversationId } = req.params;

        const conversation = await Conversation.findOne({ _id: conversationId, userId: id });

        if (!conversation) {
            return res.status(404).json({ message: "No conversation found" });
        }

        const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            data: messages.map((message) => ({
                id: message._id.toString(),
                role: message.role === "model" ? "assistant" : "user",
                content: message.content,
            })),
        });
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
