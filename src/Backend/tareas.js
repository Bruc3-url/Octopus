import AsyncStorage from "@react-native-async-storage/async-storage";

const TASKS_STORAGE_KEY = "@octopus/tasks_v1";

const DEFAULT_TASKS = [
  {
    id: "1",
    title: "Agendar una tarea",
    desc: "",
    time: "09:00 AM",
    category: "Personal",
    priority: "Alta",
    completed: false,
    createdAt: Date.now(),
  },
  {
    id: "2",
    title: "Agendar un proyecto",
    desc: "",
    time: "11:30 AM",
    category: "Profesional",
    priority: "Media",
    completed: false,
    createdAt: Date.now() + 1,
  },
];

let listeners = [];

export function subscribeTasks(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function notifyListeners(tasks) {
  listeners.forEach((listener) => {
    try {
      listener(tasks);
    } catch (_err) {
      // Ignorar errores de callback
    }
  });
}

export async function obtenerTareas() {
  try {
    const json = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    if (!json) {
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(DEFAULT_TASKS));
      return DEFAULT_TASKS;
    }
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : DEFAULT_TASKS;
  } catch (_e) {
    return DEFAULT_TASKS;
  }
}

export async function guardarNuevaTarea(tarea) {
  try {
    const actual = await obtenerTareas();
    const nueva = {
      id: "task-" + Date.now(),
      title: tarea.title.trim(),
      desc: tarea.desc?.trim() || "",
      time: tarea.time || "15:00",
      category: tarea.category || "Personal",
      priority: tarea.priority || "Media",
      duration: tarea.duration || "30m",
      date: tarea.date || "Hoy",
      validationMethod: tarea.validationMethod || "timer",
      completed: false,
      createdAt: Date.now(),
    };
    const listaActualizada = [...actual, nueva];
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(listaActualizada));
    notifyListeners(listaActualizada);
    return nueva;
  } catch (_e) {
    return null;
  }
}

export async function toggleTareaCompletada(taskId) {
  try {
    const actual = await obtenerTareas();
    const listaActualizada = actual.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t,
    );
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(listaActualizada));
    notifyListeners(listaActualizada);
    return listaActualizada;
  } catch (_e) {
    return null;
  }
}

