export const config = {
  maxDuration: 30,
};

// ─────────────────────────────────────────────────────────────
// SYSTEMINSTRUKTION – ligger bara på servern och kan inte styras
// av webbsidan. Vill du ändra hur chatten svarar, ändrar du här.
// ─────────────────────────────────────────────────────────────
const SYSTEM = `Du är en erfaren modersmålslärare och pedagogisk expert i Sverige med djup kunskap om Lgr22 kursplanen för modersmål.

Du hjälper modersmålslärare att snabbt skapa differentierade lektionsplaner och övningar för alla modersmål som undervisas i svenska skolan.

Du svarar alltid på svenska och skapar innehåll på BÅDE svenska och det efterfrågade modersmålet.

Du känner till:
- Lgr22 kursplan för modersmål, nationella minoritetsspråk och modersmål för nyanlända
- Differentiering för blandade grupper med olika nivåer
- Praktiska övningar och aktiviteter för modersmålsundervisning
- Hur man skapar tvåspråkigt lektionsmaterial

Håll svaren konkreta, praktiska och direkt användbara. Max 300 ord om inte läraren ber om mer.`;

// Gränser som hindrar att servern missbrukas
const MAX_MESSAGES = 30;      // max antal meddelanden i en konversation
const MAX_CHARS = 8000;       // max antal tecken per meddelande
const MAX_TOTAL = 25000;      // max antal tecken i hela konversationen (svaren är på två språk)
const MAX_TOKENS = 1500;      // tak för AI-svarets längd

function tillatnaAdresser() {
  const lista = ["https://modersmalsguiden.norvayapp.se", "https://modersmalsguiden.vercel.app"];
  if (process.env.VERCEL_URL) lista.push(`https://${process.env.VERCEL_URL}`);
  if (process.env.VERCEL_BRANCH_URL) lista.push(`https://${process.env.VERCEL_BRANCH_URL}`);
  if (process.env.ALLOWED_ORIGINS) {
    lista.push(...process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean));
  }
  return lista;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Endast POST är tillåtet." });
  }

  const origin = req.headers.origin;
  if (!origin || !tillatnaAdresser().includes(origin)) {
    return res.status(403).json({ error: "Förfrågan kommer inte från Modersmålsguiden." });
  }

  // Ta bara emot meddelanden – ALDRIG en systeminstruktion utifrån
  const { messages } = req.body || {};

  const valid =
    Array.isArray(messages) &&
    messages.length > 0 &&
    messages.length <= MAX_MESSAGES &&
    messages.every(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length > 0 &&
        m.content.length <= MAX_CHARS
    ) &&
    messages[messages.length - 1].role === "user" &&
    messages.reduce((summa, m) => summa + m.content.length, 0) <= MAX_TOTAL;

  if (!valid) {
    return res.status(400).json({ error: "Meddelandet är för långt eller konversationen för lång. Börja gärna en ny chatt." });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: MAX_TOKENS,
        system: SYSTEM,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      // Detaljerna loggas på servern (syns i Vercels loggar), inget känsligt till besökaren
      console.error("Anthropic-fel:", response.status, await response.text());
      return res.status(502).json({ error: "AI-tjänsten svarade inte. Försök igen om en stund." });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Serverfel:", error);
    return res.status(500).json({ error: "Något gick fel. Försök igen." });
  }
}
