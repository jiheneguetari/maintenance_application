import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import api from "../api/axios";

export default function DashboardScreen({ navigation }) {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    api.get("/machines").then(res => setMachines(res.data));
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 10 }}>
        Machines
      </Text>

      <FlatList
        data={machines}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("MachineDetails", { id: item._id })}
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text>Temp: {item.temp}°C</Text>
            <Text>Vibration: {item.vibration}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = {
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
};
