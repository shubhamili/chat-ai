import { useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../api";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = await register(username, password);
        setMessage(data.message);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-2xl"
            >
                <h2 className="text-center text-3xl font-bold text-white">
                    Create Account
                </h2>

                <p className="mb-8 mt-2 text-center text-gray-400">
                    Register to start chatting
                </p>

                <div className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-8 w-full rounded-xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-700 active:scale-95"
                >
                    Register
                </button>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-violet-400 transition hover:text-violet-300"
                    >
                        Login
                    </Link>
                </p>

                {message && (
                    <div className="mt-6 rounded-xl border border-gray-700 bg-gray-800 p-3 text-center text-sm text-gray-300">
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}