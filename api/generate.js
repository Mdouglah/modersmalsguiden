export const config = {
  maxDuration: 60,
};

// ─────────────────────────────────────────────────────────────
// Skapar en lektionsplan med AI (strömmas till webbsidan).
// Skydd: webbsidan skickar bara lärarens val, servern kontrollerar
// varje val mot listorna nedan och bygger frågan själv.
// Bara anrop från appens egen adress tillåts.
// OBS: listorna måste stämma med knapparna i src/App.jsx.
// ─────────────────────────────────────────────────────────────

function tillatnaAdresser() {
  const lista = ["https://modersmalsguiden.norvayapp.se", "https://modersmalsguiden.vercel.app"];
  if (process.env.VERCEL_URL) lista.push(`https://${process.env.VERCEL_URL}`);
  if (process.env.VERCEL_BRANCH_URL) lista.push(`https://${process.env.VERCEL_BRANCH_URL}`);
  if (process.env.ALLOWED_ORIGINS) {
    lista.push(...process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean));
  }
  return lista;
}

const SPRAK = [
  "Arabiska", "Somaliska", "Persiska/Dari", "Polska", "Spanska", "Kurdiska (Kurmanji)", "Kurdiska (Sorani)",
  "Bosniska", "Serbiska", "Kroatiska", "Albanska", "Turkiska", "Tigrinya", "Dari", "Finska", "Romani",
  "Samiska (nordsamiska)", "Meänkieli", "Jiddisch", "Ryska", "Ukrainska", "Ungerska", "Portugisiska",
  "Vietnamesiska", "Kinesiska (mandarin)", "Grekiska", "Italienska", "Syrianska/Assyrianska", "Swahili",
  "Amhariska", "Pashto", "Annat språk",
];
// "Annat språk": läraren skriver själv språkets namn – bara bokstäver, mellanslag, bindestreck, snedstreck och parenteser
const ANNAT_SPRAK = /^[\p{L}\p{M} ()\/-]{1,40}$/u;

const STADIER = { "Lågstadiet": "1–3", "Mellanstadiet": "4–6", "Högstadiet": "7–9" };
const OMRADEN = [
  "Läsa och läsförståelse", "Skriva och textproduktion", "Tala, lyssna och samtala",
  "Litteratur och berättande", "Kultur och samhälle i ursprungslandet", "Ord och grammatik",
];
const NIVAER = ["Nybörjare", "Grundnivå", "Mellannivå", "Avancerad", "Modersmålsnära"];
const TIDER = ["30 min", "45 min", "60 min"];
const KURSPLANER = {
  modersmal: "Modersmål (förstaspråk) – Lgr22 kursplan för modersmål",
  minoritet: "Nationellt minoritetsspråk – Lgr22 kursplan för modersmål som nationellt minoritetsspråk",
  nyanland: "Modersmål för nyanlända – anpassad undervisning med fokus på grundläggande kommunikation",
};

const MAX_BODY = 2000;   // max storlek på hela förfrågan (tecken)
const MAX_TOKENS = 4000; // tak för AI-svarets längd

function unikLista(v, tillatna, max) {
  return Array.isArray(v) && v.length > 0 && v.length <= max &&
    new Set(v).size === v.length && v.every((x) => tillatna.includes(x));
}

// Samma text som webbsidan byggde tidigare, nu byggd på servern
function byggFraga({ sprakNamn, kursplanInfo, stadiumText, omrade, lektionstid, nivaer }) {
  return `Du är modersmålslärare i Sverige. Skapa en KLAR lektionsplan – redo att använda direkt.

Språk: ${sprakNamn} | Kursplan: ${kursplanInfo} | Stadium: ${stadiumText} | Område: ${omrade} | Tid: ${lektionstid}
Nivåer: ${nivaer.join(", ")}

Svara ENDAST med JSON (inga backticks):
{
  "titel": "Lektionstitel på svenska",
  "titelMalsprak": "Titel på ${sprakNamn}",
  "malSvenska": "Lärandemål (1-2 meningar)",
  "malMalsprak": "Lärandemål på ${sprakNamn}",
  "lgr22": "Lgr22-koppling för modersmål (1 mening)",
  "nivaer": [
    ${nivaer.map(n => `{
      "niva": "${n}",
      "aktivitetSvenska": "Aktivitet för ${n} (2 meningar, konkret)",
      "aktivitetMalsprak": "Aktivitet på ${sprakNamn}",
      "exempelfraser": ["Exempelfras 1 på svenska", "Exempelfras 2 på svenska"],
      "exempelfraser_malsprak": ["Fras 1 på ${sprakNamn}", "Fras 2 på ${sprakNamn}"],
      "uppgiftSvenska": "Konkret uppgift för ${n}",
      "uppgiftMalsprak": "Uppgift på ${sprakNamn}",
      "exempeluppgift": "Kort exempelsvar som läraren kan visa",
      "stod": "Lärarstöd för ${n} (1 mening)"
    }`).join(",\n    ")}
  ],
  "avslutning": "Gemensam avslutning (1 mening)",
  "avslutningMalsprak": "Avslutning på ${sprakNamn}",
  "materialSvenska": "Material som behövs",
  "bedomning": "Formativ bedömningsidé (1 mening)"
}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Endast POST är tillåtet." });
  }

  const origin = req.headers.origin;
  if (!origin || !tillatnaAdresser().includes(origin)) {
    return res.status(403).json({ error: "Förfrågan kommer inte från Modersmålsguiden." });
  }

  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body) || JSON.stringify(body).length > MAX_BODY) {
    return res.status(400).json({ error: "Ogiltig förfrågan." });
  }

  const { sprak, kursplan, stadier, omrade, lektionstid, nivaer } = body;
  const sprakNamn = typeof sprak === "string" ? sprak.trim() : "";

  const giltigt =
    (SPRAK.includes(sprakNamn) || ANNAT_SPRAK.test(sprakNamn)) &&
    Object.hasOwn(KURSPLANER, kursplan) &&
    unikLista(stadier, Object.keys(STADIER), 3) &&
    OMRADEN.includes(omrade) &&
    TIDER.includes(lektionstid) &&
    unikLista(nivaer, NIVAER, NIVAER.length);

  if (!giltigt) {
    return res.status(400).json({ error: "Kontrollera dina val. Språkets namn får vara högst 40 bokstäver." });
  }

  const prompt = byggFraga({
    sprakNamn,
    kursplanInfo: KURSPLANER[kursplan],
    stadiumText: stadier.map((s) => `${s} (åk ${STADIER[s]})`).join(" + "),
    omrade,
    lektionstid,
    nivaer,
  });

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
        stream: true,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      // Logga bara statuskod och feltyp (syns i Vercels loggar), aldrig felmeddelandets text
      const fel = await response.json().catch(() => null);
      console.error("Anthropic-fel:", response.status, fel?.error?.type || "okänd feltyp");
      return res.status(502).json({ error: "AI-tjänsten svarade inte. Försök igen om en stund." });
    }

    // Sätt headers för Server-Sent Events streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;

        try {
          const parsed = JSON.parse(data);
          if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
            res.write(`data: ${JSON.stringify({ text: parsed.delta.text })}\n\n`);
          }
          if (parsed.type === "message_stop") {
            res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          }
        } catch {
          // Ignorera ogiltiga JSON-rader
        }
      }
    }

    res.end();
  } catch (error) {
    // Bara feltypen, aldrig hela felobjektet
    console.error("Serverfel:", error?.name || "okänt fel");
    if (!res.headersSent) {
      return res.status(500).json({ error: "Något gick fel. Försök igen." });
    }
    res.end();
  }
}
