import axios from "axios"

// Configuration de base
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

// Instance axios principale
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Important pour les cookies CSRF
  headers: {
    "X-Requested-With": "XMLHttpRequest", // Requis pour Laravel
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
})

// Fonction pour récupérer explicitement le token CSRF
const fetchCsrfToken = async () => {
  console.log("Récupération du token CSRF...")
  try {
    // Appel direct sans utiliser l'instance axiosInstance pour éviter les boucles
    const response = await axios.get(`${BASE_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
      },
    })

    console.log("Réponse CSRF:", response.status)

    // Extraire le token des cookies
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1]

    if (token) {
      const decodedToken = decodeURIComponent(token)
      console.log("Token CSRF récupéré avec succès")
      axiosInstance.defaults.headers.common["X-XSRF-TOKEN"] = decodedToken
      return decodedToken
    } else {
      console.warn("Token CSRF non trouvé dans les cookies après appel à /sanctum/csrf-cookie")
      return null
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du token CSRF:", error)
    return null
  }
}

// Intercepteur de requête
axiosInstance.interceptors.request.use(
  async (config) => {
    // Ajouter le token d'authentification
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }

    // Pour les requêtes qui modifient des données, s'assurer d'avoir le token CSRF
    if (["post", "put", "patch", "delete"].includes(config.method?.toLowerCase())) {
      // Vérifier si on a déjà un token CSRF
      const currentToken = axiosInstance.defaults.headers.common["X-XSRF-TOKEN"]

      if (!currentToken) {
        // Si pas de token, en récupérer un nouveau
        await fetchCsrfToken()
      }
    }

    return config
  },
  (error) => Promise.reject(error),
)

// Intercepteur de réponse
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Log détaillé de l'erreur pour le débogage
    console.error(`Erreur ${error.response?.status} pour ${originalRequest.method} ${originalRequest.url}:`, error)

    // Gestion de l'erreur 419 (CSRF token mismatch)
    if (error.response?.status === 419 && !originalRequest._retry) {
      console.log("Erreur CSRF 419 détectée, tentative de récupération d'un nouveau token...")
      originalRequest._retry = true

      try {
        // Récupérer un nouveau token CSRF
        await fetchCsrfToken()

        // Réessayer la requête originale
        console.log("Réessai de la requête avec un nouveau token CSRF")
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        console.error("Échec du renouvellement du token CSRF:", refreshError)
        return Promise.reject(error)
      }
    }

    // Gestion de l'erreur 401 (non autorisé)
    if (error.response?.status === 401 && localStorage.getItem("token")) {
      console.log("Session expirée, redirection vers la page de connexion")
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }

    return Promise.reject(error)
  },
)

// Récupérer un token CSRF au démarrage
fetchCsrfToken()

export default axiosInstance
