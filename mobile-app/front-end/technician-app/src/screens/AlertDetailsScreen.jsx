import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import api from "../api/axios";

export default function AlertDetailsScreen({ route }) {
  const { id } = route.params;
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    api.get(`/alerts/${id}`).then(res => setAlert(res.data));
  }, []);

  const updateStatus = async (status) => {
    await api.put(`/alerts/${id}`, { status });
    alert("Statut mis à jour !");
  };

  if (!alert) return <Text>Chargement...</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>
        {alert.machineName}
      </Text>

      <Text>Type : {alert.type}</Text>
      <Text>Valeur : {alert.value}</Text>
      <Text>Statut : {alert.status}</Text>

      <TouchableOpacity style={styles.btn} onPress={() => updateStatus("en cours")}>
        <Text style={{ color: "#fff" }}>Prendre en charge</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn2} onPress={() => updateStatus("résolue")}>
        <Text style={{ color: "#fff" }}>Marquer résolue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  btn: {
    backgroundColor: "#FFA500",
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  btn2: {
    backgroundColor: "#28A745",
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
    alignItems: "center",
  },
};
