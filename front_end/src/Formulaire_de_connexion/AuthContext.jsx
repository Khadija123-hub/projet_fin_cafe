"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Synchroniser l'état entre les onglets et fenêtres
  useEffect(() => {
    const handleStorageChange = () => {
      checkAuthStatus()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (token && userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } else {
        clearAuth()
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
      clearAuth()
    } finally {
      setLoading(false)
    }
  }

  const clearAuth = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  const login = (userData, token) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
    // Déclencher un événement pour synchroniser les autres onglets
    window.dispatchEvent(new Event('storage'))
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("cart")
    clearAuth()
    // Déclencher un événement pour synchroniser les autres onglets
    window.dispatchEvent(new Event('storage'))
  }

  const updateUser = (updatedUserData) => {
    const currentUser = JSON.parse(localStorage.getItem("user")) || {}
    const mergedUser = { ...currentUser, ...updatedUserData }
    
    localStorage.setItem("user", JSON.stringify(mergedUser))
    setUser(mergedUser)
    window.dispatchEvent(new Event('storage'))
  }

  const isClient = () => {
    return user?.role === "client"
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    isClient,
    checkAuthStatus,
    updateUser, // Ajout de la fonction de mise à jour
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}