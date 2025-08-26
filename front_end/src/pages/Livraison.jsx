import React from 'react';
import { Truck, Clock, MapPin, Shield, Star, ArrowRight, CheckCircle, Package, Users, Phone } from 'lucide-react';

const Livraison = () => {
  const handleCommanderClick = () => {
    // Redirection vers votre page de commande existante
    window.location.href = '/passerCommande';
  };

  const handleContactClick = () => {
    // Redirection vers la page de contact
    window.location.href = '/contact';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-800 via-orange-600 to-amber-700">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Livraison Express
            </h1>
            <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
              Commandez maintenant et recevez vos cafés frais directement chez vous
            </p>
            <button
              onClick={handleCommanderClick}
              className="inline-flex items-center px-8 py-4 bg-white text-amber-700 font-bold text-lg rounded-full hover:bg-orange-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Package className="mr-3 h-6 w-6" />
              Commander Maintenant
              <ArrowRight className="ml-3 h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Images de Livraison Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Notre Service de Livraison
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Image 1 - Livreur avec véhicule */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="aspect-[4/3] bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative text-center">
                  <Truck className="h-20 w-20 text-white mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Livraison Rapide</h3>
                  <p className="text-orange-100 px-4">Nos livreurs professionnels à votre service</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <button
                  onClick={handleCommanderClick}
                  className="w-full m-4 bg-white text-amber-700 font-semibold py-3 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  Commander Maintenant
                </button>
              </div>
            </div>

            {/* Image 2 - Livraison à domicile */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="aspect-[4/3] bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative text-center">
                  <MapPin className="h-20 w-20 text-white mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">À Votre Porte</h3>
                  <p className="text-orange-100 px-4">Livraison directement chez vous</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <button
                  onClick={handleCommanderClick}
                  className="w-full m-4 bg-white text-orange-600 font-semibold py-3 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  Commander Maintenant
                </button>
              </div>
            </div>

            {/* Image 3 - Livraison express */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="aspect-[4/3] bg-gradient-to-br from-amber-700 to-orange-800 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative text-center">
                  <Clock className="h-20 w-20 text-white mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">24-48H</h3>
                  <p className="text-orange-100 px-4">Délai de livraison garanti</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <button
                  onClick={handleCommanderClick}
                  className="w-full m-4 bg-white text-amber-700 font-semibold py-3 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  Commander Maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avantages Section */}
      <div className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Pourquoi Choisir Notre Livraison ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                <Shield className="h-10 w-10 text-amber-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sécurisé</h3>
              <p className="text-gray-600">Vos produits arrivent en parfait état</p>
            </div>

            <div className="text-center group">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <Clock className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ponctuel</h3>
              <p className="text-gray-600">Respect des délais de livraison</p>
            </div>

            <div className="text-center group">
              <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                <Users className="h-10 w-10 text-amber-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professionnel</h3>
              <p className="text-gray-600">Équipe de livreurs expérimentés</p>
            </div>

            <div className="text-center group">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <Phone className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Support</h3>
              <p className="text-gray-600">Service client disponible 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Témoignages avec images */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Ce Que Disent Nos Clients
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-amber-700" />
              </div>
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Service de livraison exceptionnel ! Mes cafés arrivent toujours à temps et avec un arôme parfait."
              </p>
              <p className="font-semibold text-gray-900">- Sarah M.</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-orange-600" />
              </div>
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Les livreurs sont très professionnels et respectent parfaitement les horaires convenus."
              </p>
              <p className="font-semibold text-gray-900">- Ahmed K.</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-amber-700" />
              </div>
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Livraison rapide et soigneuse. Je recommande vivement ce service !"
              </p>
              <p className="font-semibold text-gray-900">- Fatima L.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Final */}
      <div className="py-20 bg-gradient-to-r from-amber-700 to-orange-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à Commander ?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Profitez de notre service de livraison express et recevez vos cafés frais en 24-48h
          </p>
          
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <button
              onClick={handleCommanderClick}
              className="w-full md:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-amber-700 font-bold text-lg rounded-full hover:bg-orange-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Package className="mr-3 h-6 w-6" />
              Commencer Ma Commande
              <ArrowRight className="ml-3 h-6 w-6" />
            </button>
            
            <button className="w-full md:w-auto inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white hover:text-amber-700 transition-all duration-300" onClick={handleContactClick}>
              <Phone className="mr-3 h-6 w-6" />
              Nous Contacter
            </button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">24-48H</div>
              <div className="text-orange-100">Délai de livraison</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">GRATUITE</div>
              <div className="text-orange-100">Livraison offerte</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-orange-100">Support client</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
     
    </div>
  );
};

export default Livraison;