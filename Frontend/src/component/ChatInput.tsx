import { useState } from "react";

interface Props {
    onSend: (text: string) => void;
    onStop: () => void;
    isStreaming: boolean;
}

export default function ChatInput({ onSend, onStop, isStreaming }: Props) {
    const [text, setText] = useState("");

    const handleSend = async () => {
        if (!text.trim()) return;

        onSend(text);
        setText("");
    };

    return (
        <div className="border-t border-zinc-700 bg-[#212121]">
            <div className="max-w-3xl mx-auto p-4 flex gap-3">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Message ChatGPT..."
                    className="flex-1 rounded-xl bg-[#303030] px-4 py-3 text-white outline-none placeholder:text-gray-400"
                />

                {isStreaming ? (
                    <button
                        onClick={onStop}
                        className="rounded-xl bg-red-600 px-5 font-medium text-white hover:bg-red-700 transition"
                    >
                        Stop
                    </button>
                ) : (
                    <button
                        onClick={handleSend}
                        className="rounded-xl bg-white text-black px-5 font-medium hover:bg-gray-200 transition"
                    >
                        Send
                    </button>
                )}
            </div>
        </div>
    );
}