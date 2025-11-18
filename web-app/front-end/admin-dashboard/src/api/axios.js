// src/api/axios.js

import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🚨 Intercepteur de réponses pour la gestion des erreurs d'authentification 🚨
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si la réponse a un statut 401 (Unauthorized) ou 403 (Forbidden)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
      console.log("Token invalide ou expiré. Déconnexion forcée.");

      // 1. Nettoyer le localStorage
      localStorage.removeItem("admin");
      
      // 2. Rediriger l'utilisateur vers la page de login (/)
      // window.location.href force un rechargement pour réinitialiser le contexte
      window.location.href = "/"; 
    }
    return Promise.reject(error);
  }
);

export default instance;