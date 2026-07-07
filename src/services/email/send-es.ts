/**
 * Servicio de envío de emails transaccionales en español.
 *
 * - Lee la preferencia de idioma del usuario (cookie somna_uid / campo `lang`
 *   en D1) y selecciona la plantilla correspondiente.
 * - Para usuarios con lang=es usa las plantillas de src/emails/es/.
 * - Las plantillas se renderizan sustituyendo marcadores {{...}}.
 *
 * Este módulo es agnóstico al proveedor de envío (Resend, Mailgun, etc.):
 * expone una función `sendTransactionalEmail` que recibe el tipo de email,
 * el destinatario y los datos, y delega el envío en `dispatchEmail`.
 */

import { loadEsDict } from "@/locales/es";

export type EmailType = "activation" | "wake" | "weekly" | "renew" | "dunning" | "reengage";

export type UserLang = "en" | "es";

export interface EmailRecipient {
  email: string;
  lang: UserLang;
  uid: string;
  unsubscribeUrl: string;
}

export interface EmailData {
  /** Datos específicos del tipo de email (eficiencia, racha, importe, etc.). */
  [key: string]: string | number | undefined;
}

/**
 * Devuelve el asunto y el preheader en el idioma del usuario.
 * Solo se implementa la rama es; la rama en se gestiona en su propio módulo.
 */
export function getEmailSubject(type: EmailType, lang: UserLang, data: EmailData): string {
  if (lang !== "es") {
    // La versión inglesa vive en su propio módulo; aquí no se traduce.
    return "";
  }
  const t = loadEsDict();
  switch (type) {
    case "activation":
      return t["email.activation.subject"];
    case "wake": {
      const days = Number(data.days ?? 2);
      if (days >= 7) return t["email.wake.subject7d"];
      if (days >= 3) return t["email.wake.subject72"];
      return t["email.wake.subject48"];
    }
    case "weekly":
      return t["email.weekly.subject"];
    case "renew":
      return t["email.renew.subject"];
    case "dunning": {
      const days = Number(data.days ?? 3);
      if (days >= 14) return t["email.dunning.subject14"];
      if (days >= 7) return t["email.dunning.subject7"];
      return t["email.dunning.subject3"];
    }
    case "reengage": {
      const days = Number(data.days ?? 14);
      if (days >= 30) return t["email.reengage.subject30"];
      if (days >= 21) return t["email.reengage.subject21"];
      return t["email.reengage.subject14"];
    }
    default:
      return "";
  }
}

/**
 * Renderiza una plantilla HTML sustituyendo los marcadores {{KEY}}.
 * Las plantillas en español se importan como strings en build time.
 */
export function renderTemplate(html: string, data: Record<string, string>): string {
  return html.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? "");
}

/**
 * Punto de entrada principal. Decide la plantilla según el idioma del usuario
 * y delega el envío en el proveedor configurado.
 *
 * Si el usuario es `es`, SIEMPRE se envía la plantilla española nativa.
 * No hay fallback al inglés: si falta la plantilla, se lanza un error.
 */
export async function sendTransactionalEmail(
  type: EmailType,
  recipient: EmailRecipient,
  data: EmailData,
): Promise<void> {
  if (recipient.lang !== "es") {
    // La rama inglesa se gestiona en otro módulo; aquí no se mezcla.
    throw new Error(`Idioma no soportado en este módulo: ${recipient.lang}`);
  }

  const subject = getEmailSubject(type, recipient.lang, data);
  const html = await loadEsTemplate(type);
  const rendered = renderTemplate(html, {
    UNSUBSCRIBE_URL: recipient.unsubscribeUrl,
    ...Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v ?? "")])),
  });

  await dispatchEmail({
    to: recipient.email,
    subject,
    html: rendered,
    from: "somna <no-reply@somna.help>",
  });
}

/**
 * Carga la plantilla HTML en español correspondiente al tipo.
 * En build time se importan como strings; en runtime se sirven desde assets.
 */
async function loadEsTemplate(type: EmailType): Promise<string> {
  // Importación dinámica para mantener el código dividido.
  // Los archivos viven en src/emails/es/<type>.html.
  const modules: Record<EmailType, () => Promise<string>> = {
    activation: async () => (await import("./es/activation.html?raw")).default,
    wake: async () => (await import("./es/wake.html?raw")).default,
    weekly: async () => (await import("./es/weekly.html?raw")).default,
    renew: async () => (await import("./es/renew.html?raw")).default,
    dunning: async () => (await import("./es/dunning.html?raw")).default,
    reengage: async () => (await import("./es/reengage.html?raw")).default,
  };
  return modules[type]();
}

/**
 * Delegación del envío al proveedor (Resend, Mailgun, etc.).
 * Sustituir por la integración real. La firma se mantiene estable.
 */
async function dispatchEmail(params: {
  to: string;
  subject: string;
  html: string;
  from: string;
}): Promise<void> {
  // TODO: integrar con el proveedor de email configurado en wrangler.
  // Ejemplo con Resend:
  //   await fetch("https://api.resend.com/emails", { ... })
  console.log(`[email-es] Para: ${params.to} | Asunto: ${params.subject}`);
}
