import { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Importations d'icônes pour une meilleure UX
import { Plus, Trash2, Pencil, Loader2, Factory } from "lucide-react";

export default function Machines() {
  const [machines, setMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // État de chargement initial
  const [error, setError] = useState(null); // État d'erreur
  const [deletingId, setDeletingId] = useState(null); // ID de la machine en cours de suppression

  const { admin } = useContext(AuthContext);

  /**
   * Charger la liste des machines
   */
  const fetchMachines = async () => {
    if (!admin?.token) {
        setIsLoading(false);
        return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get("/machines", {
        headers: { "x-auth-token": admin.token },
      });
      setMachines(res.data);
    } catch (err) {
      console.error("Erreur de chargement des machines:", err);
      setError("Impossible de charger la liste des machines. Veuillez vérifier votre connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, [admin]);

  /**
   * Supprimer une machine
   */
  const deleteMachine = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette machine ?")) return;

    setDeletingId(id);
    try {
      await axios.delete(`/machines/${id}`, {
        headers: { "x-auth-token": admin?.token },
      });
      // Filtrer la liste localement pour une mise à jour rapide
      setMachines(machines.filter((x) => x._id !== id));
    } catch (err) {
      console.error("Erreur de suppression:", err);
      alert("Une erreur s'est produite lors de la suppression de la machine.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Layout>
      {/* En-tête de la page */}
      <div className="flex justify-between items-center mb-8 pb-3 border-b border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-800 flex items-center">
          <Factory className="w-8 h-8 mr-3 text-indigo-600" />
          Parc de Machines
        </h1>
        <Link
          to="/machines/add"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter une Machine
        </Link>
      </div>

      {/* Affichage des états de chargement et d'erreur */}
      {isLoading && (
        <div className="text-center p-12 bg-indigo-50 rounded-xl shadow-inner mt-6">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-xl font-medium text-indigo-800">Chargement des équipements...</p>
        </div>
      )}

      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          <span className="font-bold">Erreur :</span> {error}
          <button onClick={fetchMachines} className="ml-3 font-semibold text-red-900 underline">Réessayer</button>
        </div>
      )}

      {/* Tableau des machines */}
      {!isLoading && !error && machines.length === 0 ? (
        <div className="text-center p-12 border-4 border-dashed border-gray-200 bg-white rounded-xl mt-8">
          <p className="text-2xl text-gray-500 font-light">Aucune machine enregistrée pour le moment.</p>
          <p className="text-gray-400 mt-3">Cliquez sur "Ajouter une Machine" pour enregistrer votre premier équipement.</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-2xl rounded-xl">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Nom de la Machine
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Température max. (Seuil)
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Vibration max. (Seuil)
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {machines.map((m) => (
                <tr key={m._id} className="hover:bg-indigo-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {m.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                       {m.seuilTemp} °C
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                       {m.seuilVib} g
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    {/* Bouton Modifier */}
                    <Link
                      to={`/machines/edit/${m._id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center transition duration-150"
                      title="Modifier la machine"
                    >
                      <Pencil className="w-5 h-5 mr-1" />
                      Modifier
                    </Link>

                    {/* Bouton Supprimer */}
                    <button
                      className={`inline-flex items-center p-2 rounded-full transition duration-150 ease-in-out ${
                        deletingId === m._id 
                          ? 'bg-red-400 cursor-not-allowed text-white' 
                          : 'text-red-600 hover:bg-red-100'
                      }`}
                      onClick={() => deleteMachine(m._id)}
                      disabled={deletingId !== null}
                      title="Supprimer la machine"
                    >
                      {deletingId === m._id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}