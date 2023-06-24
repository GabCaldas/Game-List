'use client'
import GameItemList from '@/components/GameItemList';
import GenreList from '@/components/GenreList';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import loadgif from '../app/assets/loading.gif';

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

const GameList: React.FC = () => {
  const [gameList, setGameList] = useState<Game[]>([]);
  const [displayedGames, setDisplayedGames] = useState<Game[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(30);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [error, setError] = useState('');

  const url = 'https://games-test-api-81e9fb0d564a.herokuapp.com/api/data/';
  const headers = {
    Accept: 'application/json, text/plain, */*',
    'dev-email-address': 'gabrielcaldas7@gmail.com',
  };

  useEffect(() => {
    const apiTimeout = setTimeout(() => {
      setError('O servidor demorou para responder. Tente mais tarde.');
      setLoading(false);
    }, 5000);
  
    axios
      .get<Game[]>(url, { headers, timeout: 5000 })
      .then((response) => {
        clearTimeout(apiTimeout);
        const data = response.data;
        setGameList(data);
        setDisplayedGames(data.slice(startIndex, endIndex));
        setLoading(false);
        extractGenres(data);
      })
      .catch((error) => {
        clearTimeout(apiTimeout);
        if (error.response && error.response.status >= 500 && error.response.status <= 509) {
          setError('O servidor falhou em responder. Tente recarregar a página.');
        } else {
          setError('O servidor não conseguirá responder por agora, tente voltar novamente mais tarde.');
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filteredGames: Game[];

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

  const ErrorPopup: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-y-1/2 bg-white border border-white rounded shadow-lg text-center z-50 w-96">
        <p className="text-blue-150 mb-4">{message}</p>
        <button className="bg-blue-150 text-white px-4 py-2 rounded" onClick={handleReloadPage}>
          Recarregar Página
        </button>
      </div>
    );
  };

  const handleCloseErrorPopup = () => {
    setError('');
  };

  const handleReloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center bg-blue-150 min-h-screen">
      {error && <ErrorPopup message={error} onClose={handleCloseErrorPopup} />}
      <Header />
      {!error && (
        <div className="w-full md:w-3/4 flex flex-col items-center">
          {!loading && (
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          )}
          <div className="flex flex-col md:flex-row justify-center">
            <GenreList genres={genres} filterByGenre={filterByGenre} loading={loading} />
            <main className="w-full md:w-3/4 flex-grow md:ml-8">
              {loading ? (
                <div className="w-14 mr-10">
                  <Image src={loadgif} alt="carregamento" width={50} height={50} />
                </div>
              ) : (
                <GameItemList displayedGames={displayedGames} loadMoreGames={loadMoreGames} />
              )}
              {!loading && (
                <div className="flex justify-center mt-4">
                  <button
                    className="border border-white text-white bg-blue-150 py-2 px-4 rounded"
                    onClick={loadMoreGames}
                  >
                    Carregar Mais
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameList;
