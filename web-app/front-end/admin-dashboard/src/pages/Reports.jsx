import Layout from "../components/Layout";

export default function Reports() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Générer un Rapport</h1>

      <div className="bg-white p-6 rounded shadow w-96">
        <label className="block mb-3">Période :</label>
        <select className="border p-2 w-full mb-4">
          <option>Dernière semaine</option>
          <option>Dernier mois</option>
          <option>3 derniers mois</option>
        </select>

        <button className="bg-green-600 text-white w-full p-2 rounded">
          Télécharger PDF
        </button>
      </div>
    </Layout>
  );
}
