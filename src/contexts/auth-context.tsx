"use client";

import { deleteClientCookie, setClientCookie } from "@/common/utils/cookie-handler";
import { AuthDto } from "@/types/auth";
import { createContext, useContext, useState } from "react";

interface AuthContextType {
    user: AuthDto | null;
    login: (userData: AuthDto) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({
    initialUser,
    children
}: {
    initialUser: AuthDto | null;
    children: React.ReactNode
}) {
    const [{ user, isLoading }, setAuthState] = useState({
        user: initialUser,
        isLoading: false,
    });

    const login = (userData: AuthDto) => {
        if (!userData.jwtToken) return;

        setAuthState({ user: userData, isLoading: false });
        setClientCookie("token", userData.jwtToken, 7);
        localStorage.setItem("user_data", JSON.stringify(userData));
    };

    const logout = () => {
        setAuthState({ user: null, isLoading: false });
        deleteClientCookie("token");
        localStorage.removeItem("user_data");
        window.location.href = "/";
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};