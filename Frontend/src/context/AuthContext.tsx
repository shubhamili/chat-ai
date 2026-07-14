import { createContext, useContext, useState } from "react";


type User = {
    id: string;
    username: string;
};

type AuthContextType = {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);



export function AuthProvider({ children }: { children: React.ReactNode }) {


    const [user, setUser] = useState<User | null>(null);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ login, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined || !context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}