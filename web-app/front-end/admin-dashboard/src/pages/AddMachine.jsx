import { useState, useContext } from "react";
import Layout from "../components/Layout";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
// Importation d'icônes pour un look plus professionnel (ex: react-icons)
// import { FiPlusCircle, FiThermometer, FiZap, FiTag, FiSave } from "react-icons/fi"; 

export default function AddMachine() {
  const [name, setName] = useState("");
  const [seuilTemp, setSeuilTemp] = useState("");
  const [seuilVib, setSeuilVib] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Ajout d'un état de chargement
  const [error, setError] = useState(null); // Ajout d'un état d'erreur
  
  const navigate = useNavigate();

  const { admin } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Conversion des seuils en nombres (important pour la validation et l'API)
    const data = { 
        name, 
        seuilTemp: parseFloat(seuilTemp), 
        seuilVib: parseFloat(seuilVib) 
    };

    axios.post(
      "/machines",
      data,
      {
        headers: { "x-auth-token": admin?.token }
      }
    )
    .then(() => {
        setIsLoading(false);
        // Redirection avec un petit délai pour simuler une réussite visuelle
        setTimeout(() => navigate("/machines"), 50); 
    })
    .catch((err) => {
        setIsLoading(false);
        // Gestion et affichage d'une erreur API plus claire
        const apiError = err.response?.data?.message || "Erreur lors de l'ajout de la machine.";
        setError(apiError);
        console.error(err);
    });
  };

  // Styles communs pour les champs de saisie
  const inputStyle = "border border-gray-300 p-3 w-full rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out placeholder-gray-500";
  const labelStyle = "block text-sm font-medium text-gray-700 mb-2 mt-4 flex items-center";

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-md mx-auto">
          
          {/* Titre Amélioré */}
          <h1 className="text-4xl font-extrabold text-gray-800 mb-8 flex items-center">
            {/* <FiPlusCircle className="mr-3 text-indigo-600" /> */}
            Ajouter une Machine
          </h1>
          
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100">

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                    <p className="font-bold">Erreur</p>
                    <p>{error}</p>
                </div>
            )}

            {/* Champ : ID Machine (Nom) */}
            <label className={labelStyle}>
                🏷️ ID Machine (Nom)
            </label>
            <input 
                className={inputStyle} 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)} 
                placeholder="Ex: Machine_001 ou Ligne_A"
                required
            />

            <label className={labelStyle}>
                {/* <FiThermometer className="mr-2 text-red-500" /> */}
                🌡️ Seuil d'Alerte Température (°C)
            </label>
            <input 
                className={inputStyle} 
                type="number"
                step="0.1" // Permet les décimales
                value={seuilTemp}
                onChange={(e) => setSeuilTemp(e.target.value)} 
                placeholder="Ex: 85.0"
                required
            />

            <label className={labelStyle}>
                ⚡ Seuil d'Alerte Vibration (unités)
            </label>
            <input 
                className={inputStyle} 
                type="number"
                step="0.1"
                value={seuilVib}
                onChange={(e) => setSeuilVib(e.target.value)} 
                placeholder="Ex: 10.5"
                required
            />
            
            <hr className="my-6 border-gray-200" />

            <button
              type="submit"
              disabled={isLoading}
              // Style de bouton nettement amélioré avec couleur primaire (bleu/indigo)
              className={`
                text-white w-full p-3 rounded-xl font-semibold shadow-lg transition duration-300 ease-in-out 
                flex items-center justify-center space-x-2 
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transform hover:scale-[1.01]'
                }
              `}
            >
              {isLoading ? 'Enregistrement en cours...' : ' Enregistrer la Machine'}
            </button>

          </form>
        </div>
      </div>
    </Layout>
  );
}