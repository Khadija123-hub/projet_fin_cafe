import React, { useState, useEffect, useRef } from 'react';
import { motion,AnimatePresence } from 'framer-motion';
import { ArrowRight, Coffee, Star, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';



import histoire1 from '../../images/histoire 1.jpg';
import histoire2 from '../../images/histoire 2.jpg';
import histoire3 from '../../images/histoire 3.jpg';


import ImgCat from '../../images/cafeICategory.png';
import ImgLivraison from '../../images/livraison.jpg'




import Video1 from '../videos/cafe-background.mp4';
import Video2 from '../videos/video2.mp4';
import Video3 from '../videos/video3.mp4'; 




import FideliteCart from '../../images/fidélitéCart.png';


const videoSources = [
  { src: Video1, alt: "Café en arrière-plan" },
  { src: Video2, alt: "Préparation du café" },
  { src: Video3, alt: "Ambiance du salon de café" }
];


const storyImages = [histoire1 , histoire2 , histoire3 ];

const StoryImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayTimeoutRef = useRef(null);

  // Configurer la rotation automatique
  useEffect(() => {
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }
    
    autoPlayTimeoutRef.current = setTimeout(() => {
      goToNextImage();
    }, 5000);
    
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, [currentIndex]);

  // Fonction pour passer à l'image suivante
  const goToNextImage = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const nextIndex = (currentIndex + 1) % storyImages.length;
    
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setIsTransitioning(false);
    }, 500);
  };

  // Fonction pour aller à l'image précédente
  const goToPrevImage = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const prevIndex = (currentIndex - 1 + storyImages.length) % storyImages.length;
    
    setTimeout(() => {
      setCurrentIndex(prevIndex);
      setIsTransitioning(false);
    }, 500);
  };

  // Fonction pour aller à une image spécifique
  const goToImage = (index) => {
    if (isTransitioning || index === currentIndex) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 500);
  };

  const imageVariants = {
    enter: { 
      opacity: 0,
      x: 50
    },
    center: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: {
        duration: 0.5,
        ease: "easeIn"
      }
    }
  };

  return (
    <div className="relative w-full h-full rounded-lg shadow-xl overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={storyImages[currentIndex]}
          alt={`Notre histoire de café ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
        />
      </AnimatePresence>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
        {storyImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToImage(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex 
                ? 'w-6 bg-orange-400' 
                : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Aller à l'image ${idx + 1}`}
          ></button>
        ))}
      </div>
      
      <button 
        onClick={goToPrevImage}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-400 transition-colors p-2 bg-black/30 rounded-full z-10"
        aria-label="Image précédente"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={goToNextImage}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-400 transition-colors p-2 bg-black/30 rounded-full z-10"
        aria-label="Image suivante"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

