import apiClient from "@/common/constant/api-client";
import { UserDto } from "@/types/user";

export const userService = {
    getAllUsers: async (): Promise<UserDto[]> => {
        const response = await apiClient.get("/users");
        return response.data;
    },

    updateUserStatus: async (id: string, active: boolean): Promise<UserDto> => {
        const response = await apiClient.put(`/users/${id}/status`, { active });
        return response.data;
    },

    updateUserRole: async (id: string, role: string): Promise<UserDto> => {
        const response = await apiClient.put(`/users/${id}/role`, { role });
        return response.data;
    },
};
