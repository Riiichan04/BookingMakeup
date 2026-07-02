import { apiUrl } from "@/common/constant/api-url";
import { HomeDataResponse, HomeProvider, HomeArtist, HomePromotion } from "@/types/home";
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

export const getFeaturedProviders = async (): Promise<HomeProvider[]> => {
    try {
        const res = await axios.get<HomeProvider[]>(`${apiUrl}/home/featured-providers`);
        return res.data;
    } catch {
        return [];
    }
};

export const getFeaturedArtists = async (): Promise<HomeArtist[]> => {
    try {
        const res = await axios.get<HomeArtist[]>(`${apiUrl}/home/featured-artists`);
        return res.data;
    } catch {
        return [];
    }
};

export const getHomePromotions = async (): Promise<HomePromotion[]> => {
    try {
        const res = await axios.get<HomePromotion[]>(`${apiUrl}/home/promotions`);
        return res.data;
    } catch {
        return [];
    }
};