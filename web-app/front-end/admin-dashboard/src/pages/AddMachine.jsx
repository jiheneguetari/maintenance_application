import { useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddMachine() {
  const [name, setName] = useState("");
  const [seuilTemp, setSeuilTemp] = useState("");
  const [seuilVib, setSeuilVib] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:5000/api/machines", {
      name,
      seuilTemp,
      seuilVib
    })
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
