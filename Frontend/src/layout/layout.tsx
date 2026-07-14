import { Outlet } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { fetchMe } from "../api";
import { toast } from "sonner";

export default function AuthLayout() {

    const { login } = useAuth();

    const [loading, setLoading] = useState(true);

    const fetchMeApi = async () => {
        try {
            fetchMe().then((data) => {
                if (data.user) {
                    console.log("User fetched:", data.user);
                    login(data.user);
                }
            });
        } catch (error) {
            console.error("Error fetching user:", error);
            toast.error("Error fetching user.");
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchMeApi();
    }, []);

    return (
        <div className="flex h-screen bg-gray-950 text-white">
            {loading ? (
                <div className="flex h-screen w-full items-center justify-center">
                    <p className="text-lg font-semibold text-white">Loading...</p>
                </div>
            ) : (
                <>
                    <Sidebar />
                    <main className="flex-1 overflow-hidden">
                        <Outlet />
                    </main>
                </>
            )}
        </div>
    );
}