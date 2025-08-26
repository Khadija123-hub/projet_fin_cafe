import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, MapPin, Calendar, CreditCard, CheckCircle, AlertCircle, User, Phone, Mail } from 'lucide-react';

// Configuration API
const API_BASE_URL = "http://localhost:8000/api";

// --- UI Components ---
const Button = ({ children, onClick, disabled, variant = "default", size = "default", className = "", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-900",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "hover:bg-gray-100 text-gray-900",
    success: "bg-green-600 text-white hover:bg-green-700",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
    xs: "h-8 px-2 text-xs",
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
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>{children}</div>
)

const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
)

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
)

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
)

const Alert = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-blue-50 border-blue-200 text-blue-800",
    destructive: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
  }

  return (
    <div className={`relative w-full rounded-lg border p-4 ${variants[variant]} ${className}`}>
      {children}
    </div>
  )
}

const AlertDescription = ({ children }) => <div className="text-sm">{children}</div>

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Label = ({ children, className = "" }) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
)

// --- API Service ---
class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async ensureCsrfCookie() {
    try {
      await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error fetching CSRF cookie:', error);
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

  async request(endpoint, options = {}) {
    const needsCsrf = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method);
    
    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...options.headers,
    };

    if (needsCsrf) {
      const csrfToken = this.getCsrfTokenFromCookie();
      if (csrfToken) {
        headers['X-XSRF-TOKEN'] = csrfToken; 
      } else {
        throw new Error("CSRF token missing. Please refresh the page.");
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        credentials: 'include',
        headers,
        ...options,
      });

      if (response.status === 401) {
        throw new Error("Session expirée, veuillez vous reconnecter");
      }

