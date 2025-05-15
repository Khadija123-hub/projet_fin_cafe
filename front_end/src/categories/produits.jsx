import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SacherCafe from '../../images/SacherCafe.png';

function Produits() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/categories/2/produits')
      .then((response) => {
        setArticles(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Impossible de charger les produits.');
        setLoading(false);
      });
  }, []);

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 md:px-6">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-amber-100 animate-fade-in max-w-sm mx-auto"
                >
                  {article.image && (
                    <div className="relative overflow-hidden h-72">
                      <img
                        src={article.image}
                        alt={article.nom}
                        className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x200/FFEDD5/7C2D12?text=Produit';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-lg text-amber-900 font-serif">{article.nom}</h3>
                      {article.prix && (
                        <span className="text-sm font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                          {article.prix} MAD
                        </span>
                      )}
                    </div>
                    <div className="h-px w-full bg-gradient-to-r from-amber-200 to-amber-400 mb-2"></div>
                    {article.description && (
                      <p className="text-sm text-amber-800 italic font-serif line-clamp-3">
                        {article.description}
                      </p>
                    )}
                    <button className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-full font-semibold transition-all duration-300">
                      Voir plus
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