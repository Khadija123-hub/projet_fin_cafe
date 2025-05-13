import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Produits() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/categories/2/produits')
      .then((response) => {
        console.log('Données reçues de l\'API:', response.data);
        setArticles(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des articles:', error);
        setError('Impossible de charger les produits.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Chargement des produits...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Liste des produits</h2>
      
      {Array.isArray(articles) && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <div key={article.id} className="border rounded-lg p-4 shadow-md">
              {article.image && (
                <div className="mb-3">
                  <img 
                    src={article.image} 
                    alt={article.nom} 
                    className="w-full h-48 object-cover rounded"
                  />
                </div>
              )}
              <h3 className="font-bold text-lg">{article.nom}</h3>
              <p className="text-gray-700 mb-2">{article.description}</p>
              <p className="text-blue-600 font-semibold">{article.prix} DH</p>
              {article.stock > 0 ? (
                <p className="text-green-600">En stock: {article.stock}</p>
              ) : (
                <p className="text-red-600">Rupture de stock</p>
              )}
              {article.categorie_nom && (
                <p className="text-gray-500 text-sm mt-2">Catégorie: {article.categorie_nom}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Aucun produit disponible.</p>
      )}
    </div>
  );
}

export default Produits;