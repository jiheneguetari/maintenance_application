import { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout";
import axios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
// Importations d'icônes si utilisées (ex: react-icons)
// import { FiEdit, FiSave, FiTag, FiThermometer, FiZap } from "react-icons/fi";

export default function EditMachine() {
  const { id } = useParams();
  const [machine, setMachine] = useState({ name: "", seuilTemp: "", seuilVib: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { admin } = useContext(AuthContext);

  // Styles pour la cohérence
  const inputStyle = "border border-gray-300 p-3 w-full rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out placeholder-gray-500";
  const labelStyle = "block text-sm font-medium text-gray-700 mb-2 mt-4 flex items-center";

  // --- Chargement initial des données de la machine ---
  useEffect(() => {
    setIsFetching(true);
    axios.get(`/machines/${id}`, {
      headers: { "x-auth-token": admin?.token },
    })
    .then(res => {
        // Convertir en string pour l'affichage dans les inputs de type text/number
        setMachine({
            name: res.data.name || "",
            seuilTemp: res.data.seuilTemp !== undefined ? String(res.data.seuilTemp) : "",
            seuilVib: res.data.seuilVib !== undefined ? String(res.data.seuilVib) : "",
        });
        setIsFetching(false);
    })
    .catch((err) => {
        setError("Impossible de charger les données de la machine.");
        setIsFetching(false);
        console.error(err);
    });
  }, [id, admin]);

  // --- Fonction de mise à jour ---
  const update = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Préparer les données pour l'API (conversion en nombre)
    const updatedData = {
        name: machine.name,
        seuilTemp: parseFloat(machine.seuilTemp),
        seuilVib: parseFloat(machine.seuilVib),
    };

    axios.put(`/machines/${id}`, updatedData, {
      headers: { "x-auth-token": admin?.token },
    })
    .then(() => {
        setIsLoading(false);
        // Redirection après succès
        navigate("/machines", { state: { successMessage: `Machine ${machine.name} mise à jour.` } });
    })
    .catch((err) => {
        setIsLoading(false);
        const apiError = err.response?.data?.message || "Erreur lors de la mise à jour de la machine.";
        setError(apiError);
        console.error(err);
    });
  };

  if (isFetching) {
    return (
        <Layout>
            <div className="flex justify-center items-center h-48">
                <p className="text-xl text-gray-600">Chargement des données...</p>
            </div>
        </Layout>
    );
  }

  if (error && !isFetching && !isLoading) {
    return (
        <Layout>
            <div className="max-w-md mx-auto p-8 mt-10 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow">
                <p className="font-bold">Erreur de chargement</p>
                <p>{error}</p>
                <button onClick={() => navigate("/machines")} className="mt-4 text-sm text-red-600 hover:underline">
                    Retourner à la liste
                </button>
            </div>
        </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-md mx-auto">
          
          <h1 className="text-4xl font-extrabold text-gray-800 mb-8 flex items-center">
            Modifier Machine : {machine.name}
          </h1>
          
          <form onSubmit={update} className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100">

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                    <p className="font-bold">Erreur de mise à jour</p>
                    <p>{error}</p>
                </div>
            )}

            <label className={labelStyle}>
                 Nom / ID Machine
            </label>
            <input
                className={inputStyle}
                type="text"
                value={machine.name || ""}
                onChange={e => setMachine({...machine, name: e.target.value})}
                placeholder="Ex: Machine_001 ou Ligne_A"
                required
            />

            {/* Champ : Seuil Température */}
            <label className={labelStyle}>
                🌡️ Seuil d'Alerte Température (°C)
            </label>
            <input
                className={inputStyle}
                type="number"
                step="0.1"
                value={machine.seuilTemp || ""}
                onChange={e => setMachine({...machine, seuilTemp: e.target.value})}
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
                value={machine.seuilVib || ""}
                onChange={e => setMachine({...machine, seuilVib: e.target.value})}
                placeholder="Ex: 10.5"
                required
            />
            
            {/* Séparateur visuel */}
            <hr className="my-6 border-gray-200" />

            <button
              type="submit"
              disabled={isLoading}
              className={`
                text-white w-full p-3 rounded-xl font-semibold shadow-lg transition duration-300 ease-in-out 
                flex items-center justify-center space-x-2 
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transform hover:scale-[1.01]'
                }
              `}
            >
              {isLoading ? 'Sauvegarde en cours...' : ' Sauvegarder les Modifications'}
            </button>
            
          </form>
        </div>
      </div>
    </Layout>
  );
}