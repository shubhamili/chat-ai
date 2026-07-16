import { Plus, MessageSquare, User } from "lucide-react";
import { logout } from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

type Conversation = {
    _id: string;
    userId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
};


export default function Sidebar() {
    const [chatsList, setChatList] = useState<Conversation[]>([])
    const navigate = useNavigate();

    const fetchChats = async () => {
        const response = await fetch('http://localhost:3000/api/list', {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        console.log('data', data)
        setChatList(data.data);
    }

    useEffect(() => {
        fetchChats();
    }, [])


    const { user } = useAuth();
    console.log('user', user)

    return (
        <aside className="flex h-screen w-72 flex-col bg-zinc-950 border-r border-zinc-800">
            {/* Logo */}
            <div className="border-b border-zinc-800 p-4">
                <h1 className="text-2xl font-bold text-white">
                    🤖 MyGPT
                </h1>



                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white transition hover:bg-zinc-800">
                    <Plus size={18} />
                    New Chat
                </button>
            </div>

            {/* Recent Chats */}
            <div className="flex-1 overflow-y-auto p-3">
                <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Recent Chats
                </p>

                <div className="space-y-1">
                    {chatsList.map((chat, index) => (
                        <button
                            key={index}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-zinc-300 transition hover:bg-zinc-800"
                        >
                            <MessageSquare size={18} />
                            <span className="truncate">{chat.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* User Profile */}
            <div className="border-t border-zinc-800 p-4">
                <button
                    onClick={() =>
                        logout().then(() => {
                            navigate("/login");
                        })
                    }
                    className="mt-4 w-full rounded-xl border border-red-700 bg-red-600 px-4 py-3 text-white transition hover:bg-red-700 cursor-pointer"
                >
                    Logout
                </button>
                <button className="flex w-full items-center gap-3 rounded-xl p-2 transition hover:bg-zinc-800">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600">
                        <User size={20} className="text-white" />
                    </div>

                    <div className="flex-1 text-left">
                        <p className="font-medium text-white">
                            {user?.username || "Guest User"}
                        </p>
                        <p className="text-sm text-zinc-400">
                            {/* {user?.email || "john@example.com"} */}
                        </p>

                    </div>
                </button>
            </div>
        </aside>
    );
}