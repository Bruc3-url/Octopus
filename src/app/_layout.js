import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="registro" />
      <Stack.Screen name="login" />
      <Stack.Screen name="home" />
      <Stack.Screen name="mascota" />
      <Stack.Screen name="proyectos" />
      <Stack.Screen name="nueva-tarea" options={{ presentation: "card" }} />
      <Stack.Screen name="nuevo-proyecto" options={{ presentation: "card" }} />
    </Stack>
  );
}
