import React, { useState, useEffect } from 'react';

function CaféSanté({ darkMode }) {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bienfaits');
  const [showModal, setShowModal] = useState(false);
  const [selectedBienfait, setSelectedBienfait] = useState(null);
   const [email, setEmail] = useState('');
    const [question, setQuestion] = useState('');


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
 const sendToWhatsApp = () => {
  if (!question.trim()) {
    alert('Veuillez saisir votre question');
    return { success: false, error: "Question vide" };
  }

  const currentDate = new Date().toLocaleString('fr-FR');
  
  const message = `☕ *Question Café Santé* (${currentDate})
  
━━━━━━━━━━━━━━━
📧 *Contact:* ${email || 'Non précisé'}
💬 *Question:*
${question}
━━━━━━━━━━━━━━━
_Envoyé via l'application Café & Santé_`;

  const phoneNumber = '212611689213'; // +212 pour le Maroc
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  // Alternative pour ouvrir dans un nouvel onglet
  const newWindow = window.open(whatsappUrl, '_blank');
  if (!newWindow) {
    alert("Veuillez autoriser les pop-ups pour cette action");
    return { success: false, error: "Popup bloqué" };
  }
  
  return { success: true };
};
  const bienfaits = [
    {
      id: 1,
      titre: "Un cocktail d'antioxydants",
      description: "Le café est l'une des sources les plus riches en antioxydants de notre alimentation moderne. Ces composés précieux combattent les radicaux libres et protègent nos cellules contre le vieillissement prématuré.",
      details: [
        "Acides chlorogéniques : ils aident à réduire l'inflammation chronique",
        "Mélanoidines : formées pendant la torréfaction, elles possèdent des propriétés antibactériennes",
        "Caféine : au-delà de son effet stimulant, elle contribue au potentiel antioxydant global"
      ],
      image: "/images/img1cafe&sante.jpg"
    },
    {
      id: 2,
      titre: "Amélioration des performances cognitives",
      description: "La caféine, principal actif du café, est reconnue pour ses effets bénéfiques sur le cerveau.",
      details: [
        "Augmentation de la vigilance et de la concentration",
        "Amélioration de l'humeur et réduction du risque de dépression",
        "Protection potentielle contre les maladies neurodégénératives comme Alzheimer et Parkinson"
      ],
      image: "/images/img2Cafe&Sante.jpg"
    },
    {
      id: 3,
      titre: "Métabolisme et gestion du poids",
      description: "Une consommation modérée de café peut contribuer à votre métabolisme et à la gestion de votre poids.",
      details: [
        "Stimuler le métabolisme basal",
        "Améliorer les performances sportives grâce à la libération d'acides gras dans le sang",
        "Réduire le risque de diabète de type 2 (jusqu'à 30% selon certaines études)"
      ],
      image: "/images/img3Cafe&Sante.jpg"
    },
    {
      id: 4,
      titre: "Santé hépatique",
      description: "Votre foie apprécie aussi une bonne tasse de café. Des études ont montré plusieurs effets bénéfiques.",
      details: [
        "Réduction du risque de cirrhose hépatique",
        "Protection contre certaines maladies du foie",
        "Diminution des enzymes hépatiques associées aux inflammations"
      ],
      image: "/images/Image5sante.jpg"
    },
    {
      id: 5,
      titre: "Santé cardiovasculaire",
      description: "Contrairement aux anciennes croyances, une consommation modérée de café peut avoir des effets bénéfiques sur le système cardiovasculaire.",
      details: [
        "Amélioration de la circulation sanguine",
        "Réduction légère du risque de maladies cardiovasculaires",
        "Propriétés anti-inflammatoires bénéfiques pour les vaisseaux sanguins"
      ],
      image: "/images/4imagesSante.jpg"
    }
  ];

  const conseilsConsommation = {
    titre: "La juste mesure",
    description: "Pour profiter pleinement des bienfaits du café sans subir ses inconvénients, suivez ces quelques conseils:",
    conseils: [
      "Limitez votre consommation à 3-4 tasses par jour (environ 400mg de caféine)",
      "Privilégiez une consommation avant 14h pour ne pas perturber votre sommeil",
      "Évitez de surcharger votre café en sucre ou en crème",
      "Optez pour du café de qualité, idéalement issu de l'agriculture biologique",
      "Alternez entre café avec et sans caféine si vous êtes sensible"
    ]
  };

 

  const faqs = [
    {
      question: "Le café est-il vraiment bon pour la santé ?",
      reponse: "Oui, lorsqu'il est consommé avec modération (3-4 tasses par jour), le café présente de nombreux bénéfices pour la santé grâce à ses antioxydants et autres composés bioactifs. Cependant, les effets peuvent varier selon les individus."
    },
    {
      question: "Le café déshydrate-t-il l'organisme ?",
      reponse: "Contrairement à une idée reçue, une consommation modérée de café ne provoque pas de déshydratation significative. Bien que la caféine ait un léger effet diurétique, l'eau contenue dans le café compense cet effet."
    },
    {
      question: "Vaut-il mieux boire du café avec ou sans caféine ?",
      reponse: "Les deux types de café ont leurs avantages. Le café avec caféine offre les bienfaits stimulants et métaboliques, tandis que le décaféiné conserve la plupart des antioxydants sans les effets de la caféine. Alterner les deux peut être une bonne stratégie."
    },
    {
      question: "Quel est le meilleur moment pour boire du café ?",
      reponse: "Le matin jusqu'en début d'après-midi (avant 14h) est généralement recommandé pour éviter les perturbations du sommeil. Pour optimiser l'effet de la caféine, attendez 1-2 heures après le réveil, car le cortisol naturel est déjà élevé au réveil."
    }
  ];

  const funFact = "Le café contient plus de 1000 composés bioactifs différents, dont beaucoup restent encore à étudier. C'est cette richesse et cette complexité qui expliquent ses nombreux effets bénéfiques sur la santé.";

  const openModal = (bienfait) => {
    setSelectedBienfait(bienfait);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${darkMode ? 'border-amber-400' : 'border-amber-700'}`}></div>
        <p className={`ml-4 text-lg font-sans ${darkMode ? 'text-amber-400' : 'text-amber-800'}`}>Chargement...</p>
      </div>
    );
  }

  return (
    <div className={darkMode ? 'bg-gray-900 text-amber-50 min-h-screen mt-16' : 'bg-amber-50 text-amber-950 min-h-screen mt-16'}>
      {/* Header Section */}
      <header className={`py-16 px-4 text-center ${darkMode ? 'bg-amber-950' : 'bg-amber-600'}`}>
        <div className="max-w-7xl mx-auto relative px-4">
         
          <h1 className={`text-4xl md:text-5xl font-bold font-serif ${darkMode ? 'text-amber-200' : 'text-white'}`}>Café & Santé</h1>
          <div className="flex items-center justify-center">
            
            <p className={`mt-4 max-w-2xl mx-auto text-lg font-sans ${darkMode ? 'text-amber-100' : 'text-white'} opacity-90`}>
              Découvrez comment une tasse de café peut devenir un allié pour votre bien-être quotidien.
            </p>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-amber-700'} shadow-md`}>
        <div className="max-w-7xl mx-auto">
          <nav className="flex justify-center md:justify-start space-x-1 md:space-x-4 overflow-x-auto p-2 md:px-4">
            <button 
              onClick={() => setActiveTab('bienfaits')} 
              className={`px-3 py-2 rounded-lg transition-colors duration-200 ${activeTab === 'bienfaits' 
                ? (darkMode ? 'bg-amber-800 text-amber-100' : 'bg-amber-100 text-amber-900') 
                : (darkMode ? 'text-amber-200 hover:bg-amber-700' : 'text-white hover:bg-amber-600')}`}
            >
              Bienfaits
            </button>
            <button 
              onClick={() => setActiveTab('conseils')} 
              className={`px-3 py-2 rounded-lg transition-colors duration-200 ${activeTab === 'conseils' 
                ? (darkMode ? 'bg-amber-800 text-amber-100' : 'bg-amber-100 text-amber-900') 
                : (darkMode ? 'text-amber-200 hover:bg-amber-700' : 'text-white hover:bg-amber-600')}`}
            >
              Conseils
            </button>
         
            <button 
              onClick={() => setActiveTab('faq')} 
              className={`px-3 py-2 rounded-lg transition-colors duration-200 ${activeTab === 'faq' 
                ? (darkMode ? 'bg-amber-800 text-amber-100' : 'bg-amber-100 text-amber-900') 
                : (darkMode ? 'text-amber-200 hover:bg-amber-700' : 'text-white hover:bg-amber-600')}`}
            >
              FAQ
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Bienfaits Section */}
        {activeTab === 'bienfaits' && (
          <section>
            <h2 className={`text-3xl font-bold font-serif text-center mb-8 ${darkMode ? 'text-amber-300' : 'text-amber-900'}`}>
              Les Bienfaits du Café
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bienfaits.map((bienfait) => (
                <div
                  key={bienfait.id}
                  className={`rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${darkMode ? 'bg-gray-800 shadow-amber-900/20' : 'bg-white shadow-lg'}`}
                  onClick={() => openModal(bienfait)}
                >
                  <img
                    src={bienfait.image}
                    alt={bienfait.titre}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="p-6">
                    <h3 className={`text-xl font-semibold font-serif mb-3 ${darkMode ? 'text-amber-300' : 'text-amber-900'}`}>{bienfait.titre}</h3>
                    <p className={`mb-4 ${darkMode ? 'text-amber-100' : 'text-amber-800'}`}>{bienfait.description}</p>
                    <button 
                      className={`mt-2 inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
                        darkMode ? 'bg-amber-800 text-amber-100 hover:bg-amber-700' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                    >
                      En savoir plus
                      <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

{/*recette*/}



 





            {/* Fun Fact Section */}
            <div className={`mt-16 rounded-xl p-6 flex items-start ${darkMode ? 'bg-gray-800' : 'bg-amber-100'}`}>
              <svg
                className={`w-8 h-8 mr-4 ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h4 className={`text-lg font-semibold font-serif mb-2 ${darkMode ? 'text-amber-300' : 'text-amber-900'}`}>Le saviez-vous ?</h4>
                <p className={darkMode ? 'text-amber-100' : 'text-amber-800'}>{funFact}</p>
              </div>
            </div>
          </section>
        )}

        {/* Conseils Section */}
        {activeTab === 'conseils' && (
          <section>
            <h2 className={`text-3xl font-bold font-serif text-center mb-8 ${darkMode ? 'text-amber-300' : 'text-amber-900'}`}>
              Conseils de Consommation
            </h2>
            <div className={`rounded-xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-2xl font-bold font-serif mb-4 ${darkMode ? 'text-amber-300' : 'text-amber-900'}`}>{conseilsConsommation.titre}</h3>
              <p className={`mb-6 ${darkMode ? 'text-amber-100' : 'text-amber-800'}`}>{conseilsConsommation.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {conseilsConsommation.conseils.map((conseil, index) => (
                  <div key={index} className="flex items-start">
                    <svg
                      className={`w-5 h-5 mr-3 mt-1 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className={darkMode ? 'text-amber-100' : 'text-amber-800'}>{conseil}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`mt-8 rounded-xl p-6 ${darkMode ? 'bg-amber-900/50 border-l-4 border-amber-500' : 'bg-yellow-50 border-l-4 border-yellow-500'}`}>
              <p className={darkMode ? 'text-amber-100' : 'text-amber-800'}>
                <span className="font-semibold">Remarque importante :</span> Les effets du café varient selon les individus. Les personnes souffrant d'hypertension, de problèmes cardiaques, de troubles anxieux ou d'insomnie devraient consulter un professionnel de santé concernant leur consommation de café.
              </p>
            </div>

            <div className="mt-12">
              <h3 className={`text-2xl font-bold font-serif mb-6 ${darkMode ? 'text-amber-300' : 'text-amber-900'}`}>
                Meilleur moment pour consommer du café
              </h3>
              
              <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${darkMode ? 'border-amber-700' : 'border-amber-300'}`}></div>
                  </div>
                  
                  <div className="relative flex justify-around">
                    <div className="text-center">
                      <span className={`px-3 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className={`rounded-full w-10 h-10 flex items-center justify-center ${darkMode ? 'bg-amber-700 text-amber-100' : 'bg-amber-100 text-amber-800'}`}>6h</div>
                      </span>
                      <p className={`mt-2 text-sm ${darkMode ? 'text-amber-200' : 'text-amber-700'}`}>Réveil</p>
                    </div>
                    
                    <div className="text-center">
                      <span className={`px-3 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className={`rounded-full w-10 h-10 flex items-center justify-center ${darkMode ? 'bg-amber-500 text-amber-100' : 'bg-amber-500 text-white'}`}>9h</div>
                      </span>
                      <p className={`mt-2 text-sm ${darkMode ? 'text-amber-200' : 'text-amber-700'}`}>Optimal</p>
                    </div>
                    
                    <div className="text-center">
                      <span className={`px-3 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className={`rounded-full w-10 h-10 flex items-center justify-center ${darkMode ? 'bg-amber-500 text-amber-100' : 'bg-amber-500 text-white'}`}>14h</div>
                      </span>
                      <p className={`mt-2 text-sm ${darkMode ? 'text-amber-200' : 'text-amber-700'}`}>Limite</p>
                    </div>
                    
                    <div className="text-center">
                      <span className={`px-3 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className={`rounded-full w-10 h-10 flex items-center justify-center ${darkMode ? 'bg-red-700 text-amber-100' : 'bg-red-100 text-red-800'}`}>20h</div>
                      </span>
                      <p className={`mt-2 text-sm ${darkMode ? 'text-amber-200' : 'text-amber-700'}`}>À éviter</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <p className={`text-sm ${darkMode ? 'text-amber-100' : 'text-amber-800'}`}>
                    La période idéale pour consommer du café se situe entre 9h et 14h. La consommation juste après le réveil n'est pas optimale car le cortisol est naturellement élevé à ce moment-là. Après 14h, la caféine peut perturber votre cycle de sommeil.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

       {/* FAQ Section */}
        {activeTab === 'faq' && (
          <section>
          <h2 className={`text-3xl font-bold font-serif text-center mb-8 ${darkMode ? 'text-amber-300' : 'text-amber-900'}`}>
            Questions Fréquentes
          </h2>
          
          <div className="space-y-6 mb-12">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className={`p-6 ${darkMode ? 'border-b border-gray-700' : 'border-b'}`}>
                  <h3 className={`text-xl font-medium font-serif ${darkMode ? 'text-amber-300' : 'text-amber-900'}`}>
                    {faq.question}
                  </h3>
                </div>
                <div className="p-6">
                  <p className={darkMode ? 'text-amber-100' : 'text-amber-800'}>
                    {faq.reponse}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className={`p-6 rounded-xl ${darkMode ? 'bg-amber-900/30' : 'bg-amber-50'}`}>
            <h3 className={`text-xl font-semibold font-serif mb-4 ${darkMode ? 'text-amber-300' : 'text-amber-900'}`}>
              Vous avez d'autres questions ?
            </h3>
            
            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Votre adresse email (optionnel)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-3 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-800 text-amber-100 placeholder-amber-400/60' 
                    : 'bg-white text-amber-900 placeholder-amber-500/60'
                } border ${darkMode ? 'border-gray-700' : 'border-amber-200'}`}
              />
              
              <textarea
                placeholder="Votre question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
                className={`w-full p-3 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-800 text-amber-100 placeholder-amber-400/60' 
                    : 'bg-white text-amber-900 placeholder-amber-500/60'
                } border ${darkMode ? 'border-gray-700' : 'border-amber-200'} resize-none`}
              />
              
              <button
  onClick={() => {
    const result = sendToWhatsApp();
    if (result.success) {
      setQuestion(''); // Reset le champ après envoi
    }
  }}
  className={`self-start px-8 py-3 rounded-lg font-medium ${
    darkMode 
      ? 'bg-green-600 text-white hover:bg-green-500' 
      : 'bg-green-700 text-white hover:bg-green-600'
  } transition-colors duration-200 flex items-center gap-2`}
>
  <span>📱</span>
  Envoyer via WhatsApp
</button>
            </div>
            
            <p className={`mt-4 text-sm ${darkMode ? 'text-amber-400/80' : 'text-amber-700/80'}`}>
              Votre message sera envoyé directement sur WhatsApp. Nous vous répondrons rapidement !
            </p>
          </div>
        </section>
        )}
      </main>

     

      {/* Modal */}
      {showModal && selectedBienfait && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className={`max-w-2xl w-full rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
            <div className={`p-4 flex justify-between items-center ${darkMode ? 'bg-amber-800' : 'bg-amber-600'}`}>
              <h3 className={`text-xl font-bold font-serif ${darkMode ? 'text-amber-100' : 'text-white'}`}>{selectedBienfait.titre}</h3>
              <button
                onClick={closeModal}
                className={`rounded-full p-1 ${darkMode ? 'bg-amber-700 text-amber-100 hover:bg-amber-600' : 'bg-amber-500 text-white hover:bg-amber-400'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-6">
              <img
                src={selectedBienfait.image}
                alt={selectedBienfait.titre}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <p className={`mb-6 text-lg ${darkMode ? 'text-amber-100' : 'text-amber-900'}`}>{selectedBienfait.description}</p>
              <h4 className={`text-lg font-medium mb-3 ${darkMode ? 'text-amber-300' : 'text-amber-900'}`}>En détail :</h4>
              <ul className={`space-y-4 ${darkMode ? 'text-amber-100' : 'text-amber-800'}`}>
                {selectedBienfait.details.map((detail, index) => (
                  <li key={index} className="flex items-start">
                    <svg className={`w-5 h-5 mr-3 mt-1 ${darkMode ? 'text-amber-500' : 'text-amber-600'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={closeModal}
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-amber-700 text-amber-100 hover:bg-amber-600' : 'bg-amber-600 text-white hover:bg-amber-500'} transition-colors duration-200`}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CaféSanté;