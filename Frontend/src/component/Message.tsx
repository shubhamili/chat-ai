import "github-markdown-css/github-markdown.css";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../page/Home";

interface Props {
    message: ChatMessage;
}

export default function Message({ message }: Props) {
    const isUser = message.role === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>

            <div
                className={` max-w-xl rounded-2xl px-4 py-3 whitespace-pre-wrap ${isUser
                    ? "bg-green-600 text-white"
                    : "bg-[#303030] text-gray-100"
                    }`}
            >
                {/* <div className="prose prose-invert max-w-none">
                    <ReactMarkdown >
                        {message.content}
                    </ReactMarkdown>
                </div> */}


                <div className="markdown-body p-5" data-color-mode="dark" >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>

            </div>
        </div>
    );
}