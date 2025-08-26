import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../Formulaire_de_connexion/AuthContext"
import { ShoppingBag, Filter, Search } from "lucide-react"

// Configuration API
const API_BASE_URL = "http://localhost:8000/api"

// Composants UI
const Button = ({ children, onClick, disabled, variant = "default", size = "default", className = "" }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50"
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
  }

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
    {children}
  </div>
)

export default function ClientCommande() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()

  // États
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState([])

  // Services API
  const apiService = {
    async get(endpoint) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return await response.json()
      } catch (error) {
        console.error("API Error:", error)
        throw error
      }
    }
  }

  // Charger les produits et catégories
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          apiService.get("/produits"),
          apiService.get("/categories")
        ])

        setProducts(productsData.produits || [])
        setCategories(categoriesData.categories || [])
      } catch (error) {
        setError("Erreur lors du chargement des données")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    const matchesCategory = categoryFilter === "all" || product.categorie === categoryFilter
    const matchesSearch = product.nom.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Gérer l'ajout au panier
  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      navigate("/login", { 
        state: { message: "Veuillez vous connecter pour ajouter des produits au panier" }
      })
      return
    }
    addToCart(product)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Nos Produits</h1>
        <p className="text-gray-600">Découvrez notre sélection de cafés et boissons</p>
      </div>

      {/* Filtres et Recherche */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            className="border rounded-md px-3 py-2"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Toutes les catégories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grille de produits */}
      {error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucun produit ne correspond à votre recherche
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <img
                src={product.image_url || "/placeholder.png"}
                alt={product.nom}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.nom}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">{product.prix} DH</span>
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center space-x-2"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Ajouter</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}