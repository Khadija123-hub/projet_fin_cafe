import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Coffee, Truck, Globe, MapPin, Languages, Home, Phone } from 'lucide-react';
import Logo from '../../images/logo.png';

const Navbar = ({ darkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Style for active and normal links
  const activeStyle = darkMode ? 'text-orange-400 font-semibold border-b-2 border-orange-400' : 'text-orange-300 font-semibold border-b-2 border-orange-300';
  const normalStyle = darkMode ? 'text-gray-200 hover:text-orange-400 hover:border-b-2 hover:border-orange-400 transition-colors duration-200 font-medium' : 'text-amber-100 hover:text-orange-300 hover:border-b-2 hover:border-orange-300 transition-colors duration-200 font-medium';

  return (
    <nav className={`fixed top-0 left-0 right-0 w-full z-50 shadow-lg transition-all duration-300 ${darkMode ? 'bg-gray-900' : 'bg-amber-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <NavLink to="/" className="flex items-center">
              <img src={Logo} alt="logo" className="h-16 w-auto transition-transform duration-300 hover:scale-105" />
            </NavLink>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-md transition-colors duration-200 ${darkMode ? 'text-gray-200 hover:text-orange-400' : 'text-amber-100 hover:text-orange-300'}`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLink to="/nosMenu" className={({ isActive }) => `px-4 py-2 text-lg ${isActive ? activeStyle : normalStyle}`}>
              Menu
            </NavLink>
            <NavLink to="/livraison" className={({ isActive }) => `px-4 py-2 text-lg ${isActive ? activeStyle : normalStyle}`}>
              Livraison
            </NavLink>
            <NavLink to="/developpement-durable" className={({ isActive }) => `px-4 py-2 text-lg ${isActive ? activeStyle : normalStyle}`}>
              Développement durable
            </NavLink>
            <NavLink to="/CaféSanté" className={({ isActive }) => `px-4 py-2 text-lg ${isActive ? activeStyle : normalStyle}`}>
              Café & Santé
            </NavLink>
            <NavLink to="/nos-salons" className={({ isActive }) => `px-4 py-2 text-lg ${isActive ? activeStyle : normalStyle}`}>
              <MapPin className="inline-block h-4 w-4 mr-1" /> Trouver nos salons
            </NavLink>
            <NavLink to="/langue" className={({ isActive }) => `px-4 py-2 text-lg ${isActive ? activeStyle : normalStyle}`}>
              <Languages className="inline-block h-4 w-4 mr-1" /> Langue
            </NavLink>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`md:hidden ${darkMode ? 'bg-gray-800' : 'bg-amber-800'} transition-all duration-300`}>
          <div className="px-4 pt-4 pb-6 space-y-2">
            <NavLink
              to="/nosMenu"
              className={({ isActive }) => `flex items-center px-4 py-3 text-base font-medium rounded-md ${isActive ? activeStyle : normalStyle}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Coffee className="h-5 w-5 mr-2" /> Menu
            </NavLink>
            <NavLink
              to="/livraison"
              className={({ isActive }) => `flex items-center px-4 py-3 text-base font-medium rounded-md ${isActive ? activeStyle : normalStyle}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Truck className="h-5 w-5 mr-2" /> Livraison
            </NavLink>
            <NavLink
              to="/developpement-durable"
              className={({ isActive }) => `flex items-center px-4 py-3 text-base font-medium rounded-md ${isActive ? activeStyle : normalStyle}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Globe className="h-5 w-5 mr-2" /> Développement durable
            </NavLink>
            <NavLink
              to="/moyen-orient"
              className={({ isActive }) => `flex items-center px-4 py-3 text-base font-medium rounded-md ${isActive ? activeStyle : normalStyle}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <MapPin className="h-5 w-5 mr-2" /> Moyen-Orient
            </NavLink>
            <NavLink
              to="/nos-salons"
              className={({ isActive }) => `flex items-center px-4 py-3 text-base font-medium rounded-md ${isActive ? activeStyle : normalStyle}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <MapPin className="h-5 w-5 mr-2" /> Trouver nos salons
            </NavLink>
            <NavLink
              to="/langue"
              className={({ isActive }) => `flex items-center px-4 py-3 text-base font-medium rounded-md ${isActive ? activeStyle : normalStyle}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Languages className="h-5 w-5 mr-2" /> Langue
            </NavLink>
            <NavLink
              to="/a-propos"
              className={({ isActive }) => `flex items-center px-4 py-3 text-base font-medium rounded-md ${isActive ? activeStyle : normalStyle}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-5 w-5 mr-2" /> À propos de nous
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => `flex items-center px-4 py-3 text-base font-medium rounded-md ${isActive ? activeStyle : normalStyle}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Phone className="h-5 w-5 mr-2" /> Contactez-nous
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;