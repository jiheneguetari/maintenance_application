import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import api from "../api/axios";

export default function AlertDetailsScreen({ route }) {
  const { id } = route.params;
  const [alertData, setAlertData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlertDetails();
  }, [id]);

  const loadAlertDetails = async () => {
    try {
      const res = await api.get(`/alerts/${id}`);
      setAlertData(res.data);
    } catch (err) {
      console.error("Load alert details:", err);
    }
    setLoading(false);
  };

  const updateStatus = async (newStatus) => {
    try {
      await api.put(`/alerts/${id}/status`, { status: newStatus });
      setAlertData(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error("Update status failed:", err);
      alert("Impossible de mettre à jour le statut.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (!alertData) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Alerte introuvable.</Text>
      </View>
    );
  }

  const statusColor = {
    active: "#dc2626",
    en_cours: "#f59e0b",
    resolue: "#10b981",
    ignoree: "#6b7280",
  }[alertData.status];

  return (
    <View style={styles.container}>
      
      <View style={styles.card}>
        <Text style={styles.title}>Alerte : {alertData.machineId}</Text>

        <Text style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          {alertData.status.toUpperCase()}
        </Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Type :</Text>
          <Text style={styles.value}>{alertData.type}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Valeur :</Text>
          <Text style={styles.value}>{String(alertData.value)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Date :</Text>
          <Text style={styles.value}>{new Date(alertData.date).toLocaleString()}</Text>
        </View>

        {alertData.message ? (
          <View style={styles.detailCol}>
            <Text style={styles.label}>Message :</Text>
            <Text style={styles.message}>{alertData.message}</Text>
          </View>
        ) : null}
      </View>
      
      <View style={styles.buttons}>
        {alertData.status !== "resolue" && alertData.status !== "en_cours" && (
          <TouchableOpacity 
            style={[styles.btn, { backgroundColor: "#f59e0b" }]}
            onPress={() => updateStatus("en_cours")}
          >
            <Text style={styles.btnText}>Prendre en charge</Text>
          </TouchableOpacity>
        )}

        {alertData.status !== "resolue" && (
          <TouchableOpacity 
            style={[styles.btn, { backgroundColor: "#10b981" }]}
            onPress={() => updateStatus("resolue")}
          >
            <Text style={styles.btnText}>Marquer résolue</Text>
          </TouchableOpacity>
        )}

        {alertData.status !== "ignoree" && alertData.status !== "resolue" && (
          <TouchableOpacity 
            style={[styles.btn, { backgroundColor: "#6b7280" }]}
            onPress={() => updateStatus("ignoree")}
          >
            <Text style={styles.btnText}>Ignorer</Text>
          </TouchableOpacity>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#f3f4f6" },

  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 25,
    marginTop:100
  },

  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, color: "#111827" },

  statusBadge: {
    color: "white",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 20,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  detailCol: { marginTop: 10 },

  label: { fontSize: 16, fontWeight: "600", color: "#374151" },
  value: { fontSize: 16, color: "#111827" },
  message: { fontSize: 15, marginTop: 4, color: "#4b5563" },

  buttons: { gap: 12 },

  btn: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
