import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

interface Genre {
  name: string;
  active: boolean;
}

interface GenreListProps {
  genres: Genre[];
  filterByGenre: (genreName: string) => void;
  loading: boolean;
}

const GenreList: React.FC<GenreListProps> = ({ genres, filterByGenre, loading }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (loading) {
    return null;
  }

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -10 },
  };

  return (
    <div className="w-28 h-full bg-blue-150 border rounded border-gray-300 text-white">
      <h2 className="text-lg font-bold mb-1 px-1 flex justify-center">Genres</h2>
      <div
        className="cursor-pointer py-2 px-4 hover:text-blue-200"
        onClick={handleMenuToggle}
      >
        &#9776; Menu
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="menu-content"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            transition={{ duration: 0.2 }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GenreList;
