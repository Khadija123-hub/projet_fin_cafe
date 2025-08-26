import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SacherCafe from '../../images/SacherCafe.png';
import { Link, useNavigate } from 'react-router-dom';

function Produits() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [imgError, setImgError] = useState({});
  const [imageLoading, setImageLoading] = useState({});
  

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

const handleImageError = (articleId, imageName) => {
  console.log(`Erreur de chargement pour l'image: ${imageName} (ID: ${articleId})`);
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
    [articleId]: true
  }));
  
  setImageLoading(prev => ({
    ...prev,
    [articleId]: false
  }));
};

const handleImageLoad = (articleId) => {
  setImageLoading(prev => ({
    ...prev,
    [articleId]: false
  }));
};

const handleImageStart = (articleId) => {
  setImageLoading(prev => ({
    ...prev,
    [articleId]: true
  }));
};

useEffect(() => {
  if (articles.length > 0) {
    console.log('Images des produits:', articles.map(a => ({
      nom: a.nom,
      image: a.image,
      url: getImageUrl(a.image)
    })));
  }
}, [articles]);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }

    // Configuration axios avec les headers CORS appropriés
    const fetchProduits = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/categories/2/produits', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // Ajouter le token si disponible
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          withCredentials: true
        });
        
        console.log('Produits catégorie 2:', response.data);
        setArticles(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        
        // Gestion d'erreur plus détaillée
        if (error.response) {
          // Erreur de réponse du serveur
          setError(`Erreur ${error.response.status}: ${error.response.data.message || 'Impossible de charger les produits.'}`);
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

    fetchProduits();
  }, []);

  // Fonction pour gérer le clic sur le bouton "commander"
  const handleCommandeClick = (e, article) => {
    e.preventDefault();
    
    if (isAuthenticated) {
      // Si l'utilisateur est connecté, rediriger vers la page de commande
      // Optionnel: passer les données du produit sélectionné
      navigate('/commande', { state: { selectedProduct: article } });
    } else {
      // Si l'utilisateur n'est pas connecté, vérifier s'il a un compte
      const hasAccount = window.confirm(
        "Vous devez être connecté pour commander.\n\n" +
        "Cliquez sur 'OK' si vous avez déjà un compte (redirection vers connexion)\n" +
        "Cliquez sur 'Annuler' si vous n'avez pas de compte (redirection vers inscription)"
      );
      
      if (hasAccount) {
        // Rediriger vers la page de connexion
        navigate('/login', { state: { redirectTo: '/commande', selectedProduct: article } });
      } else {
        // Rediriger vers la page d'inscription
        navigate('/register', { state: { redirectTo: '/commande', selectedProduct: article } });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amber-600"></div>
        <p className="ml-4 text-lg font-serif italic text-amber-800">Préparation de notre café...</p>
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
            alt="Présentation de nos produits café"
            className="w-full h-full object-cover shadow-xl"
            loading="lazy"
          />
        </div>
      </div>

      {/* Section produits */}
      <div className="md:w-2/3">
        <div className="mx-auto p-4 bg-transparent">
          <div className="text-center mt-16 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-amber-900 relative inline-block font-serif">
              Nos Créations
              <span className="block h-1 w-16 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mt-2 rounded-full"></span>
            </h2>
            <p className="text-amber-800 mt-4 max-w-2xl mx-auto font-serif text-base italic">
              Découvrez notre sélection de produits faits maison avec des ingrédients soigneusement sélectionnés pour éveiller vos sens.
            </p>
          </div>

          {Array.isArray(articles) && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 md:px-6">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Container d'image avec dimensions fixes */}
                  <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100">
                    {article.image && !imgError[article.id] ? (
                      <>
                        {/* Indicateur de chargement */}
                        {imageLoading[article.id] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-amber-50">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600"></div>
                          </div>
                        )}
                        
                        <img
                          src={getImageUrl(article.image)}
                          alt={article.nom}
                          className={`w-full h-full object-cover transition-all duration-500 hover:scale-105 ${
                            imageLoading[article.id] ? 'opacity-0' : 'opacity-100'
                          }`}
                          loading="lazy"
                          onLoadStart={() => handleImageStart(article.id)}
                          onLoad={() => handleImageLoad(article.id)}
                          onError={() => handleImageError(article.id, article.image)}
                          style={{
                            imageRendering: 'crisp-edges',
                            WebkitImageRendering: 'crisp-edges'
                          }}
                        />
                        
                    
                      </>
                    ) : (
                      // Placeholder pour image manquante
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <svg
                            className="w-12 h-12 mx-auto text-amber-400 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-amber-600 font-serif text-xs">
                            Image non disponible
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Contenu de la carte */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-amber-900 font-serif leading-tight flex-1 mr-2">
                        {article.nom}
                      </h3>
                      {article.prix && (
                        <span className="text-sm font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full whitespace-nowrap">
                          {article.prix} MAD
                        </span>
                      )}
                    </div>
                    
                    <div className="h-px w-full bg-gradient-to-r from-amber-200 to-amber-400 mb-3"></div>
                    
                    {article.description && (
                      <p className="text-sm text-amber-800 italic font-serif line-clamp-2 mb-4 leading-relaxed">
                        {article.description}
                      </p>
                    )}
                    
                    <button
                      onClick={(e) => handleCommandeClick(e, article)}
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-2.5 px-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
                    >
                      Commander
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-lg shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-amber-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xl text-amber-800 font-medium font-serif">Aucun produit disponible pour le moment.</p>
              <p className="text-amber-700 mt-2 italic text-sm">Nos artisans préparent de nouvelles délices. Revenez bientôt.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Produits;