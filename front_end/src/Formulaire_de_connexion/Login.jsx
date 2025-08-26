"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import axiosInstance from "./AuthService"

const Login = () => {
  const navigate = useNavigate()
  const { login, user, isAuthenticated, loading } = useAuth() // Utiliser votre contexte
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    // Attendre que le loading soit terminé
    if (!loading) {
      if (isAuthenticated && user) {
        // Rediriger selon le rôle
        if (user.role === "admin") {
          navigate("/admin", { replace: true })
        } else if (user.role === "client") {
          navigate("/client-dashboard", { replace: true })
        } else {
          navigate("/commender", { replace: true })
        }
      }
    }
  }, [isAuthenticated, user, loading, navigate])

  // Afficher un loader pendant la vérification initiale
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-950 mx-auto"></div>
          <p className="mt-2 text-gray-600">Vérification...</p>
        </div>
      </div>
    )
  }

  // Si l'utilisateur est déjà connecté, ne pas afficher le formulaire
  if (isAuthenticated && user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-950 mx-auto"></div>
          <p className="mt-2 text-gray-600">Redirection en cours...</p>
        </div>
      </div>
    )
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")
    setErrors({})

    if (!email || !password) {
      setErrors({
        form: "Veuillez remplir tous les champs",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await axiosInstance.post("/api/login", {
        email,
        password,
      })

      const { user, token } = response.data

      if (!user || !token) {
        throw new Error("Réponse invalide du serveur")
      }

      // Utiliser le contexte d'authentification
      login(user, token)

      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setMessage(`Bienvenue ${user.name}, redirection en cours...`)

      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin", { replace: true })
        } else if (user.role === "client") {
          navigate("/client-dashboard", { replace: true })
        } else {
          navigate("/commender", { replace: true })
        }
      }, 1500)
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Une erreur est survenue lors de la connexion"
      setMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <br/>
      <br/>
      <br/>
    <div className="p-10 max-w-md mx-auto shadow-lg rounded-lg bg-white mt-20">
      <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>

      {message && (
        <div
          className={`p-4 mb-4 rounded ${message.includes("Bienvenue") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {message}
        </div>
      )}

      {errors.form && <div className="p-4 mb-4 rounded bg-red-100 text-red-700">{errors.form}</div>}

      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="votre@email.com"
            className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            autoComplete="email"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            autoComplete="current-password"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`w-full ${
              isLoading ? "bg-orange-300" : "bg-orange-950 hover:bg-orange-700"
            } text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            disabled={isLoading}
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-orange-700 hover:text-orange-600">
              S'inscrire
            </Link>
          </p>
        </div>
      </form>
    </div>
    <br/>
    <br/>
    <br/>
    </div>
  )
}

export default Login