// axiosConfig.js - Configuration Axios corrigée
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Configuration de base d'Axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important pour envoyer les cookies CSRF
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Fonction pour récupérer le token CSRF
const getCsrfToken = async () => {
  try {
    console.log('🔄 Récupération du token CSRF...');
    await axiosInstance.get('/sanctum/csrf-cookie');
    // Attendre un court instant pour que le cookie soit défini
    await new Promise(resolve => setTimeout(resolve, 100));
    const token = getTokenFromCookie();
    if (!token) {
      throw new Error('Token CSRF non trouvé dans les cookies');
    }
    console.log('✅ Token CSRF récupéré avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du token CSRF:', error);
    return false;
  }
};

// Fonction pour obtenir le token CSRF depuis les cookies
const getTokenFromCookie = () => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'XSRF-TOKEN') {
      return decodeURIComponent(value);
    }
  }
  return null;
};

// Intercepteur de requête pour ajouter le token CSRF automatiquement
axiosInstance.interceptors.request.use(
  async (config) => {
    // Vérifier si un token CSRF est nécessaire
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
      let csrfToken = getTokenFromCookie();
      
      // Si pas de token CSRF, en demander un nouveau
      if (!csrfToken) {
        await getCsrfToken();
        csrfToken = getTokenFromCookie();
      }
      
      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
      }
    }

    // Ajouter le token Bearer si disponible (CORRECTION: utiliser sessionStorage au lieu de localStorage)
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs CSRF
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si erreur 419 (CSRF token mismatch) et pas déjà tenté de récupérer un nouveau token
    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.log('🔄 Erreur CSRF 419 détectée, récupération d\'un nouveau token...');
      
      // Récupérer un nouveau token CSRF
      const success = await getCsrfToken();
      
      if (success) {
        // Réessayer la requête originale
        const newCsrfToken = getTokenFromCookie();
        if (newCsrfToken) {
          originalRequest.headers['X-XSRF-TOKEN'] = newCsrfToken;
        }
        return axiosInstance(originalRequest);
      }
    }

    // Si erreur 401 (non autorisé), rediriger vers la connexion
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    console.error(`❌ Erreur ${error.response?.status} pour ${error.config?.method} ${error.config?.url}:`, error);
    return Promise.reject(error);
  }
);

// Initialiser le token CSRF au démarrage
export const initializeCsrf = async () => {
  return await getCsrfToken();
};

export default axiosInstance;

// Service API pour les commandes
export const orderService = {
  // Créer une nouvelle commande
  async createOrder(orderData) {
    try {
      const response = await axiosInstance.post('/api/commandes', orderData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      
      let errorMessage = 'Erreur lors de la création de la commande';
      
      if (error.response?.status === 422) {
        // Erreur de validation
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          errorMessage = Object.values(validationErrors).flat().join(', ');
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error.response?.status === 500) {
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return { success: false, error: errorMessage };
    }
  },

  // Récupérer les commandes de l'utilisateur
  async getUserOrders() {
    try {
      const response = await axiosInstance.get('/api/mes-commandes');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      return { success: false, error: 'Impossible de récupérer vos commandes' };
    }
  }
};

// Service pour le panier - VERSION CORRIGÉE
export const cartService = {
  // CORRECTION: Méthode pour initialiser/récupérer le panier
  async initializeCart() {
    try {
      console.log('🔄 Initialisation du panier...');
      const response = await axiosInstance.get('/api/panier');
      console.log('✅ Panier initialisé:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation du panier:', error);
      return { success: false, error: 'Erreur d\'initialisation du panier' };
    }
  },
  
  // Ajouter un produit au panier
  async addToCart(productId, quantity = 1) {
    try {
      console.log(`🛒 Ajout au panier - Produit ID: ${productId}, Quantité: ${quantity}`);
      
      const response = await axiosInstance.post('/api/panier/ajouter', {
        produit_id: productId,
        quantite: quantity
      });
      
      console.log('✅ Produit ajouté au panier:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout au panier:', error);
      
      let errorMessage = 'Impossible d\'ajouter le produit au panier';
      
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          errorMessage = Object.values(validationErrors).flat().join(', ');
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'Vous devez être connecté pour ajouter des produits au panier';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return { success: false, error: errorMessage };
    }
  },

  // Récupérer le contenu du panier
  async getCart() {
    try {
      const response = await axiosInstance.get('/api/panier');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error);
      return { success: false, error: 'Impossible de récupérer le panier' };
    }
  },

  // Mettre à jour la quantité d'un produit dans le panier
  async updateCartItem(productId, quantity) {
    try {
      const response = await axiosInstance.put(`/api/panier/modifier`, {
        produit_id: productId,
        quantite: quantity
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du panier:', error);
      
      let errorMessage = 'Impossible de mettre à jour le panier';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return { success: false, error: errorMessage };
    }
  },

  // Supprimer un produit du panier
  async removeFromCart(productId) {
    try {
      const response = await axiosInstance.delete(`/api/panier/retirer`, {
        data: { produit_id: productId }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
      
      let errorMessage = 'Impossible de supprimer le produit du panier';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return { success: false, error: errorMessage };
    }
  },

  // Vider le panier
  async clearCart() {
    try {
      const response = await axiosInstance.delete('/api/panier/vider');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erreur lors du vidage du panier:', error);
      
      let errorMessage = 'Impossible de vider le panier';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return { success: false, error: errorMessage };
    }
  }
};