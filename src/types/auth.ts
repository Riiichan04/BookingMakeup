export interface AuthDto {
    id: string;
    email: string;
    username: string;
    displayName: string | null;
    gender: number;
    avatar: string | null;
    description: string | null;
    isActive: boolean;
    isVerified: boolean;
    role: number;
    jwtToken: string | null;
    totalPoint: number;
}

export interface AuthResponse {
    result: boolean;
    message: string;
    authDto: AuthDto | null;
}