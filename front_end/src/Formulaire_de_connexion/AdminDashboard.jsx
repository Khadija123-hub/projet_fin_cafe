import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axiosInstance from './AuthService';

// Supposons que ces composants existent ou seront créés ultérieurement
const AdminProduits = () => <div>Gestion des produits</div>;
const AdminClients = () => <div>Gestion des clients</div>;
const AdminCommandes = () => <div>Gestion des commandes</div>;

const AdminDashboard = ({ darkMode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/api/user');
        setUser(response.data);
        
        // Vérifier si l'utilisateur est un administrateur
        if (response.data.role !== 'admin') {
          navigate('/login');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`p-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <h1 className="text-2xl font-bold mb-6">Tableau de bord administrateur</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Barre latérale de navigation */}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/admin" 
                  className={`block p-2 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/produits" 
                  className={`block p-2 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                >
                  Produits
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/clients" 
                  className={`block p-2 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                >
                  Clients
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/commandes" 
                  className={`block p-2 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                >
                  Commandes
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                  }}
                  className={`block w-full text-left p-2 rounded ${
                    darkMode ? 'hover:bg-red-800 bg-red-900' : 'hover:bg-red-200 bg-red-100'
                  }`}
                >
                  Se déconnecter
                </button>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Contenu principal */}
        <div className={`p-4 rounded-lg col-span-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <Routes>
            <Route path="/" element={
              <div>
                <h2 className="text-xl font-semibold mb-4">Bienvenue, {user?.name}!</h2>
                <p className="mb-4">Voici un aperçu de votre boutique</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                    <h3 className="font-bold">Commandes</h3>
                    <p className="text-2xl">0</p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                    <h3 className="font-bold">Clients</h3>
                    <p className="text-2xl">0</p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                    <h3 className="font-bold">Produits</h3>
                    <p className="text-2xl">0</p>
                  </div>
                </div>
              </div>
            } />
            <Route path="/produits" element={<AdminProduits />} />
            <Route path="/clients" element={<AdminClients />} />
            <Route path="/commandes" element={<AdminCommandes />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;