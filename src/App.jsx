import { useState, useRef, useEffect } from "react";
import Markdown, { tillText } from "./Markdown.jsx";

// ─── DATA ────────────────────────────────────────────────────────────────────
const SPRAK = [
  { namn: "Arabiska", kod: "ar", flagga: "🇸🇦", sokord: ["ar", "arab"] },
  { namn: "Somaliska", kod: "so", flagga: "🇸🇴", sokord: ["so", "som"] },
  { namn: "Persiska/Dari", kod: "fa", flagga: "🇮🇷", sokord: ["fa", "per", "dari"] },
  { namn: "Polska", kod: "pl", flagga: "🇵🇱", sokord: ["pl", "pol"] },
  { namn: "Spanska", kod: "es", flagga: "🇪🇸", sokord: ["es", "spa"] },
  { namn: "Kurdiska (Kurmanji)", kod: "kmr", flagga: "🏳️", sokord: ["kmr", "kur", "kurdiska"] },
  { namn: "Kurdiska (Sorani)", kod: "ckb", flagga: "🏳️", sokord: ["ckb", "kur", "kurdiska"] },
  { namn: "Bosniska", kod: "bs", flagga: "🇧🇦", sokord: ["bs", "bos"] },
  { namn: "Serbiska", kod: "sr", flagga: "🇷🇸", sokord: ["sr", "ser"] },
  { namn: "Kroatiska", kod: "hr", flagga: "🇭🇷", sokord: ["hr", "kro"] },
  { namn: "Albanska", kod: "sq", flagga: "🇦🇱", sokord: ["sq", "alb"] },
  { namn: "Turkiska", kod: "tr", flagga: "🇹🇷", sokord: ["tr", "tur"] },
  { namn: "Tigrinya", kod: "ti", flagga: "🇪🇷", sokord: ["ti", "tig"] },
  { namn: "Dari", kod: "prs", flagga: "🇦🇫", sokord: ["prs", "dari"] },
  { namn: "Finska", kod: "fi", flagga: "🇫🇮", sokord: ["fi", "fin"] },
  { namn: "Romani", kod: "rom", flagga: "🏳️", sokord: ["rom"] },
  { namn: "Samiska (nordsamiska)", kod: "sme", flagga: "🏳️", sokord: ["sme", "sam"] },
  { namn: "Meänkieli", kod: "fit", flagga: "🏳️", sokord: ["fit", "meä"] },
  { namn: "Jiddisch", kod: "yi", flagga: "🏳️", sokord: ["yi", "jid"] },
  { namn: "Ryska", kod: "ru", flagga: "🇷🇺", sokord: ["ru", "rys"] },
  { namn: "Ukrainska", kod: "uk", flagga: "🇺🇦", sokord: ["uk", "ukr"] },
  { namn: "Ungerska", kod: "hu", flagga: "🇭🇺", sokord: ["hu", "ung"] },
  { namn: "Portugisiska", kod: "pt", flagga: "🇵🇹", sokord: ["pt", "por"] },
  { namn: "Vietnamesiska", kod: "vi", flagga: "🇻🇳", sokord: ["vi", "vie"] },
  { namn: "Kinesiska (mandarin)", kod: "zh", flagga: "🇨🇳", sokord: ["zh", "kin", "man"] },
  { namn: "Grekiska", kod: "el", flagga: "🇬🇷", sokord: ["el", "gre", "grek"] },
  { namn: "Italienska", kod: "it", flagga: "🇮🇹", sokord: ["it", "ita", "ital"] },
  { namn: "Syrianska/Assyrianska", kod: "syc", flagga: "🏳️", sokord: ["syc", "syr", "ass", "assyrianska", "syrianska"] },
  { namn: "Swahili", kod: "sw", flagga: "🇹🇿", sokord: ["sw", "swa", "swahili"] },
  { namn: "Amhariska", kod: "am", flagga: "🇪🇹", sokord: ["am", "amh", "amhariska"] },
  { namn: "Pashto", kod: "ps", flagga: "🇦🇫", sokord: ["ps", "pash", "pashto"] },
  { namn: "Annat språk", kod: "other", flagga: "🌐", sokord: ["annat", "other"] },
];

const STADIER = [
  { namn: "Lågstadiet", ar: "1–3" },
  { namn: "Mellanstadiet", ar: "4–6" },
  { namn: "Högstadiet", ar: "7–9" },
];

const OMRADEN = [
  "Läsa och läsförståelse",
  "Skriva och textproduktion",
  "Tala, lyssna och samtala",
  "Litteratur och berättande",
  "Kultur och samhälle i ursprungslandet",
  "Ord och grammatik",
];

const NIVAER = ["Nybörjare", "Grundnivå", "Mellannivå", "Avancerad", "Modersmålsnära"];
const ANTAL_LEKTIONER = ["30 min", "45 min", "60 min"];

const KURSPLANER = [
  { id: "modersmal", titel: "Modersmål", beskrivning: "Elever med språket som förstaspråk", ikon: "📘", farg: "#1565c0" },
  { id: "minoritet", titel: "Nationellt minoritetsspråk", beskrivning: "Finska, samiska, romani, meänkieli eller jiddisch", ikon: "📗", farg: "#2e7d32" },
  { id: "nyanland", titel: "Modersmål för nyanlända", beskrivning: "Elever nyanlända i Sverige med begränsad svenska", ikon: "📙", farg: "#e65100" },
];

const NIVA_FARG = {
  "Nybörjare": "#2e7d32",
  "Grundnivå": "#1565c0",
  "Mellannivå": "#e65100",
  "Avancerad": "#880e4f",
  "Modersmålsnära": "#4a148c",
};

const STEG_LABELS = ["Språk & kursplan", "Stadium", "Nivåer", "Generera"];

