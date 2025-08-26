import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function DeveloppementDurable({ darkMode }) {
  // Animation hook for sections
  const useSectionAnimation = (threshold = 0.2) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ threshold });
    
    useEffect(() => {
      if (inView) {
        controls.start('visible');
      }
    }, [controls, inView]);
    
    return [ref, controls];
  };

  // Variants for animations
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const [heroRef, heroControls] = useSectionAnimation(0.1);
  const [cardsRef, cardsControls] = useSectionAnimation();
  const [farmersRef, farmersControls] = useSectionAnimation();
  const [testimonialsRef, testimonialsControls] = useSectionAnimation();

  // Sustainability cards data
  const sustainabilityCards = [
    {
      img: '/images/image1.jpg',
      alt: 'Sourcing durable des grains de café',
      title: 'Origine du Café',
      text: 'Nous collaborons avec des producteurs éthiques pour sourcer des grains de café cultivés avec soin, respectant la terre et les communautés.',
    },
    {
      img: '/images/image2.jpg',
      alt: 'Préparation artisanale des boissons',
      title: 'Artisanat des Boissons',
      text: 'Chaque boisson de قهوتي est préparée avec passion, mêlant tradition et créativité pour un goût authentique.',
    },
    {
      img: '/images/2.png',
      alt: 'Initiatives éco-responsables pour les boissons',
      title: 'Éco-Responsabilité',
      text: 'Gobelets réutilisables et emballages recyclables : nous réduisons notre empreinte pour un avenir durable.',
    },
  ];

  // Farmers data
  const farmers = [
    {
      img: '/images/farmer1.webp',
      alt: 'Fermier de café قهوتي',
      name: 'Amina, Éthiopie',
      description: 'Amina cultive des grains d\'arabica dans les hauts plateaux éthiopiens, en préservant des méthodes traditionnelles transmises de génération en génération.',
    },
    {
      img: '/images/farmer2.webp',
      alt: 'Fermier de café قهوتي',
      name: 'Carlos, Colombie',
      description: 'Carlos utilise des pratiques agroforestières pour cultiver des grains robustes, tout en protégeant la biodiversité de sa région.',
    },
  ];

  // Testimonials data
  const testimonials = [
    { name: 'Sophie L.', text: 'Le café de قهوتي est une expérience unique. On sent la passion dans chaque tasse !' },
    { name: 'Ahmed B.', text: `J'adore leur engagement pour l'environnement. Et le goût ? Absolument parfait.` },
    { name: 'Clara M.', text: 'Les boissons artisanales sont incroyables, et les gobelets réutilisables sont un gros plus !' },
  ];

  // Text color based on dark mode
  const textColor = darkMode ? 'text-amber-300' : 'text-amber-900';
  const textColorSecondary = darkMode ? 'text-amber-200' : 'text-amber-800';
  const bgColor = darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-amber-50 to-orange-100';

  const cardBgColor = darkMode ? 'bg-gray-800/80' : 'bg-white/80';
  const sectionBgColor = darkMode ? 'bg-gray-800' : 'bg-amber-100';
  const ctaBgColor = darkMode ? 'bg-gradient-to-r from-amber-900 to-amber-800' : 'bg-gradient-to-r from-amber-800 to-amber-700';
  const footerBgColor = darkMode ? 'bg-gray-900' : 'bg-amber-900';
  const buttonStyle = darkMode 
    ? 'bg-amber-300 text-amber-900 hover:bg-amber-400' 
    : 'bg-amber-600 text-white hover:bg-amber-700';

  return (
    <div className={`min-h-screen ${bgColor}`}>
      {/* Navigation Bar */}
     

      {/* Hero Section with Parallax */}
      <motion.section
        ref={heroRef}
        animate={heroControls}
        initial="hidden"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 1 } } }}
        className="relative h-[80vh] flex items-center justify-center overflow-hidden"
        aria-label="Section d'introduction قهوتي"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
         
        >
          <img
            src="/images/image_durable.jpg"
            alt="Grains de café de قهوتي"
            className="w-full h-full object-cover opacity-90"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/1200x800/FFEDD5/7C2D12?text=قهوتي';
            }}
          />
        </div>
    
        <div className="relative z-10 text-center px-6">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-6 font-serif tracking-tight drop-shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            قهوتي : Le Goût de la Durabilité
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-amber-100 max-w-3xl mx-auto italic font-serif"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            كل رشفة تحكي قصة - Chaque gorgée raconte une histoire de café artisanal, respectueux de la terre et des communautés.
          </motion.p>
        </div>
      </motion.section>

      {/* Engagement Section */}
      <section 
        className="max-w-5xl mx-auto py-16 px-4 md:px-6 text-center"
        aria-labelledby="section-engagement"
      >
        <h2 
          id="section-engagement"
          className={`text-3xl md:text-4xl font-bold ${textColor} mb-4 font-serif relative inline-block`}
        >
          Notre Engagement
          <span className="block h-1 w-16 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mt-2 rounded-full"></span>
        </h2>
        <p className={`max-w-2xl mx-auto italic text-lg md:text-xl ${textColorSecondary} font-serif`}>
          Chez قهوتي, nous célébrons le café comme un art, en sourçant les meilleurs grains et en créant des boissons qui honorent la tradition et l'environnement.
        </p>
      </section>

      {/* Sustainability Cards */}
      <motion.section
        ref={cardsRef}
        animate={cardsControls}
        initial="hidden"
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        className="max-w-6xl mx-auto py-16 px-4 md:px-6"
        aria-labelledby="section-sustainability"
      >
        <h2 id="section-sustainability" className="sr-only">Nos Initiatives Durables</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sustainabilityCards.map((card, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`${cardBgColor} backdrop-blur-sm rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-100 mx-auto`}
            >
              <img
                src={card.img}
                alt={card.alt}
                className="w-full h-60 object-cover rounded-md mb-4"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/300x200/FFEDD5/7C2D12?text=${card.title}`;
                }}
              />
              <h3 className={`text-lg font-bold ${textColor} mb-2 font-serif`}>{card.title}</h3>
              <p className={`text-sm italic ${textColorSecondary} font-serif`}>{card.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

   
   

      {/* Testimonials Section */}
      <motion.section
        ref={testimonialsRef}
        animate={testimonialsControls}
        initial="hidden"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 1 } } }}
        className="max-w-6xl mx-auto py-16 px-4 md:px-6"
        aria-labelledby="section-testimonials"
      >
        <h2 
          id="section-testimonials"
          className={`text-3xl md:text-4xl font-bold ${textColor} mb-8 font-serif text-center`}
        >
          Ce Que Nos Clients Disent
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`${cardBgColor} backdrop-blur-sm rounded-lg shadow-md p-6 text-center border border-amber-100`}
            >
              <p className={`text-sm italic ${textColorSecondary} font-serif mb-4`}>"{testimonial.text}"</p>
              <p className={`text-lg font-bold ${textColor} font-serif`}>{testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Call to Action */}
      <section 
        className={`py-16 text-center ${ctaBgColor}`}
        aria-labelledby="section-cta"
      >
        <motion.h2
          id="section-cta"
          className="text-2xl md:text-3xl font-bold text-white mb-4 font-serif"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Savourez قهوتي, Vivez Durable
        </motion.h2>
        <motion.p
          className="text-amber-100 max-w-2xl mx-auto mb-6 text-sm md:text-base font-serif"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Découvrez nos boissons artisanales et contribuez à un monde plus vert. Commandez maintenant et goûtez la différence.
        </motion.p>
        <Link to="/commande">
          <motion.button
            className={`py-2 px-6 rounded-full font-semibold transition-all ${buttonStyle}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Commandez les boissons de قهوتي"
          >
            Commandez Vos Boissons
          </motion.button>
        </Link>
      </section>

      {/* Footer */}
      <footer className={`py-8 text-center ${footerBgColor} text-amber-100`}>
        <p className="text-sm font-serif">© 2025 قهوتي. Tous droits réservés.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <a href="/privacy" className="text-amber-200 hover:text-amber-400 transition">Politique de confidentialité</a>
          <a href="/terms" className="text-amber-200 hover:text-amber-400 transition">Conditions d'utilisation</a>
          <a href="/contact" className="text-amber-200 hover:text-amber-400 transition">Contact</a>
        </div>
      </footer>
    </div>
  );
}