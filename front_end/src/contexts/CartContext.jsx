"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axiosInstance from "../utils/axiosConfig"

// Création du contexte
const CartContext = createContext()

// Hook personnalisé pour utiliser le contexte du panier
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart doit être utilisé à l'intérieur d'un CartProvider")
  }
  return context
}

// Provider du contexte
export const CartProvider = ({ children }) => {
  // État local pour stocker les articles du panier
  const [cart, setCart] = useState([])
  const [panier, setPanier] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Charger le panier depuis le localStorage au chargement
  useEffect(() => {
    loadCartFromStorage()
  }, [])

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    saveCartToStorage()
  }, [cart])


  

  // Charger le panier depuis le localStorage
  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Erreur lors du chargement du panier:", error)
      localStorage.removeItem("cart")
    }
  }

  // Sauvegarder le panier dans localStorage
  const saveCartToStorage = () => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart))
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du panier:", error)
    }
  }

  // Synchroniser avec la base de données
  const syncWithDatabase = async () => {
    if (!panier?.id) return

    try {
      setLoading(true)

      // Récupérer les items du panier depuis la base
      const response = await axiosInstance.get("/api/panier")

      if (response.data?.items) {
        // Convertir les items de la base vers le format du contexte
        const dbItems = response.data.items.map((item) => ({
          id: item.produit.id,
          nom: item.produit.nom,
          prix: item.prix_unitaire,
          quantity: item.quantite,
          description: item.produit.description,
          stock: item.produit.stock,
        }))

        setCart(dbItems)
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation:", error)
      setError("Erreur de synchronisation avec le serveur")
    } finally {
      setLoading(false)
    }
  }

  // Créer ou récupérer le panier en base
  const initializePanier = async (userId) => {
    if (!userId) return

    try {
      setLoading(true)
      const response = await axiosInstance.post("/api/panier", {
        client_id: userId,
      })

      setPanier(response.data)
      await syncWithDatabase()
    } catch (error) {
      console.error("Erreur lors de l'initialisation du panier:", error)
      setError("Impossible d'initialiser le panier")
    } finally {
      setLoading(false)
    }
  }

  // Ajouter un produit au panier (local + base)
  const addToCart = async (product) => {
    try {
      // Ajouter localement d'abord pour une meilleure UX
      setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex((item) => item.id === product.id)

        if (existingItemIndex !== -1) {
          const updatedCart = [...prevCart]
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: updatedCart[existingItemIndex].quantity + (product.quantity || 1),
          }
          return updatedCart
        } else {
          return [...prevCart, { ...product, quantity: product.quantity || 1 }]
        }
      })

      // Synchroniser avec la base si le panier existe
      if (panier?.id) {
        await axiosInstance.post("/api/panier/items", {
          panier_id: panier.id,
          produit_id: product.id,
          quantite: product.quantity || 1,
          prix_unitaire: product.prix,
        })
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error)
      // En cas d'erreur, recharger depuis le localStorage
      loadCartFromStorage()
      throw error
    }
  }

  // Mettre à jour la quantité d'un produit
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId)
      return
    }

    try {
      // Mettre à jour localement
      setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))

      // Synchroniser avec la base si le panier existe
      if (panier?.id) {
        await axiosInstance.put(
          `/api/panier/items/${productId}`,
          {
            quantite: newQuantity,
          },
          {
            params: { panier_id: panier.id },
          },
        )
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
      loadCartFromStorage()
      throw error
    }
  }

  // Supprimer un produit du panier
  const removeFromCart = async (productId) => {
    try {
      // Supprimer localement
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId))

      // Synchroniser avec la base si le panier existe
      if (panier?.id) {
        await axiosInstance.delete(`/api/panier/items/${productId}`, {
          params: { panier_id: panier.id },
        })
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      loadCartFromStorage()
      throw error
    }
  }

  // Vider le panier
  const clearCart = async () => {
    try {
      setCart([])

      // Vider en base si le panier existe
      if (panier?.id) {
        await axiosInstance.delete("/api/panier/clear")
      }
    } catch (error) {
      console.error("Erreur lors du vidage:", error)
      throw error
    }
  }

  // Calculer le total du panier
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.prix * item.quantity, 0)
  }

  // Obtenir le nombre total d'articles
  


  const getCartCount = () => {
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  };


  


  // Valeurs exposées par le contexte
  const value = {
    cart,
    panier,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    
    initializePanier,
    syncWithDatabase,
    setError,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
