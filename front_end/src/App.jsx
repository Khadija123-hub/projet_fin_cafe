import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import Navbar from './components/navbar.jsx';
import Home from './pages/home.jsx';
import NosMenu from './pages/nosMenu.jsx';
import Livraison from './pages/Livraison.jsx';
import DeveloppementDurable from './pages/DeveloppementDurable.jsx';
import CaféSanté from './pages/CaféSanté.jsx';
import NosSalons from './pages/NosSalons.jsx';
import Langue from './pages/Langue.jsx';
import APropose from './pages/APropose.jsx';
import Contact from './pages/Contact.jsx';
import Footer from './components/footer.jsx';

import Commander from './pages/commander.jsx';

import Produits from './categories/produits.jsx';
import Boisson from './categories/boisson.jsx';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-orange-100 text-gray-900'}`}>
      <BrowserRouter>
        <Navbar darkMode={darkMode} />
        <div>
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} />} />
            <Route path="/livraison" element={<Livraison />} />
            <Route path="/developpement-durable" element={<DeveloppementDurable />} />
            <Route path="/nosMenu" element={<NosMenu darkMode={ darkMode }/>} />
            <Route path="/CaféSanté" element={<CaféSanté darkMode={darkMode} />} />
            <Route path="/nos-salons" element={<NosSalons />} />
            <Route path="/langue" element={<Langue />} />
            <Route path="/a-propos" element={<APropose />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/categories/1" element={<Boisson darkMode={darkMode}/>} />
            <Route path="/categories/2" element={<Produits darkMode={darkMode}/>} />

            <Route path="/commender" element={<Commander darkMode={darkMode} />} />

            
          
          </Routes>
        </div>
        <Footer darkMode={darkMode} />
        <button
          onClick={toggleDarkMode}
          className={`fixed right-6 bottom-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
            darkMode
              ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
          aria-label={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
          title={darkMode ? 'Mode clair' : 'Mode sombre'}
        >
          {darkMode ? (
            <Sun className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Moon className="h-6 w-6" strokeWidth={2} />
          )}
        </button>
      </BrowserRouter>
    </div>
  );
}

export default App;