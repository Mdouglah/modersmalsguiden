import { useState, useRef } from "react";

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
  {
    id: "modersmal",
    titel: "Modersmål",
    beskrivning: "Elever med språket som förstaspråk",
    ikon: "📘",
    farg: "#1565c0",
  },
  {
    id: "minoritet",
    titel: "Nationellt minoritetsspråk",
    beskrivning: "Finska, samiska, romani, meänkieli eller jiddisch",
    ikon: "📗",
    farg: "#2e7d32",
  },
  {
    id: "nyanland",
    titel: "Modersmål för nyanlända",
    beskrivning: "Elever nyanlända i Sverige med begränsad svenska",
    ikon: "📙",
    farg: "#e65100",
  },
];

const NIVA_FARG = {
  "Nybörjare": "#2e7d32",
  "Grundnivå": "#1565c0",
  "Mellannivå": "#e65100",
  "Avancerad": "#880e4f",
  "Modersmålsnära": "#4a148c",
};

const STEG_LABELS = ["Språk & kursplan", "Stadium", "Nivåer", "Generera"];

function exportText(resultat, sprakNamn, kursplan, stadium, omrade, lektionstid) {
  let t = `MODERSMÅLSGUIDEN – Lgr22\n${"=".repeat(40)}\n`;
  t += `Språk: ${sprakNamn} | Kursplan: ${kursplan?.titel} | Stadium: ${stadium?.namn} | Område: ${omrade} | Tid: ${lektionstid}\n\n`;
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
  t += `\nAVSLUTNING\n${resultat.avslutning}\n\n`;
  t += `MATERIAL\n${resultat.materialSvenska}\n\n`;
  t += `BEDÖMNING\n${resultat.bedomning}\n`;
  return t;
}

