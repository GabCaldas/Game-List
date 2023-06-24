import React from 'react';

interface Game {
  id: number;
  title: string;
  thumbnail: string;
  description: string;
  genre: string;
}

interface GameItemListProps {
  displayedGames: Game[];
  loadMoreGames: () => void;
}

const GameItemList: React.FC<GameItemListProps> = ({
  displayedGames,
  loadMoreGames,
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayedGames.map((game) => (
          <div key={game.id} className="bg-white p-4 shadow-lg hover:scale-105 transition-transform duration-300 rounded-lg">
            <img src={game.thumbnail} alt={game.title} className="w-full h-40 object-cover mb-4 rounded-lg" />
            <h3 className="flex justify-center text-lg font-semibold mb-2">{game.title}</h3>
            <p className="flex justify-center text-sm font-semibold text-blue-500">{game.genre}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameItemList;
