export interface MakeupService {
  id: number;
  title: string;
  category: string;
  categoryTag: string;
  categoryTagColor: string;
  artistName: string;
  artistInitials: string;
  artistColor: string;
  rating: number;
  reviewCount: number;
  priceFrom: number;
  imageUrl: string;
  location: string;
  description: string;
}

export interface SearchResponse {
  services: MakeupService[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchParams {
  keyword?: string;
  location?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}
