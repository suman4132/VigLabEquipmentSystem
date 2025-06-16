import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogIn, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center group transition duration-300"
            >
              <div className="p-2 bg-white rounded-lg group-hover:rotate-12 transition duration-300">
                <LayoutDashboard className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="ml-3 text-2xl font-bold text-white tracking-tight">
               Vignan Lab<span className="font-light">Manager</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/about" 
              className="text-white hover:bg-indigo-700 px-4 py-2 rounded-lg transition duration-300 font-medium hover:scale-105"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-white hover:bg-indigo-700 px-4 py-2 rounded-lg transition duration-300 font-medium hover:scale-105"
            >
              Contact
            </Link>
            <Link
              to="/login"
              className="ml-4 bg-white text-indigo-600 px-6 py-2 rounded-lg flex items-center font-medium hover:bg-indigo-50 hover:shadow-md transition duration-300 hover:scale-105"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-indigo-200 focus:outline-none p-2 rounded-lg hover:bg-white/20 transition duration-300"
            >
              {isOpen ? (
                <X className="h-8 w-8" />
              ) : (
                <Menu className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 pt-2 pb-4 space-y-2 bg-indigo-700/95 shadow-inner">
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-indigo-600 block px-4 py-3 rounded-lg font-medium transition duration-300"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-indigo-600 block px-4 py-3 rounded-lg font-medium transition duration-300"
          >
            Contact
          </Link>
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="bg-white text-indigo-600 block px-4 py-3 rounded-lg font-medium text-center hover:bg-indigo-50 transition duration-300 mt-2"
          >
            <div className="flex items-center justify-center">
              <LogIn className="h-5 w-5 mr-2" />
              Login
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}