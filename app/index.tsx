import RegistroScreen from "../src/Frontend/registro";

/**
 * Ruta raíz ("/") de la app.
 *
 * Muestra la pantalla de registro (src/Frontend/registro.js) en lugar del
 * "Hello World" del template de Expo.
 *
 * Si luego quieres una portada distinta: mueve el registro a app/registro.tsx
 * y deja aquí la pantalla de inicio, o navega con `router.push("/registro")`.
 */
export default function Index() {
  return <RegistroScreen />;
}
