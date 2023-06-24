import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm}) => {
  return (
    <div className={`mb-2`}>
      <input
        type="text"
        className="flex justify-start w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        placeholder="Search games..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