const VideoCarousel = ({ scrollY }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef([]);
  const [progress, setProgress] = useState(0);
  const autoPlayTimeoutRef = useRef(null);

  // Initialiser les références pour chaque vidéo
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videoSources.length);
  }, []);

  // Mettre à jour la barre de progression
  useEffect(() => {
    const video = videoRefs.current[currentVideoIndex];
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const interval = setInterval(updateProgress, 100);
    video.addEventListener('timeupdate', updateProgress);

    return () => {
      clearInterval(interval);
      video?.removeEventListener('timeupdate', updateProgress);
    };
  }, [currentVideoIndex]);

  // Configurer la rotation automatique
  useEffect(() => {
    // Annuler tout timeout précédent
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }
    
    // Configurer un nouveau timeout pour la vidéo actuelle
    autoPlayTimeoutRef.current = setTimeout(() => {
      goToNextVideo();
    }, 15000); // Change toutes les 15 secondes
    
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, [currentVideoIndex]);

  // Fonction pour passer à la vidéo suivante
  const goToNextVideo = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const nextIndex = (currentVideoIndex + 1) % videoSources.length;
    
    // Préparer la vidéo suivante
    if (videoRefs.current[nextIndex]) {
      videoRefs.current[nextIndex].currentTime = 0;
    }
    
    setProgress(0);
    
    setTimeout(() => {
      setCurrentVideoIndex(nextIndex);
      setIsTransitioning(false);
    }, 800); // Durée de transition plus courte pour une meilleure réactivité
  };

  // Fonction pour aller à la vidéo précédente
  const goToPrevVideo = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const prevIndex = (currentVideoIndex - 1 + videoSources.length) % videoSources.length;
    
    if (videoRefs.current[prevIndex]) {
      videoRefs.current[prevIndex].currentTime = 0;
    }
    
    setProgress(0);
    
    setTimeout(() => {
      setCurrentVideoIndex(prevIndex);
      setIsTransitioning(false);
    }, 800);
  };

  // Fonction pour aller à une vidéo spécifique
  const goToVideo = (index) => {
    if (isTransitioning || index === currentVideoIndex) return;
    
    setIsTransitioning(true);
    
    if (videoRefs.current[index]) {
      videoRefs.current[index].currentTime = 0;
    }
    
    setProgress(0);
    
    setTimeout(() => {
      setCurrentVideoIndex(index);
      setIsTransitioning(false);
    }, 800);
  };

  const videoVariants = {
    enter: (direction) => ({
      y: direction > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    center: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    exit: (direction) => ({
      y: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: "easeIn"
      }
    })
  };

  // Détermine la direction pour l'animation
  const getDirection = (newIndex) => {
    if (newIndex === currentVideoIndex) return 0;
    
    // Si on passe de la dernière à la première vidéo
    if (currentVideoIndex === videoSources.length - 1 && newIndex === 0) {
      return 1;  // comme si on allait vers le haut
    }
    
    // Si on passe de la première à la dernière vidéo
    if (currentVideoIndex === 0 && newIndex === videoSources.length - 1) {
      return -1; // comme si on allait vers le bas
    }
    
    // Direction normale
    return newIndex > currentVideoIndex ? 1 : -1;
  };

  // Fonction pour gérer le clic sur la vidéo
  const handleVideoClick = (e) => {
    // Empêcher les clics sur les contrôles de navigation de déclencher cette fonction
    if (e.target.closest('.video-controls')) return;
    
    // Passer à la vidéo suivante
    goToNextVideo();
  };

  return (
    <div 
      className="absolute inset-0 z-0 overflow-hidden cursor-pointer" 
      onClick={handleVideoClick} // Cliquer n'importe où sur le carrousel pour passer à la vidéo suivante
    >
      <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
      
      <AnimatePresence initial={false} custom={getDirection()}>
        <motion.div
          key={currentVideoIndex}
          custom={getDirection()}
          variants={videoVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <video
            ref={el => videoRefs.current[currentVideoIndex] = el}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            style={{ transform: `translateY(${scrollY * 0.2}px)` }}
          >
            <source src={videoSources[currentVideoIndex].src} type="video/mp4" />
            Votre navigateur ne supporte pas les vidéos HTML5.
          </video>
        </motion.div>
      </AnimatePresence>

      {/* Commandes du carrousel avec classe pour éviter la propagation des clics */}
      <div 
        className="absolute bottom-8 left-0 right-0 z-20 flex justify-center video-controls"
        onClick={(e) => e.stopPropagation()} // Empêcher la propagation du clic pour éviter le déclenchement de goToNextVideo
      >
        <div className="bg-black/30 backdrop-blur-sm rounded-full px-5 py-2 flex items-center space-x-4">
          {/* Bouton précédent */}
          <button 
            onClick={goToPrevVideo}
            className="text-white hover:text-orange-400 transition-colors p-2"
            aria-label="Vidéo précédente"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Indicateurs de vidéos */}
          <div className="flex space-x-2">
            {videoSources.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToVideo(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentVideoIndex 
                    ? 'w-6 bg-orange-400' 
                    : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Aller à la vidéo ${idx + 1}`}
              ></button>
            ))}
          </div>

          {/* Bouton suivant */}
          <button 
            onClick={goToNextVideo}
            className="text-white hover:text-orange-400 transition-colors p-2"
            aria-label="Vidéo suivante"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Barre de progression */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <motion.div
          className="h-full bg-orange-400"
          style={{ width: `${progress}%` }}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        ></motion.div>
      </div>
      
      {/* Indicateur visuel pour montrer que la vidéo est cliquable */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 hover:opacity-100 transition-opacity duration-300"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-16 h-16 rounded-full bg-orange-400/60 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};



const Home = ({ darkMode }) => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false); // Ajoutez cette ligne pour éviter des incohérences
      }
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  
  const colorScheme = darkMode
    ? {
        bgPrimary: 'bg-gray-900',
        textPrimary: 'text-white',
        textAccent: 'text-orange-400',
        buttonBg: 'bg-orange-600 hover:bg-orange-700',
      }
    : {
        bgPrimary: 'bg-amber-50',
        textPrimary: 'text-amber-900',
        textAccent: 'text-orange-700',
        buttonBg: 'bg-amber-900 hover:bg-amber-800',
      };

  // Variantes pour animations
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };
  
  const slideIn = {
    hidden: { x: -60, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <div className={`${colorScheme.bgPrimary} ${colorScheme.textPrimary}`}>



<section className="relative h-screen overflow-hidden">
        {/* Vidéo d'arrière-plan */}
       
        <VideoCarousel scrollY={scrollY} />

        {/* Contenu principal */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="container mx-auto px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-6xl font-bold text-white ml-2 mb-6">
             Plongez dans une expérience sensorielle unique avec <br/>
             <span className="text-orange-400">قهوتي</span>
              <br /> où chaque tasse raconte l'héritage 
              </h1>
<p className="text-xl text-gray-200 max-w-2xl mx-auto">
Laissez-vous envoûter par nos arômes profonds et nos saveurs envoûtantes, soigneusement préparés pour éveiller vos sens et vous transporter vers les terres mystérieuses des cafés d'exception
</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                to="/nosMenu"
                className="px-8 py-3 rounded-full bg-amber-900 text-white font-medium hover:bg-amber-800 transition-all transform hover:scale-105"
              >
                Découvrir notre menu
              </Link>
              <Link
                to="/nos-salons"
                className="px-8 py-3 rounded-full bg-transparent border-2 border-white text-white font-medium hover:bg-white/10 transition-all"
              >
                Trouver un salon
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Indicateur de défilement */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="h-16 w-8 rounded-full border-2 border-white flex items-start justify-center p-2">
            <div className="h-3 w-3 rounded-full bg-white"></div>
          </div>
        </motion.div>
      </section>
      
      {/* Section Notre Histoire */}
      <section className={`py-20 ${colorScheme.bgPrimary}`}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex flex-col lg:flex-row items-center gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="lg:w-1/2">
              <h2 className={`text-3xl font-bold mb-6 ${colorScheme.textAccent}`}>Notre Histoire</h2>
              <div className={`w-20 h-1 ${colorScheme.bgAccent} mb-8`}></div>
              <p className={`text-lg mb-6 ${colorScheme.textSecondary}`}>
              L’aventure  <strong>قهوتي</strong>  commence avec une simple idée : offrir bien plus qu’une tasse de café.
C’est le rêve d’un lieu où chaque arôme raconte une culture, chaque saveur évoque un voyage, et chaque instant partagé devient un souvenir chaleureux.
              </p>
              <p className={`text-lg mb-8 ${colorScheme.textSecondary}`}>
              En tant que jeune projet passionné, nous avons à cœur de célébrer l’authenticité et le savoir-faire artisanal.
              Nous sélectionnons nos cafés avec soin, en mettant l’accent sur la qualité, la provenance, et le respect des traditions.
              </p>
              <br/>
              <p className={`text-lg mb-8 ${colorScheme.textSecondary}`}>
              Ce n’est que le début d’une belle aventure, et nous avons hâte de la construire avec vous, une tasse après l’autre.<br/>
              Bienvenue dans l’univers de <strong>قهوتي</strong> , là où chaque détail compte, et où chaque gorgée raconte une histoire.
              </p>

              <Link to="/a-propos" className="inline-flex items-center text-lg font-medium group">
                <span className={colorScheme.textAccent}>Découvrir notre histoire</span>
                <ArrowRight className={`ml-2 transform group-hover:translate-x-2 transition-transform ${colorScheme.textAccent}`} />
              </Link>
            </motion.div>

 
           <motion.div 
              variants={slideIn} 
              className="lg:w-1/2 relative"
            >
              <div className="relative z-10 h-96">
                <StoryImageCarousel colorScheme={colorScheme} />
              </div>
              <div 
                className={`absolute -bottom-6 -left-6 w-64 h-64 ${colorScheme.bgAccent} rounded-full -z-10 opacity-20`}
              ></div>
            </motion.div>
          </motion.div>
        </div>
      </section>





      <section className={`py-20 ${colorScheme.bgPrimary}`}>
  <div className="container mx-auto px-4">
    <motion.div 
      className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl relative group"
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      <h2 className={`text-3xl font-bold mb-6 text-center ${colorScheme.textAccent}`}>
        Programme de Fidélité
      </h2>
      
      <div className='flex flex-col md:flex-row items-center'> 
        <div className="md:w-1/2">
          <img 
            src={FideliteCart}
            alt="Carte de fidélité" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        
        <div className={`md:w-1/2 p-6 ${colorScheme.textPrimary}`}>
          <p className="text-lg mb-4">
            Chez My Coffee, nous récompensons votre fidélité. Pour chaque café acheté, recevez un tampon sur votre carte.
          </p>
          <p className="text-xl font-semibold mb-4">
            Collectez 5 tampons et votre <span className={colorScheme.textAccent}>6ème café est gratuit !</span>
          </p>
          <p className="mb-6">
            Demandez votre carte lors de votre prochaine visite.
          </p>
          <button className={`px-6 py-2 rounded-lg ${colorScheme.bgAccent} text-white hover:opacity-90 transition-opacity`}>
            En savoir plus
          </button>
        </div>
      </div>
    </motion.div>
  </div>
</section>




      <section className={`py-20 ${colorScheme.bgPrimary}`}>
  <div className="container mx-auto px-4">
    <motion.div 
      className="mb-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className={`text-3xl font-bold mb-6 ${colorScheme.textAccent}`}>
        Nos Services
      </h2>
      <div className="w-20 h-1 bg-orange-400 mx-auto mb-6"></div>
      <p className={`text-lg max-w-2xl mx-auto ${colorScheme.textPrimary}`}>
        Découvrez nos solutions pour déguster nos cafés d'exception, que ce soit sur place ou chez vous
      </p>
    </motion.div>

    <div className="flex flex-col lg:flex-row gap-8 mt-12">
      {/* Premier div - Commander en ligne */}
      <motion.div 
        className="lg:w-1/2 rounded-2xl overflow-hidden shadow-xl relative group"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="relative h-96 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
          <img 
            src={ImgCat}
            alt="Café à emporter" 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
            <h3 className="text-2xl font-bold text-white mb-4">Commander en ligne</h3>
            <p className="text-gray-200 mb-6">
            Anticipez votre moment café en toute simplicité. Choisissez vos produits ou boissons préférés et venez les récupérer sans attendre.
            </p>
            <Link
              to="/commander"
              className="inline-flex items-center px-6 py-3 rounded-full bg-orange-500 text-white font-medium hover:bg-orange-600 transition-all transform hover:scale-105 shadow-lg"
            >
              <Coffee className="mr-2 h-5 w-5" />
              Commander maintenant
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Deuxième div - Livraison */}
      <motion.div 
        className="lg:w-1/2 rounded-2xl overflow-hidden shadow-xl relative group"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="relative h-96 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
          <img 
            src={ImgLivraison}
            alt="Livraison de café" 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
            <h3 className="text-2xl font-bold text-white mb-4">Livraison à domicile</h3>
            <p className="text-gray-200 mb-6">
            Anticipez votre moment café en toute tranquillité. Choisissez votre café préféré ou la matière première pour préparer votre boisson et faites-les livrer directement chez vous, sans attendre.
            </p>
            <Link
              to="/livraison"
              className="inline-flex items-center px-6 py-3 rounded-full border-2 border-white text-white font-medium hover:bg-white hover:text-orange-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <MapPin className="mr-2 h-5 w-5" />
              Découvrir la livraison
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
    




    
    {/* Caractéristiques */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
      <motion.div 
        className="flex flex-col items-center text-center p-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className={`w-16 h-16 rounded-full ${colorScheme.buttonBg} flex items-center justify-center mb-4`}>
          <Star className="h-8 w-8 text-white" />
        </div>
        <h3 className={`text-xl font-bold mb-3 ${colorScheme.textAccent}`}>Qualité garantie</h3>
        <p className={colorScheme.textPrimary}>
          Nos boissons sont préparées avec le même soin, que ce soit en salon ou pour emporter.
        </p>
      </motion.div>

      <motion.div 
        className="flex flex-col items-center text-center p-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className={`w-16 h-16 rounded-full ${colorScheme.buttonBg} flex items-center justify-center mb-4`}>
          <Clock className="h-8 w-8 text-white" />
        </div>
        <h3 className={`text-xl font-bold mb-3 ${colorScheme.textAccent}`}>Rapidité de service</h3>
        <p className={colorScheme.textPrimary}>
          Commandez en ligne et récupérez votre commande sans attendre en salon.
        </p>
      </motion.div>

      <motion.div 
        className="flex flex-col items-center text-center p-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className={`w-16 h-16 rounded-full ${colorScheme.buttonBg} flex items-center justify-center mb-4`}>
          <MapPin className="h-8 w-8 text-white" />
        </div>
        <h3 className={`text-xl font-bold mb-3 ${colorScheme.textAccent}`}>Livraison soignée</h3>
        <p className={colorScheme.textPrimary}>
          Nos livreurs veillent à ce que vos boissons arrivent parfaitement préservées.
        </p>
      </motion.div>
    </div>
  </div>
</section>
      

      
 
       
     
      
    
     
      

      
 
      
   
          
       
    </div>
  )
}

export default Home;