import React from 'react';

type HeaderVariant = 'default' | 'signedUser' | 'noSignedUser' | "menu";

interface HeaderProps {
  variant?: HeaderVariant;
  location?: string;
}

const Header: React.FC<HeaderProps> = ({ variant = 'default', location }) => {
  let actionSection;


  // Put the if else logic here instead of doing it in return
  if (variant === 'signedUser') {
    actionSection = (
      <div className="flex items-center justify-center border border-solid pl-10 pr-10 mr-10">
        Logout
      </div>
    );
  } else if (variant === 'noSignedUser') {
    actionSection = (
      <div className="flex items-center justify-center border border-solid pl-10 pr-10 mr-10">
        Login
      </div>
    );
  } else {
    actionSection = (
      <>
      </>
    );
  }

  return (
    <div className="relative top-0 flex justify-between items-center w-screen h-13 bg-gray-600">
      <div className="flex items-center justify-center border border-solid pl-10 pr-10 ml-10 gap-4">
        <span>Logo</span>
      </div>

      { location && (<div className="flex items-center justify-center border border-solid pl-10 pr-10 ml-10 gap-4">
        <span>{location}</span>
      </div>)}

      {actionSection}
    </div>
  );
};

export default Header;
