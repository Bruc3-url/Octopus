import { supabase } from "./supabase";

export async function registrarUsuario({ alias, correo, password }) {
  const cleanEmail = correo?.trim().toLowerCase();
  const cleanAlias = alias?.trim();

  return supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: {
        alias: cleanAlias,
      },
    },
  });
}

export async function iniciarSesion({ correo, password }) {
  const cleanEmail = correo?.trim().toLowerCase();

  return supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });
}

export async function reenviarConfirmacion(correo) {
  const cleanEmail = correo?.trim().toLowerCase();

  return supabase.auth.resend({
    type: "signup",
    email: cleanEmail,
  });
}

export async function cerrarSesion() {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (_err) {
    return { error: null };
  }
}

export async function obtenerSesion() {
  try {
    return await supabase.auth.getSession();
  } catch (_err) {
    return { data: { session: null }, error: null };
  }
}

export function escucharCambiosDeSesion(callback) {
  try {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });

    return subscription;
  } catch (_err) {
    return { unsubscribe: () => {} };
  }
}
