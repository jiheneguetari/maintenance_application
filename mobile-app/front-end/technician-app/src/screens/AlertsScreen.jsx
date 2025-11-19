import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import api from "../api/axios";

export default function AlertsScreen({ navigation }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    api.get("/alerts").then(res => setAlerts(res.data));
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>Alertes</Text>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("AlertDetails", { id: item._id })}
          >
            <Text style={styles.title}>{item.machineName}</Text>
            <Text>{item.type}</Text>
            <Text>{item.value}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = {
  card: {
    padding: 15,
    backgroundColor: "#eee",
    marginBottom: 10,
    borderRadius: 8,
  },
  title: { fontSize: 18, fontWeight: "bold" },
};
