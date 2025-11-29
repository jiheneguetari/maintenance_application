import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import api from "../api/axios";

const DashboardScreen = ({ navigation }) => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chargement des machines
  const fetchMachines = async () => {
    try {
      const res = await api.get("/machines");
      setMachines(res.data);
    } catch (err) {
      console.log("Erreur chargement machines :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  // Fonction d’état
  const getStatusIndicator = (machine) => {
    const isGlobalAlert = machine.status === "alert";
    const isTempAlert = machine.lastTemperature > machine.seuilTemp;
    const isVibAlert = machine.lastVibration > machine.seuilVib;

    return {
      isGlobalAlert,
      isTempAlert,
      isVibAlert,
      statusText: isGlobalAlert ? "Alerte Active" : "Fonctionnement Normal",
      statusColor: isGlobalAlert ? "#B91C1C" : "#10B981",
    };
  };

  // Composant carte machine
  const MachineCard = ({ item }) => {
    const { isGlobalAlert, isTempAlert, isVibAlert, statusText, statusColor } =
      getStatusIndicator(item);

    return (
      <TouchableOpacity
        style={[styles.card, isGlobalAlert && styles.alertCard]}
        onPress={() =>
          navigation.navigate("MachineDetails", { id: item._id, name: item.name })
        }
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.name}</Text>

          {isGlobalAlert && (
            <View style={styles.badgeAlert}>
              <Ionicons name="warning-outline" size={16} color="#B91C1C" />
              <Text style={styles.badgeAlertText}>ALERTE ACTIVE</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.row}>
            <Ionicons
              name="thermometer-outline"
              size={18}
              color={isTempAlert ? "#B91C1C" : "#2563EB"}
            />
            <Text style={styles.label}>Température :</Text>
            <Text style={[styles.value, isTempAlert && styles.alertValue]}>
              {item.lastTemperature}°C
            </Text>
            <Text style={styles.threshold}>({item.seuilTemp}°C)</Text>
          </View>

          <View style={styles.row}>
            <Ionicons
              name="pulse-outline"
              size={18}
              color={isVibAlert ? "#B91C1C" : "#10B981"}
            />
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
  };

  // ---- RENDER PRINCIPAL ----
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      {loading ? (
        <Text style={styles.empty}>Chargement...</Text>
      ) : machines.length === 0 ? (
        <Text style={styles.empty}>Aucune machine trouvée.</Text>
      ) : (
        <FlatList
          data={machines}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <MachineCard item={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default DashboardScreen;

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
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
