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