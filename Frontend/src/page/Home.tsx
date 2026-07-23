import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Message from "../component/Message";
import ChatInput from "../component/ChatInput";

export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export default function Chat() {
    const { conversationId } = useParams<{ conversationId?: string }>();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const activeControllerRef = useRef<AbortController | null>(null);
    const activeAssistantIdRef = useRef<string | null>(null);

    const loadConversationMessages = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/conversations/${id}/messages`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                setMessages([]);
                return;
            }

            const data = await response.json();
            if (data.success) {
                setMessages(data.data);
            }
        } catch (error) {
            console.error("Error loading conversation:", error);
            setMessages([]);
        }
    };

    useEffect(() => {
        if (conversationId) {
            loadConversationMessages(conversationId);
        } else {
            setMessages([]);
        }
    }, [conversationId]);

    const stopStreaming = () => {
        activeControllerRef.current?.abort();
        activeControllerRef.current = null;
        setIsStreaming(false);
    };

    const sendMessage = async (text: string) => {
        if (activeControllerRef.current) {
            stopStreaming();
        }

        const assistantId = crypto.randomUUID();
        const userId = crypto.randomUUID();
        activeAssistantIdRef.current = assistantId;

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
        ]);

        const controller = new AbortController();
        activeControllerRef.current = controller;
        setIsStreaming(true);

        let response: Response;
        try {
            response = await fetch("http://localhost:3000/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                signal: controller.signal,
                body: JSON.stringify({ userSaid: text, conversationId })
            });

            if (!response.ok || !response.body) {
                console.error("Request failed");
                return;
            }
        } catch (error) {
            if (controller.signal.aborted) {
                setIsStreaming(false);
                activeControllerRef.current = null;
                return;
            }

            console.error("Error sending message:", error);
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === assistantId
                        ? { ...msg, content: "Error sending message. Please try again." }
                        : msg
                )
            );
            setIsStreaming(false);
            activeControllerRef.current = null;
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });

                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === assistantId
                            ? { ...msg, content: msg.content + chunk }
                            : msg
                    )
                );
            }

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
        } catch (error) {
            if (controller.signal.aborted) {
                setIsStreaming(false);
                activeControllerRef.current = null;
                return;
            }
            console.error("Streaming error:", error);
        } finally {
            if (!controller.signal.aborted) {
                setIsStreaming(false);
                activeControllerRef.current = null;
                activeAssistantIdRef.current = null;
            }
        }
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        return () => {
            activeControllerRef.current?.abort();
        };
    }, []);

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

            <ChatInput onSend={sendMessage} onStop={stopStreaming} isStreaming={isStreaming} />
        </div>
    );
}