export default function App() {
  const [steg, setSteg] = useState(1);
  const [sprak, setSprak] = useState(null);
  const [annatSprak, setAnnatSprak] = useState("");
  const [kursplan, setKursplan] = useState(null);
  const [stadium, setStadium] = useState(null);
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
  const resultRef = useRef(null);

  const filtrerade = SPRAK.filter(s => {
    const t = sokterm.toLowerCase().trim();
    if (!t) return true;
    return (
      s.namn.toLowerCase().includes(t) ||
      s.kod.toLowerCase().startsWith(t) ||
      s.sokord?.some(k => k.startsWith(t))
    );
  });

  function toggleNiva(niva) {
    setValdaNivaer(prev =>
      prev.includes(niva) ? prev.filter(n => n !== niva) : [...prev, niva]
    );
  }

  const sprakNamn = sprak?.kod === "other" ? annatSprak || "Annat språk" : sprak?.namn;

  async function genereraLektionsplan() {
    setLaddning(true);
    setResultat(null);
    setAktivNiva(null);
    setSprakvisning("svenska");

    const kursplanInfo = kursplan?.id === "modersmal"
      ? "Modersmål (förstaspråk) – Lgr22 kursplan för modersmål"
      : kursplan?.id === "minoritet"
      ? "Nationellt minoritetsspråk – Lgr22 kursplan för modersmål som nationellt minoritetsspråk"
      : "Modersmål för nyanlända – anpassad undervisning med fokus på grundläggande kommunikation";

    const prompt = `Du är en erfaren modersmålslärare i Sverige. Skapa en KOMPLETT och KLAR lektionsplan – läraren ska kunna använda den direkt utan att behöva lägga till något.

Språk: ${sprakNamn}
Kursplan: ${kursplanInfo}
Stadium: ${stadium?.namn} (åk ${stadium?.ar})
Ämnesområde: ${omrade}
Lektionstid: ${lektionstid}
Elevnivåer: ${valdaNivaer.join(", ")}

VIKTIGT: Varje nivå ska innehålla:
- Konkreta exempelfraser och meningar på BÅDE svenska och ${sprakNamn}
- En färdig exempeluppgift med exempeltext som läraren kan visa direkt
- Specifika ord och fraser som hör till ämnet

Svara ENDAST med JSON (inga backticks, inga förklaringar):
{
  "titel": "Konkret lektionstitel på svenska",
  "titelMalsprak": "Titel på ${sprakNamn}",
  "malSvenska": "Lärandemål på svenska (2 meningar, konkret och mätbart)",
  "malMalsprak": "Lärandemål på ${sprakNamn}",
  "lgr22": "Exakt citat eller nära parafras från Lgr22 kursplan för ${kursplanInfo}",
  "nivaer": [
    ${valdaNivaer.map(n => `{
      "niva": "${n}",
      "aktivitetSvenska": "Konkret aktivitetsbeskrivning för ${n}-nivå (2-3 meningar med exakt vad läraren gör)",
      "aktivitetMalsprak": "Samma aktivitet på ${sprakNamn}",
      "exempelfraser": ["Exempelfraser på svenska som används i aktiviteten", "Ytterligare en exempelfras"],
      "exempelfraser_malsprak": ["Samma fraser på ${sprakNamn}", "Samma fras 2 på ${sprakNamn}"],
      "uppgiftSvenska": "Exakt uppgiftsbeskrivning för ${n}-nivå",
      "uppgiftMalsprak": "Samma uppgift på ${sprakNamn}",
      "exempeluppgift": "Ett konkret exempel på ett färdigt elevarbete eller exempelsvar för denna nivå",
      "stod": "Konkret lärarstöd och scaffolding för ${n}-nivå"
    }`).join(",\n    ")}
  ],
  "avslutning": "Konkret gemensam avslutning (vad gör alla elever?)",
  "avslutningMalsprak": "Avslutning på ${sprakNamn}",
  "materialSvenska": "Exakt lista på material som behövs",
  "bedomning": "Konkret formativ bedömningsidé kopplad till Lgr22"
}`;

    try {
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.error || "Serverfel");
      }

      // Läs streamen
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              fullText += parsed.text;
              setStreamText(fullText);
            }
            if (parsed.done) {
              // Streamen klar – parsa JSON
              const clean = fullText.replace(/```json|```/g, "").trim();
              const result = JSON.parse(clean);
              setResultat(result);
              setStreamText("");
              setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
            }
          } catch {
            // Ignorera ogiltiga rader
          }
        }
      }
    } catch (e) {
      console.error("API error:", e);
      setStreamText("");
      setResultat({ fel: "Kunde inte generera lektionsplanen. Försök igen." });
    }
    setLaddning(false);
  }

  function resetAllt() {
    setSteg(1);
    setSprak(null);
    setAnnatSprak("");
    setKursplan(null);
    setStadium(null);
    setOmrade(null);
    setValdaNivaer([]);
    setResultat(null);
    setSokterm("");
    setCopied(false);
    setAktivNiva(null);
    setStreamText("");
    window.scrollTo(0, 0);
  }

  function kopiera() {
    if (!resultat) return;
    navigator.clipboard.writeText(exportText(resultat, sprakNamn, kursplan, stadium, omrade, lektionstid))
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  }

  const steg1Klar = sprak && (sprak.kod !== "other" || annatSprak) && kursplan;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#e8e8f0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:.3 } 50% { opacity:1 } }
        .fade-up { animation: fadeUp .35s ease; }
        .kort { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; }
        .knapp-prim { background: linear-gradient(135deg, #e8b86d, #d4965a); color: #1a1a2e; border: none; border-radius: 12px; padding: 13px 26px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .knapp-prim:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(232,184,109,0.35); }
        .knapp-prim:disabled { opacity: 0.3; cursor: not-allowed; }
        .knapp-sek { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #e8e8f0; border-radius: 10px; padding: 10px 18px; font-size: 14px; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .knapp-sek:hover { background: rgba(255,255,255,0.08); }
        .knapp-copy { background: linear-gradient(135deg, #1565c0, #0d47a1); color: white; border: none; border-radius: 50px; padding: 10px 20px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all .2s; }
        .knapp-copy:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(21,101,192,.4); }
        .knapp-print { background: linear-gradient(135deg, #6a1b9a, #4a148c); color: white; border: none; border-radius: 50px; padding: 10px 20px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all .2s; }
        .knapp-print:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(106,27,154,.4); }
        .val-kort { background: rgba(255,255,255,0.04); border: 1.5px solid rgba(255,255,255,0.09); border-radius: 12px; padding: 13px 16px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 10px; }
        .val-kort:hover { background: rgba(232,184,109,0.08); border-color: rgba(232,184,109,0.35); }
        .val-kort.vald { background: rgba(232,184,109,0.12); border-color: #e8b86d; }
        .kursplan-kort { background: rgba(255,255,255,0.04); border: 2px solid rgba(255,255,255,0.09); border-radius: 14px; padding: 16px; cursor: pointer; transition: all 0.2s; display: flex; align-items: flex-start; gap: 14px; }
        .kursplan-kort:hover { background: rgba(232,184,109,0.07); border-color: rgba(232,184,109,0.3); }
        .kursplan-kort.vald { background: rgba(232,184,109,0.1); border-color: #e8b86d; }
        .tid-knapp { border: 2px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 9px 18px; cursor: pointer; transition: all 0.2s; font-size: 14px; background: rgba(255,255,255,0.04); color: #e8e8f0; font-family: inherit; }
        .tid-knapp:hover { border-color: rgba(232,184,109,0.4); }
        .tid-knapp.vald { background: rgba(232,184,109,0.18); border-color: #e8b86d; color: #e8b86d; font-weight: 700; }
        .tab-knapp { padding: 8px 18px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; font-family: inherit; }
        .tab-knapp.aktiv { background: #e8b86d; color: #1a1a2e; }
        .tab-knapp:not(.aktiv) { background: rgba(255,255,255,0.07); color: #8080b0; }
        .tab-knapp:not(.aktiv):hover { background: rgba(255,255,255,0.12); color: #e8e8f0; }
        .niva-tab { border: none; border-radius: 50px; padding: 7px 16px; cursor: pointer; font-size: 13px; font-weight: 700; transition: all 0.2s; font-family: inherit; }
        .niva-sektion { border-radius: 14px; padding: 20px; border-left: 4px solid; background: rgba(255,255,255,0.04); margin-bottom: 12px; }
        .fras-chip { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 5px 10px; font-size: 12px; color: #d0d0e8; display: inline-block; margin: 3px; font-style: italic; }
        .exempel-box { background: rgba(232,184,109,0.07); border: 1px solid rgba(232,184,109,0.2); border-radius: 10px; padding: 12px 14px; margin-top: 10px; }
        input[type="text"] { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.13); border-radius: 10px; padding: 10px 14px; color: #e8e8f0; font-size: 14px; outline: none; width: 100%; font-family: inherit; }
        input[type="text"]::placeholder { color: #505080; }
        input[type="text"]:focus { border-color: rgba(232,184,109,0.5); background: rgba(255,255,255,0.09); }
        .spinner { width: 38px; height: 38px; border: 3px solid rgba(232,184,109,0.15); border-top-color: #e8b86d; border-radius: 50%; animation: spin 0.8s linear infinite; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: #e8b86d; animation: pulse 1.2s ease infinite; }
        .steg-punkt { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.15); transition: all 0.3s; }
        .steg-punkt.aktiv { background: #e8b86d; width: 24px; border-radius: 4px; }
        .steg-punkt.klar { background: rgba(232,184,109,0.45); }
        .varning { background: rgba(232,184,109,0.07); border: 1px solid rgba(232,184,109,0.25); border-radius: 10px; padding: 11px 14px; margin-top: 12px; font-size: 13px; color: #e8b86d; line-height: 1.5; }
        .stat-box { background: rgba(255,255,255,0.05); border-radius: 10px; padding: 12px; text-align: center; }
        .chip { background: rgba(232,184,109,0.11); border: 1px solid rgba(232,184,109,0.22); border-radius: 6px; padding: 3px 10px; font-size: 12px; color: #e8b86d; display: inline-block; }
        .label { font-size: 11px; color: #5050a0; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; }
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .niva-sektion { border: 1px solid #ddd !important; background: #fafafa !important; color: black !important; break-inside: avoid; }
          .kort { background: white !important; border: 1px solid #ddd !important; color: black !important; }
          .exempel-box { background: #fffbe6 !important; border: 1px solid #ddd !important; }
          p, span, div { color: black !important; }
        }
      `}</style>

      {/* HEADER */}
      <div style={{ padding: "28px 24px 0", textAlign: "center" }} className="no-print">
        <div style={{ fontSize: "1.8rem", marginBottom: "6px" }}>📚</div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(26px, 5vw, 44px)",
          fontWeight: 700,
          background: "linear-gradient(135deg, #e8b86d, #f5d69a)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.5px",
          marginBottom: "6px",
        }}>ModersmålsGuiden</h1>
        <p style={{ color: "#6060a0", fontSize: "14px", marginBottom: "6px" }}>
          Differentierad lektionsplanering för modersmålslärare · Lgr22
        </p>
        {!resultat && !laddning && (
          <p style={{
            color: "#e8b86d", fontSize: "13px", fontWeight: 600,
            background: "rgba(232,184,109,0.08)", border: "1px solid rgba(232,184,109,0.2)",
            borderRadius: "20px", padding: "5px 16px", display: "inline-block", marginTop: "4px",
          }}>
            ✨ Skapa en färdig lektionsplan på under en minut
          </p>
        )}
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "24px 18px 80px" }}>

        {/* STEG-INDIKATOR */}
        {!resultat && !laddning && (
          <div style={{ textAlign: "center", marginBottom: "24px" }} className="no-print">
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "8px" }}>
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`steg-punkt ${steg === s ? "aktiv" : steg > s ? "klar" : ""}`} />
              ))}
            </div>
            <p style={{ fontSize: "12px", color: "#5050a0" }}>
              Steg {steg} av 4 – {STEG_LABELS[steg - 1]}
            </p>
          </div>
        )}

        {/* ── RESULTAT ── */}
        {resultat && !laddning && (
          <div ref={resultRef} className="fade-up">
            {resultat.fel ? (
              <div className="kort" style={{ padding: "36px", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "12px" }}>😔</div>
                <p style={{ color: "#ff6b6b", marginBottom: "16px" }}>{resultat.fel}</p>
                <button className="knapp-sek" onClick={() => setResultat(null)}>Försök igen</button>
              </div>
            ) : (
              <>
                {/* Resultathuvud */}
                <div style={{
                  background: "linear-gradient(135deg, rgba(232,184,109,0.14), rgba(212,150,90,0.07))",
                  border: "1px solid rgba(232,184,109,0.22)",
                  borderRadius: "18px", padding: "24px", marginBottom: "14px",
                  position: "relative", overflow: "hidden",
                }} className="no-print">
                  <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(232,184,109,0.06)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
                    <div>
                      <div style={{ fontSize: "11px", color: "#8080b0", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "6px" }}>
                        Lektionsplan · {kursplan?.titel} · Lgr22
                      </div>
                      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#e8b86d", marginBottom: "4px" }}>{resultat.titel}</h2>
                      <p style={{ color: "#a0a0c0", fontSize: "13px" }}>{resultat.titelMalsprak}</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button className="knapp-copy" onClick={kopiera}>{copied ? "✅ Kopierat!" : "📋 Kopiera"}</button>
                      <button className="knapp-print" onClick={() => window.print()}>🖨️ Skriv ut</button>
                      <button className="knapp-prim" onClick={resetAllt}>Ny plan</button>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                    {[sprakNamn, kursplan?.titel, stadium?.namn, omrade, lektionstid].map(tag => (
                      <span key={tag} className="chip">{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {[["Nivåer", valdaNivaer.length], ["Kursplan", kursplan?.ikon], ["Tid", lektionstid]].map(([lb, v]) => (
                      <div key={lb} className="stat-box">
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "#e8b86d" }}>{v}</div>
                        <div style={{ fontSize: "11px", color: "#5050a0" }}>{lb}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lgr22 */}
                <div style={{ background: "rgba(21,101,192,0.09)", border: "1px solid rgba(21,101,192,0.22)", borderRadius: "12px", padding: "14px 18px", marginBottom: "14px" }}>
                  <div style={{ fontSize: "11px", color: "#90caf9", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "5px" }}>📌 Lgr22-koppling · {kursplan?.titel}</div>
                  <p style={{ fontSize: "13px", color: "#b0d4f8", lineHeight: "1.65", fontStyle: "italic" }}>{resultat.lgr22}</p>
                </div>

                {/* Lärandemål */}
                <div className="kort" style={{ padding: "20px", marginBottom: "14px" }}>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }} className="no-print">
                    {["svenska", "malsprak"].map(v => (
                      <button key={v} className={`tab-knapp ${sprakvisning === v ? "aktiv" : ""}`} onClick={() => setSprakvisning(v)}>
                        {v === "svenska" ? "🇸🇪 Svenska" : `🌍 ${sprakNamn}`}
                      </button>
                    ))}
                  </div>
                  <div className="label">Lärandemål</div>
                  <p style={{ fontSize: "15px", lineHeight: "1.75", color: "#d0d0e8" }}>
                    {sprakvisning === "svenska" ? resultat.malSvenska : resultat.malMalsprak}
                  </p>
                </div>

                {/* Nivå-tabs */}
                <div className="label" style={{ marginBottom: "10px" }}>Differentierade aktiviteter</div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }} className="no-print">
                  {resultat.nivaer?.map((n, i) => (
                    <button key={i} className="niva-tab"
                      onClick={() => setAktivNiva(aktivNiva === i ? null : i)}
                      style={{
                        background: aktivNiva === i ? (NIVA_FARG[n.niva] || "#888") : "rgba(255,255,255,0.06)",
                        color: aktivNiva === i ? "white" : (NIVA_FARG[n.niva] || "#ccc"),
                        border: `2px solid ${aktivNiva === i ? "transparent" : ((NIVA_FARG[n.niva] || "#888") + "44")}`,
                      }}>
                      {n.niva}
                    </button>
                  ))}
                  {aktivNiva !== null && (
                    <button className="niva-tab" onClick={() => setAktivNiva(null)}
                      style={{ background: "rgba(255,255,255,0.06)", color: "#6060a0", border: "2px solid rgba(255,255,255,0.08)" }}>
                      Visa alla
                    </button>
                  )}
                </div>

                {/* Nivå-sektioner */}
                {resultat.nivaer?.map((n, i) => (
                  (aktivNiva === null || aktivNiva === i) && (
                    <div key={i} className="niva-sektion fade-up" style={{ borderLeftColor: NIVA_FARG[n.niva] || "#888" }}>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: NIVA_FARG[n.niva] || "#e8e8f0", marginBottom: "12px" }}>{n.niva}</div>

                      {/* Aktivitet */}
                      <div style={{ marginBottom: "12px" }}>
                        <div className="label">Aktivitet</div>
                        <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#cccce8" }}>
                          {sprakvisning === "svenska" ? n.aktivitetSvenska : n.aktivitetMalsprak}
                        </p>
                      </div>

                      {/* Exempelfraser */}
                      {(n.exempelfraser?.length > 0 || n.exempelfraser_malsprak?.length > 0) && (
                        <div style={{ marginBottom: "12px" }}>
                          <div className="label">Exempelfraser</div>
                          <div>
                            {(sprakvisning === "svenska" ? n.exempelfraser : n.exempelfraser_malsprak)?.map((f, j) => (
                              <span key={j} className="fras-chip">"{f}"</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Uppgift */}
                      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "11px", marginBottom: "10px" }}>
                        <div className="label">Uppgift</div>
                        <p style={{ fontSize: "13px", color: "#b0b0d0", fontStyle: "italic", lineHeight: "1.65" }}>
                          {sprakvisning === "svenska" ? n.uppgiftSvenska : n.uppgiftMalsprak}
                        </p>
                      </div>

                      {/* Exempeluppgift */}
                      {n.exempeluppgift && (
                        <div className="exempel-box">
                          <div style={{ fontSize: "11px", color: "#e8b86d", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "5px" }}>💡 Exempel att visa eleverna</div>
                          <p style={{ fontSize: "13px", color: "#d0c080", lineHeight: "1.65" }}>{n.exempeluppgift}</p>
                        </div>
                      )}

                      {/* Lärarstöd */}
                      <div style={{ fontSize: "12px", color: "#5050a0", marginTop: "10px" }}>
                        <span style={{ color: "#6060a0" }}>Lärarstöd: </span>{n.stod}
                      </div>
                    </div>
                  )
                ))}

                {/* Avslutning + Material */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "4px" }}>
                  <div className="kort" style={{ padding: "16px" }}>
                    <div className="label" style={{ marginBottom: "8px" }}>Gemensam avslutning</div>
                    <p style={{ fontSize: "13px", color: "#b8b8d8", lineHeight: "1.65" }}>
                      {sprakvisning === "svenska" ? resultat.avslutning : resultat.avslutningMalsprak}
                    </p>
                  </div>
                  <div className="kort" style={{ padding: "16px" }}>
                    <div className="label" style={{ marginBottom: "8px" }}>Material</div>
                    <p style={{ fontSize: "13px", color: "#b8b8d8", lineHeight: "1.65" }}>{resultat.materialSvenska}</p>
                  </div>
                </div>
                <div className="kort" style={{ padding: "16px", marginTop: "12px" }}>
                  <div className="label" style={{ marginBottom: "8px" }}>Bedömning · formativ</div>
                  <p style={{ fontSize: "13px", color: "#b8b8d8", lineHeight: "1.65" }}>{resultat.bedomning}</p>
                </div>

                {/* Knappar */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "22px", justifyContent: "center" }} className="no-print">
                  <button className="knapp-copy" onClick={kopiera}>{copied ? "✅ Kopierat!" : "📋 Kopiera text"}</button>
                  <button className="knapp-print" onClick={() => window.print()}>🖨️ Skriv ut</button>
                  <button className="knapp-sek" onClick={genereraLektionsplan}>✨ Generera nytt</button>
                  <button className="knapp-prim" onClick={resetAllt}>🔄 Ny plan</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── LADDNING ── */}
        {laddning && (
          <div style={{ padding: "40px 0" }} className="fade-up">
            {/* Spinner + status */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div className="spinner" style={{ margin: "0 auto 16px" }} />
              <p style={{ color: "#7070b0", fontSize: "15px", marginBottom: "8px" }}>
                {streamText ? "Bygger lektionsplan…" : "Ansluter till AI…"}
              </p>
              <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                {[0, 0.2, 0.4].map((d, i) => <div key={i} className="dot" style={{ animationDelay: `${d}s` }} />)}
              </div>
            </div>

            {/* Live stream-förhandsvisning */}
            {streamText && (
              <div style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                padding: "16px 20px",
                maxHeight: "280px",
                overflowY: "auto",
              }}>
                <div style={{ fontSize: "11px", color: "#5050a0", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>
                  ✍️ Genererar…
                </div>
                <pre style={{
                  fontSize: "12px",
                  color: "#8080b0",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontFamily: "inherit",
                  margin: 0,
                }}>{streamText}<span style={{ display: "inline-block", width: "8px", height: "14px", background: "#e8b86d", marginLeft: "2px", verticalAlign: "middle", borderRadius: "2px", animation: "pulse 0.8s ease infinite" }} /></pre>
              </div>
            )}

            {valdaNivaer.length > 3 && !streamText && (
              <p style={{ color: "#5050a0", fontSize: "13px", textAlign: "center", marginTop: "12px" }}>
                {valdaNivaer.length} nivåer valda – kan ta upp till 40 sekunder
              </p>
            )}
          </div>
        )}

        {/* ── FORMULÄR ── */}
        {!resultat && !laddning && (
          <div className="fade-up">

            {/* STEG 1: Språk + Kursplan */}
            {steg === 1 && (
              <div className="kort" style={{ padding: "28px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>Välj modersmål</h2>
                <p style={{ color: "#6060a0", fontSize: "13px", marginBottom: "18px" }}>Vilket språk undervisar du i?</p>
                <input
                  type="text"
                  placeholder="Sök eller skriv språk… (t.ex. 'ar', 'kur', 'arabiska')"
                  value={sokterm}
                  onChange={e => setSokterm(e.target.value)}
                  style={{ marginBottom: "14px" }}
                />
                {sokterm && filtrerade.length === 0 && (
                  <p style={{ fontSize: "13px", color: "#6060a0", marginBottom: "10px" }}>Inget språk hittades – välj "Annat språk" längst ned.</p>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px", maxHeight: "320px", overflowY: "auto", paddingRight: "4px", marginBottom: "20px" }}>
                  {filtrerade.map(s => (
                    <div key={s.kod} className={`val-kort ${sprak?.kod === s.kod ? "vald" : ""}`} onClick={() => setSprak(s)}>
                      <span style={{ fontSize: "18px" }}>{s.flagga}</span>
                      <span style={{ fontSize: "13px", fontWeight: 500 }}>{s.namn}</span>
                      {sprak?.kod === s.kod && <span style={{ marginLeft: "auto", color: "#e8b86d" }}>✓</span>}
                    </div>
                  ))}
                </div>
                {sprak?.kod === "other" && (
                  <input type="text" placeholder="Ange språkets namn…" value={annatSprak} onChange={e => setAnnatSprak(e.target.value)} style={{ marginBottom: "16px" }} />
                )}
                {sprak && (
                  <div style={{ marginBottom: "20px", padding: "10px 14px", background: "rgba(232,184,109,0.08)", borderRadius: "10px", fontSize: "13px", color: "#e8b86d" }}>
                    ✓ Valt språk: <strong>{sprakNamn}</strong>
                  </div>
                )}

                {/* Kursplansval */}
                {sprak && (
                  <>
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px", marginBottom: "14px" }}>
                      <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "4px" }}>Vilken kursplan gäller?</h3>
                      <p style={{ color: "#6060a0", fontSize: "13px", marginBottom: "14px" }}>Välj rätt kursplan – det påverkar Lgr22-koppling och lektionsinnehåll.</p>
                      <div style={{ display: "grid", gap: "10px" }}>
                        {KURSPLANER.map(k => (
                          <div key={k.id} className={`kursplan-kort ${kursplan?.id === k.id ? "vald" : ""}`} onClick={() => setKursplan(k)}>
                            <span style={{ fontSize: "22px", flexShrink: 0 }}>{k.ikon}</span>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: "14px", color: kursplan?.id === k.id ? "#e8b86d" : "#e8e8f0", marginBottom: "3px" }}>{k.titel}</div>
                              <div style={{ fontSize: "12px", color: "#6060a0" }}>{k.beskrivning}</div>
                            </div>
                            {kursplan?.id === k.id && <span style={{ marginLeft: "auto", color: "#e8b86d", fontSize: "16px" }}>✓</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div style={{ marginTop: "22px", display: "flex", justifyContent: "flex-end" }}>
                  <button className="knapp-prim" disabled={!steg1Klar} onClick={() => setSteg(2)}>
                    Fortsätt →
                  </button>
                </div>
              </div>
            )}

            {/* STEG 2 */}
            {steg === 2 && (
              <div className="kort" style={{ padding: "28px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>Stadium och ämnesområde</h2>
                <p style={{ color: "#6060a0", fontSize: "13px", marginBottom: "20px" }}>Vilken grupp och vad ska ni arbeta med?</p>
                <div style={{ marginBottom: "22px" }}>
                  <div className="label" style={{ marginBottom: "9px" }}>Stadium</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "7px" }}>
                    {STADIER.map(s => (
                      <div key={s.namn} className={`val-kort ${stadium?.namn === s.namn ? "vald" : ""}`}
                        onClick={() => setStadium(s)} style={{ flexDirection: "column", alignItems: "flex-start" }}>
                        <span style={{ fontWeight: 600, fontSize: "14px" }}>{s.namn}</span>
                        <span style={{ fontSize: "11px", color: "#6060a0" }}>Åk {s.ar}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: "22px" }}>
                  <div className="label" style={{ marginBottom: "9px" }}>Ämnesområde (Lgr22)</div>
                  <div style={{ display: "grid", gap: "7px" }}>
                    {OMRADEN.map(o => (
                      <div key={o} className={`val-kort ${omrade === o ? "vald" : ""}`} onClick={() => setOmrade(o)}>
                        <span style={{ fontSize: "13px" }}>{o}</span>
                        {omrade === o && <span style={{ marginLeft: "auto", color: "#e8b86d" }}>✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="label" style={{ marginBottom: "9px" }}>Lektionstid</div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {ANTAL_LEKTIONER.map(t => (
                      <button key={t} className={`tid-knapp ${lektionstid === t ? "vald" : ""}`} onClick={() => setLektionstid(t)}>{t}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between" }}>
                  <button className="knapp-sek" onClick={() => setSteg(1)}>← Tillbaka</button>
                  <button className="knapp-prim" disabled={!stadium || !omrade} onClick={() => setSteg(3)}>Fortsätt →</button>
                </div>
              </div>
            )}

            {/* STEG 3 */}
            {steg === 3 && (
              <div className="kort" style={{ padding: "28px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>Elevernas nivåer</h2>
                <p style={{ color: "#6060a0", fontSize: "13px", marginBottom: "18px" }}>Välj de nivåer som finns i din grupp.</p>
                <div style={{ display: "grid", gap: "9px" }}>
                  {NIVAER.map(n => (
                    <div key={n} className={`val-kort ${valdaNivaer.includes(n) ? "vald" : ""}`}
                      onClick={() => toggleNiva(n)} style={{ justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: NIVA_FARG[n], flexShrink: 0 }} />
                        <span style={{ fontSize: "14px", fontWeight: 500 }}>{n}</span>
                      </div>
                      {valdaNivaer.includes(n) && <span style={{ color: "#e8b86d" }}>✓</span>}
                    </div>
                  ))}
                </div>
                {valdaNivaer.length > 0 && (
                  <p style={{ marginTop: "12px", fontSize: "12px", color: "#6060a0" }}>Valda: {valdaNivaer.join(", ")}</p>
                )}
                {valdaNivaer.length > 3 && (
                  <div className="varning">⚠️ Du har valt {valdaNivaer.length} nivåer – kan ta upp till 40–50 sekunder. Max 3 nivåer ger snabbare resultat.</div>
                )}
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
                <p style={{ color: "#6060a0", fontSize: "13px", marginBottom: "22px" }}>Kontrollera dina val.</p>
                <div style={{ display: "grid", gap: "8px", marginBottom: "22px" }}>
                  {[
                    { label: "Modersmål", varde: sprakNamn, ikon: "🌍" },
                    { label: "Kursplan", varde: kursplan?.titel, ikon: kursplan?.ikon },
                    { label: "Stadium", varde: `${stadium?.namn} (åk ${stadium?.ar})`, ikon: "🎓" },
                    { label: "Ämnesområde", varde: omrade, ikon: "📖" },
                    { label: "Lektionstid", varde: lektionstid, ikon: "⏱" },
                    { label: "Elevnivåer", varde: valdaNivaer.join(", "), ikon: "📊" },
                  ].map(({ label, varde, ikon }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", background: "rgba(255,255,255,0.04)", borderRadius: "10px", gap: "12px" }}>
                      <span style={{ fontSize: "13px", color: "#6060a0" }}>{ikon} {label}</span>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#e8b86d", textAlign: "right" }}>{varde}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: "rgba(232,184,109,0.07)", border: "1px solid rgba(232,184,109,0.17)", borderRadius: "10px", padding: "13px", marginBottom: "22px" }}>
                  <p style={{ fontSize: "13px", color: "#b09040", lineHeight: "1.6" }}>
                    Planen genereras med <strong style={{ color: "#e8b86d" }}>konkreta exempel och färdiga fraser</strong> på svenska och {sprakNamn} – redo att använda direkt i klassrummet.
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
