import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import Ionicons from 'react-native-vector-icons/Ionicons'; // Pour les icônes

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  // Assurez-vous que l'objet user est chargé avant d'essayer d'accéder à ses propriétés
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* --- Section En-tête du Profil --- */}
      <View style={styles.profileHeader}>
        {/* Icône de l'utilisateur (peut être remplacée par une image de profil) */}
        <View style={styles.avatar}>
          <Ionicons name="person-circle-outline" size={90} color="#007BFF" />
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userRole}>Technicien</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informations du Compte</Text>
        
        {/* --- Ligne d'Information Email --- */}
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color="#6C757D" style={styles.infoIcon} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
        </View>

        {/* --- Ligne d'Information ID (Optionnel, utile pour le support) --- */}
        <View style={styles.infoRow}>
          <Ionicons name="id-card-outline" size={20} color="#6C757D" style={styles.infoIcon} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>ID Utilisateur</Text>
            <Text style={styles.infoValue}>{user._id ? user._id.substring(0, 8) + '...' : 'N/A'}</Text>
          </View>
        </View>

      </View>

      {/* --- Bouton de Déconnexion --- */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutBtnText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC', // Fond clair
    paddingHorizontal: 20,
  },
  
  // --- Section En-tête du Profil ---
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 70,
    marginTop: 40, // Espace pour descendre sous l'encoche/barre d'état
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  userRole: {
    fontSize: 16,
    color: '#007BFF', // Couleur primaire
    marginTop: 4,
    fontWeight: '500',
  },

  // --- Section Information ---
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 15,
    width: 20,
    textAlign: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },

  // --- Bouton Déconnexion ---
  logoutBtn: {
    backgroundColor: "#DC3545", // Couleur rouge pour l'action destructive
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: "#DC3545",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});