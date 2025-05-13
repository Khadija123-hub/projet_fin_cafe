import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Boisson() {
  const [boissons, setBoissons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/categories/1/produits')
      .then((response) => {
        console.log('Boissons catégorie 1:', response.data);
        setBoissons(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur:', error);
        setError('Impossible de charger les boissons.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement des boissons...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Liste des boissons</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boissons.map((boisson) => (
          <div key={boisson.id} className="border rounded-lg p-4 shadow-md">
            {boisson.image && (
              <div className="mb-3">
                <img 
                  src={boisson.image} 
                  alt={boisson.nom} 
                  className="w-full h-48 object-cover rounded"
                />
              </div>
            )}
            <h3 className="font-bold text-lg">{boisson.nom}</h3>
            <p className="text-gray-700 mb-2">{boisson.description}</p>
            <p className="text-blue-600 font-semibold">{boisson.prix} DH</p>
            <p className={boisson.stock > 0 ? "text-green-600" : "text-red-600"}>
              {boisson.stock > 0 ? `En stock: ${boisson.stock}` : 'Rupture de stock'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Boisson;