const CHATT_EXEMPEL = [
  "Ge mig en lektionsplan för arabiska åk 5, tema familj",
  "Övningar för somaliska lågstadiet, nybörjarnivå",
  "Lektionsplan kurdiska högstadiet om berättande texter",
  "Skrivövning för polska mellanstadiet, 2 nivåer",
  "Läsförståelse för tigrinya åk 3, blandad grupp",
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function exportText(resultat, sprakNamn, kursplan, stadiumText, omrade, lektionstid) {
  let t = `MODERSMÅLSGUIDEN – Lgr22\n${"=".repeat(40)}\n`;
  t += `Språk: ${sprakNamn} | Kursplan: ${kursplan?.titel} | Stadium: ${stadiumText} | Område: ${omrade} | Tid: ${lektionstid}\n\n`;
  t += `TITEL\n${resultat.titel}\n${resultat.titelMalsprak}\n\n`;
  t += `LÄRANDEMÅL\n${resultat.malSvenska}\n\n`;
  t += `LGR22\n${resultat.lgr22}\n\n`;
  t += `DIFFERENTIERADE AKTIVITETER\n${"─".repeat(32)}\n`;
  resultat.nivaer?.forEach(n => {
    t += `\n${n.niva.toUpperCase()}\n`;
    t += `Aktivitet: ${n.aktivitetSvenska}\n`;
    if (n.exempelfraser?.length) t += `Exempelfraser: ${n.exempelfraser.join(" | ")}\n`;
    t += `Uppgift: ${n.uppgiftSvenska}\n`;
    if (n.exempeluppgift) t += `Exempel: ${n.exempeluppgift}\n`;
    t += `Lärarstöd: ${n.stod}\n`;
  });
  t += `\nAVSLUTNING\n${resultat.avslutning}\n\nMATERIAL\n${resultat.materialSvenska}\n\nBEDÖMNING\n${resultat.bedomning}\n`;
  return t;
}

// ─── GLOBAL CSS ──────────────────────────────────────────────────────────────
const globalCSS = `
  @font-face { font-family: "DM Sans"; font-style: normal; font-weight: 400; font-display: swap; src: url("/fonts/dm-sans-latin-400-normal.woff2") format("woff2"); }
  @font-face { font-family: "DM Sans"; font-style: normal; font-weight: 500; font-display: swap; src: url("/fonts/dm-sans-latin-500-normal.woff2") format("woff2"); }
  @font-face { font-family: "DM Sans"; font-style: normal; font-weight: 600; font-display: swap; src: url("/fonts/dm-sans-latin-600-normal.woff2") format("woff2"); }
  @font-face { font-family: "Newsreader"; font-style: normal; font-weight: 400; font-display: swap; src: url("/fonts/newsreader-latin-400-normal.woff2") format("woff2"); }
  @font-face { font-family: "Newsreader"; font-style: italic; font-weight: 400; font-display: swap; src: url("/fonts/newsreader-latin-400-italic.woff2") format("woff2"); }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100% { opacity:.3 } 50% { opacity:1 } }
  @keyframes fi { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .fade-up { animation: fadeUp .35s ease; }
  .fi { animation: fi .3s ease; }
  .kort { background: var(--mg-vit-a06); border: 1px solid var(--mg-vit-a10); border-radius: 16px; }
  .knapp-prim { background: linear-gradient(135deg, var(--mg-guld), var(--mg-guld-mork)); color: var(--mg-bg-1); border: none; border-radius: 12px; padding: 13px 26px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: inherit; }
  .knapp-prim:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px var(--mg-guld-a35); }
  .knapp-prim:disabled { opacity: 0.3; cursor: not-allowed; }
  .knapp-sek { background: transparent; border: 1px solid var(--mg-vit-a20); color: var(--mg-text); border-radius: 10px; padding: 10px 18px; font-size: 14px; cursor: pointer; transition: all 0.2s; font-family: inherit; }
  .knapp-sek:hover { background: var(--mg-vit-a08); }
  .knapp-copy { background: linear-gradient(135deg, var(--mg-bla), var(--mg-bla-mork)); color: white; border: none; border-radius: 50px; padding: 10px 20px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all .2s; }
  .knapp-copy:hover { transform: translateY(-1px); box-shadow: 0 6px 18px var(--mg-bla-a40); }
  .knapp-print { background: linear-gradient(135deg, var(--mg-lila), var(--mg-lila-mork)); color: white; border: none; border-radius: 50px; padding: 10px 20px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all .2s; }
  .knapp-print:hover { transform: translateY(-1px); box-shadow: 0 6px 18px var(--mg-lila-a40); }
  .val-kort { background: var(--mg-vit-a04); border: 1.5px solid var(--mg-vit-a09); border-radius: 12px; padding: 13px 16px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 10px; }
  .val-kort:hover { background: var(--mg-guld-a08); border-color: var(--mg-guld-a35); }
  .val-kort.vald { background: var(--mg-guld-a12); border-color: var(--mg-guld); }
  .kursplan-kort { background: var(--mg-vit-a04); border: 2px solid var(--mg-vit-a09); border-radius: 14px; padding: 16px; cursor: pointer; transition: all 0.2s; display: flex; align-items: flex-start; gap: 14px; }
  .kursplan-kort:hover { background: var(--mg-guld-a07); border-color: var(--mg-guld-a30); }
  .kursplan-kort.vald { background: var(--mg-guld-a10); border-color: var(--mg-guld); }
  .tid-knapp { border: 2px solid var(--mg-vit-a12); border-radius: 10px; padding: 9px 18px; cursor: pointer; transition: all 0.2s; font-size: 14px; background: var(--mg-vit-a04); color: var(--mg-text); font-family: inherit; }
  .tid-knapp:hover { border-color: var(--mg-guld-a40); }
  .tid-knapp.vald { background: var(--mg-guld-a18); border-color: var(--mg-guld); color: var(--mg-guld); font-weight: 700; }
  .tab-knapp { padding: 8px 18px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; font-family: inherit; }
  .tab-knapp.aktiv { background: var(--mg-guld); color: var(--mg-bg-1); }
  .tab-knapp:not(.aktiv) { background: var(--mg-vit-a07); color: var(--mg-dampad); }
  .tab-knapp:not(.aktiv):hover { background: var(--mg-vit-a12); color: var(--mg-text); }
  .niva-tab { border: none; border-radius: 50px; padding: 7px 16px; cursor: pointer; font-size: 13px; font-weight: 700; transition: all 0.2s; font-family: inherit; }
  .niva-sektion { border-radius: 14px; padding: 20px; border-left: 4px solid; background: var(--mg-vit-a04); margin-bottom: 12px; }
  .fras-chip { background: var(--mg-vit-a07); border: 1px solid var(--mg-vit-a12); border-radius: 8px; padding: 5px 10px; font-size: 12px; color: var(--mg-text-2); display: inline-block; margin: 3px; font-style: italic; }
  .exempel-box { background: var(--mg-guld-a07); border: 1px solid var(--mg-guld-a20); border-radius: 10px; padding: 12px 14px; margin-top: 10px; }
  input[type="text"], textarea { background: var(--mg-vit-a07); border: 1px solid var(--mg-vit-a13); border-radius: 10px; padding: 10px 14px; color: var(--mg-text); font-size: 14px; outline: none; width: 100%; font-family: inherit; }
  input[type="text"]::placeholder, textarea::placeholder { color: var(--mg-dampad-6); }
  input[type="text"]:focus, textarea:focus { border-color: var(--mg-guld-a50); background: var(--mg-vit-a09); }
  .spinner { width: 38px; height: 38px; border: 3px solid var(--mg-guld-a15); border-top-color: var(--mg-guld); border-radius: 50%; animation: spin 0.8s linear infinite; }
  .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--mg-guld); animation: pulse 1.2s ease infinite; }
  .steg-punkt { width: 8px; height: 8px; border-radius: 50%; background: var(--mg-vit-a15); transition: all 0.3s; }
  .steg-punkt.aktiv { background: var(--mg-guld); width: 24px; border-radius: 4px; }
  .steg-punkt.klar { background: var(--mg-guld-a45); }
  .varning { background: var(--mg-guld-a07); border: 1px solid var(--mg-guld-a25); border-radius: 10px; padding: 11px 14px; margin-top: 12px; font-size: 13px; color: var(--mg-guld); line-height: 1.5; }
  .stat-box { background: var(--mg-vit-a05); border-radius: 10px; padding: 12px; text-align: center; }
  .chip { background: var(--mg-guld-a11); border: 1px solid var(--mg-guld-a22); border-radius: 6px; padding: 3px 10px; font-size: 12px; color: var(--mg-guld); display: inline-block; }
  .label { font-size: 11px; color: var(--mg-dampad-3); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; }
  @media print {
    body { background: white !important; color: black !important; }
    .no-print { display: none !important; }
    .niva-sektion { border: 1px solid var(--mg-print-linje) !important; background: var(--mg-print-yta) !important; color: black !important; break-inside: avoid; }
    .kort { background: white !important; border: 1px solid var(--mg-print-linje) !important; color: black !important; }
    .exempel-box { background: var(--mg-print-gul) !important; border: 1px solid var(--mg-print-linje) !important; }
    p, span, div { color: black !important; }
    /* Chatt-utskrift */
    textarea, button, input { display: none !important; }
    [style*="flex-direction: column"][style*="100vh"] > div:first-child { display: none !important; }
    [style*="flex-direction: column"][style*="100vh"] > div:last-child { display: none !important; }
    [style*="pre-wrap"] { white-space: pre-wrap !important; color: black !important; background: var(--mg-print-yta-2) !important; border: 1px solid var(--mg-print-linje) !important; border-radius: 8px !important; }
    [style*="f0d090"] { background: var(--mg-print-gul-2) !important; color: var(--mg-print-text) !important; border: 1px solid var(--mg-print-linje) !important; }
  }
`;

// ─── CHATTLÄGE ───────────────────────────────────────────────────────────────
function ChattLage({ onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text) {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Systeminstruktionen ligger på servern (api/chat.js)
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || data.error || "Något gick fel. Försök igen.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Kunde inte ansluta. Försök igen." }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ height: "calc(100vh - 44px)", background: "linear-gradient(135deg, var(--mg-bg-1) 0%, var(--mg-bg-2) 50%, var(--mg-bg-3) 100%)", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", display: "flex", flexDirection: "column", color: "var(--mg-text)" }}>
      <style>{globalCSS}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, var(--mg-guld-a12), var(--mg-guldmork-a06))", borderBottom: "1px solid var(--mg-guld-a20)", padding: ".9rem 1.2rem", display: "flex", alignItems: "center", gap: ".8rem", flexShrink: 0, boxShadow: "0 2px 20px var(--mg-svart-a30)" }}>
        <button onClick={onBack} className="knapp-sek" style={{ padding: ".35rem .8rem", fontSize: ".78rem", flexShrink: 0 }}>← Hem</button>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--mg-guld), var(--mg-guld-mork))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>📚</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "var(--mg-guld)", fontWeight: 700, fontSize: ".95rem", fontFamily: "'Newsreader', serif" }}>ModersmålsGuiden</div>
          <div style={{ color: "var(--mg-dampad-2)", fontSize: ".68rem" }}>Chattläge · Lgr22 · Beskriv fritt vad du behöver</div>
        </div>
        {messages.length > 0 && (
          <button onClick={() => setMessages([])} className="knapp-sek" style={{ padding: ".3rem .75rem", fontSize: ".72rem", flexShrink: 0 }}>Rensa</button>
        )}
        {messages.some(m => m.role === "assistant") && (
          <button onClick={() => window.print()} className="knapp-print" style={{ padding: ".3rem .75rem", fontSize: ".72rem", flexShrink: 0 }}>🖨️ Skriv ut / PDF</button>
        )}
      </div>

      {/* Meddelanden */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1.2rem", maxWidth: 720, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {messages.length === 0 && (
          <div className="fi" style={{ textAlign: "center", padding: "2rem .5rem" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, var(--mg-guld-a20), var(--mg-guldmork-a10))", border: "1px solid var(--mg-guld-a25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: "2rem" }}>📚</div>
            <h2 style={{ color: "var(--mg-guld)", margin: "0 0 .5rem", fontFamily: "'Newsreader', serif", fontSize: "1.35rem" }}>Hej! Vad behöver du idag?</h2>
            <p style={{ color: "var(--mg-dampad-4)", fontSize: ".85rem", lineHeight: 1.7, maxWidth: 380, margin: "0 auto 1.8rem" }}>
              Beskriv fritt – jag skapar lektionsplaner, övningar och material på svenska och målspråket, anpassat till Lgr22.
            </p>
            <div style={{ display: "grid", gap: ".5rem", textAlign: "left", maxWidth: 500, margin: "0 auto 1.5rem" }}>
              {CHATT_EXEMPEL.map((ex, i) => (
                <button key={i} onClick={() => sendMessage(ex)}
                  style={{ background: "var(--mg-vit-a04)", border: "1px solid var(--mg-vit-a09)", borderRadius: 12, padding: ".7rem 1rem", cursor: "pointer", fontFamily: "inherit", fontSize: ".83rem", color: "var(--mg-text-4)", textAlign: "left", transition: "all .2s", display: "flex", alignItems: "center", gap: ".7rem" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--mg-guld-a40)"; e.currentTarget.style.background = "var(--mg-guld-a07)"; e.currentTarget.style.color = "var(--mg-guld)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--mg-vit-a09)"; e.currentTarget.style.background = "var(--mg-vit-a04)"; e.currentTarget.style.color = "var(--mg-text-4)"; }}>
                  <span style={{ fontSize: ".9rem", flexShrink: 0, opacity: .7 }}>💬</span>
                  <span>{ex}</span>
                </button>
              ))}
            </div>
            <div style={{ padding: ".75rem 1rem", background: "var(--mg-vit-a03)", border: "1px solid var(--mg-vit-a06)", borderRadius: "10px", fontSize: ".74rem", color: "var(--mg-dampad-7)", maxWidth: 500, margin: "0 auto" }}>
              💡 Tips: Ange språk, stadium och tema – t.ex. "arabiska åk 5 om familjen"
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="fi" style={{ marginBottom: "1.1rem", display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
            {msg.role === "user" ? (
              <div style={{ background: "linear-gradient(135deg, var(--mg-guld-a22), var(--mg-guldmork-a14))", border: "1px solid var(--mg-guld-a25)", color: "var(--mg-guld-text)", borderRadius: "18px 18px 4px 18px", padding: ".7rem 1.1rem", maxWidth: "82%", fontSize: ".86rem", lineHeight: 1.65 }}>
                {msg.content}
              </div>
            ) : (
              <div style={{ width: "100%", maxWidth: "92%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".45rem", marginBottom: ".35rem", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: ".45rem" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, var(--mg-guld), var(--mg-guld-mork))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".7rem", flexShrink: 0 }}>📚</div>
                    <span style={{ color: "var(--mg-guld)", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".3px" }}>ModersmålsGuiden</span>
                  </div>
                  {/* Kopiera-knapp per svar */}
                  <button
                    onClick={() => { navigator.clipboard.writeText(tillText(msg.content)).then(() => { const btn = document.getElementById(`copy-${i}`); if (btn) { btn.textContent = "✅"; setTimeout(() => { btn.textContent = "📋"; }, 2000); } }); }}
                    id={`copy-${i}`}
                    style={{ background: "var(--mg-vit-a06)", border: "1px solid var(--mg-vit-a10)", borderRadius: "6px", padding: "3px 8px", cursor: "pointer", fontSize: "12px", color: "var(--mg-dampad)", fontFamily: "inherit", transition: "all .15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--mg-guld-a10)"; e.currentTarget.style.color = "var(--mg-guld)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "var(--mg-vit-a06)"; e.currentTarget.style.color = "var(--mg-dampad)"; }}>
                    📋
                  </button>
                </div>
                <div style={{ background: "var(--mg-vit-a06)", border: "1px solid var(--mg-vit-a10)", borderRadius: "4px 18px 18px 18px", padding: ".9rem 1.1rem", fontSize: ".85rem", color: "var(--mg-text-2)", lineHeight: 1.8, whiteSpace: "pre-wrap", boxShadow: "0 2px 12px var(--mg-svart-a20)" }}>
                  <Markdown text={msg.content} />
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: ".5rem", marginBottom: "1rem" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, var(--mg-guld), var(--mg-guld-mork))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".7rem", flexShrink: 0, marginTop: 2 }}>📚</div>
            <div style={{ background: "var(--mg-vit-a06)", border: "1px solid var(--mg-vit-a10)", borderRadius: "4px 18px 18px 18px", padding: ".75rem 1rem", boxShadow: "0 2px 12px var(--mg-svart-a20)" }}>
              <div style={{ display: "flex", gap: ".35rem", alignItems: "center" }}>
                {[0, .2, .4].map((d, i) => <div key={i} className="dot" style={{ animationDelay: `${d}s` }} />)}
                <span style={{ fontSize: ".74rem", color: "var(--mg-dampad-2)", marginLeft: ".35rem" }}>Skriver…</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={{ background: "linear-gradient(135deg, var(--mg-vit-a04), var(--mg-vit-a02))", borderTop: "1px solid var(--mg-vit-a08)", padding: ".9rem 1.2rem", flexShrink: 0, boxShadow: "0 -2px 20px var(--mg-svart-a30)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", gap: ".6rem", alignItems: "flex-end" }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="T.ex. 'Lektionsplan arabiska åk 6 om berättande' eller 'Övningar nybörjare somaliska'…"
            rows={2}
            style={{ flex: 1, resize: "none", lineHeight: 1.6, borderRadius: "12px", padding: "10px 14px" }}
          />
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
            style={{ background: !input.trim() || loading ? "var(--mg-guld-a15)" : "linear-gradient(135deg, var(--mg-guld), var(--mg-guld-mork))", color: !input.trim() || loading ? "var(--mg-dampad-3)" : "var(--mg-bg-1)", border: "none", borderRadius: 12, padding: ".75rem 1.1rem", cursor: !input.trim() || loading ? "default" : "pointer", fontSize: "1.15rem", flexShrink: 0, fontFamily: "inherit", transition: "all .2s", fontWeight: 700 }}>
            ➤
          </button>
        </div>
        <p style={{ textAlign: "center", color: "var(--mg-guld)", fontSize: ".75rem", fontWeight: 600, margin: ".5rem 0 0" }}>Skriv inte in elevers namn eller andra personuppgifter.</p>
        <p style={{ textAlign: "center", color: "var(--mg-dampad-8)", fontSize: ".65rem", margin: ".4rem 0 0" }}>Enter för att skicka · Shift+Enter för ny rad</p>
      </div>
    </div>
  );
}

// ─── GUIDAT LÄGE ─────────────────────────────────────────────────────────────
function GuidatLage({ onBack }) {
  const [steg, setSteg] = useState(1);
  const [sprak, setSprak] = useState(null);
  const [annatSprak, setAnnatSprak] = useState("");
  const [kursplan, setKursplan] = useState(null);
  const [valdaStadier, setValdaStadier] = useState([]);
  const [omrade, setOmrade] = useState(null);
  const [valdaNivaer, setValdaNivaer] = useState([]);
  const [lektionstid, setLektionstid] = useState("45 min");
  const [laddning, setLaddning] = useState(false);
  const [resultat, setResultat] = useState(null);
  const [sprakvisning, setSprakvisning] = useState("svenska");
  const [sokterm, setSokterm] = useState("");
  const [copied, setCopied] = useState(false);
  const [aktivNiva, setAktivNiva] = useState(null);
  const [streamText, setStreamText] = useState("");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const resultRef = useRef(null);

  const filtrerade = SPRAK.filter(s => {
    const t = sokterm.toLowerCase().trim();
    if (!t) return true;
    return s.namn.toLowerCase().includes(t) || s.kod.toLowerCase().startsWith(t) || s.sokord?.some(k => k.startsWith(t));
  });

  function toggleNiva(niva) {
    setValdaNivaer(prev => prev.includes(niva) ? prev.filter(n => n !== niva) : [...prev, niva]);
  }

  function toggleStadium(s) {
    setValdaStadier(prev => prev.find(x => x.namn === s.namn) ? prev.filter(x => x.namn !== s.namn) : [...prev, s]);
  }

  const sprakNamn = sprak?.kod === "other" ? annatSprak || "Annat språk" : sprak?.namn;
  const stadiumText = valdaStadier.map(s => `${s.namn} (åk ${s.ar})`).join(" + ");
  const steg1Klar = sprak && (sprak.kod !== "other" || annatSprak) && kursplan;

  async function genereraLektionsplan() {
    setLaddning(true);
    setResultat(null);
    setAktivNiva(null);
    setSprakvisning("svenska");
    setStreamText("");

    try {
      // Bara lärarens val skickas – frågan till AI:n byggs på servern (api/generate.js)
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sprak: sprakNamn,
          kursplan: kursplan?.id,
          stadier: valdaStadier.map(s => s.namn),
          omrade,
          lektionstid,
          nivaer: valdaNivaer,
        }),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        setStreamText("");
        setResultat({ fel: data.error || "Kunde inte generera lektionsplanen. Försök igen med färre nivåer." });
        setLaddning(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let gotDone = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const parsed = JSON.parse(line.slice(6).trim());
            if (parsed.text) { fullText += parsed.text; setStreamText(fullText); }
            if (parsed.done) {
              gotDone = true;
              const result = JSON.parse(fullText.replace(/```json|```/g, "").trim());
              setResultat(result);
              setStreamText("");
              setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
            }
          } catch { /* ignorera */ }
        }
      }

      if (!gotDone && fullText.length > 50) {
        try {
          let jsonStr = fullText.replace(/```json|```/g, "").trim();
          if (!jsonStr.endsWith("}")) {
            const last = jsonStr.lastIndexOf("}");
            if (last > 0) jsonStr = jsonStr.slice(0, last + 1);
          }
          setResultat(JSON.parse(jsonStr));
          setStreamText("");
          setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        } catch {
          setStreamText("");
          setResultat({ fel: "Lektionsplanen blev för lång. Prova färre nivåer eller ett stadium." });
        }
      }
    } catch (e) {
      console.error("API error:", e);
      setStreamText("");
      setResultat({ fel: "Kunde inte generera lektionsplanen. Försök igen med färre nivåer." });
    }
    setLaddning(false);
  }

  function resetAllt() {
    setSteg(1); setSprak(null); setAnnatSprak(""); setKursplan(null);
    setValdaStadier([]); setOmrade(null); setValdaNivaer([]);
    setResultat(null); setSokterm(""); setCopied(false);
    setAktivNiva(null); setStreamText("");
    window.scrollTo(0, 0);
  }

  function kopiera() {
    if (!resultat) return;
    navigator.clipboard.writeText(exportText(resultat, sprakNamn, kursplan, stadiumText, omrade, lektionstid))
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, var(--mg-bg-1) 0%, var(--mg-bg-2) 50%, var(--mg-bg-3) 100%)", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "var(--mg-text)" }}>
      <style>{globalCSS}</style>

      {/* Header */}
      <div style={{ padding: "20px 24px 0", display: "flex", alignItems: "center", gap: "12px" }} className="no-print">
        <button onClick={onBack} className="knapp-sek" style={{ padding: ".3rem .8rem", fontSize: ".78rem" }}>← Hem</button>
        <div style={{ textAlign: "center", flex: 1 }}>
          <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 700, background: "linear-gradient(135deg, var(--mg-guld), var(--mg-guld-ljus))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ModersmålsGuiden</h1>
          <p style={{ color: "var(--mg-dampad-2)", fontSize: "13px" }}>Guidat läge · Lgr22</p>
        </div>
        <div style={{ width: 80 }} />
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "20px 18px 80px" }}>

        {/* Steg-indikator */}
        {!resultat && !laddning && (
          <div style={{ textAlign: "center", marginBottom: "24px" }} className="no-print">
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "8px" }}>
              {[1, 2, 3, 4].map(s => <div key={s} className={`steg-punkt ${steg === s ? "aktiv" : steg > s ? "klar" : ""}`} />)}
            </div>
            <p style={{ fontSize: "12px", color: "var(--mg-dampad-3)" }}>Steg {steg} av 4 – {STEG_LABELS[steg - 1]}</p>
          </div>
        )}

        {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}
        {/* RESULTAT */}
        {resultat && !laddning && (
          <div ref={resultRef} className="fade-up">
            {resultat.fel ? (
              <div className="kort" style={{ padding: "36px", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "12px" }}>😔</div>
                <p style={{ color: "var(--mg-fel)", marginBottom: "16px" }}>{resultat.fel}</p>
                <button className="knapp-sek" onClick={() => setResultat(null)}>Försök igen</button>
              </div>
            ) : (
              <>
                <div style={{ background: "linear-gradient(135deg, var(--mg-guld-a14), var(--mg-guldmork-a07))", border: "1px solid var(--mg-guld-a22)", borderRadius: "18px", padding: "24px", marginBottom: "14px", position: "relative", overflow: "hidden" }} className="no-print">
                  <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "var(--mg-guld-a06)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--mg-dampad)", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "6px" }}>Lektionsplan · {kursplan?.titel} · Lgr22</div>
                      <h2 style={{ fontFamily: "'Newsreader', serif", fontSize: "20px", color: "var(--mg-guld)", marginBottom: "4px" }}>{resultat.titel}</h2>
                      <p style={{ color: "var(--mg-text-6)", fontSize: "13px" }}>{resultat.titelMalsprak}</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button className="knapp-copy" onClick={kopiera}>{copied ? "✅ Kopierat!" : "📋 Kopiera"}</button>
                      <button className="knapp-print" onClick={() => window.print()}>🖨️ Skriv ut</button>
                      <button className="knapp-prim" onClick={resetAllt}>Ny plan</button>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                    {[sprakNamn, kursplan?.titel, stadiumText, omrade, lektionstid].map(tag => <span key={tag} className="chip">{tag}</span>)}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {[["Nivåer", valdaNivaer.length], ["Kursplan", kursplan?.ikon], ["Tid", lektionstid]].map(([lb, v]) => (
                      <div key={lb} className="stat-box">
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--mg-guld)" }}>{v}</div>
                        <div style={{ fontSize: "11px", color: "var(--mg-dampad-3)" }}>{lb}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "var(--mg-bla-a09)", border: "1px solid var(--mg-bla-a22)", borderRadius: "12px", padding: "14px 18px", marginBottom: "14px" }}>
                  <div style={{ fontSize: "11px", color: "var(--mg-bla-ljus)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "5px" }}>📌 Lgr22-koppling · {kursplan?.titel}</div>
                  <p style={{ fontSize: "13px", color: "var(--mg-bla-ljus-2)", lineHeight: "1.65", fontStyle: "italic" }}>{resultat.lgr22}</p>
                </div>

                <div className="kort" style={{ padding: "20px", marginBottom: "14px" }}>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }} className="no-print">
                    {["svenska", "malsprak"].map(v => (
                      <button key={v} className={`tab-knapp ${sprakvisning === v ? "aktiv" : ""}`} onClick={() => setSprakvisning(v)}>
                        {v === "svenska" ? "🇸🇪 Svenska" : `🌍 ${sprakNamn}`}
                      </button>
                    ))}
                  </div>
                  <div className="label">Lärandemål</div>
                  <p style={{ fontSize: "15px", lineHeight: "1.75", color: "var(--mg-text-2)" }}>
                    {sprakvisning === "svenska" ? resultat.malSvenska : resultat.malMalsprak}
                  </p>
                </div>

                <div className="label" style={{ marginBottom: "10px" }}>Differentierade aktiviteter</div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }} className="no-print">
                  {resultat.nivaer?.map((n, i) => (
                    <button key={i} className="niva-tab" onClick={() => setAktivNiva(aktivNiva === i ? null : i)}
                      style={{ background: aktivNiva === i ? (NIVA_FARG[n.niva] || "#888") : "rgba(255,255,255,0.06)", color: aktivNiva === i ? "white" : (NIVA_FARG[n.niva] || "#ccc"), border: `2px solid ${aktivNiva === i ? "transparent" : ((NIVA_FARG[n.niva] || "#888") + "44")}` }}>
                      {n.niva}
                    </button>
                  ))}
                  {aktivNiva !== null && (
                    <button className="niva-tab" onClick={() => setAktivNiva(null)} style={{ background: "var(--mg-vit-a06)", color: "var(--mg-dampad-2)", border: "2px solid var(--mg-vit-a08)" }}>Visa alla</button>
                  )}
                </div>

                {resultat.nivaer?.map((n, i) => (
                  (aktivNiva === null || aktivNiva === i) && (
                    <div key={i} className="niva-sektion fade-up" style={{ borderLeftColor: NIVA_FARG[n.niva] || "var(--mg-gra)" }}>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: NIVA_FARG[n.niva] || "var(--mg-text)", marginBottom: "12px" }}>{n.niva}</div>
                      <div style={{ marginBottom: "12px" }}>
                        <div className="label">Aktivitet</div>
                        <p style={{ fontSize: "14px", lineHeight: "1.7", color: "var(--mg-text-5)" }}>{sprakvisning === "svenska" ? n.aktivitetSvenska : n.aktivitetMalsprak}</p>
                      </div>
                      {(n.exempelfraser?.length > 0 || n.exempelfraser_malsprak?.length > 0) && (
                        <div style={{ marginBottom: "12px" }}>
                          <div className="label">Exempelfraser</div>
                          <div>{(sprakvisning === "svenska" ? n.exempelfraser : n.exempelfraser_malsprak)?.map((f, j) => <span key={j} className="fras-chip">"{f}"</span>)}</div>
                        </div>
                      )}
                      <div style={{ background: "var(--mg-vit-a04)", borderRadius: "8px", padding: "11px", marginBottom: "10px" }}>
                        <div className="label">Uppgift</div>
                        <p style={{ fontSize: "13px", color: "var(--mg-text-4)", fontStyle: "italic", lineHeight: "1.65" }}>{sprakvisning === "svenska" ? n.uppgiftSvenska : n.uppgiftMalsprak}</p>
                      </div>
                      {n.exempeluppgift && (
                        <div className="exempel-box">
                          <div style={{ fontSize: "11px", color: "var(--mg-guld)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "5px" }}>💡 Exempel att visa eleverna</div>
                          <p style={{ fontSize: "13px", color: "var(--mg-guld-2)", lineHeight: "1.65" }}>{n.exempeluppgift}</p>
                        </div>
                      )}
                      <div style={{ fontSize: "12px", color: "var(--mg-dampad-3)", marginTop: "10px" }}>
                        <span style={{ color: "var(--mg-dampad-2)" }}>Lärarstöd: </span>{n.stod}
                      </div>
                    </div>
                  )
                ))}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "4px" }}>
                  <div className="kort" style={{ padding: "16px" }}>
                    <div className="label" style={{ marginBottom: "8px" }}>Gemensam avslutning</div>
                    <p style={{ fontSize: "13px", color: "var(--mg-text-3)", lineHeight: "1.65" }}>{sprakvisning === "svenska" ? resultat.avslutning : resultat.avslutningMalsprak}</p>
                  </div>
                  <div className="kort" style={{ padding: "16px" }}>
                    <div className="label" style={{ marginBottom: "8px" }}>Material</div>
                    <p style={{ fontSize: "13px", color: "var(--mg-text-3)", lineHeight: "1.65" }}>{resultat.materialSvenska}</p>
                  </div>
                </div>
                <div className="kort" style={{ padding: "16px", marginTop: "12px" }}>
                  <div className="label" style={{ marginBottom: "8px" }}>Bedömning · formativ</div>
                  <p style={{ fontSize: "13px", color: "var(--mg-text-3)", lineHeight: "1.65" }}>{resultat.bedomning}</p>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "22px", justifyContent: "center" }} className="no-print">
                  <button className="knapp-copy" onClick={kopiera}>{copied ? "✅ Kopierat!" : "📋 Kopiera text"}</button>
                  <button className="knapp-print" onClick={() => window.print()}>🖨️ Skriv ut</button>
                  <button className="knapp-sek" onClick={genereraLektionsplan}>✨ Generera nytt</button>
                  <button className="knapp-prim" onClick={resetAllt}>🔄 Ny plan</button>
                  <button onClick={() => setFeedbackOpen(true)} style={{ background: "linear-gradient(135deg,var(--mg-orange),var(--mg-orange-mork))", color: "white", border: "none", borderRadius: 50, padding: "10px 20px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>📝 Feedback</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* LADDNING */}
        {laddning && (
          <div style={{ padding: "40px 0" }} className="fade-up">
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div className="spinner" style={{ margin: "0 auto 16px" }} />
              <p style={{ color: "var(--mg-dampad-5)", fontSize: "15px", marginBottom: "8px" }}>{streamText ? "Bygger lektionsplan…" : "Ansluter till AI…"}</p>
              <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                {[0, 0.2, 0.4].map((d, i) => <div key={i} className="dot" style={{ animationDelay: `${d}s` }} />)}
              </div>
            </div>
            {streamText && (
              <div style={{ background: "var(--mg-vit-a04)", border: "1px solid var(--mg-vit-a08)", borderRadius: "14px", padding: "16px 20px", maxHeight: "280px", overflowY: "auto" }}>
                <div className="label" style={{ marginBottom: "10px" }}>✍️ Genererar…</div>
                <pre style={{ fontSize: "12px", color: "var(--mg-dampad)", lineHeight: "1.6", whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "inherit", margin: 0 }}>
                  {streamText}<span style={{ display: "inline-block", width: "8px", height: "14px", background: "var(--mg-guld)", marginLeft: "2px", verticalAlign: "middle", borderRadius: "2px", animation: "pulse 0.8s ease infinite" }} />
                </pre>
              </div>
            )}
          </div>
        )}

        {/* FORMULÄR */}
        {!resultat && !laddning && (
          <div className="fade-up">

            {/* STEG 1 */}
            {steg === 1 && (
              <div className="kort" style={{ padding: "28px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>Välj modersmål</h2>
                <p style={{ color: "var(--mg-dampad-2)", fontSize: "13px", marginBottom: "18px" }}>Vilket språk undervisar du i?</p>
                <input type="text" placeholder="Sök eller skriv språk… (t.ex. 'ar', 'kur', 'arabiska')" value={sokterm} onChange={e => setSokterm(e.target.value)} style={{ marginBottom: "14px" }} />
                {sokterm && filtrerade.length === 0 && <p style={{ fontSize: "13px", color: "var(--mg-dampad-2)", marginBottom: "10px" }}>Inget språk hittades – välj "Annat språk" längst ned.</p>}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px", maxHeight: "300px", overflowY: "auto", paddingRight: "4px", marginBottom: "16px" }}>
                  {filtrerade.map(s => (
                    <div key={s.kod} className={`val-kort ${sprak?.kod === s.kod ? "vald" : ""}`} onClick={() => setSprak(s)}>
                      <span style={{ fontSize: "18px" }}>{s.flagga}</span>
                      <span style={{ fontSize: "13px", fontWeight: 500 }}>{s.namn}</span>
                      {sprak?.kod === s.kod && <span style={{ marginLeft: "auto", color: "var(--mg-guld)" }}>✓</span>}
                    </div>
                  ))}
                </div>
                {sprak?.kod === "other" && <input type="text" maxLength={40} placeholder="Ange språkets namn…" value={annatSprak} onChange={e => setAnnatSprak(e.target.value)} style={{ marginBottom: "12px" }} />}
                {sprak && <div style={{ marginBottom: "20px", padding: "10px 14px", background: "var(--mg-guld-a08)", borderRadius: "10px", fontSize: "13px", color: "var(--mg-guld)" }}>✓ Valt språk: <strong>{sprakNamn}</strong></div>}

                {sprak && (
                  <div style={{ borderTop: "1px solid var(--mg-vit-a08)", paddingTop: "20px" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "4px" }}>Vilken kursplan gäller?</h3>
                    <p style={{ color: "var(--mg-dampad-2)", fontSize: "13px", marginBottom: "14px" }}>Välj rätt kursplan – påverkar Lgr22-koppling och innehåll.</p>
                    <div style={{ display: "grid", gap: "10px" }}>
                      {KURSPLANER.map(k => (
                        <div key={k.id} className={`kursplan-kort ${kursplan?.id === k.id ? "vald" : ""}`} onClick={() => setKursplan(k)}>
                          <span style={{ fontSize: "22px", flexShrink: 0 }}>{k.ikon}</span>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "14px", color: kursplan?.id === k.id ? "var(--mg-guld)" : "var(--mg-text)", marginBottom: "3px" }}>{k.titel}</div>
                            <div style={{ fontSize: "12px", color: "var(--mg-dampad-2)" }}>{k.beskrivning}</div>
                          </div>
                          {kursplan?.id === k.id && <span style={{ marginLeft: "auto", color: "var(--mg-guld)", fontSize: "16px" }}>✓</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ marginTop: "22px", display: "flex", justifyContent: "flex-end" }}>
                  <button className="knapp-prim" disabled={!steg1Klar} onClick={() => setSteg(2)}>Fortsätt →</button>
                </div>
              </div>
            )}

            {/* STEG 2 */}
            {steg === 2 && (
              <div className="kort" style={{ padding: "28px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>Stadium och ämnesområde</h2>
                <p style={{ color: "var(--mg-dampad-2)", fontSize: "13px", marginBottom: "20px" }}>Du kan välja flera stadier om du har en blandad grupp.</p>
                <div style={{ marginBottom: "22px" }}>
                  <div className="label" style={{ marginBottom: "9px" }}>Stadium – välj ett eller flera</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "7px" }}>
                    {STADIER.map(s => (
                      <div key={s.namn} className={`val-kort ${valdaStadier.find(x => x.namn === s.namn) ? "vald" : ""}`}
                        onClick={() => toggleStadium(s)} style={{ flexDirection: "column", alignItems: "flex-start" }}>
                        <span style={{ fontWeight: 600, fontSize: "14px" }}>{s.namn}</span>
                        <span style={{ fontSize: "11px", color: "var(--mg-dampad-2)" }}>Åk {s.ar}</span>
                        {valdaStadier.find(x => x.namn === s.namn) && <span style={{ color: "var(--mg-guld)", fontSize: "11px", marginTop: "4px" }}>✓ Vald</span>}
                      </div>
                    ))}
                  </div>
                  {valdaStadier.length > 1 && (
                    <div style={{ marginTop: "10px", padding: "8px 12px", background: "var(--mg-guld-a08)", borderRadius: "8px", fontSize: "12px", color: "var(--mg-guld)" }}>
                      🎓 Blandad grupp: {stadiumText}
                    </div>
                  )}
                </div>
                <div style={{ marginBottom: "22px" }}>
                  <div className="label" style={{ marginBottom: "9px" }}>Ämnesområde (Lgr22)</div>
                  <div style={{ display: "grid", gap: "7px" }}>
                    {OMRADEN.map(o => (
                      <div key={o} className={`val-kort ${omrade === o ? "vald" : ""}`} onClick={() => setOmrade(o)}>
                        <span style={{ fontSize: "13px" }}>{o}</span>
                        {omrade === o && <span style={{ marginLeft: "auto", color: "var(--mg-guld)" }}>✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="label" style={{ marginBottom: "9px" }}>Lektionstid</div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {ANTAL_LEKTIONER.map(t => <button key={t} className={`tid-knapp ${lektionstid === t ? "vald" : ""}`} onClick={() => setLektionstid(t)}>{t}</button>)}
                  </div>
                </div>
                <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between" }}>
                  <button className="knapp-sek" onClick={() => setSteg(1)}>← Tillbaka</button>
                  <button className="knapp-prim" disabled={valdaStadier.length === 0 || !omrade} onClick={() => setSteg(3)}>Fortsätt →</button>
                </div>
              </div>
            )}

            {/* STEG 3 */}
            {steg === 3 && (
              <div className="kort" style={{ padding: "28px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>Elevernas nivåer</h2>
                <p style={{ color: "var(--mg-dampad-2)", fontSize: "13px", marginBottom: "18px" }}>Välj de nivåer som finns i din grupp.</p>
                <div style={{ display: "grid", gap: "9px" }}>
                  {NIVAER.map(n => (
                    <div key={n} className={`val-kort ${valdaNivaer.includes(n) ? "vald" : ""}`} onClick={() => toggleNiva(n)} style={{ justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: NIVA_FARG[n], flexShrink: 0 }} />
                        <span style={{ fontSize: "14px", fontWeight: 500 }}>{n}</span>
                      </div>
                      {valdaNivaer.includes(n) && <span style={{ color: "var(--mg-guld)" }}>✓</span>}
                    </div>
                  ))}
                </div>
                {valdaNivaer.length > 0 && <p style={{ marginTop: "12px", fontSize: "12px", color: "var(--mg-dampad-2)" }}>Valda: {valdaNivaer.join(", ")}</p>}
                {valdaNivaer.length > 3 && <div className="varning">⚠️ Du har valt {valdaNivaer.length} nivåer – kan ta upp till 40–50 sekunder. Max 3 ger snabbare resultat.</div>}
                <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between" }}>
                  <button className="knapp-sek" onClick={() => setSteg(2)}>← Tillbaka</button>
                  <button className="knapp-prim" disabled={valdaNivaer.length === 0} onClick={() => setSteg(4)}>Fortsätt →</button>
                </div>
              </div>
            )}

            {/* STEG 4 */}
            {steg === 4 && (
              <div className="kort" style={{ padding: "28px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>Redo att generera</h2>
                <p style={{ color: "var(--mg-dampad-2)", fontSize: "13px", marginBottom: "22px" }}>Kontrollera dina val.</p>
                <div style={{ display: "grid", gap: "8px", marginBottom: "22px" }}>
                  {[
                    { label: "Modersmål", varde: sprakNamn, ikon: "🌍" },
                    { label: "Kursplan", varde: kursplan?.titel, ikon: kursplan?.ikon },
                    { label: "Stadium", varde: stadiumText, ikon: "🎓" },
                    { label: "Ämnesområde", varde: omrade, ikon: "📖" },
                    { label: "Lektionstid", varde: lektionstid, ikon: "⏱" },
                    { label: "Elevnivåer", varde: valdaNivaer.join(", "), ikon: "📊" },
                  ].map(({ label, varde, ikon }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", background: "var(--mg-vit-a04)", borderRadius: "10px", gap: "12px" }}>
                      <span style={{ fontSize: "13px", color: "var(--mg-dampad-2)" }}>{ikon} {label}</span>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--mg-guld)", textAlign: "right" }}>{varde}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: "var(--mg-guld-a07)", border: "1px solid var(--mg-guld-a17)", borderRadius: "10px", padding: "13px", marginBottom: "22px" }}>
                  <p style={{ fontSize: "13px", color: "var(--mg-guld-3)", lineHeight: "1.6" }}>
                    Planen genereras med <strong style={{ color: "var(--mg-guld)" }}>konkreta exempel och fraser</strong> på svenska och {sprakNamn}.
                  </p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button className="knapp-sek" onClick={() => setSteg(3)}>← Tillbaka</button>
                  <button className="knapp-prim" onClick={genereraLektionsplan}>✨ Generera lektionsplan</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── STARTSIDA ────────────────────────────────────────────────────────────────
// ─── FEEDBACK MODAL ───────────────────────────────────────────────────────────
function FeedbackModal({ onClose }) {
  const [skickat, setSkickat] = useState(false);
  const [laddar, setLaddar] = useState(false);
  const [form, setForm] = useState({ namn: "", sprak: "", betyg: "", kommentar: "" });

  async function skicka(e) {
    e.preventDefault();
    setLaddar(true);
    try {
      await fetch("https://formspree.io/f/mjgzgdzr", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          app: "ModersmålsGuiden",
          namn: form.namn || "Anonym",
          sprak: form.sprak,
          betyg: form.betyg,
          kommentar: form.kommentar,
          _subject: `ModersmålsGuiden Feedback – ${form.sprak || "Allmänt"}`,
        }),
      });
      setSkickat(true);
    } catch {
      alert("Något gick fel. Försök igen.");
    }
    setLaddar(false);
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"var(--mg-svart-a60)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:"var(--mg-bg-1)", border:"1px solid var(--mg-guld-a30)", borderRadius:18, padding:"1.5rem", maxWidth:440, width:"100%", boxShadow:"0 8px 40px var(--mg-svart-a50)", fontFamily:"'DM Sans', sans-serif", color:"var(--mg-text)" }}>
        {skickat ? (
          <div style={{ textAlign:"center", padding:"1rem 0" }}>
            <div style={{ fontSize:"2.5rem", marginBottom:".5rem" }}>🎉</div>
            <h2 style={{ color:"var(--mg-guld)", margin:"0 0 .5rem", fontFamily:"'Newsreader', serif" }}>Tack för din feedback!</h2>
            <p style={{ color:"var(--mg-dampad)", fontSize:".85rem", marginBottom:"1.2rem", lineHeight:1.6 }}>Din feedback hjälper mig att förbättra ModersmålsGuiden.</p>
            <button onClick={onClose} style={{ background:"linear-gradient(135deg,var(--mg-guld),var(--mg-guld-mork))", color:"var(--mg-bg-1)", border:"none", borderRadius:50, padding:".6rem 1.5rem", cursor:"pointer", fontFamily:"inherit", fontSize:".85rem", fontWeight:700 }}>Stäng</button>
          </div>
        ) : (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
              <h2 style={{ margin:0, color:"var(--mg-guld)", fontSize:"1.1rem", fontFamily:"'Newsreader', serif" }}>📝 Ge feedback</h2>
              <button onClick={onClose} style={{ background:"none", border:"none", fontSize:"1.3rem", cursor:"pointer", color:"var(--mg-dampad-2)" }}>✕</button>
            </div>
            <p style={{ color:"var(--mg-dampad-2)", fontSize:".8rem", marginBottom:"1rem", lineHeight:1.6 }}>Din feedback skickas direkt till mig och hjälper mig förbättra appen.</p>
            <form onSubmit={skicka}>
              <div style={{ marginBottom:".75rem" }}>
                <label style={{ fontSize:".78rem", color:"var(--mg-guld)", fontWeight:600, display:"block", marginBottom:".3rem" }}>Namn (valfritt)</label>
                <input type="text" placeholder="Ditt namn" value={form.namn} onChange={e=>setForm(f=>({...f,namn:e.target.value}))}
                  style={{ width:"100%", background:"var(--mg-vit-a07)", border:"1px solid var(--mg-vit-a15)", borderRadius:8, padding:".5rem .75rem", color:"var(--mg-text)", fontFamily:"inherit", fontSize:".85rem", outline:"none", boxSizing:"border-box" }}/>
              </div>
              <div style={{ marginBottom:".75rem" }}>
                <label style={{ fontSize:".78rem", color:"var(--mg-guld)", fontWeight:600, display:"block", marginBottom:".3rem" }}>Vilket modersmål undervisar du i?</label>
                <input type="text" placeholder="T.ex. Arabiska, Somaliska, Kurdiska..." value={form.sprak} onChange={e=>setForm(f=>({...f,sprak:e.target.value}))}
                  style={{ width:"100%", background:"var(--mg-vit-a07)", border:"1px solid var(--mg-vit-a15)", borderRadius:8, padding:".5rem .75rem", color:"var(--mg-text)", fontFamily:"inherit", fontSize:".85rem", outline:"none", boxSizing:"border-box" }}/>
              </div>
              <div style={{ marginBottom:".75rem" }}>
                <label style={{ fontSize:".78rem", color:"var(--mg-guld)", fontWeight:600, display:"block", marginBottom:".3rem" }}>Betyg (1–5)</label>
                <div style={{ display:"flex", gap:".4rem" }}>
                  {[1,2,3,4,5].map(n=>(
                    <button type="button" key={n} onClick={()=>setForm(f=>({...f,betyg:String(n)}))}
                      style={{ flex:1, padding:".45rem", border:`2px solid ${form.betyg===String(n)?"var(--mg-guld)":"var(--mg-vit-a15)"}`, borderRadius:8, background:form.betyg===String(n)?"var(--mg-guld-a20)":"var(--mg-vit-a05)", cursor:"pointer", fontFamily:"inherit", fontSize:".9rem", fontWeight:700, color:form.betyg===String(n)?"var(--mg-guld)":"var(--mg-dampad)" }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom:"1rem" }}>
                <label style={{ fontSize:".78rem", color:"var(--mg-guld)", fontWeight:600, display:"block", marginBottom:".3rem" }}>Kommentar</label>
                <textarea placeholder="Vad fungerar bra? Vad kan förbättras?" value={form.kommentar} onChange={e=>setForm(f=>({...f,kommentar:e.target.value}))} rows={3}
                  style={{ width:"100%", background:"var(--mg-vit-a07)", border:"1px solid var(--mg-vit-a15)", borderRadius:8, padding:".5rem .75rem", color:"var(--mg-text)", fontFamily:"inherit", fontSize:".85rem", outline:"none", resize:"vertical", boxSizing:"border-box" }}/>
                <p style={{ fontSize:".75rem", color:"var(--mg-guld)", margin:".3rem 0 0" }}>Skriv inga personuppgifter.</p>
              </div>
              <div style={{ display:"flex", gap:".5rem", justifyContent:"flex-end" }}>
                <button type="button" onClick={onClose} style={{ background:"transparent", border:"1px solid var(--mg-vit-a20)", borderRadius:50, padding:".5rem 1.1rem", cursor:"pointer", fontFamily:"inherit", fontSize:".82rem", color:"var(--mg-dampad)" }}>Avbryt</button>
                <button type="submit" disabled={laddar||!form.kommentar}
                  style={{ background:!form.kommentar||laddar?"var(--mg-avstangd-yta)":"linear-gradient(135deg,var(--mg-guld),var(--mg-guld-mork))", color:!form.kommentar||laddar?"var(--mg-avstangd-text)":"var(--mg-bg-1)", border:"none", borderRadius:50, padding:".5rem 1.3rem", cursor:!form.kommentar||laddar?"default":"pointer", fontFamily:"inherit", fontSize:".82rem", fontWeight:700 }}>
                  {laddar?"Skickar…":"Skicka ✉️"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  if (mode === "chatt") return <ChattLage onBack={() => { setMode(null); window.scrollTo(0, 0); }} />;
  if (mode === "guide") return <GuidatLage onBack={() => { setMode(null); window.scrollTo(0, 0); }} />;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, var(--mg-bg-1) 0%, var(--mg-bg-2) 50%, var(--mg-bg-3) 100%)", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <style>{globalCSS}</style>
      <div className="fi" style={{ textAlign: "center", maxWidth: 480, width: "100%" }}>
        {/* Norvay-tema: layout "stack" med formen "circle" */}
        <div className="mg-motif" aria-hidden="true">📚</div>
        <h1 className="mg-hero-title" style={{ fontFamily: "'Newsreader', serif", fontSize: "clamp(32px, 7vw, 48px)", color: "var(--mg-text)", lineHeight: 1.05, marginBottom: "10px" }}>
          Modersmåls<em>Guiden</em>
        </h1>
        <p style={{ color: "var(--mg-dampad-2)", fontSize: "14px", marginBottom: "8px" }}>Differentierad lektionsplanering för modersmålslärare · Lgr22</p>
        <p style={{ color: "var(--mg-guldaccent)", fontSize: "13px", fontWeight: 600, background: "var(--mg-guldaccent-yta)", border: "1px solid var(--mg-guldaccent-kant)", borderRadius: "20px", padding: "5px 16px", display: "inline-block", marginBottom: "2rem" }}>
          ✨ Skapa en färdig lektionsplan på under en minut
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <button onClick={() => setMode("guide")} style={{ background: "linear-gradient(135deg, var(--mg-guld-a15), var(--mg-guldmork-a08))", border: "1px solid var(--mg-guld-a25)", borderRadius: "16px", padding: "1.5rem .9rem", cursor: "pointer", fontFamily: "inherit", transition: "all .2s", textAlign: "left" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            <div style={{ fontSize: "1.7rem", marginBottom: ".35rem" }}>📋</div>
            <div style={{ fontSize: ".95rem", fontWeight: 700, color: "var(--mg-guld)", marginBottom: ".2rem" }}>Guidat läge</div>
            <div style={{ fontSize: ".72rem", color: "var(--mg-dampad)" }}>Välj språk, kursplan, stadium och nivåer steg för steg</div>
          </button>
          <button onClick={() => setMode("chatt")} style={{ background: "linear-gradient(135deg, var(--mg-vit-a06), var(--mg-vit-a03))", border: "1px solid var(--mg-vit-a12)", borderRadius: "16px", padding: "1.5rem .9rem", cursor: "pointer", fontFamily: "inherit", transition: "all .2s", textAlign: "left" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            <div style={{ fontSize: "1.7rem", marginBottom: ".35rem" }}>💬</div>
            <div style={{ fontSize: ".95rem", fontWeight: 700, color: "var(--mg-text)", marginBottom: ".2rem" }}>Chattläge</div>
            <div style={{ fontSize: ".72rem", color: "var(--mg-dampad)" }}>Skriv fritt – få lektionsplan eller övning direkt</div>
          </button>
        </div>

        <div style={{ background: "var(--mg-vit-a04)", border: "1px solid var(--mg-vit-a08)", borderRadius: "12px", padding: ".7rem 1rem", marginBottom: "1rem" }}>
          <p style={{ color: "var(--mg-dampad-3)", fontSize: ".75rem", fontWeight: 600, marginBottom: ".2rem" }}>💬 Prova i chattläget:</p>
          <p style={{ color: "var(--mg-dampad-2)", fontSize: ".73rem" }}>"Lektionsplan arabiska åk 5 om familj" · "Övningar somaliska nybörjare" · "Kurdiska högstadiet berättande texter"</p>
        </div>

        {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}

        <button onClick={() => setFeedbackOpen(true)}
          style={{ background: "none", border: "1px solid var(--mg-guld-a30)", borderRadius: 50, padding: ".4rem 1.2rem", cursor: "pointer", fontFamily: "inherit", fontSize: ".78rem", color: "var(--mg-dampad)", marginBottom: ".8rem", transition: "all .2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--mg-guld-a60)"; e.currentTarget.style.color = "var(--mg-guld)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--mg-guld-a30)"; e.currentTarget.style.color = "var(--mg-dampad)"; }}>
          📝 Ge feedback på appen
        </button>

        <p style={{ color: "var(--mg-dampad-9)", fontSize: ".7rem" }}>av MD · modersmalsguiden.vercel.app</p>
      </div>
    </div>
  );
}
