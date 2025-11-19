import { AuthProvider } from "./src/context/AuthContext";
import MainNavigation from "./src/navigation/MainNavigation";

export default function App() {
  return (
    <AuthProvider>
      <MainNavigation />
    </AuthProvider>
  );
}
