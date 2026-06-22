export interface UserDto {
    id: string;
    username: string;
    email: string;
    displayName: string | null;
    avatarUrl: string | null;
    phone: string | null;
    gender: string | number | null;
    role: "USER" | "ADMIN" | number;
    isActive: boolean;
    address: string | null;
    totalPoints: number;
}

export interface ServiceOwnerProfileDto {
    userId: string;
    bio: string;
    experienceYears: number;
    showcaseType: "STANDARD" | "PREMIUM";
    identityFront: string | null;
    identityBack: string | null;
    verificationStatus: string;
}

export interface UpdateServiceOwnerProfileRequest {
    bio?: string;
    experienceYears?: number;
    showcaseType?: "STANDARD" | "PREMIUM";
    identityFront?: string;
    identityBack?: string;
}

export interface UpdateProfileRequest {
    displayName?: string;
    avatarUrl?: string;
    phone?: string;
    gender?: string | number;
    address?: string;
}

export interface ChangePasswordRequest {
    oldPassword?: string;
    newPassword?: string;
}
