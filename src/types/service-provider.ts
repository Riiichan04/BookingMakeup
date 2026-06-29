import { ServiceSimpleDto } from "./artist";
import { FeaturedArtistDto } from "./home";

export interface ProviderProfileResponse {
    ownerId: string;
    displayName: string;
    avatarUrl: string | null;
    address: string;
    experienceYears: number;
    bio: string;
    averageRating: number;
    totalReviews: number;
    artists: FeaturedArtistDto[];
    services: ServiceSimpleDto[];
}