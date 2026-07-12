import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layout/layout";
import Login from "../page/Login";
import Register from "../page/Register";
import Chat from "../page/Home";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<Chat />} />

                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}