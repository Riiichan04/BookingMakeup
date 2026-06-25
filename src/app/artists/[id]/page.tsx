"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Artist, Booking } from '@/types/artist';
import { artistService } from '@/services/artist-service';
import ArtistProfileHeader from '@/components/artists/ArtistProfileHeader';
import BookingTable from '@/components/artists/BookingTable';

export default function ArtistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const artistId = params.id as string;

  const [artist, setArtist] = useState<Artist | null>(null);
  const [schedule, setSchedule] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtistData = async () => {
      try {
        const [artistData, bookingsData] = await Promise.all([
          artistService.getArtistById(artistId),
          artistService.getArtistBookings(artistId)
        ]);
        
        setArtist(artistData);
        // Chỉ lấy PENDING và CONFIRMED
        const activeBookings = bookingsData.filter(b => 
          b.status === 'PENDING' || b.status === 'CONFIRMED'
        );
        setSchedule(activeBookings);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    if (artistId) loadArtistData();
  }, [artistId]);

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải thông tin...</div>;
  if (!artist) return <div className="p-8 text-center text-red-500">Không tìm thấy thông tin Artist!</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <button 
        onClick={() => router.back()} 
        className="text-gray-500 hover:text-black mb-4 font-medium flex items-center gap-2"
      >
        ← Quay lại danh sách
      </button>

      {/* Component chứa thông tin Artist */}
      <ArtistProfileHeader artist={artist} />

      {/* Component chứa Lịch làm việc */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          Lịch làm việc sắp tới 
          <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {schedule.length} lịch hẹn
          </span>
        </h2>
        <BookingTable schedule={schedule} />
      </div>
    </div>
  );
}