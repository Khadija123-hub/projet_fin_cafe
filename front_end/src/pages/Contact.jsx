import React, { useState } from "react";

export default function Contact({ formRef }) {
  const options = [
    { value: "commande", label: "Suivi de commande" },
    { value: "reclamation", label: "Réclamation" },
    { value: "produit", label: "Informations sur un produit" },
    { value: "autre", label: "Autre" },
  ];

  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    email: '',
    demande: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Validation des champs
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom || formData.nom.length < 2) {
      newErrors.nom = formData.nom ? "Minimum 2 caractères" : "Le nom est obligatoire";
    }

    if (!formData.telephone) {
      newErrors.telephone = "Le numéro de téléphone est obligatoire";
    } else if (formData.telephone.startsWith("+")) {
      if (formData.telephone.length !== 12) {
        newErrors.telephone = "Le numéro doit être de 12 caractères avec l'indicatif";
      }
    } else if (formData.telephone.length !== 10) {
      newErrors.telephone = "Le numéro doit être de 10 caractères";
    }

    if (!formData.email) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(formData.email)) {
      newErrors.email = "Adresse email invalide";
    }

    if (!formData.demande) {
      newErrors.demande = "Veuillez sélectionner une option";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envoi via WhatsApp
  const sendWhatsApp = () => {
    const selectedOption = options.find(opt => opt.value === formData.demande);
    const message = `🔸 *Nouveau Contact*
    
📝 *Nom:* ${formData.nom}
📞 *Téléphone:* ${formData.telephone}
📧 *Email:* ${formData.email}
🏷️ *Type:* ${selectedOption?.label || ''}

💬 *Message:*
${formData.message || 'Aucun message'}`;

    const phoneNumber = '212611689213'; // Remplacez par votre numéro WhatsApp (format international)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    return { success: true };
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const result = sendWhatsApp();

      if (result.success) {
        setSubmitStatus({ 
          success: true, 
          message: 'Votre message a été envoyé vers WhatsApp avec succès !' 
        });
        
        // Reset du formulaire
        setFormData({
          nom: '',
          telephone: '',
          email: '',
          demande: '',
          message: ''
        });
      } else {
        setSubmitStatus({ 
          success: false, 
          message: 'Une erreur est survenue lors de l\'envoi' 
        });
      }
    } catch (error) {
      setSubmitStatus({ 
        success: false, 
        message: 'Une erreur inattendue est survenue' 
      });
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <section className="contact-form" ref={formRef}>
        <br></br> <br></br> <br></br>
        <p className="contact">Une question ? Contactez-nous !</p>
        <p className="description">
          Que ce soit pour une commande, une réclamation ou un conseil caféiné, nous sommes là pour vous répondre.
        </p>

        {submitStatus && (
          <div className={`status-message ${submitStatus.success ? 'success' : 'error'}`}>
            {submitStatus.message}
          </div>
        )}

        <div className="form">
          <label htmlFor="nom">Nom & Prénom <span className="red">*</span></label>
          <input
            type="text"
            id="nom"
            placeholder="Nom complet"
            value={formData.nom}
            onChange={(e) => handleInputChange('nom', e.target.value)}
            className={errors.nom ? "is-invalid" : ""}
          />
          {errors.nom && <p className="error-message">{errors.nom}</p>}

          <label htmlFor="telephone">Numéro de Tél <span className="red">*</span></label>
          <input
            type="tel"
            id="telephone"
            placeholder="06XXXXXXXX"
            value={formData.telephone}
            onChange={(e) => handleInputChange('telephone', e.target.value)}
            className={errors.telephone ? "is-invalid" : ""}
          />
          {errors.telephone && <p className="error-message">{errors.telephone}</p>}

          <label htmlFor="email">E-mail <span className="red">*</span></label>
          <input
            type="email"
            id="email"
            placeholder="exemple@email.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={errors.email ? "is-invalid" : ""}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}

          <label htmlFor="demande">Type de demande <span className="red">*</span></label>
          <select
            id="demande"
            value={formData.demande}
            onChange={(e) => handleInputChange('demande', e.target.value)}
            className={errors.demande ? "is-invalid" : ""}
          >
            <option value="">Sélectionnez une option</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.demande && <p className="error-message">{errors.demande}</p>}

          <label htmlFor="message">Votre message</label>
          <textarea
            id="message"
            rows="4"
            placeholder="Expliquez-nous votre besoin ou votre problème"
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
          />

          <button 
            type="button"
            className="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer via WhatsApp'}
          </button>
        </div>
      </section>

      <style>
        {`
          .contact-form {
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          .contact {
            font-size: 28px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 10px;
            color: #6f4e37;
          }

          .description {
            text-align: center;
            margin-bottom: 30px;
            color: #666;
            font-size: 16px;
          }

          .form {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 40px;
          }

          label {
            font-weight: 600;
            margin-bottom: 5px;
            color: #333;
          }

          .red {
            color: #e74c3c;
          }

          input, select, textarea {
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.3s ease;
          }

          input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #6f4e37;
            box-shadow: 0 0 0 3px rgba(111, 78, 55, 0.1);
          }

          .is-invalid {
            border-color: #e74c3c;
          }

          .error-message {
            color: #e74c3c;
            font-size: 12px;
            text-align: left;
            margin-top: 5px;
            margin-bottom: 0;
          }

          .submit {
            background: linear-gradient(135deg, #25d366, #20b954);
            color: white;
            padding: 14px 20px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
          }

          .submit:hover:not(:disabled) {
            background: linear-gradient(135deg, #20b954, #1e9e47);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
          }

          .submit:disabled {
            background: #bdc3c7;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          .status-message {
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 25px;
            text-align: center;
            font-weight: 500;
          }

          .status-message.success {
            background-color: #d4edda;
            color: #155724;
            border: 2px solid #c3e6cb;
          }

          .status-message.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 2px solid #f5c6cb;
          }

          textarea {
            resize: vertical;
            min-height: 100px;
          }

          @media (max-width: 768px) {
            .contact-form {
              padding: 15px;
            }
            
            .contact {
              font-size: 24px;
            }
          }
        `}
      </style>
    </>
  );
}