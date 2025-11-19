import { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/users/login", { email, password });
      login(res.data);
    } catch {
      alert("Email ou mot de passe incorrect");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
        Connexion Technicien
      </Text>

      <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} />
      <TextInput placeholder="Mot de passe" style={styles.input} secureTextEntry onChangeText={setPassword} />

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={{ color: "#fff" }}>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8
  },
  btn: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center"
  },
};
