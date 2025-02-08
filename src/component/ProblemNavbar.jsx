import React from 'react';

const ProblemNavbar = ({ data, onNavChange }) => {
  const navOptions = ['description', 'Submissions',"editorial"];

  return (
    <div className="h-[50px] bg-zinc-800 border-b border-gray-700 flex items-center px-4">
      {navOptions.map((option) => (
        <div
          key={option}
          className={`mr-4 cursor-pointer ${
            data.nav_option_name === option ? 'text-white' : 'text-gray-400'
          }`}
          onClick={() => onNavChange(option)}
        >
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </div>
      ))}
    </div>
  );
};

export default ProblemNavbar;
