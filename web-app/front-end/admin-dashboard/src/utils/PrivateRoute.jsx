// src/utils/PrivateRoute.jsx (Correction)

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  // Récupérer l'état de chargement
  const { admin, loading } = useContext(AuthContext); 

  if (loading) {
    // Vous pouvez remplacer ceci par un spinner ou un message plus élégant
    return <div>Chargement de l'authentification...</div>; 
  }

  // 2. Si le chargement est terminé et que l'admin est null, rediriger
  if (!admin) {
    return <Navigate to="/" />;
  }

  // 3. Si le chargement est terminé et que l'admin est présent, autoriser l'accès
  return children;
}