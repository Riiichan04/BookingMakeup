"use client";

import { AuthDto } from "@/types/auth";
import Cookies from "js-cookie";
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useSyncExternalStore,
} from "react";

const USER_DATA_KEY = "user_data";
const AUTH_CHANGE_EVENT = "auth-change";

interface AuthContextType {
    user: AuthDto | null;
    login: (userData: AuthDto) => void;
    logout: () => void;
    updateUser: (updatedData: Partial<AuthDto>) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Snapshot primitive — must stay referentially stable when data is unchanged. */
function getUserSnapshot(): string | null {
    if (typeof window === "undefined") return null;

    const savedUser = localStorage.getItem(USER_DATA_KEY);
    const token = Cookies.get("token");

    if (!savedUser || !token) return null;

    return savedUser;
}

function parseUserSnapshot(snapshot: string | null): AuthDto | null {
    if (!snapshot) return null;

    try {
        return JSON.parse(snapshot) as AuthDto;
    } catch {
        return null;
    }
}

function persistUser(user: AuthDto | null) {
    if (user) {
        const userJson = JSON.stringify(user);
        localStorage.setItem(USER_DATA_KEY, userJson);
        Cookies.set(USER_DATA_KEY, userJson, {
            expires: 7,
            sameSite: "lax",
        });
        if (user.jwtToken) {
            Cookies.set("token", user.jwtToken, {
                expires: 7,
                sameSite: "lax",
            });
        }
    } else {
        localStorage.removeItem(USER_DATA_KEY);
        Cookies.remove(USER_DATA_KEY);
        Cookies.remove("token");
    }
}

function subscribeToAuth(onStoreChange: () => void) {
    const handleStorage = (e: StorageEvent) => {
        if (e.key === USER_DATA_KEY || e.key === null) {
            onStoreChange();
        }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(AUTH_CHANGE_EVENT, onStoreChange);

    return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(AUTH_CHANGE_EVENT, onStoreChange);
    };
}

function notifyAuthChange() {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

function subscribeNoop() {
    return () => {};
}

export default function AuthProvider({
    initialUser,
    children,
}: {
    initialUser: AuthDto | null;
    children: React.ReactNode;
}) {
    const serverUserSnapshot = useMemo(
        () => (initialUser ? JSON.stringify(initialUser) : null),
        [initialUser]
    );

    const userSnapshot = useSyncExternalStore(
        subscribeToAuth,
        getUserSnapshot,
        () => serverUserSnapshot
    );

    const user = useMemo(
        () => parseUserSnapshot(userSnapshot),
        [userSnapshot]
    );

    const isHydrated = useSyncExternalStore(
        subscribeNoop,
        () => true,
        () => false
    );

    const login = useCallback((userData: AuthDto) => {
        if (!userData.jwtToken) return;
        if (typeof window !== "undefined") {
            sessionStorage.removeItem("is_service_owner");
        }
        persistUser(userData);
        notifyAuthChange();
    }, []);

    const logout = useCallback(() => {
        if (typeof window !== "undefined") {
            sessionStorage.removeItem("is_service_owner");
        }
        persistUser(null);
        notifyAuthChange();
        window.location.href = "/";
    }, []);

    const updateUser = useCallback((updatedData: Partial<AuthDto>) => {
        const current = parseUserSnapshot(getUserSnapshot());
        if (!current) return;

        persistUser({ ...current, ...updatedData });
        notifyAuthChange();
    }, []);

    const value = useMemo(
        () => ({
            user,
            login,
            logout,
            updateUser,
            isLoading: !isHydrated,
        }),
        [user, login, logout, updateUser, isHydrated]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error(
            "useAuth must be used within an AuthProvider"
        );
    }

    return context;
};
