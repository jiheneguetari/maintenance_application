import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Machines() {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/machines")
      .then(res => setMachines(res.data))
      .catch(console.error);
  }, []);

  return (
    <Layout>
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Liste des Machines</h1>
        <Link to="/machines/add" className="bg-blue-600 text-white px-4 py-2 rounded">
          + Ajouter Machine
        </Link>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Nom</th>
            <th className="p-3">Température max</th>
            <th className="p-3">Vibration max</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {machines.map((m) => (
            <tr key={m._id} className="border-b">
              <td className="p-3">{m.name}</td>
              <td className="p-3">{m.seuilTemp}</td>
              <td className="p-3">{m.seuilVib}</td>
              <td className="p-3">
                <Link to={`/machines/edit/${m._id}`} className="text-blue-600 mr-3">Modifier</Link>
                <button className="text-red-600"
                        onClick={() => deleteMachine(m._id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );

  function deleteMachine(id) {
    if (!window.confirm("Supprimer cette machine ?")) return;
    axios.delete(`http://localhost:5000/api/machines/${id}`)
      .then(() => setMachines(machines.filter(x => x._id !== id)))
      .catch(console.error);
  }
}
