import React from 'react';
import { Link } from 'lucide-react';

type HeaderVariant = 'default' | 'auth' | 'dashboard' | 'watch';

interface HeaderProps {
  variant?: HeaderVariant;
}

const Header: React.FC<HeaderProps> = ({ variant = 'default' }) => {
  const user = {};

  return (
    <div className="absolute top-0 flex justify-between items-center w-screen h-13 bg-gray-600">
      <div className="flex items-center justify-center border border-solid pl-10 pr-10 ml-10">
        Logo
      </div>

      

      {variant === 'auth' && (
        <div className="flex items-center justify-center border border-solid pl-10 pr-10 mr-10">
          Login
        </div>
      )}

      {variant === 'dashboard' && (
        <div className="flex items-center justify-center border border-solid pl-10 pr-10 mr-10">
          Dashboard Menu
        </div>
      )}

      {variant === 'default' && (
        <div className="flex items-center justify-center border border-solid pl-10 pr-10 mr-10">
          Logout
        </div>
      )}

      { variant === "watch" && (
        <div className="flex items-center justify-center border border-solid pl-10 pr-10 mr-10">
          Watch
        </div>
      )}
    </div>
  );
};

export default Header;
