import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Package, AlertCircle, Check, ArrowLeft, Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiService from '../Formulaire_de_connexion/ApiService';

// --- UI Components with Coffee Theme ---
const Button = ({ children, onClick, disabled, variant = "default", size = "default", className = "", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm"

  const variants = {
    default: "bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-amber-200",
    destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-red-200",
    outline: "border-2 border-amber-300 bg-white hover:bg-amber-50 text-amber-800 hover:border-amber-400",
    secondary: "bg-gradient-to-r from-orange-100 to-amber-100 text-amber-900 hover:from-orange-200 hover:to-amber-200",
    ghost: "hover:bg-amber-100 text-amber-800 hover:text-amber-900",
  }

  const sizes = {
    default: "h-11 px-6 py-3",
    sm: "h-9 px-4 py-2",
    lg: "h-12 px-8 py-3",
    xs: "h-8 px-3 py-1 text-xs",
    icon: "h-10 w-10",
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border border-amber-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 p-4 sm:p-6 ${className}`}>{children}</div>
)

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-xl sm:text-2xl font-bold leading-none tracking-tight text-amber-900 ${className}`}>
    {children}
  </h3>
)

const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 sm:p-6 pt-0 ${className}`}>{children}</div>
)

const Alert = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-blue-50 border-blue-200 text-blue-800",
    destructive: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
  }

  return (
    <div className={`relative w-full rounded-lg border p-3 sm:p-4 ${variants[variant]} ${className}`}>
      {children}
    </div>
  )
}

const AlertDescription = ({ children }) => <div className="text-sm">{children}</div>

// Main Cart Component
function Panier() {
  const [panierData, setPanierData] = useState({
    items: [],
    count: 0,
    total: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const navigate = useNavigate();

  // Load cart on component mount
  useEffect(() => {
    loadPanier();
  }, []);

  const loadPanier = async () => {
    try {
      setError(null);
      const response = await apiService.getCart();
      
      if (response?.success) {
        setPanierData({
          items: response.data?.items || [],
          count: response.data?.count || 0,
          total: response.data?.total || 0
        });
      } else {
        setPanierData({ items: [], count: 0, total: 0 });
      }
    } catch (err) {
      console.error('Erreur chargement panier:', err);
      setError(err.message || "Erreur lors du chargement du panier");
      setPanierData({ items: [], count: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 3000);
  };

  const updateQuantity = async (produitId, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }
    
    try {
      setUpdatingItems(prev => new Set([...prev, produitId]));
      setError(null);
      
      const response = await apiService.updateCartItem(produitId, newQuantity);
      
      if (response?.success) {
        await loadPanier();
        showSuccess(`Quantité mise à jour: ${newQuantity}`);
      } else {
        throw new Error(response?.message || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      console.error('Erreur mise à jour quantité:', err);
      setError(err.message || "Erreur lors de la mise à jour de la quantité");
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(produitId);
        return newSet;
      });
    }
  };

  const decreaseQuantity = (item) => {
    const currentQuantity = parseInt(item.quantite || 0);
    if (currentQuantity > 1) {
      updateQuantity(item.id, currentQuantity - 1);
    }
  };

  const increaseQuantity = (item) => {
    const currentQuantity = parseInt(item.quantite || 0);
    updateQuantity(item.id, currentQuantity + 1);
  };

  const removeItem = async (produitId) => {
    try {
      setUpdatingItems(prev => new Set([...prev, produitId]));
      setError(null);
      
      const response = await apiService.removeFromCart(produitId);
      
      if (response?.success) {
        await loadPanier();
        showSuccess("Produit supprimé du panier");
      }
    } catch (err) {
      setError(err.message || "Erreur lors de la suppression");
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(produitId);
        return newSet;
      });
    }
  };

  const clearCart = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir vider votre panier ?")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.clearCart();
      
      if (response?.success) {
        setPanierData({ items: [], count: 0, total: 0 });
        showSuccess("Panier vidé avec succès");
      }
    } catch (err) {
      setError(err.message || "Erreur lors du vidage du panier");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return parseFloat(price || 0).toFixed(2);
  };

  const calculateSubtotal = (item) => {
    const prix = parseFloat(item.prix || 0);
    const quantite = parseInt(item.quantite || 0);
    return (prix * quantite).toFixed(2);
  };

  if (loading && panierData.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 mt-44">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-11 sm:h-12 sm:w-12 border-b-2 border-amber-600"></div>
            <span className="ml-3 text-amber-800 text-sm sm:text-base">Chargement du panier...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        {/* Header with coffee theme */}
        <div className="flex items-center mt-20 mb-6 sm:mb-8 bg-white rounded-xl shadow-lg p-3 border border-amber-200">
          <Button variant="ghost" className="mr-2 sm:mr-4 px-2 sm:px-4" onClick={() => navigate('/commande')}>
            <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Retour aux achats</span>
            <span className="sm:hidden">Retour</span>
          </Button>
          <Coffee className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600 mr-2 sm:mr-3" />
          <h1 className="text-xl sm:text-3xl font-bold text-amber-900 mr-3">Mon Panier Café</h1>
        </div>

        {/* Alerts - Mobile optimized */}
        {error && (
          <Alert variant="destructive" className="mb-4 sm:mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mb-4 sm:mb-6">
            <Check className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {panierData.items.length === 0 ? (
          <Card className="border-2 border-dashed border-amber-300">
            <CardContent className="text-center py-12 sm:py-16">
              <div className="mb-4">
                <Coffee className="h-12 w-12 sm:h-16 sm:w-16 text-amber-400 mx-auto mb-2" />
                <ShoppingCart className="h-8 w-8 sm:h-12 sm:w-12 text-amber-300 mx-auto" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-amber-900 mb-2">Votre panier café est vide</h2>
              <p className="text-amber-700 mb-6 text-sm sm:text-base px-4">Découvrez nos délicieux cafés, pâtisseries et boissons chaudes</p>
              <Button onClick={() => navigate('/commande')} size="lg" className="w-full sm:w-auto">
                <Coffee className="h-4 w-4 mr-2" />
                Découvrir nos produits
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="">
            {/* Cart Items - Mobile First Design */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-lg border border-amber-200">
                <h2 className="text-lg sm:text-xl font-bold text-amber-900 flex items-center">
                  <Coffee className="h-5 w-5 mr-2 text-amber-600" />
                  Vos produits ({panierData.count})
                </h2>
              </div>
              
              {panierData.items.map((item) => {
                const isUpdating = updatingItems.has(item.id);
                
                return (
                  <Card key={item.panier_id || item.id} className="hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                      <div className="space-y-4">
                        {/* Product Info - Mobile Optimized */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base sm:text-lg text-amber-900 mb-2 leading-tight">
                            {item.nom || 'Produit sans nom'}
                          </h3>
                          
                          <div className="space-y-1">
                            <p className="text-xs sm:text-sm text-amber-700">
                              Prix unitaire: <span className="font-semibold text-amber-800">{formatPrice(item.prix)} DH</span>
                            </p>
                            <p className="text-sm sm:text-lg font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-lg inline-block">
                              Sous-total: {calculateSubtotal(item)} DH
                            </p>
                          </div>
                        </div>

                        {/* Quantity and Actions - Mobile Layout */}
                        <div className=" sm:items-center justify-between gap-3 pt-2 border-t border-amber-100">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                            <span className="text-xs sm:text-sm font-medium text-amber-800 mr-2">Quantité:</span>
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => decreaseQuantity(item)}
                              disabled={isUpdating || parseInt(item.quantite) <= 1}
                              className="h-8 w-8 sm:h-9 sm:w-9"
                            >
                              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            
                            <div className="w-12 sm:w-16 text-center bg-amber-50 rounded-lg py-1">
                              {isUpdating ? (
                                <div className="animate-spin h-4 w-4 border-2 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
                              ) : (
                                <span className="text-sm sm:text-lg font-bold text-amber-900">{item.quantite}</span>
                              )}
                            </div>
                            
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => increaseQuantity(item)}
                              disabled={isUpdating}
                              className="h-8 w-8 sm:h-9 sm:w-9"
                            >
                              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>

                          {/* Remove Button */}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeItem(item.id)}
                            disabled={isUpdating}
                            className="w-full sm:w-auto text-xs sm:text-sm ml-7 mt-2"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Order Summary - Below items on Mobile, Sticky on Desktop */}
            <div className="lg:col-span-1 mt-12">
              <Card className="lg:sticky lg:top-4 bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-300">
                <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-xl">
                  <CardTitle className="text-white flex items-center text-lg sm:text-xl">
                    <Package className="h-5 w-5 mr-2" />
                    Résumé de la commande
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-800">Sous-total ({panierData.count} articles):</span>
                      <span className="font-semibold text-amber-900">{formatPrice(panierData.total)} DH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-800">Livraison:</span>
                      <span className="font-semibold text-green-600">Gratuite</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-800">Service café:</span>
                      <span className="font-semibold text-green-600">Inclus</span>
                    </div>
                  </div>
                  
                  <hr className="border-amber-300" />
                  
                  <div className="flex justify-between items-center text-lg sm:text-xl font-bold bg-white rounded-lg p-3 border-2 border-amber-400">
                    <span className="text-amber-900">Total:</span>
                    <span className="text-amber-700">{formatPrice(panierData.total)} DH</span>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      className="w-full font-bold" 
                      size="lg"
                      onClick={() => navigate('/passerCommande')}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Passer la commande
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full text-xs sm:text-sm"
                      onClick={() => navigate('/commande')}
                    >
                      <Coffee className="h-4 w-4 mr-2" />
                      Continuer mes achats
                    </Button>
                    
                    <Button 
                      variant="destructive" 
                      className="w-full text-xs sm:text-sm"
                      onClick={clearCart}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Vider le panier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Panier;