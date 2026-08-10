/**
 * Português do Brasil — Reflection UI Text Content
 *
 * Conteúdo de UI nativo para o recurso de Reflexão Guiada.
 */

import type { ReflectionUiStrings } from "@/content/en/diary/reflection-ui";

export const PT_BR_REFLECTION_UI: ReflectionUiStrings = {
  title: "Reflexão Guiada CBT-I",
  subtitle: "Três perguntas diárias para explorar sua relação com o sono",
  promptsHeader: "Perguntas de hoje",
  word: "palavra",
  wordCount: "contagem de palavras",
  wordLimit: "palavras",
  wordLimitReached: "Limite de palavras atingido — você ainda pode editar e apagar",
  saveButton: "Salvar Reflexão",
  historyButton: "Ver Histórico",
  syncButton: "Sincronizar em dispositivos",
  saveStatus: {
    idle: "",
    saving: "Salvando...",
    saved: "Salvo localmente",
    error: "Falha ao salvar",
    unsaved: "Alterações não salvas",
  },
  toast: {
    saved: "Reflexão salva com sucesso",
    saveError: "Não foi possível salvar sua reflexão. Tente novamente.",
    deleted: "Reflexão excluída",
    deleteError: "Não foi possível excluir a reflexão. Tente novamente.",
  },
  history: {
    title: "Histórico de Reflexões",
    empty: "Ainda não há reflexões. Comece com a de hoje!",
    backToToday: "Voltar para Hoje",
    edit: "Editar",
    delete: "Excluir",
    deleteConfirm: "Tem certeza de que deseja excluir esta reflexão? Isso não pode ser desfeito.",
    deleteConfirmAction: "Excluir",
    cancel: "Cancelar",
  },
  privacy:
    "Suas reflexões são armazenadas localmente no seu dispositivo e nunca enviadas aos nossos servidores.",
  accessibility: {
    editorLabel: "Editor de reflexão. Três perguntas diárias para explorar sua relação com o sono",
    wordCountAnnounce: "Você escreveu",
    savedAnnounce: "Sua reflexão foi salva localmente",
  },
  stats: {
    streak: "dias consecutivos",
    thisMonth: "este mês",
    total: "reflexões totais",
  },
};
