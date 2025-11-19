import { View, Text, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>Profil</Text>

      <Text style={styles.info}>Nom: {user.name}</Text>
      <Text style={styles.info}>Email: {user.email}</Text>

      <TouchableOpacity style={styles.btn} onPress={logout}>
        <Text style={{ color: "#fff" }}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  info: { fontSize: 18, marginVertical: 10 },
  btn: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
};
