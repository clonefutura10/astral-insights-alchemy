
import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Star, Sun, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative z-10 bg-black/20 backdrop-blur-xl border-t border-white/10 mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Moon className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
                Pandit Pradeep Kiradoo
              </span>
            </div>
            <p className="text-purple-200 mb-4 max-w-md">
              Bridging ancient wisdom with modern understanding to illuminate your path through the science of Jyotish Shastra.
            </p>
            <div className="flex items-center space-x-2 text-purple-300">
              <Heart className="w-4 h-4 text-pink-400" />
              <span className="text-sm">Bhagya badla nahi ja sakta, par sawara ja sakta hai</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-purple-200 hover:text-yellow-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-purple-200 hover:text-yellow-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/consultation" className="text-purple-200 hover:text-yellow-400 transition-colors">
                  Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2 text-purple-200">
              <li className="flex items-center space-x-2">
                <Star className="w-3 h-3 text-yellow-400" />
                <span>Vedic Astrology</span>
              </li>
              <li className="flex items-center space-x-2">
                <Sun className="w-3 h-3 text-orange-400" />
                <span>Life Guidance</span>
              </li>
              <li className="flex items-center space-x-2">
                <Moon className="w-3 h-3 text-purple-400" />
                <span>Spiritual Counseling</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-purple-300 text-sm">
            © 2024 Pandit Pradeep Kiradoo. All rights reserved. | Guided by ancient wisdom, powered by modern technology.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
