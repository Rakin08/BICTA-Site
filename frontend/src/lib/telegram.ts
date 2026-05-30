/**
 * Telegram notification helper — sends messages to the admin chat.
 * Uses the existing bot token + chat ID from env vars.
 */
export async function sendTelegram(message: string): Promise<void> {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return; // silently skip if not configured

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });
  } catch {
    // Never let a notification failure break the main flow
  }
}
