import { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

// Si vous avez un écran d'inscription (SignUpScreen) et un hook de navigation
// import { useNavigation } from "@react-navigation/native"; 

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  // const navigation = useNavigation(); // Décommenter si vous utilisez la navigation
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

  const handleSignUp = () => {
    // 1. Logique de navigation vers l'écran d'inscription (si disponible)
    // navigation.navigate("SignUp"); 

    // 2. Ou simple alerte pour l'exemple
    alert("Redirection vers l'écran d'inscription...");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Connexion Technicien
      </Text>

      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        onChangeText={setEmail} 
        keyboardType="email-address" // Améliore l'expérience utilisateur
        autoCapitalize="none" 
      />
      <TextInput 
        placeholder="Mot de passe" 
        style={styles.input} 
        secureTextEntry 
        onChangeText={setPassword} 
      />

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginBtnText}>Se connecter</Text>
      </TouchableOpacity>

      {/* --- Bouton d'Inscription Ajouté --- */}
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Vous n'avez pas de compte ?</Text>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.signUpBtnText}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
      {/* ------------------------------------- */}
    </View>
  );
}

// Déplacement et amélioration des styles dans un objet StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: "center", 
    padding: 20,
    backgroundColor: "#f5f5f5", // Ajout d'une couleur de fond légère
  },
  title: {
    fontSize: 32, // Légèrement plus grand
    fontWeight: "bold", 
    marginBottom: 40, // Plus d'espace sous le titre
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd", // Une couleur de bordure plus douce
    padding: 15, // Un peu plus de padding
    marginBottom: 15,
    borderRadius: 10, // Un peu plus arrondi
    backgroundColor: "#fff",
    fontSize: 16,
  },
  loginBtn: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20, // Espace avant le lien d'inscription
    elevation: 2, // Ajout d'une ombre pour Android
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  // Nouveaux styles pour le lien d'inscription
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  signUpText: {
    fontSize: 16,
    color: "#666",
    marginRight: 5,
  },
  signUpBtnText: {
    fontSize: 16,
    color: "#007BFF", // Utilise la couleur primaire pour le lien
    fontWeight: "bold",
    textDecorationLine: "underline",
  }
});