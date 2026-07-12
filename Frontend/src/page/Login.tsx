import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../api";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = await login(username, password);
        setMessage(data.message);
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                width: 350,
                padding: 20,
                background: "white",
                borderRadius: 10,
                display: "flex",
                flexDirection: "column",
                gap: 12,
            }}
        >
            <h2>Login</h2>

            <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button>Login</button>

            <Link to="/register">Create Account</Link>

            <p>{message}</p>
        </form>
    );
}