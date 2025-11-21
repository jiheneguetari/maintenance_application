import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import api from "../api/axios";

// --- LOGIQUE D'ÉTAT CORRIGÉE ---
const getStatusIndicator = (machine) => {
    // Le statut global "alert" vient de la route GET /machines (Backend)
    const isGlobalAlert = machine.status === 'alert'; 

    // Les indicateurs spécifiques sont toujours utiles pour colorer les valeurs
    const isTempAlert = machine.lastTemperature > machine.seuilTemp;
    const isVibAlert = machine.lastVibration > machine.seuilVib;

    // Détermination de l'état (Santé vs Alerte)
    let statusText;
    let statusColor;

    if (isGlobalAlert) {
        statusText = 'Alerte Active';
        statusColor = '#B91C1C'; // Rouge
    } else {
        // Supposons que tout est 'normal' si ce n'est pas 'alert'
        statusText = 'Fonctionnement Normal';
        statusColor = '#10B981'; // Vert
    }
    
    return {
        isGlobalAlert, // Devrait être TRUE si machine.status === 'alert'
        isTempAlert,   // Est TRUE si la dernière mesure dépasse le seuil
        isVibAlert,    // Est TRUE si la dernière mesure dépasse le seuil
        statusText,
        statusColor,
    };
};

// Composant MachineCard mis à jour
const MachineCard = React.memo(({ item, navigation }) => {
    // Renommage de isAlert en isGlobalAlert pour plus de clarté
    const { isGlobalAlert, isTempAlert, isVibAlert, statusColor, statusText } =
        getStatusIndicator(item);

    return (
        <TouchableOpacity
            style={[styles.card, isGlobalAlert && styles.alertCard]} 
            onPress={() => navigation.navigate("MachineDetails", { id: item._id, name: item.name })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.name}</Text>

                {isGlobalAlert && ( // Afficher le badge d'alerte basé sur le statut global
                    <View style={styles.badgeAlert}>
                        <Ionicons name="warning-outline" size={16} color="#B91C1C" />
                        <Text style={styles.badgeAlertText}>ALERTE ACTIVE</Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                
                {/* Température */}
                <View style={styles.row}>
                    <Ionicons name="thermometer-outline" size={18} color={isTempAlert ? '#B91C1C' : '#2563EB'} /> {/* Rouge si alerte locale */}
                    <Text style={styles.label}>Température :</Text>
                    <Text style={[styles.value, isTempAlert && styles.alertValue]}>
                        {item.lastTemperature}°C
                    </Text>
                    <Text style={styles.threshold}>({item.seuilTemp}°C)</Text>
                </View>

                {/* Vibration */}
                <View style={styles.row}>
                    <Ionicons name="pulse-outline" size={18} color={isVibAlert ? '#B91C1C' : '#10B981'} /> {/* Rouge si alerte locale */}
                    <Text style={styles.label}>Vibration :</Text>
                    <Text style={[styles.value, isVibAlert && styles.alertValue]}>
                        {item.lastVibration}
                    </Text>
                    <Text style={styles.threshold}>({item.seuilVib})</Text>
                </View>

                <View style={[styles.statusBox, { borderColor: statusColor }]}>
                    <Ionicons
                        name={isGlobalAlert ? "alert-circle" : "checkmark-circle"} 
                        size={14}
                        color={statusColor}
                    />
                    <Text style={[styles.statusText, { color: statusColor }]}>
                        {statusText}
                    </Text>
                </View>
            </View>

            <Ionicons name="chevron-forward" size={22} color="#6B7280" style={styles.chevron} />
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6", paddingHorizontal: 18 },
  
  header: {
    fontSize: 30,
    fontWeight: "700",
    marginTop: 65,
    marginBottom: 15,
    color: "#111827",
  },

  list: { paddingBottom: 30 },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    position: "relative",
  },

  alertCard: {
    borderColor: "#DC2626",
    backgroundColor: "#FFF1F2",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },

  badgeAlert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },

  badgeAlertText: {
    color: "#991B1B",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 5,
  },

  content: { gap: 6 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },

  label: { fontSize: 14, color: "#6B7280" },

  value: { fontSize: 15, fontWeight: "600", color: "#111827" },

  threshold: { fontSize: 13, color: "#9CA3AF" },

  alertValue: { color: "#DC2626" },

  statusBox: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 5,
  },

  chevron: { position: "absolute", right: 15, top: "50%" },

  empty: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#6B7280",
  },
});
