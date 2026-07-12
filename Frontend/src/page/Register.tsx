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
            <h2>Register</h2>

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

            <button>Register</button>

            <Link to="/login">Already have an account?</Link>

            <p>{message}</p>
        </form>
    );
}