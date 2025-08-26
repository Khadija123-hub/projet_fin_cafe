"use client"

import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { Menu, X, Coffee, Truck, Globe, MapPin,  Home, Phone, User } from "lucide-react"
import { useAuth } from "../Formulaire_de_connexion/AuthContext";
import Logo from "../../images/logo.png"
import ClientDashboard from "../Formulaire_de_connexion/ClientDashboard"

// Configuration des liens de navigation (inchangée)
const NAVIGATION_LINKS = {
  desktop: [
    { to: "/nosMenu", label: "Menu", icon: null },
    { to: "/livraison", label: "Livraison", icon: null },
    { to: "/developpement-durable", label: "Développement durable", icon: null },
    { to: "/CaféSanté", label: "Café & Santé", icon: null },
    { to: "/nos-salons", label: "Trouver nos salons", icon: MapPin },
  
  ],
  mobile: [
    { to: "/nosMenu", label: "Menu", icon: Coffee },
    { to: "/livraison", label: "Livraison", icon: Truck },
    { to: "/developpement-durable", label: "Développement durable", icon: Globe },
    { to: "/moyen-orient", label: "Moyen-Orient", icon: MapPin },
    { to: "/nos-salons", label: "Trouver nos salons", icon: MapPin },
   
    
    { to: "/contact", label: "Contactez-nous", icon: Phone },
  ],
}

const getNavigationStyles = (darkMode) => ({
  active: darkMode
    ? "text-orange-400 font-semibold border-b-2 border-orange-400"
    : "text-orange-300 font-semibold border-b-2 border-orange-300",
  normal: darkMode
    ? "text-gray-200 hover:text-orange-400 hover:border-b-2 hover:border-orange-400 transition-colors duration-200 font-medium"
    : "text-amber-100 hover:text-orange-300 hover:border-b-2 hover:border-orange-300 transition-colors duration-200 font-medium",
})

// Composant bouton utilisateur amélioré
const DesktopUserButton = ({ showDashboard, toggleDashboard, styles, isAuthenticated, isClient, user }) => {
  if (!isAuthenticated) {
    return (
      <NavLink to="/login" className={`px-4 py-2 text-lg ${styles.normal} flex items-center`} title="Se connecter">
        <User className="h-5 w-5 mr-2" />
        Connexion
      </NavLink>
    )
  }

  if (!isClient) {
    return (
      <span className={`px-4 py-2 text-lg ${styles.normal} flex items-center opacity-50 cursor-not-allowed`}>
        <User className="h-5 w-5 mr-2" />
        {user?.name || "Utilisateur"}
      </span>
    )
  }

  return (
    <button
      onClick={toggleDashboard}
      className={`px-4 py-2 text-lg ${showDashboard ? styles.active : styles.normal} flex items-center`}
      title="Dashboard Client"
    >
      <User className="h-5 w-5 mr-2" />
      {user?.name || "Client"}
    </button>
  )
}

const MobileUserButton = ({ showDashboard, toggleDashboard, styles, onClick, isAuthenticated, isClient, user }) => {
  if (!isAuthenticated) {
    return (
      <NavLink
        to="/login"
        className={`flex items-center px-4 py-3 text-base font-medium rounded-md ${styles.normal}`}
        onClick={onClick}
      >
        <User className="h-5 w-5 mr-2" />
        Connexion
      </NavLink>
    )
  }

  if (!isClient) {
    return (
      <span className={`px-4 py-3 text-base font-medium rounded-md ${styles.normal} opacity-50`}>
        <User className="h-5 w-5 mr-2" />
        {user?.name || "Utilisateur"}
      </span>
    )
  }

  return (
    <button
      onClick={() => {
        toggleDashboard()
        onClick()
      }}
      className={`flex items-center px-4 py-3 text-base font-medium rounded-md w-full ${
        showDashboard ? styles.active : styles.normal
      }`}
    >
      <User className="h-5 w-5 mr-2" />
      Dashboard
    </button>
  )
}

// Composants inchangés
const NavbarLogo = ({ logo }) => (
  <div className="flex-shrink-0">
    <NavLink to="/" className="flex items-center">
      <img
        src={logo || "/placeholder.svg"}
        alt="logo"
        className="h-16 w-auto transition-transform duration-300 hover:scale-105"
      />
    </NavLink>
  </div>
)

