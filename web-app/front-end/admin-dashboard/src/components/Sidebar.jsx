// src/components/Sidebar.jsx (Ajout du Logout)

import { Link } from 'react-router-dom';
import { useContext } from 'react'; // ⬅️ IMPORT
import { AuthContext } from '../context/AuthContext'; // ⬅️ IMPORT

export default function Sidebar() {
    const { logout } = useContext(AuthContext); // ⬅️ UTILISATION DU CONTEXTE

    return (
        <div className="w-60 bg-gray-900 text-white h-screen p-5 fixed flex flex-col"> 
            <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>

            <nav className="flex flex-col space-y-4 flex-grow"> {/* flex-grow pour pousser le logout en bas */}
                <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
                <Link to="/machines" className="hover:text-blue-400">Machines</Link>
                <Link to="/technicians" className="hover:text-blue-400">Techniciens</Link>
                <Link to="/alerts" className="hover:text-blue-400">Alertes</Link>
                <Link to="/reports" className="hover:text-blue-400">Rapports</Link>
            </nav>
            
            <button
                onClick={logout}
                className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition duration-150 mt-4"
            >
                Déconnexion
            </button>

        </div>
    );
}