"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../Formulaire_de_connexion/AuthContext"
import {
  ShoppingCart,
  MapPin,
  CreditCard,
  Check,
  AlertCircle,
  ArrowLeft,
  Package,
  Truck,
  Phone,
  Mail,
  Calendar,
  Clock,
} from "lucide-react"

// Configuration API
const API_BASE_URL = "http://localhost:8000/api"

// Composants UI
const Button = ({ children, onClick, disabled, variant = "default", size = "default", className = "", ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    success: "bg-green-600 text-white hover:bg-green-700",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
    xs: "h-8 px-2 text-xs",
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
  <div className={`flex flex-col space-y-1.5 p-4 sm:p-6 ${className}`}>{children}</div>
)

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg sm:text-xl lg:text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
)

const CardContent = ({ children, className = "" }) => <div className={`p-4 sm:p-6 pt-0 ${className}`}>{children}</div>

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Label = ({ children, htmlFor }) => (
  <label
    htmlFor={htmlFor}
    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    {children}
  </label>
)

const Alert = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-blue-50 border-blue-200 text-blue-800",
    destructive: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
  }

  return (
    <div className={`relative w-full rounded-lg border p-3 sm:p-4 ${variants[variant]} ${className}`}>{children}</div>
  )
}

const AlertDescription = ({ children }) => <div className="text-sm">{children}</div>

const RadioGroup = ({ children, value, onValueChange, className = "" }) => (
  <div className={`space-y-2 ${className}`} role="radiogroup">
    {children}
  </div>
)

const RadioGroupItem = ({ value, id, checked, onChange, children }) => (
  <div className="flex items-center space-x-2">
    <input
      type="radio"
      id={id}
      value={value}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
    />
    <label
      htmlFor={id}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
    >
      {children}
    </label>
  </div>
)

const Stepper = ({ currentStep, steps }) => (
  <div className="flex items-center justify-between mb-8">
    {steps.map((step, index) => (
      <div key={index} className="flex items-center">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            index <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
          }`}
        >
          {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
        </div>
        <span className={`ml-2 text-sm ${index <= currentStep ? "text-blue-600 font-medium" : "text-gray-500"}`}>
          {step}
        </span>
        {index < steps.length - 1 && (
          <div className={`w-12 h-0.5 mx-4 ${index < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />
        )}
      </div>
    ))}
  </div>
)

