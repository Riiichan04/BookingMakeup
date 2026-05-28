export interface Artist {
  id: string;
  artistName: string;
  specialization: string;
  portfolioImages: string;
  averageRating: number;
  reviewCount: number;
  followCount: number;
}

export interface Booking {
  id: string;
  customerId: string;
  customerDisplayName: string;
  serviceId: string;
  serviceName: string;
  artistId: string;
  artistName: string;
  bookingDate: string; // YYYY-MM-DD
  startTime: string;   // HH:mm:ss
  endTime: string;
  totalAmount: number;
  depositAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}