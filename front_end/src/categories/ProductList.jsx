import React from 'react';

function ProductList({ items, title }) {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 shadow-md">
            {item.image && (
              <div className="mb-3">
                <img 
                  src={`http://localhost:8000/${item.image}`}
                  alt={item.nom} 
                  className="w-full h-48 object-cover rounded"
                  onError={(e) => {
                    console.error(`Error loading image: ${item.image}`);
                    e.target.src = '/placeholder.jpg';
                  }}
                />
              </div>
            )}
            <h3 className="font-bold text-lg">{item.nom}</h3>
            <p className="text-gray-700 mb-2">{item.description}</p>
            <p className="text-blue-600 font-semibold">{item.prix} DH</p>
            <p className={item.stock > 0 ? "text-green-600" : "text-red-600"}>
              {item.stock > 0 ? `En stock: ${item.stock}` : 'Rupture de stock'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;