import React from 'react';

interface Genre {
  name: string;
  active: boolean;
}

interface GenreListProps {
  genres: Genre[];
  filterByGenre: (genreName: string) => void;
  loading: boolean;
}


const GenreList: React.FC<GenreListProps> = ({ genres, filterByGenre, loading}) => {
  if (loading) {
    return null; 
  }
  const isMobile = window.innerWidth <= 768;

  return (
    <div className="sticky w-28 h-full bg-blue-150 border rounded border-gray-300 text-white">
      <h2 className="text-lg font-bold mb-1 px-1 flex justify-center">Genres</h2>
      <ul className="text-white">
        {genres.map((genre) => (
          <li
            key={genre.name}
            className={`cursor-pointer py-2 px-4 ${
              genre.active ? 'text-blue-200' : 'hover:text-blue-200'
            }`}
            onClick={() => filterByGenre(genre.name)}
          >
            {genre.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GenreList;
