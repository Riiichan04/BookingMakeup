import { apiUrl } from "@/common/constant/api-url";
import { HomeDataResponse } from "@/types/home";

export const getHomeData = async (): Promise<HomeDataResponse> => {
    try {
        const res = await fetch(`${apiUrl}/home/data`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch home data: ${res.status}`);
        }

        const data = await res.json();

        return {
            featuredArtists: data.featuredArtists || [],
            promotions: data.promotions || [],
        };
    } catch {
        return {
            featuredArtists: [],
            promotions: [],
        };
    }
};