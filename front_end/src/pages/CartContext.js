import axiosInstance from '../Formulaire_de_connexion/AuthService';

export const cartService = {
  async initializeCart() {
    try {
      // Changement de POST à GET pour l'initialisation
      const response = await axiosInstance.get('/api/panier');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du panier:', error);
      return {
        success: false,
        error: 'Impossible d\'initialiser le panier'
      };
    }
  },

  async addToCart(productId, quantity = 1) {
    try {
      const response = await axiosInstance.post('/api/panier/ajouter', {
        produit_id: productId,
        quantite: quantity
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return this.handleError(error, 'Impossible d\'ajouter au panier');
    }
  },

  async updateCartItem(productId, quantity) {
    try {
      const response = await axiosInstance.patch(`/api/panier/${productId}`, {
        quantite: quantity
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return this.handleError(error, 'Impossible de mettre à jour le panier');
    }
  },

  async removeFromCart(productId) {
    try {
      const response = await axiosInstance.delete(`/api/panier/${productId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return this.handleError(error, 'Impossible de supprimer du panier');
    }
  },

  async clearCart() {
    try {
      const response = await axiosInstance.delete('/api/panier/vider');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return this.handleError(error, 'Impossible de vider le panier');
    }
  },

  handleError(error, defaultMessage) {
    console.error(`${defaultMessage}:`, error);
    const errorMessage = error.response?.data?.message || defaultMessage;
    return {
      success: false,
      error: errorMessage
    };
  }
};