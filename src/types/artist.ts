
export interface FeaturedArtistDto {
    id: string;
    displayName: string;
    specialty: string;
    rating: number;
    reviewsCount?: number;
    priceFrom?: number;
    avatarUrl: string | null;
}

export interface ServiceSimpleDto {
    id: string;
    name: string;
    price: number;
    duration: number;
    imageUrl: string;
}

export interface ServiceDetailResponse {
    serviceId: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    category: string;
    ownerId: string;
    ownerName: string;
    ownerAvatar: string | null;
    relatedServices: ServiceSimpleDto[];
    mainThumbnailUrl: string;
}