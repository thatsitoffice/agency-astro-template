/**
 * Cloudflare Pages Function für Kontaktformular
 * 
 * Endpoint: /api/contact
 * Method: POST
 * 
 * Verarbeitet Formular-Submissions mit:
 * - Serverseitiger Validierung
 * - Honeypot-Check
 * - Cloudflare Turnstile Verifizierung
 * - E-Mail-Versand (optional über Resend API)
 * 
 * Environment Variables:
 * - TURNSTILE_SECRET_KEY: Secret Key für Turnstile Verifizierung
 * - CONTACT_TO_EMAIL: E-Mail-Adresse, an die Nachrichten gesendet werden
 * - RESEND_API_KEY: (Optional) API Key für Resend E-Mail Service
 */

interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
  company_website?: string; // Honeypot field
  privacy: boolean;
  turnstile_token: string;
}

interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

// Simple in-memory rate limiting (best effort)
// In Production: Verwenden Sie Cloudflare Rate Limiting Rules
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 Minute
const RATE_LIMIT_MAX = 5; // Max 5 Requests pro Minute pro IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Validiert die Formular-Daten serverseitig
 */
function validateInput(data: ContactRequest): { valid: boolean; error?: string } {
  // Name validieren
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    return { valid: false, error: 'Name muss mindestens 2 Zeichen lang sein.' };
  }
  if (data.name.length > 100) {
    return { valid: false, error: 'Name ist zu lang (max. 100 Zeichen).' };
  }

  // E-Mail validieren
  if (!data.email || typeof data.email !== 'string') {
    return { valid: false, error: 'E-Mail-Adresse ist erforderlich.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, error: 'Ungültige E-Mail-Adresse.' };
  }
  if (data.email.length > 255) {
    return { valid: false, error: 'E-Mail-Adresse ist zu lang.' };
  }

  // Telefon validieren (optional)
  if (data.phone && data.phone.length > 50) {
    return { valid: false, error: 'Telefonnummer ist zu lang.' };
  }

  // Nachricht validieren
  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 10) {
    return { valid: false, error: 'Nachricht muss mindestens 10 Zeichen lang sein.' };
  }
  if (data.message.length > 5000) {
    return { valid: false, error: 'Nachricht ist zu lang (max. 5000 Zeichen).' };
  }

  // Privacy Checkbox
  if (!data.privacy) {
    return { valid: false, error: 'Sie müssen der Datenschutzerklärung zustimmen.' };
  }

  return { valid: true };
}

/**
 * Verifiziert Cloudflare Turnstile Token
 */
async function verifyTurnstile(
  token: string,
  secretKey: string,
  ip?: string
): Promise<{ success: boolean; error?: string }> {
  if (!token) {
    return { success: false, error: 'Turnstile Token fehlt.' };
  }

  try {
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (ip) {
      formData.append('remoteip', ip);
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const result: TurnstileResponse = await response.json();

    if (!result.success) {
      const errors = result['error-codes'] || ['Unbekannter Fehler'];
      return { success: false, error: `Turnstile Verifizierung fehlgeschlagen: ${errors.join(', ')}` };
    }

    return { success: true };
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return { success: false, error: 'Fehler bei der Turnstile-Verifizierung.' };
  }
}

/**
 * Sendet E-Mail über Resend API (optional)
 */
async function sendEmailViaResend(
  apiKey: string,
  toEmail: string,
  data: ContactRequest
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Kontaktformular <noreply@example.com>', // TODO: Anpassen
        to: toEmail,
        subject: `Neue Kontaktanfrage von ${data.name}`,
        html: `
          <h2>Neue Kontaktanfrage</h2>
          <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
          <p><strong>E-Mail:</strong> ${escapeHtml(data.email)}</p>
          ${data.phone ? `<p><strong>Telefon:</strong> ${escapeHtml(data.phone)}</p>` : ''}
          <p><strong>Nachricht:</strong></p>
          <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
        `,
        text: `
          Neue Kontaktanfrage
          
          Name: ${data.name}
          E-Mail: ${data.email}
          ${data.phone ? `Telefon: ${data.phone}` : ''}
          
          Nachricht:
          ${data.message}
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      return { success: false, error: 'E-Mail konnte nicht gesendet werden.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Resend email error:', error);
    return { success: false, error: 'Fehler beim Senden der E-Mail.' };
  }
}

/**
 * Loggt E-Mail (Fallback wenn kein Resend API Key gesetzt)
 */
function logEmail(data: ContactRequest): void {
  console.log('=== KONTAKTFORMULAR SUBMISSION ===');
  console.log('Name:', data.name);
  console.log('E-Mail:', data.email);
  console.log('Telefon:', data.phone || 'Nicht angegeben');
  console.log('Nachricht:', data.message);
  console.log('Zeitstempel:', new Date().toISOString());
  console.log('==================================');
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Main Handler
 */
export async function onRequestPost(context: {
  request: Request;
  env: {
    TURNSTILE_SECRET_KEY?: string;
    CONTACT_TO_EMAIL?: string;
    RESEND_API_KEY?: string;
  };
}): Promise<Response> {
  const { request, env } = context;

  // Rate Limiting
  const ip = request.headers.get('CF-Connecting-IP') || 
             request.headers.get('X-Forwarded-For')?.split(',')[0] || 
             'unknown';
  
  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' }),
      {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // Parse Request Body
    const data: ContactRequest = await request.json();

    // Honeypot Check: Wenn company_website gefüllt ist, antworten wir mit Erfolg, senden aber keine E-Mail
    if (data.company_website && data.company_website.trim().length > 0) {
      console.log('Honeypot triggered - bot detected');
      return new Response(
        JSON.stringify({ ok: true }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Input Validation
    const validation = validateInput(data);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ ok: false, error: validation.error }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Turnstile Verification
    const turnstileSecret = env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) {
      console.error('TURNSTILE_SECRET_KEY nicht gesetzt');
      return new Response(
        JSON.stringify({ ok: false, error: 'Server-Konfigurationsfehler.' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const turnstileResult = await verifyTurnstile(data.turnstile_token, turnstileSecret, ip);
    if (!turnstileResult.success) {
      return new Response(
        JSON.stringify({ ok: false, error: turnstileResult.error || 'Verifizierung fehlgeschlagen.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // E-Mail senden
    const toEmail = env.CONTACT_TO_EMAIL;
    if (!toEmail) {
      console.warn('CONTACT_TO_EMAIL nicht gesetzt - E-Mail wird nur geloggt');
      logEmail(data);
      return new Response(
        JSON.stringify({ ok: true }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Versuche Resend API, falls verfügbar
    if (env.RESEND_API_KEY) {
      const emailResult = await sendEmailViaResend(env.RESEND_API_KEY, toEmail, data);
      if (emailResult.success) {
        return new Response(
          JSON.stringify({ ok: true }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } else {
        // Fallback: Loggen
        console.error('Resend API Fehler:', emailResult.error);
        logEmail(data);
        return new Response(
          JSON.stringify({ ok: false, error: emailResult.error || 'E-Mail konnte nicht gesendet werden.' }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    } else {
      // Kein Resend API Key: Nur loggen
      logEmail(data);
      return new Response(
        JSON.stringify({ ok: true }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: 'Ein unerwarteter Fehler ist aufgetreten.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
