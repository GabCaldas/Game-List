'use client'

import appMlogo from '@/app/assets/appmastersLogo.png';
import axios, { AxiosError } from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Game {
  id: number;
  title: string;
  thumbnail: string;
  description: string;
  genre: string;
}

interface Genre {
  name: string;
  active: boolean;
}

export default function GameList() {
  const [gameList, setGameList] = useState<Game[]>([]);
  const [displayedGames, setDisplayedGames] = useState<Game[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(30);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genres, setGenres] = useState<Genre[]>([]);

  const url = 'https://games-test-api-81e9fb0d564a.herokuapp.com/api/data/';
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'dev-email-address': 'gabrielcaldas7@gmail.com',
  };

  useEffect(() => {
    axios
      .get<Game[]>(url, { headers })
      .then((response) => {
        const data = response.data;
        setGameList(data);
        setDisplayedGames(data.slice(startIndex, endIndex));
        setLoading(false);
        extractGenres(data);
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          console.log('Error:', error.response.data);
        } else if (error.request) {
          console.log('Request Error:', error.request);
        } else {
          console.log('Error:', error.message);
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filteredGames;

    if (searchTerm === '') {
      filteredGames = gameList.slice(startIndex, endIndex);
    } else if (searchTerm.length === 1) {
      filteredGames = gameList.filter((game) =>
        game.title.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
    } else {
      filteredGames = gameList.filter((game) =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setDisplayedGames(filteredGames);
  }, [searchTerm]);

  const extractGenres = (games: Game[]) => {
    const genreSet = new Set<string>();
    games.forEach((game) => {
      genreSet.add(game.genre);
    });
    const genreArray = ['All', ...Array.from(genreSet)].map((genre) => ({
      name: genre,
      active: false,
    }));
    setGenres(genreArray);
  };
  

  const filterByGenre = (genreName: string) => {
    if (genreName === 'All') {
      setDisplayedGames(gameList.slice(startIndex, endIndex));
    } else {
      const filteredGames = gameList.filter((game) => game.genre === genreName);
      setDisplayedGames(filteredGames);
    }
  };
  
  const loadMoreGames = () => {
    const newEndIndex = endIndex + 30;
    setDisplayedGames(gameList.slice(startIndex, newEndIndex));
    setEndIndex(newEndIndex);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-blue-150 min-h-screen">
      <header className="sticky top-0 justify-center px-4 py-1 text-center bg-blue-150 mb-4">
        <div className="flex items-center justify-center">
          <Image src={appMlogo} alt="logoAppMasters" />
        </div>
        <h1 className="text-4xl font-bold text-white">Game List</h1>
        <h2>Project made for the App Masters selection process</h2>
      </header>
      <div className="flex justify-center">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 flex flex-col items-center">
            <div className="w-auto bg-blue-150 border rounded border-gray-300 text-white">
              <h2 className="text-lg font-bold mb-4 px-4">Genres</h2>
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
          </div>
          <div className="col-span-3 flex flex-col items-center">
            <main className="flex-grow mr-40">
              <div className="search-bar-container mb-4 px-1">
                <input
                  type="text"
                  className="w-full sm:w-1/2 md:w-2/4 lg:w-1/3 xl:w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="Search games..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
                </div>
              ) : (
                <div
                  className="game-list-container overflow-y-auto bg-blue-150 border rounded border-gray-300 p-4"
                  style={{ maxHeight: '500px', width: '80%', scrollbarWidth: 'thin', scrollbarColor: '#ffffff #d1d5db' }}
                >
                  <style>
                    {`
                      .game-list-container::-webkit-scrollbar {
                        width: 8px;
                      }
                      .game-list-container::-webkit-scrollbar-track {
                        background-color: #0008e0;
                        border-radius: 4px;
                      }
                      .game-list-container::-webkit-scrollbar-thumb {
                        background-color: #ffffff;
                        border-radius: 4px;
                      }
                    `}
                  </style>
                  <ul className="grid grid-cols-3 gap-4">
                    {displayedGames.map((game) => (
                      <li
                        key={game.id}
                        className="game-item transform transition-transform duration-300 hover:scale-105 border rounded border-gray-300"
                      >
                        <div className="game-item-inner rounded-lg p-4 bg-white">
                          <div className="game-image">
                            <img src={game.thumbnail} alt={game.title} className="rounded-lg" />
                          </div>
                          <div
                            className="game-details"
                            style={{ overflow: 'auto', maxHeight: '100px' }}
                          >
                            <h3 className="text-lg font-bold mb-2 text-center text-blue-150">
                              {game.title}
                            </h3>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {gameList.length && (
                    <div className="flex justify-center mt-4 mr-auto">
                      <button
                        onClick={loadMoreGames}
                        className="bg-blue-150 hover:bg-white hover:text-blue-150 text-white font-bold py-2 px-4 rounded-full shadow-md border border-gray-300"
                      >
                        Load More Games
                      </button>
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
  
  
  
}