import Image from 'next/image';
import React from 'react';

import appMlogo from '@/app/assets/appmastersLogo.png';

const Header: React.FC = () => {
  return (
    <header className="top-0 justify-center px-4 py-8 text-center bg-blue-150 mb-4 animate-fadeIn">
      <div className="flex items-center justify-center mb-3 mr-4">
        <Image src={appMlogo} alt="logoAppMasters" />
      </div>
      <h1 className="text-4xl font-bold text-white">Game List</h1>
      <h2 className="text-lg text-white">Project made for the App Masters selection process</h2>
    </header>
  );
};

export default Header;
