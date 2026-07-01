import { Artist } from '@/types/artist';

interface Props {
  artist: Artist;
}

export default function ArtistProfileHeader({ artist }: Props) {
  return (
    <div className="bg-white border rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
      <img 
        src={artist.portfolioImages || "https://via.placeholder.com/150"} 
        className="w-32 h-32 rounded-full object-cover border-4 border-gray-50 shadow-md shrink-0" 
        alt="Avatar" 
      />
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900">{artist.artistName}</h1>
        <p className="text-lg text-gray-500 mt-2 font-medium">Chuyên môn: {artist.specialization}</p>
        <div className="flex flex-wrap gap-4 mt-5 text-sm font-bold">
          <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-100 shadow-sm">
            Follow {artist.followCount || 0}
          </span>
          <span className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg border border-yellow-100 shadow-sm">
            ⭐ {artist.averageRating ? artist.averageRating.toFixed(1) : "0.0"} ({artist.reviewCount || 0} Đánh giá)
          </span>
        </div>
      </div>
    </div>
  );
}