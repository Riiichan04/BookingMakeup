import { apiUrl } from "@/common/constant/api-url";
import { HomeDataResponse } from "@/types/home";
import axios from "axios";

export const getHomeData = async (): Promise<HomeDataResponse> => {
    try {
        const res = await axios.get<HomeDataResponse>(`${apiUrl}/home/data`);

        return res.data;
    } catch {
        return {
            featuredProviders: [],
            featuredArtists: [],
            promotions: [],
        };
    }
};