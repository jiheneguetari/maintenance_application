import { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

// Importations d'icônes pour une meilleure UX (si vous utilisez une bibliothèque d'icônes comme lucide-react ou react-icons)
// Exemple avec lucide-react, vous devrez l'installer : npm install lucide-react
import { Trash2, UserPlus, Loader2 } from "lucide-react"; 

export default function Technicians() {
  const [techs, setTechs] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // État de chargement initial
  const [error, setError] = useState(null); // État d'erreur
  const [deletingId, setDeletingId] = useState(null); // ID du technicien en cours de suppression

  const { admin } = useContext(AuthContext);

  /**
   * Charger la liste des techniciens
   */
  const fetchTechs = async () => {
    if (!admin?.token) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get("/users", {
        headers: { "x-auth-token": admin.token }
      });
      setTechs(res.data);
    } catch (err) {
      console.error("Erreur de chargement des techniciens:", err);
      setError("Impossible de charger la liste des techniciens. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTechs();
  }, [admin]);

  /**
   * Supprimer un technicien
   */
  const deleteTech = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce technicien ? Cette action est irréversible.")) {
      return;
    }

    setDeletingId(id); // Désactiver le bouton pendant la suppression
    try {
      await axios.delete(`/users/${id}`, {
        headers: { "x-auth-token": admin?.token }
      });
      setTechs(techs.filter(x => x._id !== id));
      // Optionnel : ajouter un message de succès (e.g., Toast)
    } catch (err) {
      console.error("Erreur de suppression:", err);
      alert("Une erreur s'est produite lors de la suppression du technicien.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold"> Gestion des Techniciens</h1>
        
      </div>

      {isLoading && (
        <div className="text-center p-8 bg-gray-50 rounded-lg shadow-inner">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-3" />
          <p className="text-lg text-indigo-700">Chargement des données...</p>
        </div>
      )}

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          <span className="font-medium">Erreur :</span> {error}
          <button onClick={fetchTechs} className="ml-3 text-red-900 underline">Réessayer</button>
        </div>
      )}

      {!isLoading && !error && techs.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg mt-8">
          <p className="text-xl text-gray-500">Aucun technicien trouvé.</p>
          <p className="text-gray-400 mt-2">Utilisez le bouton "Ajouter un Technicien" pour commencer.</p>
        </div>
      ) : (
        <table className="min-w-full bg-white shadow-xl rounded-lg overflow-hidden border-separate [border-spacing:0_10px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Nom</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="p-3 text-center text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {techs.map(t => (
              <tr key={t._id} className="hover:bg-gray-50 transition duration-100 ease-in-out">
                <td className="p-3 font-medium text-gray-800">{t.name}</td>
                <td className="p-3 text-gray-600">{t.email}</td>
                <td className="p-3 text-center">
                  <button
                    className={`inline-flex items-center justify-center p-2 rounded-full transition duration-150 ease-in-out ${
                      deletingId === t._id 
                        ? 'bg-red-400 cursor-not-allowed' 
                        : 'text-red-600 hover:bg-red-100'
                    }`}
                    onClick={() => deleteTech(t._id)}
                    disabled={deletingId !== null} // Désactiver tous les boutons si une suppression est en cours
                    aria-label={`Supprimer ${t.name}`}
                  >
                    {deletingId === t._id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}