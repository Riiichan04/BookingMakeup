export interface CategoryDto {
    id: string;
    name: string;
    slug: string;
    iconUrl: string;
    description: string;
}

export interface FeaturedArtistDto {
    id: string;
    displayName: string;
    avatarUrl: string;
    specialty: string;
    rating: number;
    reviewsCount: number;
    priceFrom: number;
}

export interface PromotionDto {
    id: string;
    title: string;
    code: string;
    discountPercent: number;
    imageUrl: string;
    validUntil: string;
}

export interface ReviewDto {
    id: string;
    customerName: string;
    customerAvatar: string;
    serviceName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface HomeArtist {
    id: string;
    displayName: string;
    specialty: string;
    rating: number;
    reviewsCount: number;
    avatarUrl: string;
    priceFrom: number;
}

export interface HomePromotion {
    id: string;
    code: string;
    discountValue: number;
    title: string;
    validUntil: string;
    imageUrl?: string;
}


export interface HomeDataResponse {
    featuredArtists: HomeArtist[];
    promotions: HomePromotion[];
}