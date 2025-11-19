import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "../screens/DashboardScreen";
import MachineDetailsScreen from "../screens/MachineDetailsScreen";
import HistoryScreen from "../screens/HistoryScreen";
import AlertsScreen from "../screens/AlertsScreen";
import AlertDetailsScreen from "../screens/AlertDetailsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="MachineDetails" component={MachineDetailsScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Alerts" component={AlertsScreen} />
      <Stack.Screen name="AlertDetails" component={AlertDetailsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
