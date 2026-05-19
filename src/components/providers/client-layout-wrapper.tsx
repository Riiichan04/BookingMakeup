"use client";

import AuthProvider from "@/contexts/auth-context";
import { AuthDto } from "@/types/auth";
import { Toaster } from "sonner";

export default function ClientLayoutWrapper({ initialUser, children }: { initialUser: AuthDto | null, children: React.ReactNode }) {
    return (
        <AuthProvider initialUser={initialUser}>
            {children}
            <Toaster richColors closeButton />
        </AuthProvider>
    );
}