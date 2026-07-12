import { useEffect, useRef, useState } from "react";
import Message from "../component/Message";
import ChatInput from "../component/ChatInput";
import ReactMarkdown from "react-markdown";

export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export default function Chat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);
    const sendMessage = async (text: string) => {
        const assistantId = crypto.randomUUID()
        const userId = crypto.randomUUID()
        console.log("assistantId :", assistantId);
        setMessages(prev => [
            ...prev,
            {
                id: userId,
                role: "user",
                content: text
            },
            {
                id: assistantId,
                role: "assistant",
                content: ""
            }
        ])
        let response: Response;
        try {
            response = await fetch("http://localhost:3000/chat/post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userSaid: text, userId: userId })
            });

            if (!response.ok || !response.body) {
                console.error("Request failed");
                return;
            }
        } catch (error) {
            console.error("Error sending message:", error);
            // Update the assistant message to indicate an error occurred
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === assistantId
                        ? { ...msg, content: "Error sending message. Please try again." }
                        : msg
                )
            )
            return;
        }
        console.log("Response status:", response);
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        // let result = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            // result += chunk;

            setMessages(prev =>
                prev.map(msg =>
                    msg.id === assistantId
                        ? { ...msg, content: msg.content + chunk }
                        : msg
                )
            );
        }
        // After the loop, flush any remaining bytes:
        const remaining = decoder.decode();
        if (remaining) {
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === assistantId
                        ? { ...msg, content: msg.content + remaining }
                        : msg
                )
            );
        }

    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto px-4 py-8">
                <div className="max-w-3xl mx-auto space-y-6">
                    {messages.map((message) => (
                        <Message key={message.id} message={message} />

                    ))}
                    <div ref={bottomRef} />
                </div>
            </div>
            {/* <ReactMarkdown
                components={{
                    h1: ({ children }) => <h1 className="text-3xl font-bold">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-2xl font-semibold">{children}</h2>,
                    ul: ({ children }) => <ul className="list-disc ml-6">{children}</ul>,
                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                }}
            >
                {`# Hello

## Subtitle

- One
- Two

**Bold**`}
            </ReactMarkdown> */}
            <ChatInput onSend={sendMessage} />
        </div>
    );
}