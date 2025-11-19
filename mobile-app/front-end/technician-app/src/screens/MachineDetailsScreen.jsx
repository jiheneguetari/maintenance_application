import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import api from "../api/axios";

export default function MachineDetailsScreen({ route, navigation }) {
  const { id } = route.params;
  const [machine, setMachine] = useState(null);

  useEffect(() => {
    api.get(`/machines/${id}`).then(res => setMachine(res.data));
  }, []);

  if (!machine) return <Text>Chargement...</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>{machine.name}</Text>

      <Text style={styles.info}>Température: {machine.temp}°C</Text>
      <Text style={styles.info}>Vibration: {machine.vibration}</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("History", { id })}
      >
        <Text style={{ color: "#fff" }}>Voir Historique</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  info: { fontSize: 18, marginTop: 10 },
  btn: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
};
