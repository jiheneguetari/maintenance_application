import { NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import AppTabs from "./AppTabs";

export default function MainNavigation() {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {user ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
