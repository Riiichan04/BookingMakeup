import { SearchParams, SearchResponse } from "@/types/service";
import apiClient from "./client";

//Tìm kiem service
export async function searchServices(params: SearchParams): Promise<SearchResponse> {
  const { data } = await apiClient.get<SearchResponse>("/api/services/search", {
    params: {
      keyword: params.keyword || undefined,
      location: params.location || undefined,
      category: params.category || undefined,
      minPrice: params.minPrice || undefined,
      maxPrice: params.maxPrice || undefined,
      minRating: params.minRating || undefined,
      sortBy: params.sortBy || "suggested",
      page: params.page || 1,
      pageSize: params.pageSize || 6,
    },
  });
  return data;
}

export async function getCategories(): Promise<string[]> {
  const { data } = await apiClient.get<string[]>("/api/services/categories");
  return data;
}
