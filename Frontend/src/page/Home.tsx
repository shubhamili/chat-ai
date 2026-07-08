import { useState } from "react";
import Message from "../component/Message";
import ChatInput from "../component/ChatInput";



export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
}


export default function Chat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const sendMessage = async (text: string) => {
        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content: text,
        };

        setMessages((prev) => [...prev, userMessage]);

        // Fake AI response
        setTimeout(() => {
            const aiMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: `Hello! You said "${text}"`,
            };

            setMessages((prev) => [...prev, aiMessage]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto px-4 py-8">
                <div className="max-w-3xl mx-auto space-y-6">
                    {messages.map((message) => (
                        <Message key={message.id} message={message} />
                    ))}
                </div>
            </div>

            <ChatInput onSend={sendMessage} />
        </div>
    );
}