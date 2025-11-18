import { useState, useContext } from "react";
import Layout from "../components/Layout";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AddMachine() {
  const [name, setName] = useState("");
  const [seuilTemp, setSeuilTemp] = useState("");
  const [seuilVib, setSeuilVib] = useState("");
  const navigate = useNavigate();

  const { admin } = useContext(AuthContext); // 👈 token admin

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(
      "/machines",
      { name, seuilTemp, seuilVib },
      {
        headers: { "x-auth-token": admin?.token }
      }
    )
    .then(() => navigate("/machines"))
    .catch(console.error);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Ajouter une Machine</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">

        <label className="block mb-3">Nom machine</label>
        <input className="border p-2 w-full mb-4" value={name}
               onChange={(e) => setName(e.target.value)} />

        <label className="block mb-3">Seuil Température</label>
        <input className="border p-2 w-full mb-4" value={seuilTemp}
               onChange={(e) => setSeuilTemp(e.target.value)} />

        <label className="block mb-3">Seuil Vibration</label>
        <input className="border p-2 w-full mb-4" value={seuilVib}
               onChange={(e) => setSeuilVib(e.target.value)} />

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Enregistrer
        </button>

      </form>
    </Layout>
  );
}
