import AsyncStorage from "@react-native-async-storage/async-storage";

const PROJECTS_STORAGE_KEY = "@octopus/projects_v1";

const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    name: "Lanzamiento Octopus Studio",
    vision: "Crear una experiencia de productividad marina inolvidable.",
    icon: "🚀",
    color: "#0ea5e9",
    colorName: "Turquesa Octy",
    type: "deadline",
    startDate: "24 Oct",
    targetDate: "En 30 días",
    cadence: "Semanal",
    subtasks: [],
    createdAt: Date.now(),
  },
];

let listeners = [];

export function subscribeProyectos(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function notifyListeners(proyectos) {
  listeners.forEach((listener) => {
    try {
      listener(proyectos);
    } catch (_err) {
      // Ignorar errores en callback
    }
  });
}

export async function obtenerProyectos() {
  try {
    const json = await AsyncStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!json) {
      await AsyncStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
      return DEFAULT_PROJECTS;
    }
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : DEFAULT_PROJECTS;
  } catch (_e) {
    return DEFAULT_PROJECTS;
  }
}

export async function guardarNuevoProyecto(proyecto) {
  try {
    const actual = await obtenerProyectos();
    const nuevo = {
      id: "proj-" + Date.now(),
      name: proyecto.name.trim(),
      vision: proyecto.vision?.trim() || "",
      icon: proyecto.icon || "🚀",
      color: proyecto.color || "#0ea5e9",
      colorName: proyecto.colorName || "Turquesa Octy",
      type: proyecto.type || "continuous",
      startDate: proyecto.startDate || "Hoy, 24 Oct",
      targetDate: proyecto.targetDate || "Flexible",
      cadence: proyecto.cadence || "Semanal",
      subtasks: Array.isArray(proyecto.subtasks) ? proyecto.subtasks : [],
      createdAt: Date.now(),
    };
    const listaActualizada = [nuevo, ...actual];
    await AsyncStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(listaActualizada));
    notifyListeners(listaActualizada);
    return nuevo;
  } catch (_e) {
    return null;
  }
}

