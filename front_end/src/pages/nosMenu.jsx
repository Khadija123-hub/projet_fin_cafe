import React from 'react';
import { useNavigate } from 'react-router-dom';
import cafeCategory from '../../images/cafeICategory.png';
import SacherCafe from '../../images/SacherCafe.png';
import boissonCtegory from '../../images/boissonCtegory.jpg';

export default function NosMenu() {
  const navigate = useNavigate();

  const handleCategoryClick = (id) => {
    if(id===1){
      navigate(`/categories/1`)
    }
    if(id===2){
      navigate(`/categories/2`)
    }
   // navigate(`/categories/${id}`); 
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-100px)] bg-gray-50">
      <div className="hidden md:block md:w-1/3 sticky top-[80px] self-start h-[calc(100vh-100px)]">
        <img
          src={cafeCategory}
          alt="Présentation de nos produits café"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-2/3 p-6 md:p-8 lg:p-12 overflow-y-auto">
        <section className="max-w-3xl mx-auto">
          <div className="text-center mt-10 md:mt-20 lg:mt-32">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-coffee-900 mb-6">
              Découvrez l'essence du café
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              À travers notre sélection de grains soigneusement choisis et de matières premières de qualité.
            </p>
          </div>
        </section>

        <section className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-semibold text-coffee-800 mb-8 text-center">
            Nos Sélections Exclusives
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col cursor-pointer"
              onClick={() => handleCategoryClick(1)}
            >
              <div className="relative h-64 md:h-72 overflow-hidden">
                <img
                  src={boissonCtegory}
                  alt="Nos boissons"
                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-lg font-bold text-coffee-900 mb-2">Boissons</h3>
                <p className="text-gray-600">Découvrez notre sélection de boissons exclusives.</p>
              </div>
            </div>

            <div
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col cursor-pointer"
              onClick={() => handleCategoryClick(2)}
            >
              <div className="relative h-64 md:h-72 overflow-hidden">
                <img
                  src={SacherCafe}
                  alt="Nos matières premières"
                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-lg font-bold text-coffee-900 mb-2">Matières Premières</h3>
                <p className="text-gray-600">Découvrez nos matières premières de qualité.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}