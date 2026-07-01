import Link from 'next/link';
import { Artist } from '@/types/artist';

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link href={`/artists/${artist.id}`}>
      <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer group h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-4 mb-5">
            <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden border border-gray-200 shrink-0">
              <img 
                src={artist.portfolioImages || "https://via.placeholder.com/150"} 
                alt={artist.artistName} 
                className="object-cover w-full h-full group-hover:scale-110 transition-transform"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 line-clamp-1">{artist.artistName}</h2>
              <p className="text-sm text-gray-500 font-medium line-clamp-1">{artist.specialization}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm font-medium border-t pt-4 mt-auto">
          <span className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">
            ⭐ {artist.averageRating ? artist.averageRating.toFixed(1) : "0.0"} ({artist.reviewCount || 0})
          </span>
          <span className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            Follow {artist.followCount || 0}
          </span>
        </div>
      </div>
    </Link>
  );
}