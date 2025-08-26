import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import Navbar from './components/navbar.jsx';
import Home from './pages/home.jsx';
import NosMenu from './pages/nosMenu.jsx';
import Livraison from './pages/Livraison.jsx';
import DeveloppementDurable from './pages/DeveloppementDurable.jsx';
import CaféSanté from './pages/CaféSanté.jsx';
import Nosalon from './pages/NosSalons.jsx';


import ClientCommande from './pages/ClientCommande.jsx';
import Contact from './pages/Contact.jsx';
import Footer from './components/footer.jsx';
import Register from './Formulaire_de_connexion/Regitrer.jsx';
import Commande from './pages/commander.jsx';
import Login from './Formulaire_de_connexion/Login.jsx';
import Produits from './categories/produits.jsx';
import Boisson from './categories/boisson.jsx';

import  CheckoutPage from './Formulaire_de_connexion/checkout-page.jsx'

import PasserCommande from './Formulaire_de_connexion/passerCommande.jsx';

import { AuthProvider } from './Formulaire_de_connexion/AuthContext.jsx';

import AdminDashboard from './Formulaire_de_connexion/AdminDashboard.jsx';
import ClientDashboard from './Formulaire_de_connexion/ClientDashboard.jsx';

import axiosInstance from './Formulaire_de_connexion/AuthService.js';

import { CartProvider } from './contexts/CartContext.jsx';



import Panier from './Formulaire_de_connexion/panier.jsx';




import ProtectedRouteConnect from './Formulaire_de_connexion/ProtectedRoute.jsx'; 

// Composant de route protégée
const ProtectedRoute = ({ element, role }) => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }
  
  return element;
};





function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    const initializeCsrf = async () => {
      try {
        await axiosInstance.get('/sanctum/csrf-cookie');
      } catch (error) {
        console.error('Failed to initialize CSRF protection:', error);
      }
    };
    
    initializeCsrf();
  }, []);

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
     <AuthProvider>
      <CartProvider>
      <BrowserRouter>
        <Navbar darkMode={darkMode} />
        <div>
           <AuthProvider>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home darkMode={darkMode} />} />
            <Route path="/livraison" element={<Livraison />} />
            <Route path="/developpement-durable" element={<DeveloppementDurable />} />
            <Route path="/nosMenu" element={<NosMenu darkMode={darkMode} />} />
            <Route path="/CaféSanté" element={<CaféSanté darkMode={darkMode} />} />
            <Route path="/nos-salons" element={<Nosalon/>} />
           
           
            <Route path="/contact" element={<Contact />} />
            <Route path="/categories/1" element={<Boisson darkMode={darkMode} />} />
            <Route path="/categories/2" element={<Produits darkMode={darkMode} />} />



            <Route path="/login" element={
              <ProtectedRouteConnect requireAuth={false}>
              <Login darkMode={darkMode} />
              </ProtectedRouteConnect>
             } />



            <Route path="/register" element={<Register />} />
            <Route path="/commande" element={<Commande darkMode={darkMode} />} />
            <Route path="/checkout" element={<CheckoutPage darkMode={darkMode} />} />
             <Route path="/panier" element={<Panier />} />
            <Route path="/passerCommande" element={<PasserCommande darkMode={darkMode} />} />
            <Route path='/commande' element={<DeveloppementDurable darkMode={darkMode}/>} />
            
            
            {/* Routes protégées */}
           <Route path="/client-dashboard" element={
            <ProtectedRouteConnect requireAuth={true}>
            <ClientDashboard darkMode={darkMode} />
           </ProtectedRouteConnect>

           
           } />




            <Route 
              path="/admin/*" 
              element={<ProtectedRoute element={<AdminDashboard darkMode={darkMode} />} role="admin" />}  />
              
          </Routes>
          </AuthProvider>
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
      </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;