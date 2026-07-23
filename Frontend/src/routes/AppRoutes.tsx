import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layout/layout";
import Login from "../page/Login";
import Register from "../page/Register";
import Chat from "../page/Home";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<AuthLayout />}>
                    <Route path="/" element={<Chat />} />
                    <Route path="/chat/:conversationId?" element={<Chat />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}