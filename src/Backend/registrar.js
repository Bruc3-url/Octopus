import { supabase } from "./supabase";

export async function registrarUsuario({ usuario, nombre, correo, password }) {
  const { data, error } = await supabase.auth.signUp({
    email: correo.trim().toLowerCase(),
    password,
    options: {
      data: {
        usuario: usuario.trim(),
        nombre: nombre.trim(),
      },
    },
  });

  return { data, error };
}

export async function iniciarSesion({ correo, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: correo.trim().toLowerCase(),
    password,
  });

  return { data, error };
}

export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function obtenerSesion() {
  return supabase.auth.getSession();
}

export function escucharCambiosDeSesion(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return subscription;
}
