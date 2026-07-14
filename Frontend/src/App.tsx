import { Toaster } from "sonner";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <AppRoutes />
      </AuthProvider>
    </>
  );
}