"use client"

import { useEffect, useState } from "react"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../Formulaire_de_connexion/AuthContext"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../Formulaire_de_connexion/AuthService";
import { cartService } from "../Formulaire_de_connexion/AuthService"
import axios from "axios"
import cafeCategory from '../../images/cafeICategory.png';

// Configuration pour gérer les erreurs
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  },
)

function Commande() {
  const { cart, getCartTotal, getCartCount } = useCart()
  const { isAuthenticated, isClient, user } = useAuth()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [produitsParCategorie, setProduitsParCategorie] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState("")
  const [imgError, setImgError] = useState({})
  const [imageLoading, setImageLoading] = useState({})
  
  // États pour le modal d'image amélioré
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showProductModal, setShowProductModal] = useState(false)
  const [modalImageLoading, setModalImageLoading] = useState(false)
  const [modalImageError, setModalImageError] = useState(false)
  const [quantity, setQuantity] = useState(1)
  
  // États pour la recherche
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProduitsParCategorie, setFilteredProduitsParCategorie] = useState({})

  // Fonction pour filtrer les produits par nom
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProduitsParCategorie(produitsParCategorie)
    } else {
      const filtered = {}
      Object.keys(produitsParCategorie).forEach(categorieId => {
        const produits = produitsParCategorie[categorieId]
        if (produits && produits.length > 0) {
          const filteredProduits = produits.filter(produit => 
            produit.nom.toLowerCase().includes(searchTerm.toLowerCase())
          )
          if (filteredProduits.length > 0) {
            filtered[categorieId] = filteredProduits
          }
        }
      })
      setFilteredProduitsParCategorie(filtered)
    }
  }, [searchTerm, produitsParCategorie])

  // Fonction pour construire l'URL des images avec fallbacks multiples
  const getImageUrl = (imageName) => {
    if (!imageName) return null;
    try {
      const cleanName = imageName.trim();
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      // Essayer plusieurs formats d'URL
      const possibleUrls = [
        `${baseUrl}/storage/produits/${encodeURIComponent(cleanName)}`,
        `${baseUrl}/storage/produits/${cleanName}`,
        `${baseUrl}/images/produits/${encodeURIComponent(cleanName)}`,
        `${baseUrl}/images/produits/${cleanName}`,
        `${baseUrl}/uploads/produits/${encodeURIComponent(cleanName)}`,
        `${baseUrl}/uploads/produits/${cleanName}`
      ];
      
      console.log('URLs d\'images à essayer:', possibleUrls);
      return possibleUrls[0]; // Retourner la première URL, on testera les autres en cas d'erreur
    } catch (error) {
      console.error('Erreur lors de la construction de l\'URL de l\'image:', error);
      return null;
    }
  };

  // Fonction pour tester et récupérer une URL d'image valide
  const getValidImageUrl = async (imageName) => {
    if (!imageName) return null;
    
    const cleanName = imageName.trim();
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    
    const possibleUrls = [
      `${baseUrl}/storage/produits/${encodeURIComponent(cleanName)}`,
      `${baseUrl}/storage/produits/${cleanName}`,
      `${baseUrl}/images/produits/${encodeURIComponent(cleanName)}`,
      `${baseUrl}/images/produits/${cleanName}`,
      `${baseUrl}/uploads/produits/${encodeURIComponent(cleanName)}`,
      `${baseUrl}/uploads/produits/${cleanName}`,
      // Formats d'images alternatives
      `${baseUrl}/storage/produits/${cleanName.replace(/\.[^/.]+$/, '')}.jpg`,
      `${baseUrl}/storage/produits/${cleanName.replace(/\.[^/.]+$/, '')}.jpeg`,
      `${baseUrl}/storage/produits/${cleanName.replace(/\.[^/.]+$/, '')}.png`,
      `${baseUrl}/storage/produits/${cleanName.replace(/\.[^/.]+$/, '')}.webp`
    ];

    for (const url of possibleUrls) {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
          console.log('URL d\'image valide trouvée:', url);
          return url;
        }
      } catch (error) {
        console.log('URL échouée:', url);
        continue;
      }
    }
    
    console.error('Aucune URL d\'image valide trouvée pour:', imageName);
    return null;
  };

  // Gestion des erreurs d'images pour les cartes
  const handleImageError = (produitId, imageName) => {
    console.log(`Erreur de chargement pour l'image: ${imageName} (ID: ${produitId})`);
    setImgError(prev => ({
      ...prev,
      [produitId]: true
    }));
    setImageLoading(prev => ({
      ...prev,
      [produitId]: false
    }));
  };

  const handleImageLoad = (produitId) => {
    setImageLoading(prev => ({
      ...prev,
      [produitId]: false
    }));
  };

  const handleImageStart = (produitId) => {
    setImageLoading(prev => ({
      ...prev,
      [produitId]: true
    }));
  };

  // Fonction pour ouvrir le modal de produit amélioré
  const handleProductClick = (produit) => {
    setSelectedProduct(produit);
    setQuantity(1);
    setModalImageLoading(true);
    setModalImageError(false);
    setShowProductModal(true);
    // Bloquer le scroll du body
    document.body.style.overflow = 'hidden';
  };

  // Fonction pour fermer le modal
  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
    setQuantity(1);
    setModalImageLoading(false);
    setModalImageError(false);
    // Restaurer le scroll du body
    document.body.style.overflow = 'unset';
  };

  // Gestion des erreurs d'images pour le modal avec retry automatique
  const handleModalImageError = async () => {
    console.log('Erreur image modal, tentative URL alternative...');
    
    if (selectedProduct?.image) {
      const validUrl = await getValidImageUrl(selectedProduct.image);
      if (validUrl && validUrl !== selectedProduct.validImageUrl) {
        setSelectedProduct(prev => ({
          ...prev,
          validImageUrl: validUrl
        }));
        setModalImageLoading(true); // Relancer le chargement
        return;
      }
    }
    
    setModalImageError(true);
    setModalImageLoading(false);
  };

  const handleModalImageLoad = () => {
    setModalImageLoading(false);
    setModalImageError(false);
  };

  // Initialiser le panier si l'utilisateur est connecté
  useEffect(() => {
    const initCart = async () => {
      if (isAuthenticated && user?.id) {
        try {
          const result = await cartService.initializeCart(user.id)
          if (!result.success) {
            setError(result.error)
          }
        } catch (error) {
          setError("Erreur d'initialisation du panier")
          console.error(error)
        }
      }
    }
    initCart()
  }, [isAuthenticated, user])

  // Chargement des produits par catégorie
  const fetchProduitsParCategorie = async (categories) => {
    try {
      setLoading(true);
      const produitsGroupes = {};
      
      for (const categorie of categories) {
        try {
          console.log(`Chargement des produits pour la catégorie ${categorie.id}...`);
          const response = await axiosInstance.get(`/api/categories/${categorie.id}/produits`);
          console.log('Produits reçus:', response.data);
          produitsGroupes[categorie.id] = response.data;
        } catch (error) {
          console.error(`Erreur pour la catégorie ${categorie.id}:`, error);
          produitsGroupes[categorie.id] = [];
        }
      }
      
      console.log('Tous les produits chargés:', produitsGroupes);
      setProduitsParCategorie(produitsGroupes);
      setFilteredProduitsParCategorie(produitsGroupes);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      setError("Impossible de charger les produits.");
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial des données
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('Chargement des catégories...');
        const categoriesResponse = await axiosInstance.get("/api/categories");
        console.log('Catégories reçues:', categoriesResponse.data);
        
        if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data);
          await fetchProduitsParCategorie(categoriesResponse.data);
        } else {
          throw new Error('Format de données invalide pour les catégories');
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setError("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Fermer le modal avec échap
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showProductModal) {
        closeProductModal();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showProductModal]);

  // Ajouter un produit au panier avec notification et gestion de quantité
  const handleAddToCart = async (produit, quantiteToAdd = 1) => {
    try {
      const result = await cartService.addToCart(produit.id, quantiteToAdd)
      if (result.success) {
        setNotification(`${quantiteToAdd} ${produit.nom} ajouté(s) au panier`)
        // Fermer le modal après ajout réussi
        if (showProductModal) {
          setTimeout(() => {
            closeProductModal();
          }, 1000);
        }
      } else {
        setNotification(result.error)
      }
      setTimeout(() => setNotification(""), 3000)
    } catch (error) {
      setNotification("Erreur lors de l'ajout au panier")
      setTimeout(() => setNotification(""), 3000)
    }
  }

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return
    
    try {
      const result = await cartService.updateCartItem(productId, newQuantity)
      if (result.success) {
        setNotification("Quantité mise à jour")
      } else {
        setNotification(result.error || "Erreur de mise à jour")
      }
      setTimeout(() => setNotification(""), 3000)
    } catch (error) {
      setNotification("Erreur lors de la mise à jour de la quantité")
      setTimeout(() => setNotification(""), 3000)
    }
  }

  const handleRemoveFromCart = async (productId) => {
    try {
      const result = await cartService.removeFromCart(productId)
      if (result.success) {
        setNotification("Produit retiré du panier")
      } else {
        setNotification(result.error || "Erreur de suppression")
      }
      setTimeout(() => setNotification(""), 3000)
    } catch (error) {
      setNotification("Erreur lors de la suppression")
      setTimeout(() => setNotification(""), 3000)
    }
  }

  const handleClearCart = async () => {
    try {
      const result = await cartService.clearCart()
      if (result.success) {
        setNotification("Panier vidé")
      } else {
        setNotification(result.error || "Erreur lors du vidage du panier")
      }
      setTimeout(() => setNotification(""), 3000)
    } catch (error) {
      setNotification("Erreur lors du vidage du panier")
      setTimeout(() => setNotification(""), 3000)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amber-600"></div>
        <p className="ml-4 text-lg font-serif italic text-amber-800">Préparation de nos produits...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 mt-20">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg">
          <p className="text-red-700 font-medium font-serif">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-100px)] bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Image de gauche */}
      <div className="md:w-1/3 relative">
        <div className="hidden md:block sticky top-[80px] self-start h-[calc(100vh-100px)] relative">
          <img
            src={cafeCategory}
            alt="Nos délicieuses créations"
            className="w-full h-full object-cover shadow-xl"
            loading="lazy"
          />
        </div>
      </div>

      {/* Section principale des produits */}
      <div className="md:w-2/3">
        <div className="mx-auto p-4 bg-transparent">
          {/* En-tête */}
          <div className="text-center mt-16 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-amber-900 relative inline-block font-serif">
              Nos Produits
              <span className="block h-1 w-16 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mt-2 rounded-full"></span>
            </h2>
            <p className="text-amber-800 mt-4 max-w-2xl mx-auto font-serif text-base italic">
              Découvrez toute notre gamme de produits artisanaux et ajoutez vos favoris au panier.
            </p>
          </div>

          {/* Barre de recherche */}
          <div className="mb-8 px-4 md:px-8">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg 
                  className="w-5 h-5 text-amber-900" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Rechercher un produit par nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-amber-900 rounded-xl bg-white/80 backdrop-blur-sm 
                  focus:ring-2 focus:ring-amber-700 focus:border-amber-700 focus:outline-none 
                  transition-all duration-300 shadow-md font-serif text-amber-900 placeholder-amber-900"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg 
                    className="w-5 h-5 text-amber-900 hover:text-amber-800" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Bouton panier flottant */}
          <button
            onClick={() => navigate('/panier')}
            className="fixed top-20 right-4 z-40 bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full shadow-lg flex items-center transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {getCartCount() > 0 && (
              <span className="ml-2 bg-white text-amber-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {getCartCount()}
              </span>
            )}
          </button>

          {/* Liste des produits par catégorie */}
          <div className="px-2 md:px-6">
            {categories.map((categorie) => (
              filteredProduitsParCategorie[categorie.id] && filteredProduitsParCategorie[categorie.id].length > 0 && (
                <section key={categorie.id} className="mb-12">
                  <h3 className="text-xl font-bold text-amber-900 mb-6 text-center font-serif border-b border-amber-200 pb-2">
                    {categorie.nom}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProduitsParCategorie[categorie.id].map((produit) => (
                      <div
                        key={produit.id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                        onClick={() => handleProductClick(produit)}
                      >
                        {/* Container d'image avec dimensions fixes */}
                        <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100">
                          {produit.image && !imgError[produit.id] ? (
                            <>
                              {/* Indicateur de chargement */}
                              {imageLoading[produit.id] && (
                                <div className="absolute inset-0 flex items-center justify-center bg-amber-50">
                                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600"></div>
                                </div>
                              )}
                              
                              <img
                                src={getImageUrl(produit.image)}
                                alt={produit.nom}
                                data-product-id={produit.id}
                                className={`w-full h-full object-cover transition-all duration-500 ${
                                  imageLoading[produit.id] ? 'opacity-0' : 'opacity-100'
                                }`}
                                loading="lazy"
                                onLoadStart={() => handleImageStart(produit.id)}
                                onLoad={() => handleImageLoad(produit.id)}
                                onError={() => handleImageError(produit.id, produit.image)}
                                style={{
                                  imageRendering: 'auto',
                                  WebkitImageRendering: 'auto'
                                }}
                              />
                              
                              {/* Overlay au survol */}
                              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="text-white text-center">
                                  <svg
                                    className="w-10 h-10 mx-auto mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                  <span className="text-sm font-serif px-4 py-2 bg-black/40 rounded-full backdrop-blur-sm">
                                    Cliquer pour voir
                                  </span>
                                </div>
                              </div>
                            </>
                          ) : (
                            // Placeholder pour image manquante
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-center">
                                <svg
                                  className="w-12 h-12 mx-auto text-amber-400 mb-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                <p className="text-amber-600 font-serif text-xs">
                                  Image non disponible
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Contenu de la carte */}
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-lg text-amber-900 font-serif leading-tight flex-1 mr-2">
                              {produit.nom}
                            </h4>
                            {produit.prix && (
                              <span className="text-sm font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full whitespace-nowrap">
                                {produit.prix} MAD
                              </span>
                            )}
                          </div>
                          
                          <div className="h-px w-full bg-gradient-to-r from-amber-200 to-amber-400 mb-3"></div>
                          
                          {produit.description && (
                            <p className="text-sm text-amber-800 italic font-serif line-clamp-2 mb-4 leading-relaxed">
                              {produit.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-amber-700 font-medium">
                              {produit.stock > 0 ? `En stock: ${produit.stock}` : "Rupture de stock"}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (produit.stock > 0) handleAddToCart(produit);
                              }}
                              disabled={produit.stock <= 0}
                              className={`bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-2 px-4 rounded-full font-semibold 
                                transition-all duration-300 transform hover:scale-[1.05] active:scale-[0.95] shadow-md hover:shadow-lg
                                ${produit.stock <= 0 ? "opacity-50 cursor-not-allowed hover:scale-100" : ""}`}
                            >
                              Ajouter
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )
            ))}
            
            {/* Message si aucun résultat de recherche */}
            {searchTerm && Object.keys(filteredProduitsParCategorie).length === 0 && (
              <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-lg shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-amber-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xl text-amber-800 font-medium font-serif">
                  Aucun produit trouvé pour "{searchTerm}"
                </p>
                <p className="text-amber-700 mt-2 italic text-sm">
                  Essayez avec d'autres termes de recherche ou parcourez nos catégories.
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-full font-semibold transition-colors duration-300"
                >
                  Voir tous les produits
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de produit optimisé */}
      {showProductModal && selectedProduct && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={closeProductModal}
        >
          <div 
            className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton de fermeture amélioré */}
            <button
              onClick={closeProductModal}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 bg-white bg-opacity-95 hover:bg-opacity-100 rounded-full p-3 z-20 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-110"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            
            {/* Layout responsive */}
            <div className="flex flex-col lg:flex-row h-full max-h-[95vh]">
              {/* Section image avec gestion d'erreur améliorée */}
              <div className="lg:w-1/2 relative bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center min-h-[300px] lg:min-h-[500px]">
                {modalImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-amber-50 z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amber-600 mx-auto mb-4"></div>
                      <p className="text-amber-800 font-serif italic">Chargement de l'image...</p>
                    </div>
                  </div>
                )}
                
                {selectedProduct.validImageUrl && !modalImageError ? (
                  <div className="w-full h-full relative group">
                    <img
                      src={selectedProduct.validImageUrl}
                      alt={selectedProduct.nom}
                      className={`w-full h-full object-contain transition-all duration-500 ${
                        modalImageLoading ? 'opacity-0' : 'opacity-100'
                      }`}
                      onLoad={handleModalImageLoad}
                      onError={handleModalImageError}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        imageRendering: 'auto',
                        WebkitImageRendering: 'auto'
                      }}
                    />
                    
                    {/* Badge de zoom si l'image est grande */}
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs font-serif opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Image haute qualité
                    </div>
                  </div>
                ) : selectedProduct.image && !modalImageError ? (
                  <div className="w-full h-full relative group">
                    <img
                      src={getImageUrl(selectedProduct.image)}
                      alt={selectedProduct.nom}
                      className={`w-full h-full object-contain transition-all duration-500 ${
                        modalImageLoading ? 'opacity-0' : 'opacity-100'
                      }`}
                      onLoad={handleModalImageLoad}
                      onError={handleModalImageError}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        imageRendering: 'auto',
                        WebkitImageRendering: 'auto'
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <svg
                      className="w-24 h-24 mx-auto text-amber-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-amber-600 font-serif text-lg mb-2">Image non disponible</p>
                    <p className="text-amber-500 font-serif text-sm italic">
                      {selectedProduct.image ? 
                        "Impossible de charger l'image du produit" : 
                        "Aucune image associée à ce produit"
                      }
                    </p>
                    
                    {/* Bouton pour réessayer le chargement */}
                    {selectedProduct.image && (
                      <button
                        onClick={async () => {
                          setModalImageLoading(true);
                          setModalImageError(false);
                          const validUrl = await getValidImageUrl(selectedProduct.image);
                          if (validUrl) {
                            setSelectedProduct(prev => ({
                              ...prev,
                              validImageUrl: validUrl
                            }));
                          } else {
                            setModalImageLoading(false);
                            setModalImageError(true);
                          }
                        }}
                        className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                      >
                        Réessayer le chargement
                      </button>
                    )}
                  </div>
                )}
                
                {/* Gradient overlay léger */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
              </div>
              
              {/* Section informations */}
              <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-between bg-white overflow-y-auto">
                {/* En-tête du produit */}
                <div className="mb-6">
                  {/* Badge de catégorie si disponible */}
                  {selectedProduct.categorie && (
                    <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
                      {selectedProduct.categorie}
                    </span>
                  )}
                  
                  {/* Titre et prix */}
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
                    <h2 className="text-2xl lg:text-3xl font-bold text-amber-900 font-serif leading-tight mb-2 lg:mb-0 lg:mr-4">
                      {selectedProduct.nom}
                    </h2>
                    {selectedProduct.prix && (
                      <div className="text-right">
                        <span className="text-2xl lg:text-3xl font-bold text-amber-700 block">
                          {selectedProduct.prix} MAD
                        </span>
                        <span className="text-sm text-amber-600">Prix unitaire</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Ligne de séparation élégante */}
                  <div className="h-px w-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 mb-6"></div>
                  
                  {/* Description */}
                  {selectedProduct.description && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-amber-800 mb-3 uppercase tracking-wide">
                        Description
                      </h3>
                      <p className="text-amber-800 font-serif italic leading-relaxed text-base">
                        {selectedProduct.description}
                      </p>
                    </div>
                  )}
                  
                  {/* Informations sur le stock */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-amber-800 mb-3 uppercase tracking-wide">
                      Disponibilité
                    </h3>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                        selectedProduct.stock > 0 
                          ? 'text-green-800 bg-green-100' 
                          : 'text-red-800 bg-red-100'
                      }`}>
                        <svg
                          className={`w-4 h-4 mr-2 ${
                            selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {selectedProduct.stock > 0 ? (
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          ) : (
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          )}
                        </svg>
                        {selectedProduct.stock > 0 ? `${selectedProduct.stock} en stock` : "Rupture de stock"}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Section d'ajout au panier */}
                {selectedProduct.stock > 0 && (
                  <div className="border-t border-amber-100 pt-6">
                    <h3 className="text-sm font-semibold text-amber-800 mb-4 uppercase tracking-wide">
                      Ajouter au panier
                    </h3>
                    
                    {/* Sélecteur de quantité */}
                    <div className="flex items-center space-x-4 mb-6">
                      <span className="text-amber-800 font-medium">Quantité:</span>
                      <div className="flex items-center border-2 border-amber-200 rounded-lg bg-white">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 text-amber-700 hover:bg-amber-50 transition-colors rounded-l-lg"
                          disabled={quantity <= 1}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        
                        <input
                          type="number"
                          min="1"
                          max={selectedProduct.stock}
                          value={quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setQuantity(Math.min(Math.max(1, val), selectedProduct.stock));
                          }}
                          className="w-16 text-center border-0 py-2 text-amber-900 font-semibold focus:outline-none"
                        />
                        
                        <button
                          onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                          className="p-2 text-amber-700 hover:bg-amber-50 transition-colors rounded-r-lg"
                          disabled={quantity >= selectedProduct.stock}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Prix total */}
                      {selectedProduct.prix && (
                        <div className="text-right">
                          <span className="text-lg font-bold text-amber-700">
                            Total: {(selectedProduct.prix * quantity).toFixed(2)} MAD
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Boutons d'action */}
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                      <button
                        onClick={() => handleAddToCart(selectedProduct, quantity)}
                        className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-4 px-6 rounded-xl font-semibold 
                          transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl
                          flex items-center justify-center space-x-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span>Ajouter au panier</span>
                        {quantity > 1 && (
                          <span className="bg-white text-amber-700 rounded-full px-2 py-1 text-xs font-bold">
                            {quantity}
                          </span>
                        )}
                      </button>
                      
                      <button
                        onClick={() => navigate('/panier')}
                        className="sm:w-auto bg-white border-2 border-amber-600 text-amber-700 hover:bg-amber-50 py-4 px-6 rounded-xl font-semibold 
                          transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg
                          flex items-center justify-center space-x-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        <span>Voir le panier</span>
                      </button>
                    </div>
                    
                    {/* Note sur la livraison */}
                    <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <div className="flex items-start space-x-3">
                        <svg
                          className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <p className="text-amber-800 font-serif text-sm leading-relaxed">
                            <strong>Produit artisanal</strong> - Préparé avec soin par nos artisans.
                            Livraison possible ou retrait en magasin.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Message pour produit en rupture */}
                {selectedProduct.stock <= 0 && (
                  <div className="border-t border-amber-100 pt-6">
                    <div className="text-center p-6 bg-red-50 rounded-xl border border-red-200">
                      <svg
                        className="w-12 h-12 mx-auto text-red-500 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <h3 className="text-lg font-bold text-red-800 mb-2 font-serif">Produit non disponible</h3>
                      <p className="text-red-700 font-serif italic">
                        Ce produit est actuellement en rupture de stock. 
                        Nos artisans travaillent pour le remettre en vente bientôt.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification améliorée */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 font-serif flex items-center space-x-3 animate-in slide-in-from-right-5 fade-in duration-300">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{notification}</span>
        </div>
      )}
    </div>
  )
}

export default Commande