      if (response.status === 419) {
        await this.ensureCsrfCookie(); 
        if (!options._retry) {
          return this.request(endpoint, { ...options, _retry: true });
        }
        throw new Error("Erreur de sécurité CSRF. Veuillez actualiser la page.");
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || `Erreur HTTP: ${response.status}`);
        }
        
        return data;
      } else {
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return { success: true };
      }
      
    } catch (fetchError) {
      console.error('Erreur de requête:', fetchError);
      throw fetchError;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// --- Composant Principal ---
function PasserCommande() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [panierData, setPanierData] = useState({ items: [], total: 0 });
  const [commandeReussie, setCommandeReussie] = useState(false);
  const [numeroCommande, setNumeroCommande] = useState(null);

  // État du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    adresse: '', // Changed from adresse_livraison to match backend
    date_livraison: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const apiService = new ApiService(API_BASE_URL);

  useEffect(() => {
    const initialize = async () => {
      await apiService.ensureCsrfCookie();
      loadPanier();
    };
    initialize();
  }, []);

  const loadPanier = async () => {
    try {
      // Use the existing passer-commande endpoint to get cart data
      const response = await apiService.get("/passer-commande");
      if (response?.success) {
        setPanierData({
          items: response.data?.items || [],
          total: response.data?.total || 0
        });
        
        // Pre-fill form with existing client data if available
        if (response.data?.client) {
          const client = response.data.client;
          setFormData(prev => ({
            ...prev,
            nom: client.nom || '',
            email: client.email || '',
            telephone: client.telephone || '',
            adresse: client.adresse || ''
          }));
        } else if (response.data?.user) {
          // Use user data as fallback
          const user = response.data.user;
          setFormData(prev => ({
            ...prev,
            nom: user.name || '',
            email: user.email || ''
          }));
        }
      }
    } catch (err) {
      setError("Erreur lors du chargement du panier");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le téléphone est requis";
    }

    if (!formData.adresse.trim()) {
      newErrors.adresse = "L'adresse de livraison est requise";
    }

    if (!formData.date_livraison) {
      newErrors.date_livraison = "La date de livraison est requise";
    } else {
      const today = new Date();
      const selectedDate = new Date(formData.date_livraison);
      if (selectedDate <= today) {
        newErrors.date_livraison = "La date de livraison doit être future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (panierData.items.length === 0) {
      setError("Votre panier est vide");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Format data to match backend expectations
      const commandeData = {
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        adresse: formData.adresse,
        date_livraison: formData.date_livraison,
        notes: formData.notes,
        mode_paiement: 'especes', // Default payment method
        items: panierData.items.map(item => ({
          produit_id: item.produit_id,
          quantite: item.quantite,
          prix_unitaire: item.prix_unitaire || item.prix
        }))
      };

      // Use the existing store endpoint
      const response = await apiService.post("/passer-commande", commandeData);

      if (response?.success) {
        setCommandeReussie(true);
        setNumeroCommande(response.data?.commande_id);
        setSuccess("Commande passée avec succès !");
        
        // Redirect after 5 seconds
        setTimeout(() => {
          window.location.href = '/'; 
        }, 5000);
      }
    } catch (err) {
      console.error('Erreur commande:', err);
      setError(err.message || "Erreur lors de la création de la commande");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return parseFloat(price || 0).toFixed(2);
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (commandeReussie) {
    return (
      <div className="min-h-screen bg-gray-50 py-11">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="text-center">
            <CardContent className="py-16">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Commande Confirmée !
              </h1>
              <p className="text-gray-600 mb-6">
                Votre commande a été passée avec succès. Vous recevrez bientôt un email de confirmation.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                {numeroCommande && (
                  <p className="text-sm text-gray-600 mb-2">
                    Numéro de commande: <span className="font-semibold text-blue-600">#{numeroCommande}</span>
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  Total de la commande: <span className="font-semibold text-green-600">{formatPrice(panierData.total)} DH</span>
                </p>
                <p className="text-sm text-gray-600">
                  Date de livraison prévue: <span className="font-semibold">{new Date(formData.date_livraison).toLocaleDateString('fr-FR')}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Adresse de livraison: <span className="font-semibold">{formData.adresse}</span>
                </p>
              </div>
              <div className="space-y-3">
               
                <Button variant="outline" onClick={() => window.location.href = '/'} className="w-full">
                  Retour à l'accueil
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center mb-8">
          <Button variant="ghost" className="mr-4" onClick={() => window.location.href = '/panier'}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au panier
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Passer ma commande</h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire de commande */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Informations de livraison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div onSubmit={handleSubmit} className="space-y-6">
                  {/* Informations personnelles */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Informations personnelles
                    </h3>
                    
                    <div>
                      <Label>Nom complet *</Label>
                      <Input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        placeholder="Votre nom complet"
                        className={errors.nom ? "border-red-500" : ""}
                      />
                      {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                    </div>

                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="votre@email.com"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <Label>Téléphone *</Label>
                      <Input
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        placeholder="+212 6XX XXX XXX"
                        className={errors.telephone ? "border-red-500" : ""}
                      />
                      {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
                    </div>
                  </div>

                  {/* Adresse de livraison */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Adresse de livraison
                    </h3>
                    
                    <div>
                      <Label>Adresse complète *</Label>
                      <Textarea
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleInputChange}
                        placeholder="Rue, quartier, ville..."
                        rows={3}
                        className={errors.adresse ? "border-red-500" : ""}
                      />
                      {errors.adresse && <p className="text-red-500 text-sm mt-1">{errors.adresse}</p>}
                    </div>

                    <div>
                      <Label>Date de livraison souhaitée *</Label>
                      <Input
                        type="date"
                        name="date_livraison"
                        value={formData.date_livraison}
                        onChange={handleInputChange}
                        min={getTomorrowDate()}
                        className={errors.date_livraison ? "border-red-500" : ""}
                      />
                      {errors.date_livraison && <p className="text-red-500 text-sm mt-1">{errors.date_livraison}</p>}
                    </div>

                    <div>
                      <Label>Notes supplémentaires (optionnel)</Label>
                      <Textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Instructions spéciales pour la livraison..."
                        rows={2}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleSubmit}
                    className="w-full" 
                    size="lg"
                    disabled={loading || panierData.items.length === 0}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Traitement en cours...
                      </div>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Confirmer la commande
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Résumé de la commande */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Résumé de votre commande</CardTitle>
              </CardHeader>
              <CardContent>
                {panierData.items.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Votre panier est vide</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {panierData.items.map((item) => (
                        <div key={item.panier_id || item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.nom}</h4>
                            <p className="text-sm text-gray-500">
                              Quantité: {item.quantite} × {formatPrice(item.prix_unitaire || item.prix)} DH
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatPrice(item.prix_total || (item.prix_unitaire || item.prix) * item.quantite)} DH
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <hr />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Sous-total:</span>
                        <span>{formatPrice(panierData.total)} DH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Livraison:</span>
                        <span className="text-green-600">Gratuite</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>TVA (20%):</span>
                        <span>{formatPrice(panierData.total * 0.2)} DH</span>
                      </div>
                    </div>

                    <hr />

                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total à payer:</span>
                      <span className="text-blue-600">
                        {formatPrice(panierData.total * 1.2)} DH
                      </span>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Livraison gratuite</strong> pour toute commande
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Délai de livraison: 24-48h
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasserCommande;