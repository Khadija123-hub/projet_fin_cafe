import React from "react";
import { motion } from "framer-motion";
import image1 from "../../images/cafe-interieur.jpg";

const Nosalon = () => {
  return (
    <div className="bg-gradient-to-b from-[#fefaf6] to-[#f5ebe0] text-gray-800 py-16 px-4 sm:px-8">
      <br></br><br></br> <br></br>
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Titre */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-[#5c3d2e] mb-4">☕ Bienvenue dans notre Salon</h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Un lieu unique où chaque détail est pensé pour vous offrir une expérience café inoubliable.
          </p>
        </motion.div>

        {/* Image immersive */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-[2rem] shadow-2xl"
        >
          <img
            src={image1}
            alt="Intérieur du café"
            className="w-full h-[550px] object-cover transition-transform duration-500"
          />
        </motion.div>

        {/* Section localisation */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Infos */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-semibold text-[#5c3d2e] mb-6">📍 Localisation</h2>
            <ul className="space-y-4 text-lg text-gray-700">
              <li><strong>Adresse :</strong> 12 Rue des Dattes, Casablanca, Maroc</li>
              <li><strong>Téléphone :</strong> +212 6 12 34 56 78</li>
              <li><strong>Horaires :</strong> 08h00 à 22h00 - 7j/7</li>
            </ul>
          </motion.div>

          {/* Carte */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden shadow-xl border-4 border-[#dec9b2]"
          >
            <iframe
              title="Localisation"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.776578009652!2d-7.622856684800935!3d33.5731101807354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d25b74b4b2e3%3A0x38a6c930b43c7a0c!2sCasablanca!5e0!3m2!1sfr!2sma!4v1685645161685!5m2!1sfr!2sma"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Nosalon;
