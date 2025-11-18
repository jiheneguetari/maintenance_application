import { createContext, useState, useEffect } from "react";
import axios from "../api/axios"; // Assurez-vous que ce chemin est correct

// src/context/AuthContext.js (Correction)


export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true); // ⬅️ NOUVEL ÉTAT DE CHARGEMENT

  const setAuthHeader = (token) => {
    // ... (Votre fonction reste inchangée)
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token; 
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("admin");
      if (saved && saved !== "undefined") {
        const adminData = JSON.parse(saved);
        setAdmin(adminData);
        if (adminData.token) {
          setAuthHeader(adminData.token);
        }
      }
    } catch (err) {
      console.error("Erreur parsing JSON admin :", err);
      localStorage.removeItem("admin");
    } finally {
      setLoading(false); // ⬅️ METTRE loading À false APRÈS LA VÉRIFICATION
    }
  }, []);

  const login = (data) => {
    // ... (Votre fonction reste inchangée)
    localStorage.setItem("admin", JSON.stringify(data));
    setAdmin(data);
    if (data.token) {
      setAuthHeader(data.token);
    }
  };

  const logout = () => {
    // ... (Votre fonction reste inchangée)
    localStorage.removeItem("admin");
    setAdmin(null);
    setAuthHeader(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}> 
      {children}
    </AuthContext.Provider>
  );
}