/**
 * Sleep Diary v2.3 - Spanish Authentication Content
 * 
 * Natively authored Spanish content for the authentication modal.
 * NOT translated from English.
 * 
 * Tone: calm, professional, warm, privacy-conscious
 */

import type { ContentPackage } from "../../content-types";
import type { AuthCopy } from "../../en/auth/auth-copy";

export const authCopyEs: ContentPackage<AuthCopy> = {
  metadata: {
    locale: "es",
    version: "1.0.0",
    reviewedAt: "2026-07-24",
    reviewedBy: "content-team-es",
    medicalReviewStatus: "approved",
    nativeReviewStatus: "approved",
    lastUpdated: "2026-07-24",
  },
  content: {
    modal: {
      title: "Sincroniza Tu Recorrido de Sueño",
      subtitle: "Mantén tus registros de sueño y reflexiones seguros, y continúa en cualquier dispositivo.",
      privacyNote: "No necesitas contraseña. Tus datos privados de sueño permanecen privados.",
    },
    emailForm: {
      label: "Correo electrónico",
      placeholder: "tu@ejemplo.com",
      button: "Enviar código de verificación",
      sending: "Enviando...",
    },
    otpForm: {
      title: "Revisa tu correo",
      instructions: "Enviamos un código de verificación de 6 dígitos a tu correo. Introdúcelo a continuación para continuar.",
      codeLabel: "Código de verificación",
      verifyButton: "Verificar y continuar",
      verifying: "Verificando...",
      resendButton: "Reenviar código",
      resendWaiting: "Reenvío disponible en",
    },
    success: {
      title: "¡Verificado!",
      message: "Tus datos de sueño ahora están sincronizados de forma segura.",
      continueButton: "Continuar",
    },
    errors: {
      invalidEmail: "Por favor, introduce una dirección de correo válida.",
      codeInvalid: "Ese código no coincide. Por favor, inténtalo de nuevo.",
      codeExpired: "Este código ha caducado. Por favor, solicita uno nuevo.",
      maxAttempts: "Demasiados intentos. Por favor, solicita un código nuevo.",
      rateLimited: "Demasiadas solicitudes. Por favor, inténtalo más tarde.",
      networkError: "Problema de conexión. Comprueba tu internet e inténtalo de nuevo.",
      unknownError: "Algo salió mal. Por favor, inténtalo de nuevo.",
    },
    identityMenu: {
      syncProgress: "Sincronizar Progreso",
      account: "Cuenta",
      dashboard: "Panel",
      sleepDiary: "Diario de Sueño",
      reminderCenter: "Centro de Recordatorios",
      syncStatus: "Estado de Sincronización",
      settings: "Configuración",
      exportData: "Exportar Mis Datos",
      deleteData: "Eliminar Mis Datos",
      privacy: "Privacidad",
      signOut: "Cerrar Sesión",
      syncConnected: "Sincronización en la nube conectada",
      syncOffline: "Modo sin conexión",
    },
    intentLabels: {
      sync_diary: "Sincroniza tu diario de sueño",
      save_reflection: "Guarda tu reflexión en la nube",
      enable_reminders: "Habilita recordatorios por correo electrónico",
      restore_history: "Restaura tu historial",
      export_data: "Exporta tus datos",
      general: "Iniciar sesión",
    },
    accountExport: {
      title: "Exporta Tus Datos",
      description: "Descarga una copia completa de tus registros de sueño, reflexiones y configuraciones como un archivo JSON privado.",
      button: "Descargar Datos",
      downloading: "Preparando descarga...",
      successMessage: "Tus datos han sido exportados exitosamente.",
      failureMessage: "Error al exportar datos. Por favor, inténtalo de nuevo.",
      includes: [
        "Registros de sueño y notas",
        "Reflexiones guiadas CBT-I",
        "Configuraciones de recordatorios",
        "Progreso del programa",
        "Preferencias de cuenta",
      ],
    },
    accountDelete: {
      title: "Elimina Tus Datos",
      warning: "Esta acción no se puede deshacer.",
      explanation: "Elimina permanentemente todos tus datos de sueño, reflexiones y configuraciones de nuestros servidores. Tus datos locales también serán borrados.",
      confirmButton: "Eliminar Todos Mis Datos",
      cancelButton: "Cancelar",
      confirmationPlaceholder: 'Escribe "DELETE_MY_SLEEP_DATA" para confirmar',
      confirmationPhrase: "DELETE_MY_SLEEP_DATA",
      successMessage: "Los datos de tu cuenta han sido eliminados.",
      partialFailureMessage: "Algunos datos no pudieron ser eliminados. Contacta con soporte.",
      sessionRevokedMessage: "Tu sesión ha sido revocada.",
      clearingCacheMessage: "Borrando caché local...",
      ariaLabel: "Eliminar todos tus datos de sueño e información de cuenta",
    },
    sync: {
      statusLabels: {
        "local-only": "Solo local",
        syncing: "Sincronizando...",
        synced: "Sincronizado",
        offline: "Sin conexión",
        "needs-attention": "Necesita atención",
        "sync-failed": "Error de sincronización",
      },
      lastSynced: "Última sincronización",
      pendingChanges: "{count} cambios pendientes",
      conflictsNeedingReview: "{count} conflictos necesitan revisión",
      syncNow: "Sincronizar ahora",
      retry: "Reintentar",
      resolveConflict: "Resolver conflicto",
      migration: {
        preparing: "Preparando migración...",
        uploading: "Subiendo tus datos...",
        merging: "Combinando con datos en la nube...",
        completed: "¡Migración completada!",
        failed: "Error en la migración. Por favor, reinténtalo.",
      },
      restore: {
        title: "Restaurando tus datos",
        progress: "Descargando desde la nube...",
        completed: "¡Restauración completada!",
      },
    },
  },
};
