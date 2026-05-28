"use client";

import { useEffect, useState } from 'react';
import { Artist } from '@/types/artist';
import { artistService } from '@/services/artist-service';
import ArtistCard from '@/components/artists/ArtistCard';

export default function ArtistManagementPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data = await artistService.getMyArtists();
        setArtists(data);
      } catch (err: any) {
        setError(err.message || 'Không thể tải danh sách Artist. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải danh sách...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Artist</h1>
        <button className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition shadow-md">
          Thêm Artist mới
        </button>
      </div>

      {artists.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">Bạn chưa có thợ makeup nào. Hãy thêm thợ mới nhé!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      )}
    </div>
  );
}