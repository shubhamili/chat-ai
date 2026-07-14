import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = await login(username, password);
        setMessage(data.message);
        authLogin({ id: data.user.id, username: data.user.username });
        toast.success(data.message);
        navigate("/");

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-2xl"
            >
                <h2 className="text-3xl font-bold text-center text-white">
                    Welcome Back
                </h2>

                <p className="mt-2 mb-8 text-center text-gray-400">
                    Sign in to your account
                </p>

                <div className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="Enter username"
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
                            placeholder="Enter password"
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
                    Login
                </button>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-violet-400 transition hover:text-violet-300"
                    >
                        Create Account
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