export default function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cart, clearCart, getCartTotal } = useCart()
  const { user } = useAuth()

  // États
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [orderCreated, setOrderCreated] = useState(null)

  // Données du formulaire
  const [shippingData, setShippingData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
    instructions: "",
  })

  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery")
  const [deliveryMethod, setDeliveryMethod] = useState("standard")

  const steps = ["Panier", "Livraison", "Paiement", "Confirmation"]

  // Initialisation des données utilisateur
  useEffect(() => {
    if (cart.length === 0) {
      navigate("/dashboard", { replace: true })
      return
    }

    // Récupérer les données du profil depuis les props ou l'état global
    const profileData = location.state?.profileData || {}
    setShippingData({
      nom: profileData.nom || user?.name || "",
      prenom: "",
      email: profileData.email || user?.email || "",
      telephone: profileData.telephone || "",
      adresse: profileData.adresse || "",
      ville: "",
      codePostal: "",
      instructions: "",
    })
  }, [cart, navigate, location.state, user])

  // Service API - CORRIGÉ
  const createOrder = async (orderData) => {
    try {
      // Récupérer le CSRF token depuis un cookie si votre backend l'utilise
      let csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1]

      // Si le token est encodé en URL, le décoder
      if (csrfToken) {
        csrfToken = decodeURIComponent(csrfToken)
      }

      const response = await fetch(`${API_BASE_URL}/commandes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // Ajouter le CSRF token si disponible
          ...(csrfToken && { "X-XSRF-TOKEN": csrfToken }),
          // Ajouter l'en-tête X-Requested-With pour identifier les requêtes AJAX
          "X-Requested-With": "XMLHttpRequest",
        },
        // Inclure les credentials pour envoyer les cookies
        credentials: "include",
        body: JSON.stringify(orderData),
      })

      // Gérer les différents codes d'erreur
      if (response.status === 419) {
        throw new Error("Session expirée. Veuillez rafraîchir la page et réessayer.")
      } else if (response.status === 401) {
        throw new Error("Vous n'êtes pas autorisé. Veuillez vous reconnecter.")
      } else if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  // Validation des étapes
  const validateStep = (step) => {
    switch (step) {
      case 1: // Livraison
        return (
          shippingData.nom && shippingData.email && shippingData.telephone && shippingData.adresse && shippingData.ville
        )
      case 2: // Paiement
        return paymentMethod && deliveryMethod
      default:
        return true
    }
  }

  // Navigation entre les étapes
  const nextStep = () => {
    if (validateStep(currentStep + 1)) {
      setCurrentStep(currentStep + 1)
      setError("")
    } else {
      setError("Veuillez remplir tous les champs obligatoires")
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
    setError("")
  }

  // Finalisation de la commande
  const handleFinalizeOrder = async () => {
    setLoading(true)
    setError("")

    try {
      const orderData = {
        client_id: user?.id,
        produits: cart.map((item) => ({
          produit_id: item.id,
          quantite: item.quantity,
          prix_unitaire: item.prix,
        })),
        total: getCartTotal(),
        statut: "en_attente",
        adresse_livraison: `${shippingData.adresse}, ${shippingData.ville} ${shippingData.codePostal}`,
        telephone_contact: shippingData.telephone,
        email_contact: shippingData.email,
        mode_paiement: paymentMethod,
        mode_livraison: deliveryMethod,
        instructions_livraison: shippingData.instructions,
        date_commande: new Date().toISOString(),
      }

      const response = await createOrder(orderData)

      if (response?.commande) {
        setOrderCreated(response.commande)
        setCurrentStep(3) // Étape de confirmation
        setSuccess("Commande créée avec succès!")

        // Vider le panier après 2 secondes
        setTimeout(() => {
          clearCart()
        }, 2000)
      }
    } catch (error) {
      setError(error.message || "Erreur lors de la création de la commande. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  // Calculs des coûts
  const subtotal = getCartTotal()
  const deliveryFee = deliveryMethod === "express" ? 25 : 0
  const total = subtotal + deliveryFee

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Finaliser ma commande</h1>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>
          <Stepper currentStep={currentStep} steps={steps} />
        </div>

        {/* Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </div>
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mb-6">
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-2" />
              <AlertDescription>{success}</AlertDescription>
            </div>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {/* Étape 0: Récapitulatif du panier */}
            {currentStep === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Récapitulatif du panier
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-3 border-b">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <h4 className="font-medium">{item.nom}</h4>
                            <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{(item.prix * item.quantity).toFixed(2)} DH</p>
                          <p className="text-sm text-gray-600">{item.prix.toFixed(2)} DH/unité</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button onClick={nextStep}>Continuer vers la livraison</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Étape 1: Informations de livraison */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Informations de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nom">Nom *</Label>
                        <Input
                          id="nom"
                          value={shippingData.nom}
                          onChange={(e) => setShippingData({ ...shippingData, nom: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="prenom">Prénom *</Label>
                        <Input
                          id="prenom"
                          value={shippingData.prenom}
                          onChange={(e) => setShippingData({ ...shippingData, prenom: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={shippingData.email}
                          onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="telephone">Téléphone *</Label>
                        <Input
                          id="telephone"
                          value={shippingData.telephone}
                          onChange={(e) => setShippingData({ ...shippingData, telephone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="adresse">Adresse complète *</Label>
                      <Textarea
                        id="adresse"
                        value={shippingData.adresse}
                        onChange={(e) => setShippingData({ ...shippingData, adresse: e.target.value })}
                        placeholder="Numéro, rue, quartier..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ville">Ville *</Label>
                        <Input
                          id="ville"
                          value={shippingData.ville}
                          onChange={(e) => setShippingData({ ...shippingData, ville: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="codePostal">Code postal</Label>
                        <Input
                          id="codePostal"
                          value={shippingData.codePostal}
                          onChange={(e) => setShippingData({ ...shippingData, codePostal: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="instructions">Instructions de livraison (optionnel)</Label>
                      <Textarea
                        id="instructions"
                        value={shippingData.instructions}
                        onChange={(e) => setShippingData({ ...shippingData, instructions: e.target.value })}
                        placeholder="Étage, code d'accès, instructions spéciales..."
                      />
                    </div>
                  </form>

                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={prevStep}>
                      Retour
                    </Button>
                    <Button onClick={nextStep}>Continuer vers le paiement</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Étape 2: Mode de paiement et livraison */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Mode de livraison */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="h-5 w-5 mr-2" />
                      Mode de livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                      <div className="space-y-3">
                        <div className="border rounded-lg p-4">
                          <RadioGroupItem
                            value="standard"
                            id="standard"
                            checked={deliveryMethod === "standard"}
                            onChange={(e) => setDeliveryMethod(e.target.value)}
                          >
                            <div className="ml-2">
                              <div className="font-medium">Livraison standard</div>
                              <div className="text-sm text-gray-600">3-5 jours ouvrables • Gratuit</div>
                            </div>
                          </RadioGroupItem>
                        </div>
                        <div className="border rounded-lg p-4">
                          <RadioGroupItem
                            value="express"
                            id="express"
                            checked={deliveryMethod === "express"}
                            onChange={(e) => setDeliveryMethod(e.target.value)}
                          >
                            <div className="ml-2">
                              <div className="font-medium">Livraison express</div>
                              <div className="text-sm text-gray-600">24-48h • 25 DH</div>
                            </div>
                          </RadioGroupItem>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Mode de paiement */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Mode de paiement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-3">
                        <div className="border rounded-lg p-4">
                          <RadioGroupItem
                            value="cash_on_delivery"
                            id="cash_on_delivery"
                            checked={paymentMethod === "cash_on_delivery"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          >
                            <div className="ml-2">
                              <div className="font-medium">Paiement à la livraison</div>
                              <div className="text-sm text-gray-600">Payez en espèces lors de la réception</div>
                            </div>
                          </RadioGroupItem>
                        </div>
                        <div className="border rounded-lg p-4 opacity-50">
                          <RadioGroupItem
                            value="card"
                            id="card"
                            checked={paymentMethod === "card"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          >
                            <div className="ml-2">
                              <div className="font-medium">Carte bancaire</div>
                              <div className="text-sm text-gray-600">Bientôt disponible</div>
                            </div>
                          </RadioGroupItem>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Retour
                  </Button>
                  <Button onClick={handleFinalizeOrder} disabled={loading}>
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Traitement...
                      </div>
                    ) : (
                      "Confirmer la commande"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Étape 3: Confirmation */}
            {currentStep === 3 && orderCreated && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Commande confirmée !</h2>
                  <p className="text-gray-600 mb-6">Votre commande #{orderCreated.id} a été créée avec succès.</p>

                  <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                    <h3 className="font-semibold mb-4">Détails de la commande :</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Date: {new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Délai de livraison: {deliveryMethod === "express" ? "24-48h" : "3-5 jours"}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Contact: {shippingData.telephone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Email: {shippingData.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button onClick={() => navigate("/dashboard")} className="w-full">
                      Retour au dashboard
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/orders")} className="w-full">
                      Voir mes commandes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Résumé de commande */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Résumé de commande</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total ({cart.length} articles)</span>
                    <span>{subtotal.toFixed(2)} DH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Livraison</span>
                    <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                      {deliveryFee === 0 ? "Gratuit" : `${deliveryFee} DH`}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-blue-600">{total.toFixed(2)} DH</span>
                    </div>
                  </div>
                </div>

                {currentStep < 3 && (
                  <div className="mt-6 space-y-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <Check className="h-3 w-3 mr-1 text-green-500" />
                      <span>Livraison gratuite disponible</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-3 w-3 mr-1 text-green-500" />
                      <span>Retour gratuit sous 14 jours</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-3 w-3 mr-1 text-green-500" />
                      <span>Service client 24/7</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
