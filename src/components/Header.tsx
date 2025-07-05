
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Moon className="w-8 h-8 text-yellow-300 animate-pulse" />
          <span className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-blue-300 to-purple-300 bg-clip-text text-transparent tracking-wide">
            Pandit Pradeep Kiradoo
          </span>
        </div>
        
        <div className="flex space-x-8">
          <Link 
            to="/" 
            className={`relative text-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              isActive('/') 
                ? 'text-yellow-300 font-semibold' 
                : 'text-white/80 hover:text-yellow-300'
            }`}
          >
            Home
            {isActive('/') && (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-300 to-purple-300 rounded-full animate-pulse" />
            )}
          </Link>
          
          <Link 
            to="/about" 
            className={`relative text-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              isActive('/about') 
                ? 'text-yellow-300 font-semibold' 
                : 'text-white/80 hover:text-yellow-300'
            }`}
          >
            About
            {isActive('/about') && (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-300 to-purple-300 rounded-full animate-pulse" />
            )}
          </Link>
          
          <Link 
            to="/consultation" 
            className={`relative text-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              isActive('/consultation') 
                ? 'text-yellow-300 font-semibold' 
                : 'text-white/80 hover:text-yellow-300'
            }`}
          >
            Consultation
            {isActive('/consultation') && (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-300 to-purple-300 rounded-full animate-pulse" />
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
