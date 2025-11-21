import React, { useContext } from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Alert, TouchableOpacity } from "react-native";

// Importez les icônes (exemple avec 'Ionicons')
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import HistoryScreen from "../screens/HistoryScreen";

import DashboardScreen from "../screens/DashboardScreen";
import MachineDetailsScreen from "../screens/MachineDetailsScreen";
import AlertsScreen from "../screens/AlertsScreen";
import AlertDetailsScreen from "../screens/AlertDetailsScreen";
import ProfileScreen from "../screens/ProfileScreen";

import { AuthContext } from "../context/AuthContext"; // Importez le contexte d'auth

// Création des navigators
const Tab = createBottomTabNavigator();
const DashboardStack = createNativeStackNavigator();
const AlertsStack = createNativeStackNavigator();

// --- 1. Stack pour l'onglet Tableau de Bord (Dashboard) ---
// Ceci permet de naviguer de Dashboard à MachineDetails, etc., tout en gardant les onglets.
function DashboardStackScreen() {
  return (
    <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
      <DashboardStack.Screen name="DashboardMain" component={DashboardScreen} />
      <DashboardStack.Screen name="MachineDetails" component={MachineDetailsScreen} />
    <DashboardStack.Screen name="History" component={HistoryScreen} />
      
    </DashboardStack.Navigator>
  );
}

// --- 2. Stack pour l'onglet Alertes ---
function AlertsStackScreen() {
  return (
    <AlertsStack.Navigator screenOptions={{ headerShown: false }}>
      <AlertsStack.Screen name="AlertsMain" component={AlertsScreen} />
      <AlertsStack.Screen name="AlertDetails" component={AlertDetailsScreen} />
    </AlertsStack.Navigator>
  );
}

// --- 3. Tab Navigator Principal (le "Footer") ---
export default function AppTabs() {
  const { logout } = useContext(AuthContext); // Récupérer la fonction logout

  // Fonction pour afficher l'alerte de déconnexion
  const confirmLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Déconnexion",
          onPress: logout, // Appel de la fonction logout du contexte
          style: "destructive"
        }
      ]
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeStack') {
            iconName = focused ? 'speedometer' : 'speedometer-outline';
          } else if (route.name === 'AlertsStack') {
            iconName = focused ? 'alert-circle' : 'alert-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Logout') {
            iconName = focused ? 'log-out' : 'log-out-outline';
          }

          // Vous pouvez ajuster la couleur ici si nécessaire, ou laisser le style par défaut
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007BFF', // Couleur active
        tabBarInactiveTintColor: 'gray', // Couleur inactive
        tabBarStyle: { height: 60, paddingBottom: 5 }, // Style du pied de page
        headerShown: false, // Cache l'en-tête par défaut car chaque Stack a son propre en-tête
      })}
    >
      <Tab.Screen 
        name="HomeStack" 
        component={DashboardStackScreen} 
        options={{ 
          title: 'Dashboard',
        }} 
      />
      
      <Tab.Screen 
        name="AlertsStack" 
        component={AlertsStackScreen} 
        options={{ 
          title: 'Alertes',
          // Exemple d'un badge de notification
          // tabBarBadge: 3, 
          // tabBarBadgeStyle: { backgroundColor: 'red' }
        }} 
      />
      
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          title: 'Profil',
        }} 
      />

      {/* --- Onglet de Déconnexion --- */}
      <Tab.Screen 
        name="Logout" 
        component={() => null} // L'onglet n'a pas de composant, l'action est dans `tabBarButton`
        options={{ 
          title: 'Déconnexion',
          tabBarButton: (props) => (
            <TouchableOpacity 
              {...props} 
              onPress={confirmLogout} 
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            />
          ),
        }} 
      />
    </Tab.Navigator>
  );
}