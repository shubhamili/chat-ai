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

    return res.json();
};