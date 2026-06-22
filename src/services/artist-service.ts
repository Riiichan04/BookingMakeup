import { apiUrl } from "@/common/constant/api-url";
import { ServiceDetailResponse } from "@/types/artist";
import { ProviderProfileResponse } from "@/types/service-provider";

export const getProviderProfile = async (id: string): Promise<ProviderProfileResponse | null> => {
    try {
        const res = await fetch(`${apiUrl}/profile/providers/${id}`);
        if (!res.ok) return null;

        const result = await res.json() as ProviderProfileResponse;
        console.log(result)
        return result
    } catch (error) {
        console.error("Lỗi fetch provider profile:", error);
        return null;
    }
};

export const getServiceDetail = async (id: string): Promise<ServiceDetailResponse | null> => {
    try {
        const res = await fetch(`${apiUrl}/profile/providers/services/${id}`);
        if (!res.ok) return null;
        return await res.json() as ServiceDetailResponse;
    } catch (error) {
        console.error("Lỗi fetch service detail:", error);
        return null;
    }
};