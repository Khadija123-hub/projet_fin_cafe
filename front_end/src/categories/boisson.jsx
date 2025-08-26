import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SacherCafe from '../../images/image2_cafe.jpg';
import { Link, useNavigate } from 'react-router-dom';

function Boisson() {
  const [boissons, setBoissons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
   const [imgError, setImgError] = useState({});
  

const getImageUrl = (imageName) => {
  if (!imageName) return '/images/placeholder.jpg';
  try {
    // Encodage correct du nom de fichier pour gérer les espaces et caractères spéciaux
    const encodedName = encodeURIComponent(imageName.trim());
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const url = `${baseUrl}/storage/produits/${encodedName}`;
    
    console.log('Image URL constructed:', url);
    return url;
  } catch (error) {
    console.error('Erreur lors de la construction de l\'URL de l\'image:', error);
    return '/images/placeholder.jpg';
  }
};

const handleImageError = (boissonId, imageName) => {
  console.log(`Erreur de chargement pour l'image: ${imageName} (ID: ${boissonId})`);
  const url = getImageUrl(imageName);
  console.log('URL tentée:', url);
  
  // Vérifier si l'image existe
  fetch(url, { method: 'HEAD' })
    .then(response => {
      console.log(`Statut de l'image ${imageName}:`, response.status);
      if (!response.ok) {
        console.error(`Image non trouvée: ${url}`);
      }
    })
    .catch(error => {
      console.error(`Erreur lors de la vérification de l'image ${imageName}:`, error);
    });

  setImgError(prev => ({
    ...prev,
    [boissonId]: true
  }));
};

useEffect(() => {
  if (boissons.length > 0) {
    console.log('Images des boissons:', boissons.map(b => ({
      nom: b.nom,
      image: b.image,
      url: getImageUrl(b.image)
    })));
  }
}, [boissons]);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }

    // Configuration axios avec les headers CORS appropriés
    const fetchBoissons = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/categories/1/produits', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // Ajouter le token si disponible
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          withCredentials: true
        });
        
        console.log('Boissons catégorie 1:', response.data);
        setBoissons(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        
        // Gestion d'erreur plus détaillée
        if (error.response) {
          // Erreur de réponse du serveur
          setError(`Erreur ${error.response.status}: ${error.response.data.message || 'Impossible de charger les boissons.'}`);
        } else if (error.request) {
          // Erreur de réseau
          setError('Erreur de connexion au serveur. Vérifiez que le serveur est en marche.');
        } else {
          // Autre erreur
          setError('Une erreur inattendue s\'est produite.');
        }
        setLoading(false);
      }
    };

    fetchBoissons();
  }, []);

  // Fonction pour gérer le clic sur le bouton "commander"
  const handleCommandeClick = (e, boisson) => {
    e.preventDefault();
    
    if (isAuthenticated) {
      // Si l'utilisateur est connecté, rediriger vers la page de commande
      // Optionnel: passer les données du produit sélectionné
      navigate('/commande', { state: { selectedProduct: boisson } });
    } else {
      // Si l'utilisateur n'est pas connecté, vérifier s'il a un compte
      const hasAccount = window.confirm(
        "Vous devez être connecté pour commander.\n\n" +
        "Cliquez sur 'OK' si vous avez déjà un compte (redirection vers connexion)\n" +
        "Cliquez sur 'Annuler' si vous n'avez pas de compte (redirection vers inscription)"
      );
      
      if (hasAccount) {
        // Rediriger vers la page de connexion
        navigate('/login', { state: { redirectTo: '/commande', selectedProduct: boisson } });
      } else {
        // Rediriger vers la page d'inscription
        navigate('/register', { state: { redirectTo: '/commande', selectedProduct: boisson } });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amber-600"></div>
        <p className="ml-4 text-lg font-serif italic text-amber-800">Préparation de nos boissons...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 mt-20">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg">
          <p className="text-red-700 font-medium font-serif">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-100px)] bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Image de gauche */}
      <div className="md:w-1/3 relative">
        <div className="hidden md:block sticky top-[80px] self-start h-[calc(100vh-100px)] relative">
          <img
            src={SacherCafe}
            alt="Présentation de nos boissons"
            className="w-full h-full object-cover shadow-xl"
            loading="lazy"
          />
        </div>
      </div>

      {/* Section boissons */}
      <div className="md:w-2/3">
        <div className="mx-auto p-4 bg-transparent">
          <div className="text-center mt-16 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-amber-900 relative inline-block font-serif">
              Nos Boissons
              <span className="block h-1 w-16 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mt-2 rounded-full"></span>
            </h2>
            <p className="text-amber-800 mt-4 max-w-2xl mx-auto font-serif text-base italic">
              Découvrez notre sélection de boissons rafraîchissantes, préparées avec soin pour vous offrir une expérience gustative unique.
            </p>
          </div>

        {Array.isArray(boissons) && boissons.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 md:px-6 ml-28">
    {boissons.map((boisson) => (
      <div key={boisson.id} className="bg-white rounded-lg shadow-lg overflow-hidden w-96">
        {boisson.image && !imgError[boisson.id] ? (
     <div className="relative overflow-hidden group">
     <img
              src={getImageUrl(boisson.image)}
              alt={boisson.nom}
              className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-102 bg-white"
              loading="lazy"
              onError={() => handleImageError(boisson.id, boisson.image)}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ) : (
          <div className="relative overflow-hidden h-64 group bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto text-amber-600 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-amber-800 font-serif text-sm">
                {boisson.nom || 'Boisson'}
              </p>
            </div>
          </div>
        )}
        {/* Add boisson details */}
        <div className="p-4">



        <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-lg text-amber-900 font-serif">{boisson.nom}</h3>
                      {boisson.prix && (
                        <div className="text-sm font-semibold text-amber-700 bg-amber-100 px-7 py-2 rounded-full">
                          {boisson.prix} DH
                        </div>
                      )}</div>
                      <div className="h-px w-full bg-gradient-to-r from-amber-200 to-amber-400 mb-2"></div>
                      <br/>
                      <br/>


          <p className="text-sm text-amber-800 italic font-serif line-clamp-3">
                        {boisson.description}</p>
          <button
            onClick={(e) => handleCommandeClick(e, boisson)}
            className="mt-2 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
          >
            Commander
          </button>
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="text-center text-amber-800 py-8">
    Aucune boisson disponible pour le moment.
  </div>
)}
        </div>
      </div>
    </div>
  );
}

export default Boisson;