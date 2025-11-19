import { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Technicians() {
  const [techs, setTechs] = useState([]);

  const { admin } = useContext(AuthContext); // admin token

  useEffect(() => {
    axios.get("/users", {
      headers: { "x-auth-token": admin?.token }
    })
    .then(res => setTechs(res.data))
    .catch(console.error);
  }, [admin]);

  const deleteTech = (id) => {
    if (!window.confirm("Supprimer ce technicien ?")) return;

    axios.delete(`/users/${id}`, {
      headers: { "x-auth-token": admin?.token }
    })
    .then(() => setTechs(techs.filter(x => x._id !== id)))
    .catch(console.error);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Techniciens</h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3">Nom</th>
            <th className="p-3">Email</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {techs.map(t => (
            <tr key={t._id} className="border-b">
              <td className="p-3">{t.name}</td>
              <td className="p-3">{t.email}</td>
              <td className="p-3">
                <button className="text-red-600"
                        onClick={() => deleteTech(t._id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </Layout>
  );
}
