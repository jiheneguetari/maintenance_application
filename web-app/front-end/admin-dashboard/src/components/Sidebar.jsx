export default function Sidebar() {
  return (
    <div className="w-60 bg-gray-900 text-white h-screen p-5 fixed">
      <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>

      <nav className="flex flex-col space-y-4">
        <a href="/dashboard" className="hover:text-blue-400">Dashboard</a>
        <a href="/machines" className="hover:text-blue-400">Machines</a>
        <a href="/technicians" className="hover:text-blue-400">Techniciens</a>
        <a href="/alerts" className="hover:text-blue-400">Alertes</a>
        <a href="/reports" className="hover:text-blue-400">Rapports</a>
      </nav>
    </div>
  );
}
