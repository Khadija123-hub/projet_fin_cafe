import React, { useState } from "react";
import axios from "axios";
import { useNavigate , Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    nom: "",
    telephone: "",
    adresse: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Reset error for this field when typing
    if (errors[name]) {
      setErrors({...errors, [name]: null});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setErrors({});

    try {
      // Afficher le corps de la requête dans la console pour le débogage
      console.log("Envoi des données:", formData);
      
      const response = await axios.post('http://localhost:8000/api/register', formData)
      console.log("Réponse du serveur:", response.data);
      
      // Si l'inscription réussit, stocker le token et rediriger
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      setMessage("Inscription réussie ! Redirection...");
      
      // Rediriger en fonction du rôle
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setMessage(error.response?.data?.message || "Une erreur est survenue lors de l'inscription");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Vérification du mot de passe en temps réel
  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return null;
    
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    
    const requirements = [
      { met: isLongEnough, text: "Au moins 8 caractères" },
      { met: hasLowerCase, text: "Au moins une minuscule" },
      { met: hasUpperCase, text: "Au moins une majuscule" },
      { met: hasNumbers, text: "Au moins un chiffre" },
      { met: hasSymbols, text: "Au moins un symbole (!@#$%^&*)" }
    ];
    
    return requirements;
  };

  return (
    <div>
      <br/>
      <br/>
      <br/>
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
     
      <h1 className="text-2xl font-bold mb-6 text-center">Inscription</h1>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${message.includes("réussie") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Nom d'utilisateur
          </label>
          <input
            className={`shadow appearance-none border ${errors.name ? "border-red-500" : "border-gray-300"} rounded w-full py-2 px-3 text-gray-700 leading-tight`}
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className={`shadow appearance-none border ${errors.email ? "border-red-500" : "border-gray-300"} rounded w-full py-2 px-3 text-gray-700 leading-tight`}
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Mot de passe
          </label>
          <input
            className={`shadow appearance-none border ${errors.password ? "border-red-500" : "border-gray-300"} rounded w-full py-2 px-3 text-gray-700 leading-tight`}
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          
          {/* Affichage des exigences de mot de passe */}
          {formData.password && (
            <div className="mt-2 text-xs">
              <p className="font-semibold mb-1">Exigences du mot de passe:</p>
              <ul className="pl-4">
                {passwordStrength().map((req, index) => (
                  <li 
                    key={index} 
                    className={req.met ? "text-green-600" : "text-red-600"}
                  >
                    {req.met ? "✓" : "✗"} {req.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password_confirmation">
            Confirmation du mot de passe
          </label>
          <input
            className={`shadow appearance-none border ${errors.password_confirmation ? "border-red-500" : "border-gray-300"} rounded w-full py-2 px-3 text-gray-700 leading-tight`}
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
          />
          {errors.password_confirmation && (
            <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>
          )}
          {formData.password && formData.password_confirmation && 
           formData.password !== formData.password_confirmation && (
            <p className="text-red-500 text-xs mt-1">Les mots de passe ne correspondent pas</p>
          )}
        </div>
        
        <hr className="my-6" />
        <h2 className="text-lg font-semibold mb-4">Informations personnelles</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nom">
            Nom complet
          </label>
          <input
            className={`shadow appearance-none border ${errors.nom ? "border-red-500" : "border-gray-300"} rounded w-full py-2 px-3 text-gray-700 leading-tight`}
            id="nom"
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
          {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telephone">
            Téléphone
          </label>
          <input
            className={`shadow appearance-none border ${errors.telephone ? "border-red-500" : "border-gray-300"} rounded w-full py-2 px-3 text-gray-700 leading-tight`}
            id="telephone"
            type="tel"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            required
            placeholder="Ex: +33 6 12 34 56 78"
          />
          {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="adresse">
            Adresse
          </label>
          <textarea
            className={`shadow appearance-none border ${errors.adresse ? "border-red-500" : "border-gray-300"} rounded w-full py-2 px-3 text-gray-700 leading-tight`}
            id="adresse"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            rows="3"
            required
          ></textarea>
          {errors.adresse && <p className="text-red-500 text-xs mt-1">{errors.adresse}</p>}
        </div>
        
        <div className="flex items-center justify-between">
          <button
            className={`bg-orange-950 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Inscription en cours..." : "S'inscrire"}
          </button>
          <Link
            className="inline-block align-baseline font-bold text-sm text-orange-300 hover:text-orange-500"
            to="/login"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            Déjà inscrit?
          </Link>
        </div>
      </form>
    </div>
    <br/>
    <br/>
    <br/>
    </div>
  );
};

export default Register;