const MobileMenuButton = ({ isMenuOpen, toggleMenu, darkMode }) => (
  <div className="md:hidden">
    <button
      onClick={toggleMenu}
      className={`p-2 rounded-md transition-colors duration-200 ${
        darkMode ? "text-gray-200 hover:text-orange-400" : "text-amber-100 hover:text-orange-300"
      }`}
      aria-label="Toggle menu"
    >
      {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </button>
  </div>
)

const DesktopNavLink = ({ to, label, icon: Icon, styles }) => (
  <NavLink to={to} className={({ isActive }) => `px-4 py-2 text-lg ${isActive ? styles.active : styles.normal}`}>
    {Icon && <Icon className="inline-block h-4 w-4 mr-1" />}
    {label}
  </NavLink>
)

const MobileNavLink = ({ to, label, icon: Icon, styles, onClick }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-3 text-base font-medium rounded-md ${isActive ? styles.active : styles.normal}`
    }
    onClick={onClick}
  >
    <Icon className="h-5 w-5 mr-2" />
    {label}
  </NavLink>
)

const DesktopMenu = ({ styles, showDashboard, toggleDashboard, isAuthenticated, isClient, user }) => (
  <div className="hidden md:flex md:items-center md:space-x-8">
    {NAVIGATION_LINKS.desktop.map((link) => (
      <DesktopNavLink key={link.to} to={link.to} label={link.label} icon={link.icon} styles={styles} />
    ))}

    <DesktopUserButton
      showDashboard={showDashboard}
      toggleDashboard={toggleDashboard}
      styles={styles}
      isAuthenticated={isAuthenticated}
      isClient={isClient}
      user={user}
    />
  </div>
)

const MobileMenu = ({
  isMenuOpen,
  darkMode,
  styles,
  showDashboard,
  toggleDashboard,
  onLinkClick,
  isAuthenticated,
  isClient,
  user,
}) => {
  if (!isMenuOpen) return null

  return (
    <div className={`md:hidden ${darkMode ? "bg-gray-800" : "bg-amber-800"} transition-all duration-300`}>
      <div className="px-4 pt-4 pb-6 space-y-2">
        {NAVIGATION_LINKS.mobile.map((link) => (
          <MobileNavLink
            key={link.to}
            to={link.to}
            label={link.label}
            icon={link.icon}
            styles={styles}
            onClick={onLinkClick}
          />
        ))}

        <MobileUserButton
          showDashboard={showDashboard}
          toggleDashboard={toggleDashboard}
          styles={styles}
          onClick={onLinkClick}
          isAuthenticated={isAuthenticated}
          isClient={isClient}
          user={user}
        />
      </div>
    </div>
  )
}

const DashboardOverlay = ({ showDashboard, toggleDashboard, isAuthenticated, isClient }) => {
  // Ne pas afficher si pas authentifié ou pas client
  if (!showDashboard || !isAuthenticated || !isClient) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleDashboard} />

      <div className="fixed top-20 right-0 h-[calc(100vh-5rem)] w-96 bg-white shadow-xl overflow-y-auto z-50 transform transition-transform duration-300">
        <div className="relative p-4">
          <button
            onClick={toggleDashboard}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
            aria-label="Fermer le dashboard"
          >
            <X className="h-5 w-5" />
          </button>
          <ClientDashboard onClose={toggleDashboard} />
        </div>
      </div>
    </>
  )
}
const Navbar = ({ darkMode = false }) => {
  const { isAuthenticated, user, isClient } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const isClientUser = isClient() 

  // Fermer le dashboard si l'utilisateur se déconnecte
useEffect(() => {
    if (!isAuthenticated || !isClientUser) {
      setShowDashboard(false)
    }
  }, [isAuthenticated, isClientUser])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleDashboard = () => {
    if (!isAuthenticated || !isClientUser) {
      return
    }

    setShowDashboard(!showDashboard)
    if (isMenuOpen) setIsMenuOpen(false)
  }

  const handleMobileLinkClick = () => {
    setIsMenuOpen(false)
  }

  const navigationStyles = getNavigationStyles(darkMode)
  const navbarClasses = `fixed top-0 left-0 right-0 w-full z-50 shadow-lg transition-all duration-300 ${
    darkMode ? "bg-gray-900" : "bg-amber-900"
  }`

  return (
    <>
      <nav className={navbarClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <NavbarLogo logo={Logo} />

            <MobileMenuButton isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} darkMode={darkMode} />

             <DesktopMenu
          styles={navigationStyles}
          showDashboard={showDashboard}
          toggleDashboard={toggleDashboard}
          isAuthenticated={isAuthenticated}
          isClient={isClientUser}
          user={user}
        />
          </div>
        </div>

        <MobileMenu
          isMenuOpen={isMenuOpen}
          darkMode={darkMode}
          styles={navigationStyles}
          showDashboard={showDashboard}
          toggleDashboard={toggleDashboard}
          onLinkClick={handleMobileLinkClick}
          isAuthenticated={isAuthenticated}
          isClient={isClient()}
          user={user}
        />
      </nav>

     
      <DashboardOverlay
        showDashboard={showDashboard}
        toggleDashboard={toggleDashboard}
        isAuthenticated={isAuthenticated}
        isClient={isClientUser}
      />
    </>
  )
}

export default Navbar
