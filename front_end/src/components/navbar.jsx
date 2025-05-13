import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Coffee, Truck, Globe, MapPin, Languages, Home, Phone } from 'lucide-react';
import Logo from '../../images/logo.png';

const Navbar = ({ darkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Style pour les liens actifs
  const activeStyle = darkMode ? "text-orange-400 font-semibold" : "text-orange-300 font-semibold";
  const normalStyle = darkMode ? "text-orange-100 hover:text-orange-400 font-medium" : "text-amber-100 hover:text-orange-300 font-medium";

  return (
    <nav className={`shadow-md fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${darkMode ? 'bg-gray-900' : 'bg-amber-900'}`}>
      <div className="h-28">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <NavLink to="/" className="flex">
              <img src={Logo} alt='logo' className='h-28 mt-10' />
            </NavLink>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-2 rounded-md ${darkMode ? 'text-white hover:text-orange-400' : 'text-amber-100 hover:text-orange-300'} focus:outline-none`}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:flex-1 md:items-center md:justify-between mt-9">
            <div className="w-4"></div>

            <div className="flex items-center justify-center flex-1 space-x-4">
              <NavLink to="/nosMenu" className={({ isActive }) => `px-3 py-2 text-xl ${isActive ? activeStyle : normalStyle}`}>Menu</NavLink>
              <NavLink to="/livraison" className={({ isActive }) => `px-3 py-2 text-xl ${isActive ? activeStyle : normalStyle}`}>Livraison</NavLink>
              <NavLink to="/developpement-durable" className={({ isActive }) => `px-3 py-2 text-xl ${isActive ? activeStyle : normalStyle}`}>Développement durable</NavLink>
              <NavLink to="/moyen-orient" className={({ isActive }) => `px-3 py-2 text-xl ${isActive ? activeStyle : normalStyle}`}>Moyen-Orient</NavLink>
            </div>

            <div className="flex items-center space-x-4">
              <NavLink to="/nos-salons" className={({ isActive }) => `px-3 py-2 text-xl ${isActive ? activeStyle : normalStyle}`}>
                <MapPin className="inline-block h-4 w-4 mr-1" /> Trouver nos salons
              </NavLink>
              <NavLink to="/langue" className={({ isActive }) => `px-3 py-2 text-xl ${isActive ? activeStyle : normalStyle}`}>
                <Languages className="inline-block h-4 w-4 mr-1" /> Langue
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`md:hidden ${darkMode ? 'bg-gray-800' : 'bg-amber-800'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink to="/nosMenu" className={({ isActive }) => `block px-3 py-2 text-base font-medium ${isActive ? activeStyle : normalStyle}`} onClick={() => setIsMenuOpen(false)}>
              <Coffee className="inline-block h-5 w-5 mr-2" /> Menu
            </NavLink>
            <NavLink to="/livraison" className={({ isActive }) => `block px-3 py-2 text-base font-medium ${isActive ? activeStyle : normalStyle}`} onClick={() => setIsMenuOpen(false)}>
              <Truck className="inline-block h-5 w-5 mr-2" /> Livraison
            </NavLink>
            <NavLink to="/developpement-durable" className={({ isActive }) => `block px-3 py-2 text-base font-medium ${isActive ? activeStyle : normalStyle}`} onClick={() => setIsMenuOpen(false)}>
              <Globe className="inline-block h-5 w-5 mr-2" /> Développement durable
            </NavLink>
            <NavLink to="/moyen-orient" className={({ isActive }) => `block px-3 py-2 text-base font-medium ${isActive ? activeStyle : normalStyle}`} onClick={() => setIsMenuOpen(false)}>
              <MapPin className="inline-block h-5 w-5 mr-2" /> Moyen-Orient
            </NavLink>
            <NavLink to="/nos-salons" className={({ isActive }) => `block px-3 py-2 text-base font-medium ${isActive ? activeStyle : normalStyle}`} onClick={() => setIsMenuOpen(false)}>
              <MapPin className="inline-block h-5 w-5 mr-2" /> Trouver nos salons
            </NavLink>
            <NavLink to="/langue" className={({ isActive }) => `block px-3 py-2 text-base font-medium ${isActive ? activeStyle : normalStyle}`} onClick={() => setIsMenuOpen(false)}>
              <Languages className="inline-block h-5 w-5 mr-2" /> Langue
            </NavLink>
            <NavLink to="/a-propos" className={({ isActive }) => `block px-3 py-2 text-base font-medium ${isActive ? activeStyle : normalStyle}`} onClick={() => setIsMenuOpen(false)}>
              <Home className="inline-block h-5 w-5 mr-2" /> À propos de nous
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `block px-3 py-2 text-base font-medium ${isActive ? activeStyle : normalStyle}`} onClick={() => setIsMenuOpen(false)}>
              <Phone className="inline-block h-5 w-5 mr-2" /> Contactez-nous
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
