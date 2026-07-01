export type CommentTag = "NICE_ATTITUDE" | "GOOD_SERVICE" | "ON_TIME" | "BAD_SERVICE" | "WORST_ATTITUDE";

export interface ReviewDto {
    id: string;
    bookingId?: string;
    customerId?: string;
    artistId?: string;
    customer: string;
    service: string;
    rating: number;
    artistRating: number;
    comment: string;
    images?: string;
    tags?: CommentTag;
    date: string;
    status: "APPROVED" | "PENDING" | "HIDDEN";
}

export interface CreateReviewRequest {
    bookingId: string;
    bookingRating: number;
    artistRating: number;
    comment: string;
    images?: string;
    tags: CommentTag;
}

export interface CheckReviewableResponse {
    canReview: boolean;
    bookingId?: string;
}