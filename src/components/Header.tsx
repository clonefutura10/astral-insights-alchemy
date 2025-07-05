
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/30 backdrop-blur-xl border-b border-blue-300/20">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Moon className="w-8 h-8 text-blue-300 animate-pulse" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 bg-clip-text text-transparent tracking-wide">
            Pandit Pradeep Kiradoo
          </span>
        </div>
        
        <div className="flex space-x-8">
          <Link 
            to="/" 
            className={`relative text-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              isActive('/') 
                ? 'text-blue-300 font-semibold' 
                : 'text-blue-100/80 hover:text-blue-300'
            }`}
          >
            Home
            {isActive('/') && (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full animate-pulse" />
            )}
          </Link>
          
          <Link 
            to="/about" 
            className={`relative text-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              isActive('/about') 
                ? 'text-blue-300 font-semibold' 
                : 'text-blue-100/80 hover:text-blue-300'
            }`}
          >
            About
            {isActive('/about') && (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full animate-pulse" />
            )}
          </Link>
          
          <Link 
            to="/consultation" 
            className={`relative text-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              isActive('/consultation') 
                ? 'text-blue-300 font-semibold' 
                : 'text-blue-100/80 hover:text-blue-300'
            }`}
          >
            Consultation
            {isActive('/consultation') && (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full animate-pulse" />
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
