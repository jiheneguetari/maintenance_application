import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import api from "../api/axios";

export default function MachineDetailsScreen({ route, navigation }) {
  const { id } = route.params;
  const [machine, setMachine] = useState(null);

  useEffect(() => {
    api.get(`/machines/${id}`).then(res => setMachine(res.data));
  }, []);

  if (!machine) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loading}>Chargement...</Text>
      </View>
    );
  }

  // Détection alertes
  const isTempAlert = machine.lastTemperature > machine.seuilTemp;
  const isVibAlert = machine.lastVibration > machine.seuilVib;
  const isAlert = isTempAlert || isVibAlert;

  const statusColor = isAlert ? "#DC2626" : "#10B981";

  return (
    <ScrollView style={styles.container}>
      {/* TITRE */}
      <Text style={styles.title}>{machine.name}</Text>

      {/* BADGE STATUT */}
      <View style={[styles.statusBadge, { backgroundColor: `${statusColor}22`, borderColor: statusColor }]}>
        <Ionicons
          name={isAlert ? "warning" : "checkmark-circle-outline"}
          size={18}
          color={statusColor}
        />
        <Text style={[styles.statusText, { color: statusColor }]}>
          {isAlert ? "Alerte détectée" : "Fonctionnement normal"}
        </Text>
      </View>

      {/* CARD INFO MACHINE */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="thermometer-outline" size={22} color="#2563EB" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.label}>Température actuelle</Text>
            <Text style={[styles.value, isTempAlert && styles.alertValue]}>
              {machine.lastTemperature}°C
            </Text>
            <Text style={styles.threshold}>Seuil : {machine.seuilTemp}°C</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.row}>
          <Ionicons name="pulse-outline" size={22} color="#10B981" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.label}>Vibration actuelle</Text>
            <Text style={[styles.value, isVibAlert && styles.alertValue]}>
              {machine.lastVibration}
            </Text>
            <Text style={styles.threshold}>Seuil : {machine.seuilVib}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.row}>
          <Ionicons name="time-outline" size={22} color="#6B7280" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.label}>Dernière mise à jour</Text>
            <Text style={styles.value}>
              {new Date(machine.updatedAt).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* BOUTON HISTORIQUE */}
      <TouchableOpacity
        style={styles.historyBtn}
        onPress={() => navigation.navigate("History", { id })}
      >
        <Ionicons name="bar-chart-outline" size={20} color="#fff" />
        <Text style={styles.historyText}>Voir Historique</Text>
      </TouchableOpacity>

      {/* BOUTON RETOUR */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.backText}>Revenir</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F3F4F6", marginTop:70 },

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loading: { fontSize: 18, color: "#6B7280" },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111827",
  },

  statusBadge: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
    alignSelf: "flex-start",
    alignItems: "center",
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 25,
  },

  row: { flexDirection: "row", alignItems: "center" },

  label: { fontSize: 14, color: "#6B7280" },
  value: { fontSize: 18, fontWeight: "700", color: "#111827" },
  threshold: { fontSize: 12, color: "#9CA3AF" },

  alertValue: { color: "#DC2626" },

  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 15,
  },

  historyBtn: {
    flexDirection: "row",
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  historyText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 10,
  },

  backBtn: {
    flexDirection: "row",
    backgroundColor: "#6B7280",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 8,
  },
});
