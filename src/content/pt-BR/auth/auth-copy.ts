/**
 * Sleep Diary v2.3 - Brazilian Portuguese Authentication Content
 *
 * Natively authored Brazilian Portuguese content for the authentication modal.
 * NOT translated from English.
 *
 * Tone: calm, professional, warm, privacy-conscious
 */

import type { ContentPackage } from "../../content-types";
import type { AuthCopy } from "../../en/auth/auth-copy";

export const authCopyPtBr: ContentPackage<AuthCopy> = {
  metadata: {
    locale: "pt-BR",
    version: "1.0.0",
    reviewedAt: "2026-07-24",
    reviewedBy: "content-team-pt",
    medicalReviewStatus: "approved",
    nativeReviewStatus: "approved",
    lastUpdated: "2026-07-24",
  },
  content: {
    modal: {
      title: "Sincronize Sua Jornada de Sono",
      subtitle:
        "Mantenha seus registros de sono e reflexões seguros, e continue em qualquer dispositivo.",
      privacyNote: "Sem senha necessária. Seus dados privados de sono permanecem privados.",
    },
    emailForm: {
      label: "Endereço de e-mail",
      placeholder: "voce@exemplo.com",
      button: "Enviar código de verificação",
      sending: "Enviando...",
    },
    otpForm: {
      title: "Verifique seu e-mail",
      instructions:
        "Enviamos um código de verificação de 6 dígitos para seu e-mail. Digite-o abaixo para continuar.",
      codeLabel: "Código de verificação",
      verifyButton: "Verificar e continuar",
      verifying: "Verificando...",
      resendButton: "Reenviar código",
      resendWaiting: "Reenvio disponível em",
    },
    success: {
      title: "Verificado!",
      message: "Seus dados de sono agora estão sincronizados com segurança.",
      continueButton: "Continuar",
    },
    errors: {
      invalidEmail: "Por favor, digite um endereço de e-mail válido.",
      codeInvalid: "Esse código não confere. Por favor, tente novamente.",
      codeExpired: "Este código expirou. Por favor, solicite um novo.",
      maxAttempts: "Muitas tentativas. Por favor, solicite um código novo.",
      rateLimited: "Muitas solicitações. Por favor, tente novamente mais tarde.",
      networkError: "Problema de conexão. Verifique sua internet e tente novamente.",
      unknownError: "Algo deu errado. Por favor, tente novamente.",
      emailSendFailed:
        "Não conseguimos enviar o e-mail de verificação. Por favor, tente novamente.",
    },
    identityMenu: {
      syncProgress: "Sincronizar Progresso",
      account: "Conta",
      dashboard: "Painel",
      sleepDiary: "Diário de Sono",
      reminderCenter: "Central de Lembretes",
      syncStatus: "Status da Sincronização",
      settings: "Configurações",
      exportData: "Exportar Meus Dados",
      deleteData: "Excluir Meus Dados",
      privacy: "Privacidade",
      signOut: "Sair",
      syncConnected: "Sincronização na nuvem conectada",
      syncOffline: "Modo offline",
    },
    intentLabels: {
      sync_diary: "Sincronize seu diário de sono",
      save_reflection: "Salve sua reflexão na nuvem",
      enable_reminders: "Ative lembretes por e-mail",
      restore_history: "Restaure seu histórico",
      export_data: "Exporte seus dados",
      general: "Entrar",
    },
    accountExport: {
      title: "Exporte Seus Dados",
      description:
        "Baixe uma cópia completa de seus registros de sono, reflexões e configurações como um arquivo JSON privado.",
      button: "Baixar Dados",
      downloading: "Preparando download...",
      successMessage: "Seus dados foram exportados com sucesso.",
      failureMessage: "Falha ao exportar dados. Por favor, tente novamente.",
      includes: [
        "Registros de sono e notas",
        "Reflexões guiadas CBT-I",
        "Configurações de lembretes",
        "Progresso do programa",
        "Preferências da conta",
      ],
    },
    accountDelete: {
      title: "Exclua Seus Dados",
      warning: "Esta ação não pode ser desfeita.",
      explanation:
        "Exclua permanentemente todos os seus dados de sono, reflexões e configurações dos nossos servidores. Seus dados locais também serão limpos.",
      confirmButton: "Excluir Todos os Meus Dados",
      cancelButton: "Cancelar",
      confirmationPlaceholder: 'Digite "DELETE_MY_SLEEP_DATA" para confirmar',
      confirmationPhrase: "DELETE_MY_SLEEP_DATA",
      successMessage: "Os dados da sua conta foram excluídos.",
      partialFailureMessage: "Alguns dados não puderam ser excluídos. Contate o suporte.",
      sessionRevokedMessage: "Sua sessão foi revogada.",
      clearingCacheMessage: "Limpando cache local...",
      ariaLabel: "Excluir todos os seus dados de sono e informações da conta",
    },
    sync: {
      statusLabels: {
        "local-only": "Apenas local",
        syncing: "Sincronizando...",
        synced: "Sincronizado",
        offline: "Sem conexão",
        "needs-attention": "Precisa de atenção",
        "sync-failed": "Falha na sincronização",
      },
      lastSynced: "Última sincronização",
      pendingChanges: "{count} alterações pendentes",
      conflictsNeedingReview: "{count} conflitos precisam de revisão",
      syncNow: "Sincronizar agora",
      retry: "Tentar novamente",
      resolveConflict: "Resolver conflito",
      migration: {
        preparing: "Preparando migração...",
        uploading: "Enviando seus dados...",
        merging: "Mesclando com dados na nuvem...",
        completed: "Migração concluída!",
        failed: "Falha na migração. Por favor, tente novamente.",
      },
      restore: {
        title: "Restaurando seus dados",
        progress: "Baixando da nuvem...",
        completed: "Restauração concluída!",
      },
    },
  },
};
