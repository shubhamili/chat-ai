import type { ChatMessage } from "../page/Home";


interface Props {
    message: ChatMessage;
}

export default function Message({ message }: Props) {
    const isUser = message.role === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-xl rounded-2xl px-4 py-3 whitespace-pre-wrap ${isUser
                        ? "bg-green-600 text-white"
                        : "bg-[#303030] text-gray-100"
                    }`}
            >
                {message.content}
            </div>
        </div>
    );
}