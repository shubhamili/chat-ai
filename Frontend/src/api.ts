import { toast } from "sonner";

const API = "http://localhost:3000/api";

export const register = async (username: string, password: string) => {
    const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
    });

    return res.json();
};

export const login = async (username: string, password: string) => {
    const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
        console.error("Login failed:", res.statusText);
        toast.error("Login failed.");
    }

    return res.json();
};


export const logout = async () => {
    const res = await fetch(`${API}/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (!res.ok) {
        console.error("Logout failed:", res.statusText);
        toast.error("Logout failed.");
    }

    return res.json();
};


export const fetchMe = async () => {
    const res = await fetch(`${API}/me`, {
        method: "GET",
        credentials: "include",
    });
    return res.json();
};