// AuthService.js or ApiService.js - Unified API service
import axios from 'axios';

const API_BASE_URL = "http://localhost:8000/api";

class ApiService {
  constructor() {
    this.axios = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      withCredentials: true,
      timeout: 30000, // 30 secondes timeout
    });

    // Add request interceptor for CSRF
    this.axios.interceptors.request.use(
      async (config) => {
        try {
          // Ensure CSRF cookie is set for state-changing requests
          if (['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
            await this.ensureCsrfCookie();
            
            // Get CSRF token from cookie
            const token = this.getCsrfTokenFromCookie();
            if (token) {
              config.headers['X-XSRF-TOKEN'] = token;
            }
          }
          
          console.log(`🔄 ${config.method.toUpperCase()} ${config.url}`, {
            data: config.data,
            headers: config.headers
          });
          
          return config;
        } catch (error) {
          console.error('❌ Erreur dans request interceptor:', error);
          return config;
        }
      },
      (error) => {
        console.error('❌ Erreur request interceptor:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.axios.interceptors.response.use(
      (response) => {
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}:`, response.data);
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        
        console.error(`❌ Erreur ${error.response?.status || 'Network'} pour ${originalRequest?.method} ${originalRequest?.url}:`, error);
        
        if (error.response?.status === 419 && !originalRequest._retry) {
          // CSRF token mismatch - retry once
          originalRequest._retry = true;
          try {
            await this.ensureCsrfCookie();
            return this.axios.request(originalRequest);
          } catch (retryError) {
            console.error('❌ Erreur lors du retry CSRF:', retryError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  async ensureCsrfCookie() {
    try {
      console.log('🔄 Récupération du cookie CSRF...');
      await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        credentials: 'include',
        method: 'GET',
      });
      console.log('✅ Cookie CSRF récupéré');
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du cookie CSRF:', error);
      throw error;
    }
  }

  getCsrfTokenFromCookie() {
    const name = 'XSRF-TOKEN=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

  // Auth methods
  async login(credentials) {
    try {
      const response = await this.axios.post('/login', credentials);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout() {
    try {
      const response = await this.axios.post('/logout');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(userData) {
    try {
      const response = await this.axios.post('/register', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUser() {
    try {
      const response = await this.axios.get('/user');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Cart methods
  async getCart() {
    try {
      console.log('🛒 Récupération du panier...');
      const response = await this.axios.get('/panier');
      console.log('✅ Panier récupéré:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du panier:', error);
      throw this.handleError(error);
    }
  }

async addToCart(produitId, quantite) {
    try {
        // Add validation
        if (!produitId || isNaN(produitId) ){
            throw new Error('Invalid product ID');
        }
        if (!quantite || isNaN(quantite) || quantite < 1) {
            throw new Error('Invalid quantity');
        }

        console.log(`🛒 Ajout au panier - Produit ID: ${produitId}, Quantité: ${quantite}`);
        
        const requestData = {
            produit_id: Number(produitId), // Ensure it's a number
            quantite: Number(quantite)     // Ensure it's a number
        };
        
        console.log('📦 Données envoyées:', requestData);
        
        const response = await this.axios.post('/panier/ajouter', requestData);
        console.log('✅ Produit ajouté au panier:', response.data);
        return response.data;
    } catch (error) {
        console.error(`❌ Erreur lors de l'ajout au panier:`, error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw this.handleError(error);
    }
}

  async updateCartItem(produitId, quantite) {
    try {
      if (!produitId || !quantite || quantite < 1) {
        throw new Error('Données invalides: ID produit et quantité requis');
      }

      console.log(`🛒 Mise à jour panier - Produit ID: ${produitId}, Quantité: ${quantite}`);
      
      const requestData = {
        quantite: parseInt(quantite)
      };
      
      const response = await this.axios.put(`/panier/${produitId}`, requestData);
      console.log('✅ Panier mis à jour:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur lors de la mise à jour du panier:`, error);
      throw this.handleError(error);
    }
  }

  async removeFromCart(produitId) {
    try {
      if (!produitId) {
        throw new Error('ID produit requis');
      }

      console.log(`🛒 Suppression du panier - Produit ID: ${produitId}`);
      const response = await this.axios.delete(`/panier/${produitId}`);
      console.log('✅ Produit supprimé du panier:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur lors de la suppression du panier:`, error);
      throw this.handleError(error);
    }
  }

  async clearCart() {
    try {
      console.log('🛒 Vidage du panier...');
      const response = await this.axios.delete('/panier');
      console.log('✅ Panier vidé:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors du vidage du panier:', error);
      throw this.handleError(error);
    }
  }

  async getCartCount() {
    try {
      const response = await this.axios.get('/panier/count');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du nombre d\'articles:', error);
      throw this.handleError(error);
    }
  }

  // Product methods (if needed)
  async getProducts() {
    try {
      const response = await this.axios.get('/produits');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Enhanced error handling
  handleError(error) {
    console.error('🔍 Analyse de l\'erreur:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          return new Error('Session expirée, veuillez vous reconnecter');
        case 403:
          return new Error('Accès non autorisé');
        case 404:
          return new Error('Ressource non trouvée');
        case 419:
          return new Error('Erreur de sécurité CSRF. Veuillez actualiser la page.');
        case 422:
          // Validation errors
          if (data.errors) {
            const errorMessages = Object.values(data.errors).flat();
            return new Error(errorMessages.join(', '));
          }
          return new Error(data.message || 'Données invalides');
        case 500:
          // Log server errors for debugging
          console.error('🚨 Erreur serveur 500:', data);
          return new Error(data.message || 'Erreur serveur interne. Veuillez réessayer.');
        default:
          return new Error(data.message || `Erreur HTTP: ${status}`);
      }
    } else if (error.request) {
      // Network error
      console.error('🌐 Erreur réseau:', error.request);
      return new Error('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
    } else {
      // Other error
      console.error('❓ Erreur inconnue:', error.message);
      return new Error(error.message || 'Une erreur inattendue s\'est produite');
    }
  }
}

// Create and export a single instance
const apiService = new ApiService();

// Initialize CSRF cookie on app load
apiService.ensureCsrfCookie().catch(console.error);

export default apiService;