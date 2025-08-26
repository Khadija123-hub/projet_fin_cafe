import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"

const ProtectedRouteConnect = ({ children, requireAuth = true, redirectTo = "/login" }) => {
  const { isAuthenticated, user, loading } = useAuth()

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-950 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  // Si la route nécessite une authentification
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // Si la route ne nécessite PAS d'authentification (comme /login)
  // mais que l'utilisateur est déjà connecté
  if (!requireAuth && isAuthenticated && user) {
    // Rediriger selon le rôle
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />
    } else if (user.role === "client") {
      return <Navigate to="/client-dashboard" replace />
    } else {
      return <Navigate to="/commender" replace />
    }
  }

  return children
}

export default ProtectedRouteConnect