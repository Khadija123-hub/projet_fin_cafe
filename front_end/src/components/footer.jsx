import React from 'react';
import { NavLink } from 'react-router-dom';
import { Coffee, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';


const Footer = ({ darkMode }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`pt-10 pb-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-amber-900 text-amber-100'}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="flex flex-col">
         
            <p className="mt-2 text-sm">
              Notre café vous offre une expérience authentique avec des grains soigneusement sélectionnés 
              et torréfiés pour révéler des saveurs uniques du Moyen-Orient.
            </p>
            <div className="flex mt-4 space-x-4">
              <a href="https://instagram.com" className={`${darkMode ? 'text-gray-300 hover:text-orange-400' : 'text-amber-100 hover:text-orange-300'}`}>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" className={`${darkMode ? 'text-gray-300 hover:text-orange-400' : 'text-amber-100 hover:text-orange-300'}`}>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className={`${darkMode ? 'text-gray-300 hover:text-orange-400' : 'text-amber-100 hover:text-orange-300'}`}>
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-orange-400' : 'text-orange-300'}`}>Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/nosMenu" className={`text-sm ${darkMode ? 'hover:text-orange-400' : 'hover:text-orange-300'}`}>
                  Notre menu
                </NavLink>
              </li>
              <li>
                <NavLink to="/livraison" className={`text-sm ${darkMode ? 'hover:text-orange-400' : 'hover:text-orange-300'}`}>
                  Livraison
                </NavLink>
              </li>
              <li>
                <NavLink to="/developpement-durable" className={`text-sm ${darkMode ? 'hover:text-orange-400' : 'hover:text-orange-300'}`}>
                  Développement durable
                </NavLink>
              </li>
              <li>
                <NavLink to="/moyen-orient" className={`text-sm ${darkMode ? 'hover:text-orange-400' : 'hover:text-orange-300'}`}>
                  Moyen-Orient
                </NavLink>
              </li>
              <li>
                <NavLink to="/a-propos" className={`text-sm ${darkMode ? 'hover:text-orange-400' : 'hover:text-orange-300'}`}>
                  À propos de nous
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Nos salons */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-orange-400' : 'text-orange-300'}`}>Nos salons</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Paris - 25 rue de la Paix</span>
              </li>
              <li className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Lyon - 12 place Bellecour</span>
              </li>
              <li className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Marseille - 45 rue Paradis</span>
              </li>
              <li className="flex items-center text-sm">
                <NavLink to="/nos-salons" className={`mt-2 inline-flex items-center ${darkMode ? 'text-orange-400' : 'text-orange-300'}`}>
                  Voir tous nos salons
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-orange-400' : 'text-orange-300'}`}>Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2" />
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2" />
                <span>contact@cafemoyenorient.com</span>
              </li>
              <li className="mt-4">
                <NavLink to="/contact" className={`text-sm py-2 px-4 rounded ${darkMode ? 'bg-orange-700 hover:bg-orange-800 text-white' : 'bg-amber-800 hover:bg-amber-950 text-amber-100'}`}>
                  Nous contacter
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className={`mt-10 py-6 border-t ${darkMode ? 'border-gray-700' : 'border-amber-800'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className={`text-lg font-medium ${darkMode ? 'text-orange-400' : 'text-orange-300'}`}>Inscrivez-vous à notre newsletter</h4>
              <p className="text-sm mt-1">Recevez nos offres spéciales et découvrez nos nouveautés</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Votre email" 
                className={`px-4 py-2 w-full md:w-64 rounded-l focus:outline-none ${darkMode ? 'bg-gray-800 text-white' : 'bg-amber-800 text-white'}`} 
              />
              <button 
                type="submit" 
                className={`px-4 py-2 rounded-r ${darkMode ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-orange-700 hover:bg-orange-800 text-white'}`}
              >
                S'inscrire
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm">
          <p>© {currentYear} Café Moyen-Orient. Tous droits réservés.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <NavLink to="/mentions-legales" className={`text-xs ${darkMode ? 'hover:text-orange-400' : 'hover:text-orange-300'}`}>
              Mentions légales
            </NavLink>
            <NavLink to="/politique-confidentialite" className={`text-xs ${darkMode ? 'hover:text-orange-400' : 'hover:text-orange-300'}`}>
              Politique de confidentialité
            </NavLink>
            <NavLink to="/cgv" className={`text-xs ${darkMode ? 'hover:text-orange-400' : 'hover:text-orange-300'}`}>
              CGV
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;