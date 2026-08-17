/**
 * Español — Reflection UI Text Content
 *
 * Contenido de UI nativo para la característica de Reflexión Guiada.
 */

import type { ReflectionUiStrings } from "@/content/en/diary/reflection-ui";

export const ES_REFLECTION_UI: ReflectionUiStrings = {
  title: "Reflexión Guiada CBT-I",
  subtitle: "Tres preguntas diarias para explorar tu relación con el sueño",
  promptsHeader: "Preguntas de hoy",
  word: "palabra",
  wordCount: "conteo de palabras",
  wordLimit: "palabras",
  wordLimitReached: "Límite de palabras alcanzado — aún puedes editar y borrar",
  saveButton: "Guardar Reflexión",
  saveChangesButton: "Guardar cambios",
  historyButton: "Ver Historial",
  syncButton: "Sincronizar en dispositivos",
  saveStatus: {
    idle: "",
    saving: "Guardando...",
    saved: "Guardado localmente",
    error: "Error al guardar",
    unsaved: "Cambios sin guardar",
  },
  toast: {
    saved: "Reflexión guardada correctamente",
    saveError: "No se pudo guardar tu reflexión. Inténtalo de nuevo.",
    deleted: "Reflexión eliminada",
    deleteError: "No se pudo eliminar la reflexión. Inténtalo de nuevo.",
    copied: "Copiado al portapapeles",
    copyError: "No se pudo copiar al portapapeles",
  },
  timeline: {
    tabToday: "Hoy",
    tabTimeline: "Línea de tiempo",
    title: "Historial de Reflexiones",
    empty: "Aún no hay reflexiones",
    emptyCta: "Escribe la reflexión de hoy",
    today: "Hoy",
    yesterday: "Ayer",
    savedLocally: "Guardado localmente",
    synced: "Sincronizado",
    pending: "Pendiente de sincronización",
    expand: "Ver más",
    collapse: "Ver menos",
    edit: "Editar",
    copy: "Copiar",
    copied: "Copiado",
    delete: "Eliminar",
    deleteConfirm: "¿Estás seguro de que quieres eliminar esta reflexión? No se puede deshacer.",
    deleteConfirmAction: "Eliminar",
    cancel: "Cancelar",
    backToToday: "Volver a Hoy",
    total: "reflexiones totales",
  },
  history: {
    title: "Historial de Reflexiones",
    empty: "Aún no hay reflexiones. ¡Empieza con la de hoy!",
    backToToday: "Volver a Hoy",
    edit: "Editar",
    delete: "Eliminar",
    deleteConfirm: "¿Estás seguro de que quieres eliminar esta reflexión? No se puede deshacer.",
    deleteConfirmAction: "Eliminar",
    cancel: "Cancelar",
  },
  privacy:
    "Tus reflexiones se guardan localmente en tu dispositivo y nunca se envían a nuestros servidores.",
  accessibility: {
    editorLabel:
      "Editor de reflexión. Tres preguntas diarias para explorar tu relación con el sueño",
    wordCountAnnounce: "Has escrito",
    savedAnnounce: "Tu reflexión se ha guardado localmente",
    expandEntry: "Expandir entrada para leer la reflexión completa",
    collapseEntry: "Contraer entrada",
    editEntry: "Editar esta reflexión",
    copyEntry: "Copiar texto de la reflexión al portapapeles",
    deleteEntry: "Eliminar esta reflexión",
    timelineTab: "Ver línea de tiempo de reflexiones",
    todayTab: "Volver a la reflexión de hoy",
  },
  stats: {
    streak: "días seguidos",
    thisMonth: "este mes",
    total: "reflexiones totales",
  },
};
