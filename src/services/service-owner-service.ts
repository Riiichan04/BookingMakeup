import { apiUrl } from "@/common/constant/api-url";
import { RegisterServiceOwnerValues } from "@/schemas/register-service-owner-schema";
import { AuthDto, AuthResponse } from "@/types/auth";
import axios from "axios";

export async function handleServiceOwnerRegister(
    data: RegisterServiceOwnerValues
): Promise<AuthDto> {
    const response = await axios.post<AuthResponse>(`${apiUrl}/auth/register/service-owner`, {
        email: data.email,
        username: data.username,
        password: data.password,
        bio: data.bio,
        experienceYears: data.experienceYears,
        showcaseType: data.showcaseType,
        identityFront: data.identityFront || undefined,
        identityBack: data.identityBack || undefined,
    });

    if (!response.data.result || !response.data.authDto) {
        throw new Error(response.data.message || "Đăng ký Service Owner thất bại");
    }

    return response.data.authDto;
}
