import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#000",
                color: "#fff",
            }}
        >
            <Outlet />
        </div>
    );
}