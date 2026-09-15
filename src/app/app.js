import { SafeAreaProvider } from "react-native-safe-area-context";

import HomeScreen from "../screens/homescreen/homescreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
}