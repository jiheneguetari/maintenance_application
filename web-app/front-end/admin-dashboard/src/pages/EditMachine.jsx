import { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout";
import axios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function EditMachine() {
  const { id } = useParams();
  const [machine, setMachine] = useState({});
  const navigate = useNavigate();

  const { admin } = useContext(AuthContext); // 👈 récupérer token

  useEffect(() => {
    axios.get(`/machines/${id}`, {
      headers: { "x-auth-token": admin?.token },
    })
    .then(res => setMachine(res.data))
    .catch(console.error);
  }, [id, admin]);

  const update = (e) => {
    e.preventDefault();

    axios.put(`/machines/${id}`, machine, {
      headers: { "x-auth-token": admin?.token },
    })
    .then(() => navigate("/machines"))
    .catch(console.error);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Modifier Machine</h1>

      <form onSubmit={update} className="bg-white p-6 rounded shadow w-96">
        <label className="block mb-3">Nom</label>
        <input className="border p-2 w-full mb-4"
               value={machine.name || ""}
               onChange={e => setMachine({...machine, name: e.target.value})}/>

        <label className="block mb-3">Seuil Température</label>
        <input className="border p-2 w-full mb-4"
               value={machine.seuilTemp || ""}
               onChange={e => setMachine({...machine, seuilTemp: e.target.value})}/>

        <label className="block mb-3">Seuil Vibration</label>
        <input className="border p-2 w-full mb-4"
               value={machine.seuilVib || ""}
               onChange={e => setMachine({...machine, seuilVib: e.target.value})}/>

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Sauvegarder
        </button>
      </form>
    </Layout>
  );
}
