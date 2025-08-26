// AuthContext.js
// Contexte d'authentification pour gérer l'état de connexion globalement

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Création du contexte
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier si l'utilisateur est déjà connecté (au chargement de l'application)
  useEffect(() => {
    const checkUserAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Configurer axios pour utiliser le token dans les headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Récupérer les informations de l'utilisateur
          const response = await axios.get('http://localhost:8000/api/user');
          setUser(response.data);
        } catch (err) {
          console.error('Erreur d\'authentification:', err);
          // Si le token est invalide ou expiré, on le supprime
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          axios.defaults.headers.common['Authorization'] = '';
        }
      }
      setLoading(false);
    };
    
    checkUserAuth();
  }, []);

  // Fonction de connexion
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setUser(response.data.user);
        return { success: true };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
      return { success: false, error: err.response?.data?.message || 'Erreur de connexion' };
    }
  };

  // Fonction d'inscription
  const register = async (userData) => {
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/api/register', userData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setUser(response.data.user);
        return { success: true };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.errors 
        ? Object.values(err.response.data.errors).flat().join(', ')
        : err.response?.data?.message || 'Erreur lors de l\'inscription';
      
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      // Appel API pour déconnecter côté serveur
      if (localStorage.getItem('token')) {
        await axios.post('http://localhost:8000/api/logout');
      }
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      // Nettoyage local quoi qu'il arrive
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      axios.defaults.headers.common['Authorization'] = '';
      setUser(null);
    }
  };

  // Valeurs exposées par le contexte
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;