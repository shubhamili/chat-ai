import {  useState } from "react";
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
        const assistantId = (Date.now() + 1).toString();

        setMessages(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                role: "user",
                content: text
            },
            {
                id: assistantId,
                role: "assistant",
                content: ""
            }
        ])

        const response = await fetch("http://localhost:3000/chat/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userSaid: text, userId: "default-user" })
        });
        if (!response.ok || !response.body) {
            console.error("Request failed");
            return;
        }
        console.log("Response status:", response);
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let result = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            result += chunk;

            setMessages(prev =>
                prev.map(msg =>
                    msg.id === assistantId
                        ? { ...msg, content: msg.content + chunk }
                        : msg
                )
            );
        }

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