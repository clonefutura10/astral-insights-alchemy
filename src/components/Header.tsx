
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Moon className="w-8 h-8 text-yellow-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
            Pandit Pradeep Kiradoo
          </span>
        </div>
        
        <div className="flex space-x-8">
          <Link 
            to="/" 
            className={`relative text-lg font-medium transition-colors duration-300 ${
              isActive('/') 
                ? 'text-yellow-400' 
                : 'text-white hover:text-yellow-400'
            }`}
          >
            Home
            {isActive('/') && (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-purple-400 rounded-full" />
            )}
          </Link>
          
          <Link 
            to="/about" 
            className={`relative text-lg font-medium transition-colors duration-300 ${
              isActive('/about') 
                ? 'text-yellow-400' 
                : 'text-white hover:text-yellow-400'
            }`}
          >
            About
            {isActive('/about') && (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-purple-400 rounded-full" />
            )}
          </Link>
          
          <Link 
            to="/consultation" 
            className={`relative text-lg font-medium transition-colors duration-300 ${
              isActive('/consultation') 
                ? 'text-yellow-400' 
                : 'text-white hover:text-yellow-400'
            }`}
          >
            Consultation
            {isActive('/consultation') && (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-purple-400 rounded-full" />
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
