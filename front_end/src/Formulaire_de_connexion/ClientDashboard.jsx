"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../Formulaire_de_connexion/AuthContext"
import { ShoppingCart, Package, LogOut, Edit, Check, AlertCircle, User, Menu, X } from "lucide-react"
import Panier from "../Formulaire_de_connexion/panier"

const API_BASE_URL = "http://localhost:8000/api"

// Composants UI
const Button = ({ children, onClick, disabled, variant = "default", size = "default", className = "", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
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

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    outline: "border border-gray-300 text-gray-700",
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2 sm:px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}

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
  }

  return (
    <div className={`relative w-full rounded-lg border p-3 sm:p-4 ${variants[variant]} ${className}`}>{children}</div>
  )
}

const AlertDescription = ({ children }) => <div className="text-sm">{children}</div>

export default function ClientDashboard({ onClose, darkMode }) {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const { cart, clearCart } = useCart()

  // États optimisés
  const [initialLoad, setInitialLoad] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("cart")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [orders, setOrders] = useState([])
  const [profileData, setProfileData] = useState({
    nom: user?.name || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
    adresse: user?.adresse || "",
  })
  const [editingProfile, setEditingProfile] = useState(false)

  // Service API optimisé
  const apiService = {
    async request(endpoint, options = {}) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          ...options,
        })

        if (response.status === 401) {
          logout()
          navigate("/login")
          return null
        }

        const data = await response.json()
        return response.ok ? data : Promise.reject(data)
      } catch (error) {
        console.error("API Error:", error)
        throw error
      }
    },

    async get(endpoint) {
      return this.request(endpoint, { method: 'GET' })
    },

    async post(endpoint, data = {}) {
      return this.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    async put(endpoint, data = {}) {
      return this.request(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    }
  }

  // Initialisation optimisée
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true })
      return
    }

    const loadData = async () => {
      try {
        await Promise.all([
          loadClientData(),
          loadOrders()
        ])
      } catch (error) {
        console.error("Initial load error:", error)
        setError("Erreur lors du chargement initial")
      } finally {
        setInitialLoad(false)
      }
    }

    loadData()
  }, [isAuthenticated, navigate])

  // Fonctions optimisées
  const loadClientData = async () => {
    try {
      const response = await apiService.get("/client/profile")
      if (response?.profile) {
        setProfileData(prev => ({
          nom: response.profile.user.name || prev.nom,
          email: response.profile.user.email || prev.email,
          telephone: response.profile.client.telephone || prev.telephone,
          adresse: response.profile.client.adresse || prev.adresse
        }))
      }
    } catch (error) {
      console.error("Profile load error:", error)
      // On garde les données existantes
    }
  }

  const loadOrders = async () => {
    try {
      const response = await apiService.get("/client/commandes")
      setOrders(response?.commandes || [])
    } catch (error) {
      console.error("Orders load error:", error)
      setOrders([])
    }
  }

  const handleLogout = () => {
    logout()
    clearCart()
    navigate("/login", { replace: true })
  }

  const updateProfile = async () => {
    try {
      setError("")
      const response = await apiService.put("/client/profile", {
        name: profileData.nom,
        email: profileData.email,
        telephone: profileData.telephone,
        adresse: profileData.adresse,
      })

      if (response?.success) {
        setSuccess("Profil mis à jour avec succès")
        setEditingProfile(false)
        setTimeout(() => setSuccess(""), 3000)
      }
    } catch (error) {
      console.error("Profile update error:", error)
      setError(error.message || "Erreur lors de la mise à jour")
    }
  }

  const handleOrderCreated = (newOrder) => {
    setOrders(prev => [newOrder, ...prev])
    setActiveTab("orders")
    setSuccess("Commande créée avec succès!")
    setTimeout(() => setSuccess(""), 3000)
  }

  const getDisplayName = () => {
    if (profileData.nom && profileData.nom !== user?.name) return profileData.nom
    if (user?.name) return user.name
    return "Utilisateur"
  }

  const getInitial = () => {
    return getDisplayName().charAt(0).toUpperCase()
  }

  const tabs = [
    {
      id: "cart",
      label: `Panier (${cart.length})`,
      icon: ShoppingCart,
      shortLabel: "Panier",
      count: cart.length,
    },
    {
      id: "profile",
      label: "Mon Profil",
      icon: User,
      shortLabel: "Profil",
    },
  ]

  if (initialLoad) {
    return (
      <div className={`flex items-center justify-center min-h-[80vh] ${darkMode ? 'bg-gray-900' : 'bg-orange-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-800 mx-auto mb-4"></div>
          <p className={darkMode ? "text-white" : "text-orange-900"}>Chargement en cours...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto p-2 sm:p-4 max-w-7xl min-h-[80vh]">
        {/* Header */}
        <div className={`rounded-lg shadow-sm mb-4 sm:mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-4 sm:p-6">
            <div className="hidden sm:flex justify-between items-center mt-20">
              <div className="flex items-center space-x-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-gray-700' : 'bg-orange-50'
                }`}>
                  <span className={darkMode ? "text-white" : "text-orange-800"}>{getInitial()}</span>
                </div>
                <div>
                  <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-amber-950'}`}>
                    Espace Client
                  </h1>
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    Bienvenue, {getDisplayName()}
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleLogout} 
                variant={darkMode ? "secondary" : "outline"} 
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>

            {/* Mobile Header */}
            <div className="sm:hidden">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    darkMode ? 'bg-gray-700' : 'bg-blue-100'
                  }`}>
                    <span className={darkMode ? "text-white" : "text-amber-600"}>{getInitial()}</span>
                  </div>
                  <div>
                    <h1 className={darkMode ? "text-white" : "text-gray-900"}>Espace Client</h1>
                    <p className={darkMode ? "text-gray-300" : "text-gray-600"}>{getDisplayName()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    onClick={handleLogout} 
                    variant={darkMode ? "secondary" : "outline"} 
                    size="xs"
                  >
                    <LogOut className="h-3 w-3" />
                  </Button>
                  <Button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                    variant={darkMode ? "secondary" : "outline"} 
                    size="xs"
                  >
                    {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alertes */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <div className="flex items-start sm:items-center">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
              <AlertDescription>{error}</AlertDescription>
            </div>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4">
            <div className="flex items-start sm:items-center">
              <Check className="h-4 w-4 mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
              <AlertDescription>{success}</AlertDescription>
            </div>
          </Alert>
        )}

        {/* Contenu principal */}
        <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Navigation desktop */}
          <div className="hidden sm:block border-b border-gray-200">
            <nav className="flex space-x-8 p-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? darkMode 
                        ? "bg-gray-700 text-white" 
                        : "bg-blue-100 text-blue-700"
                      : darkMode 
                        ? "text-gray-300 hover:bg-gray-700" 
                        : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Navigation mobile */}
          <div className="sm:hidden">
            <div className="border-b border-gray-200">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`flex-1 flex items-center justify-center px-3 py-3 text-xs font-medium ${
                      activeTab === tab.id
                        ? darkMode
                          ? "bg-gray-700 text-white border-b-2 border-blue-500"
                          : "bg-blue-100 text-blue-700 border-b-2 border-blue-500"
                        : darkMode
                          ? "text-gray-300"
                          : "text-gray-500"
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-1" />
                    <span>{tab.shortLabel}</span>
                    {tab.count > 0 && (
                      <span className={`ml-1 rounded-full px-1.5 py-0.5 text-xs ${
                        darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {activeTab === "cart" && (
              <div>
                <div className="mb-6">
                  <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : ''}`}>
                    Mon Panier
                  </h2>
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    Gérez vos articles
                  </p>
                </div>
                
                <Panier 
                  onOrderCreated={handleOrderCreated} 
                  profileData={profileData}
                  darkMode={darkMode}
                />
              </div>
            )}

            {activeTab === "profile" && (
              <div>
                <div className="mb-6">
                  <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : ''}`}>
                    Mon Profil
                  </h2>
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    Mettez à jour vos informations
                  </p>
                </div>

                <Card className={darkMode ? 'bg-gray-700 border-gray-600' : ''}>
                  <CardContent>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nom" className="text-right">
                          Nom
                        </Label>
                        <Input
                          id="nom"
                          value={profileData.nom}
                          onChange={(e) => setProfileData({...profileData, nom: e.target.value})}
                          disabled={!editingProfile}
                          className="col-span-3"
                          darkMode={darkMode}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          disabled={!editingProfile}
                          className="col-span-3"
                          darkMode={darkMode}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="telephone" className="text-right">
                          Téléphone
                        </Label>
                        <Input
                          id="telephone"
                          value={profileData.telephone}
                          onChange={(e) => setProfileData({...profileData, telephone: e.target.value})}
                          disabled={!editingProfile}
                          className="col-span-3"
                          darkMode={darkMode}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="adresse" className="text-right">
                          Adresse
                        </Label>
                        <Textarea
                          id="adresse"
                          value={profileData.adresse}
                          onChange={(e) => setProfileData({...profileData, adresse: e.target.value})}
                          disabled={!editingProfile}
                          className="col-span-3"
                          darkMode={darkMode}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      {editingProfile ? (
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => setEditingProfile(false)} 
                            variant="outline"
                          >
                            Annuler
                          </Button>
                          <Button onClick={updateProfile}>
                            <Check className="h-4 w-4 mr-2" />
                            Enregistrer
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => setEditingProfile(true)} 
                          variant="outline"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}