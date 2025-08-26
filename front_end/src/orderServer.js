// OrderService.js - Service pour gérer les commandes

class OrderService {
  constructor() {
    this.API_BASE_URL = "http://localhost:8000/api";
  }

  // Récupérer le token d'authentification
  getAuthToken() {
    return localStorage.getItem("token");
  }

  // Headers par défaut pour les requêtes API
  getHeaders() {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.getAuthToken()}`
    };
  }

  /**
   * Créer une nouvelle commande
   * @param {Object} orderData - Données de la commande
   * @param {Array} orderData.produits - Liste des produits [{id, quantite}]
   * @param {string} orderData.adresse_livraison - Adresse de livraison
   * @param {string} orderData.date_livraison - Date de livraison (ISO string)
   */
  async createOrder(orderData) {
    try {
      console.log("Creating order with data:", orderData);

      const response = await fetch(`${this.API_BASE_URL}/commandes`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(orderData)
      });

      console.log("Order response status:", response.status);

      if (response.status === 401) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log("Order created successfully:", result);

      return {
        success: true,
        data: result.data,
        message: result.message || "Commande créée avec succès"
      };

    } catch (error) {
      console.error("Error creating order:", error);
      
      return {
        success: false,
        error: error.message || "Erreur lors de la création de la commande"
      };
    }
  }

  /**
   * Récupérer les commandes du client connecté
   */
  async getClientOrders() {
    try {
      const response = await fetch(`${this.API_BASE_URL}/client/commandes`, {
        method: "GET",
        headers: this.getHeaders()
      });

      if (response.status === 401) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        data: result.commandes || result.data || result,
        message: "Commandes récupérées avec succès"
      };

    } catch (error) {
      console.error("Error fetching orders:", error);
      
      return {
        success: false,
        error: error.message || "Erreur lors de la récupération des commandes"
      };
    }
  }

  /**
   * Récupérer les détails d'une commande spécifique
   * @param {number} orderId - ID de la commande
   */
  async getOrderDetails(orderId) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/commandes/${orderId}`, {
        method: "GET",
        headers: this.getHeaders()
      });

      if (response.status === 401) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        data: result,
        message: "Détails de la commande récupérés avec succès"
      };

    } catch (error) {
      console.error("Error fetching order details:", error);
      
      return {
        success: false,
        error: error.message || "Erreur lors de la récupération des détails"
      };
    }
  }

  /**
   * Annuler une commande
   * @param {number} orderId - ID de la commande à annuler
   */
  async cancelOrder(orderId) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/commandes/${orderId}/cancel`, {
        method: "PUT",
        headers: this.getHeaders()
      });

      if (response.status === 401) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        data: result.commande,
        message: result.message || "Commande annulée avec succès"
      };

    } catch (error) {
      console.error("Error canceling order:", error);
      
      return {
        success: false,
        error: error.message || "Erreur lors de l'annulation de la commande"
      };
    }
  }

  /**
   * Valider les données de commande avant envoi
   * @param {Array} cart - Panier avec les produits
   * @param {string} deliveryAddress - Adresse de livraison
   */
  validateOrderData(cart, deliveryAddress) {
    const errors = [];

    // Vérifier que le panier n'est pas vide
    if (!cart || cart.length === 0) {
      errors.push("Le panier ne peut pas être vide");
    }

    // Vérifier que chaque produit a une quantité valide
    if (cart) {
      cart.forEach((item, index) => {
        if (!item.product || !item.product.id) {
          errors.push(`Produit invalide à la position ${index + 1}`);
        }
        if (!item.quantity || item.quantity < 1) {
          errors.push(`Quantité invalide pour ${item.product?.nom || 'un produit'}`);
        }
      });
    }

    // Vérifier l'adresse de livraison
    if (!deliveryAddress || deliveryAddress.trim().length < 10) {
      errors.push("L'adresse de livraison doit contenir au moins 10 caractères");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Préparer les données de commande au format attendu par l'API
   * @param {Array} cart - Panier avec les produits
   * @param {string} deliveryAddress - Adresse de livraison
   * @param {Date} deliveryDate - Date de livraison (optionnelle)
   */
  prepareOrderData(cart, deliveryAddress, deliveryDate = null) {
    // Date de livraison par défaut : demain
    const defaultDeliveryDate = new Date();
    defaultDeliveryDate.setDate(defaultDeliveryDate.getDate() + 1);

    return {
      produits: cart.map(item => ({
        id: item.product.id,
        quantite: item.quantity
      })),
      adresse_livraison: deliveryAddress.trim(),
      date_livraison: deliveryDate ? deliveryDate.toISOString() : defaultDeliveryDate.toISOString()
    };
  }

  /**
   * Calculer le total d'une commande
   * @param {Array} cart - Panier avec les produits
   */
  calculateTotal(cart) {
    return cart.reduce((total, item) => {
      return total + (item.product.prix * item.quantity);
    }, 0);
  }

  /**
   * Formater les données de commande pour l'affichage
   * @param {Object} order - Données de commande de l'API
   */
  formatOrderForDisplay(order) {
    return {
      id: order.id,
      date: order.created_at || order.date,
      statut: order.statut,
      total: order.total,
      produits: order.produits?.map(product => ({
        nom: product.nom,
        quantite: product.pivot?.quantite || product.quantite,
        prix_unitaire: product.prix || product.pivot?.prix_unitaire,
        sous_total: (product.prix || product.pivot?.prix_unitaire) * (product.pivot?.quantite || product.quantite)
      })) || [],
      adresse_livraison: order.adresse_livraison,
      date_livraison: order.date_livraison
    };
  }
}

// Export pour utilisation dans les composants React
export default OrderService;

// Export de l'instance singleton pour utilisation directe
export const orderService = new OrderService();