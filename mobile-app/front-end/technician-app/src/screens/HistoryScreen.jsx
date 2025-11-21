import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import api from "../api/axios";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

const HistoryCard = ({ item, seuilTemp, seuilVib }) => {
  const isTempAlert = item.temperature > seuilTemp;
  const isVibAlert = item.vibrationValue > seuilVib;
  const isAlert = isTempAlert || isVibAlert;

  const formatted = new Date(item.date).toLocaleString("fr-FR", { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={[styles.card, isAlert ? styles.cardAlert : null]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{formatted}</Text>
        <Text style={styles.cardStatus}>{isAlert ? "ALERTE" : "OK"}</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="thermometer-outline" size={18} color={isTempAlert ? "#DC2626" : "#2563EB"} />
        <Text style={styles.label}>Température</Text>
        <Text style={[styles.value, isTempAlert && styles.valueAlert]}>{item.temperature}°C</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="pulse-outline" size={18} color={isVibAlert ? "#DC2626" : "#10B981"} />
        <Text style={styles.label}>Vibration</Text>
        <Text style={[styles.value, isVibAlert && styles.valueAlert]}>{item.vibrationValue}</Text>
      </View>
    </View>
  );
};

export default function HistoryScreen({ route, navigation }) {
  const { id, seuilTemp: routeSeuilTemp, seuilVib: routeSeuilVib } = route.params;
  const [machine, setMachine] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // 1) load machine details (to get seuils)
      const mRes = await api.get(`/machines/${id}`);
      const machineDetails = mRes.data;
      setMachine(machineDetails);

      // 2) load history from API
      const hRes = await api.get(`/machines/${encodeURIComponent(machineDetails.name)}/history?limit=200`);
      setHistory(hRes.data);
    } catch (err) {
      console.error("History load error:", err);
      // show user feedback if needed
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const totalAlerts = useMemo(() => history.filter(h => (h.temperature > (machine?.seuilTemp ?? routeSeuilTemp) || h.vibrationValue > (machine?.seuilVib ?? routeSeuilVib))).length, [history, machine, routeSeuilTemp, routeSeuilVib]);

  if (loading) return (
    <View style={styles.loading}><ActivityIndicator size="large" color="#6B7280" /></View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique — {machine?.name || id}</Text>

      <View style={styles.summary}>
        <Ionicons name="time-outline" size={20} color="#374151" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.summaryTitle}>Points analysés</Text>
          <Text style={styles.summaryValue}>{history.length} mesures • {totalAlerts} alertes</Text>
        </View>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item._id || item.id || String(item.date)}
        renderItem={({ item }) => (
          <HistoryCard item={item} seuilTemp={machine?.seuilTemp} seuilVib={machine?.seuilVib} />
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={18} color="#fff" />
        <Text style={styles.backText}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F8FAFC" },
  title: { fontSize: 22, fontWeight: "700", marginVertical: 12 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  summary: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 12 },
  summaryTitle: { fontSize: 13, color: "#374151" },
  summaryValue: { fontSize: 15, fontWeight: "700" },

  card: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: "#E6E7EA" },
  cardAlert: { borderLeftWidth: 4, borderLeftColor: "#DC2626" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  cardTitle: { fontWeight: "700" },
  cardStatus: { fontWeight: "700", color: "#DC2626" },

  row: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  label: { marginLeft: 8, color: "#6B7280", minWidth: 100 },
  value: { marginLeft: 8, fontWeight: "700" },
  valueAlert: { color: "#DC2626" },

  backBtn: { flexDirection: "row", backgroundColor: "#374151", padding: 12, borderRadius: 10, justifyContent: "center", alignItems: "center", marginTop: 12 },
  backText: { color: "#fff", marginLeft: 8, fontWeight: "700" }
});
