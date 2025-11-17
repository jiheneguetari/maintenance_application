import Layout from "../components/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Machines</h2>
          <p className="text-2xl font-bold">12</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Alertes actives</h2>
          <p className="text-2xl font-bold text-red-600">4</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Techniciens</h2>
          <p className="text-2xl font-bold">5</p>
        </div>

      </div>
    </Layout>
  );
}
