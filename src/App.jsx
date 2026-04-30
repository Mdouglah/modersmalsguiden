import { useState, useRef } from "react";

const SPRAK = [
  { namn: "Arabiska", kod: "ar", flagga: "🇸🇦" },
  { namn: "Somaliska", kod: "so", flagga: "🇸🇴" },
  { namn: "Persiska/Dari", kod: "fa", flagga: "🇮🇷" },
  { namn: "Polska", kod: "pl", flagga: "🇵🇱" },
  { namn: "Spanska", kod: "es", flagga: "🇪🇸" },
  { namn: "Kurdiska (Kurmanji)", kod: "kmr", flagga: "🏳️" },
  { namn: "Kurdiska (Sorani)", kod: "ckb", flagga: "🏳️" },
  { namn: "Bosniska", kod: "bs", flagga: "🇧🇦" },
  { namn: "Serbiska", kod: "sr", flagga: "🇷🇸" },
  { namn: "Kroatiska", kod: "hr", flagga: "🇭🇷" },
  { namn: "Albanska", kod: "sq", flagga: "🇦🇱" },
  { namn: "Turkiska", kod: "tr", flagga: "🇹🇷" },
  { namn: "Tigrinya", kod: "ti", flagga: "🇪🇷" },
  { namn: "Dari", kod: "prs", flagga: "🇦🇫" },
  { namn: "Finska", kod: "fi", flagga: "🇫🇮" },
  { namn: "Romani", kod: "rom", flagga: "🏳️" },
  { namn: "Samiska (nordsamiska)", kod: "sme", flagga: "🏳️" },
  { namn: "Meänkieli", kod: "fit", flagga: "🏳️" },
  { namn: "Jiddisch", kod: "yi", flagga: "🏳️" },
  { namn: "Ryska", kod: "ru", flagga: "🇷🇺" },
  { namn: "Ukrainska", kod: "uk", flagga: "🇺🇦" },
  { namn: "Ungerska", kod: "hu", flagga: "🇭🇺" },
  { namn: "Portugisiska", kod: "pt", flagga: "🇵🇹" },
  { namn: "Vietnamesiska", kod: "vi", flagga: "🇻🇳" },
  { namn: "Kinesiska (mandarin)", kod: "zh", flagga: "🇨🇳" },
  { namn: "Annat språk", kod: "other", flagga: "🌐" },
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

export default function App() {
  const [steg, setSteg] = useState(1);
  const [sprak, setSprak] = useState(null);
  const [annatSprak, setAnnatSprak] = useState("");
  const [stadium, setStadium] = useState(null);
  const [omrade, setOmrade] = useState(null);
  const [valdaNivaer, setValdaNivaer] = useState([]);
  const [lektionstid, setLektionstid] = useState("45 min");
  const [laddning, setLaddning] = useState(false);
  const [resultat, setResultat] = useState(null);
  const [sprakvisning, setSprakvisning] = useState("svenska");
  const [sokterm, setSokterm] = useState("");
  const resultRef = useRef(null);

  const filtrerade = SPRAK.filter(s =>
    s.namn.toLowerCase().includes(sokterm.toLowerCase())
  );

  function toggleNiva(niva) {
    setValdaNivaer(prev =>
      prev.includes(niva) ? prev.filter(n => n !== niva) : [...prev, niva]
    );
  }

  const sprakNamn = sprak?.kod === "other" ? annatSprak || "Annat språk" : sprak?.namn;

  async function genereraLektionsplan() {
    setLaddning(true);
    setResultat(null);

    const nivaLista = valdaNivaer.join(", ");
    const prompt = `Du är en erfaren modersmålslärare och pedagogisk expert med djup kunskap om Lgr22 kursplanen för modersmål i svenska skolan.

Skapa en komplett och detaljerad differentierad lektionsplan på SVENSKA för modersmålsundervisning.

Språk: ${sprakNamn}
Stadium: ${stadium?.namn} (årskurs ${stadium?.ar})
Ämnesområde: ${omrade}
Lektionstid: ${lektionstid}
Elevnivåer i gruppen: ${nivaLista}

Svara ENDAST med ett JSON-objekt i detta exakta format (inga backticks eller förklaringar):
{
  "titel": "Lektionens titel på svenska",
  "titelMalsprak": "Lektionens titel på ${sprakNamn}",
  "malSvenska": "Lärandemål på svenska (2-3 meningar)",
  "malMalsprak": "Lärandemål på ${sprakNamn} (2-3 meningar)",
  "lgr22": "Relevant koppling till Lgr22 kursplan för modersmål",
  "nivaer": [
    ${valdaNivaer.map(n => `{
      "niva": "${n}",
      "aktivitetSvenska": "Detaljerad aktivitetsbeskrivning för ${n}-nivå på svenska (3-4 meningar med konkreta uppgifter)",
      "aktivitetMalsprak": "Samma aktivitetsbeskrivning på ${sprakNamn}",
      "uppgiftSvenska": "En konkret skriftlig eller muntlig uppgift för denna nivå på svenska",
      "uppgiftMalsprak": "Samma uppgift på ${sprakNamn}",
      "stod": "Lärarstöd och scaffolding-tips för denna nivå"
    }`).join(",\n    ")}
  ],
  "avslutning": "Gemensam avslutning för hela gruppen på svenska (1-2 meningar)",
  "avslutningMalsprak": "Samma avslutning på ${sprakNamn}",
  "materialSvenska": "Behövligt material och resurser",
  "bedomning": "Formativ bedömningsidé kopplad till Lgr22"
}`;

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-dangerous-direct-browser-access": "true",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await resp.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResultat(parsed);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      setResultat({ fel: "Kunde inte generera lektionsplanen. Försök igen." });
    }
    setLaddning(false);
  }

  function resetAllt() {
    setSteg(1);
    setSprak(null);
    setAnnatSprak("");
    setStadium(null);
    setOmrade(null);
    setValdaNivaer([]);
    setResultat(null);
    setSokterm("");
  }

  function skrivUt() {
    window.print();
  }

  const nivaBakgrund = {
    "Nybörjare": "#e8f4e8",
    "Grundnivå": "#e8eef8",
    "Mellannivå": "#fff3e0",
    "Avancerad": "#fce4ec",
    "Modersmålsnära": "#f3e5f5",
  };

  const nivaFarg = {
    "Nybörjare": "#2e7d32",
    "Grundnivå": "#1565c0",
    "Mellannivå": "#e65100",
    "Avancerad": "#880e4f",
    "Modersmålsnära": "#4a148c",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#e8e8f0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .kort { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; }
        .knapp-prim { background: linear-gradient(135deg, #e8b86d, #d4965a); color: #1a1a2e; border: none; border-radius: 12px; padding: 14px 28px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .knapp-prim:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(232,184,109,0.35); }
        .knapp-prim:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .knapp-sek { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #e8e8f0; border-radius: 10px; padding: 10px 20px; font-size: 14px; cursor: pointer; transition: all 0.2s; }
        .knapp-sek:hover { background: rgba(255,255,255,0.08); }
        .val-kort { background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 18px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 12px; }
        .val-kort:hover { background: rgba(232,184,109,0.1); border-color: rgba(232,184,109,0.4); }
        .val-kort.vald { background: rgba(232,184,109,0.15); border-color: #e8b86d; }
        .niva-knapp { border: 2px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 10px 16px; cursor: pointer; transition: all 0.2s; font-size: 14px; background: rgba(255,255,255,0.05); color: #e8e8f0; }
        .niva-knapp:hover { border-color: rgba(232,184,109,0.5); }
        .niva-knapp.vald { background: rgba(232,184,109,0.2); border-color: #e8b86d; color: #e8b86d; }
        .tab-knapp { padding: 8px 20px; border-radius: 8px; border: none; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s; }
        .tab-knapp.aktiv { background: #e8b86d; color: #1a1a2e; }
        .tab-knapp:not(.aktiv) { background: rgba(255,255,255,0.08); color: #a0a0b8; }
        .niva-sektion { border-radius: 14px; padding: 20px; margin-bottom: 16px; border-left: 4px solid; }
        input[type="text"] { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 10px 14px; color: #e8e8f0; font-size: 14px; outline: none; width: 100%; }
        input[type="text"]::placeholder { color: #6060a0; }
        input[type="text"]:focus { border-color: rgba(232,184,109,0.5); }
        .spinner { width: 40px; height: 40px; border: 3px solid rgba(232,184,109,0.2); border-top-color: #e8b86d; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .steg-indikator { display: flex; gap: 8px; justify-content: center; margin-bottom: 32px; }
        .steg-punkt { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.2); transition: all 0.3s; }
        .steg-punkt.aktiv { background: #e8b86d; width: 24px; border-radius: 4px; }
        .steg-punkt.klar { background: rgba(232,184,109,0.5); }
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .niva-sektion { border: 1px solid #ccc !important; background: #f9f9f9 !important; color: black !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ padding: "24px 24px 0", textAlign: "center" }} className="no-print">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 6vw, 48px)", fontWeight: 700, background: "linear-gradient(135deg, #e8b86d, #f5d69a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.5px" }}>
          ModersmålsGuiden
        </h1>
        <p style={{ color: "#8080b0", fontSize: "15px", marginTop: "6px" }}>Differentierad lektionsplanering för modersmålslärare · Lgr22</p>
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "32px 20px 60px" }}>

        {/* Steg-indikator */}
        {!resultat && (
          <div className="steg-indikator no-print">
            {[1,2,3,4].map(s => (
              <div key={s} className={`steg-punkt ${steg === s ? "aktiv" : steg > s ? "klar" : ""}`}/>
            ))}
          </div>
        )}

        {/* RESULTAT */}
        {resultat && (
          <div ref={resultRef}>
            {resultat.fel ? (
              <div className="kort" style={{ padding: "32px", textAlign: "center", color: "#ff6b6b" }}>
                <p>{resultat.fel}</p>
                <button className="knapp-sek" style={{ marginTop: "16px" }} onClick={() => setResultat(null)}>Försök igen</button>
              </div>
            ) : (
              <>
                {/* Resultathuvud */}
                <div className="kort no-print" style={{ padding: "24px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <div style={{ fontSize: "12px", color: "#8080b0", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>Lektionsplan</div>
                      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#e8b86d" }}>{resultat.titel}</h2>
                      <p style={{ color: "#a0a0c0", fontSize: "14px", marginTop: "4px" }}>{resultat.titelMalsprak}</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="knapp-sek" onClick={skrivUt}>Skriv ut</button>
                      <button className="knapp-prim" onClick={resetAllt}>Ny plan</button>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}>
                    {[sprakNamn, stadium?.namn, omrade, lektionstid].map(tag => (
                      <span key={tag} style={{ background: "rgba(232,184,109,0.12)", border: "1px solid rgba(232,184,109,0.25)", borderRadius: "6px", padding: "4px 10px", fontSize: "12px", color: "#e8b86d" }}>{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Mål */}
                <div className="kort" style={{ padding: "20px", marginBottom: "16px" }}>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }} className="no-print">
                    {["svenska", "malsprak"].map(v => (
                      <button key={v} className={`tab-knapp ${sprakvisning === v ? "aktiv" : ""}`} onClick={() => setSprakvisning(v)}>
                        {v === "svenska" ? "🇸🇪 Svenska" : `🌍 ${sprakNamn}`}
                      </button>
                    ))}
                  </div>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#e8b86d", marginBottom: "8px" }}>Lärandemål</h3>
                  <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#d0d0e0" }}>
                    {sprakvisning === "svenska" ? resultat.malSvenska : resultat.malMalsprak}
                  </p>
                  <div style={{ marginTop: "12px", padding: "10px 14px", background: "rgba(255,255,255,0.04)", borderRadius: "8px" }}>
                    <span style={{ fontSize: "11px", color: "#6060a0", textTransform: "uppercase", letterSpacing: "0.8px" }}>Lgr22: </span>
                    <span style={{ fontSize: "13px", color: "#a0a0c0" }}>{resultat.lgr22}</span>
                  </div>
                </div>

                {/* Nivåer */}
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#8080b0", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Differentierade aktiviteter</h3>
                {resultat.nivaer?.map(n => (
                  <div key={n.niva} className="niva-sektion" style={{
                    background: "rgba(255,255,255,0.04)",
                    borderLeftColor: nivaFarg[n.niva] || "#888",
                    marginBottom: "14px"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{ fontWeight: 600, fontSize: "15px", color: nivaFarg[n.niva] || "#e8e8f0" }}>{n.niva}</span>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <div style={{ fontSize: "12px", color: "#8080b0", marginBottom: "4px" }}>Aktivitet</div>
                      <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#d0d0e0" }}>
                        {sprakvisning === "svenska" ? n.aktivitetSvenska : n.aktivitetMalsprak}
                      </p>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "12px", marginBottom: "10px" }}>
                      <div style={{ fontSize: "12px", color: "#8080b0", marginBottom: "4px" }}>Uppgift</div>
                      <p style={{ fontSize: "14px", color: "#c0c0d8", fontStyle: "italic" }}>
                        {sprakvisning === "svenska" ? n.uppgiftSvenska : n.uppgiftMalsprak}
                      </p>
                    </div>
                    <div style={{ fontSize: "12px", color: "#6060a0" }}>
                      <span style={{ color: "#8080a0" }}>Lärarstöd: </span>{n.stod}
                    </div>
                  </div>
                ))}

                {/* Avslutning + Material */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginTop: "4px" }}>
                  <div className="kort" style={{ padding: "18px" }}>
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#e8b86d", marginBottom: "8px" }}>Gemensam avslutning</h3>
                    <p style={{ fontSize: "14px", color: "#c0c0d8", lineHeight: "1.6" }}>
                      {sprakvisning === "svenska" ? resultat.avslutning : resultat.avslutningMalsprak}
                    </p>
                  </div>
                  <div className="kort" style={{ padding: "18px" }}>
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#e8b86d", marginBottom: "8px" }}>Material</h3>
                    <p style={{ fontSize: "14px", color: "#c0c0d8", lineHeight: "1.6" }}>{resultat.materialSvenska}</p>
                  </div>
                </div>
                <div className="kort" style={{ padding: "18px", marginTop: "14px" }}>
                  <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#e8b86d", marginBottom: "8px" }}>Bedömning (formativ)</h3>
                  <p style={{ fontSize: "14px", color: "#c0c0d8", lineHeight: "1.6" }}>{resultat.bedomning}</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* LADDNING */}
        {laddning && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div className="spinner" style={{ margin: "0 auto 20px" }}/>
            <p style={{ color: "#8080b0" }}>Genererar differentierad lektionsplan…</p>
          </div>
        )}

        {/* FORMULÄR */}
        {!resultat && !laddning && (
          <>
            {/* STEG 1: Språk */}
            {steg === 1 && (
              <div className="kort" style={{ padding: "28px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "6px" }}>Välj modersmål</h2>
                <p style={{ color: "#8080b0", fontSize: "14px", marginBottom: "20px" }}>Vilket språk undervisar du i?</p>
                <input type="text" placeholder="Sök språk…" value={sokterm} onChange={e => setSokterm(e.target.value)} style={{ marginBottom: "16px" }}/>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", maxHeight: "380px", overflowY: "auto", paddingRight: "4px" }}>
                  {filtrerade.map(s => (
                    <div key={s.kod} className={`val-kort ${sprak?.kod === s.kod ? "vald" : ""}`} onClick={() => setSprak(s)}>
                      <span style={{ fontSize: "20px" }}>{s.flagga}</span>
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>{s.namn}</span>
                    </div>
                  ))}
                </div>
                {sprak?.kod === "other" && (
                  <input type="text" placeholder="Ange språkets namn…" value={annatSprak} onChange={e => setAnnatSprak(e.target.value)} style={{ marginTop: "12px" }}/>
                )}
                <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
                  <button className="knapp-prim" disabled={!sprak || (sprak.kod === "other" && !annatSprak)} onClick={() => setSteg(2)}>
                    Nästa →
                  </button>
                </div>
              </div>
            )}

            {/* STEG 2: Stadium + Ämnesområde */}
            {steg === 2 && (
              <div className="kort" style={{ padding: "28px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "6px" }}>Stadium och ämnesområde</h2>
                <p style={{ color: "#8080b0", fontSize: "14px", marginBottom: "20px" }}>Vilken grupp och vad ska ni arbeta med?</p>

                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontSize: "13px", color: "#8080b0", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.8px" }}>Stadium</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                    {STADIER.map(s => (
                      <div key={s.namn} className={`val-kort ${stadium?.namn === s.namn ? "vald" : ""}`} onClick={() => setStadium(s)} style={{ flexDirection: "column", alignItems: "flex-start" }}>
                        <span style={{ fontWeight: 600, fontSize: "15px" }}>{s.namn}</span>
                        <span style={{ fontSize: "12px", color: "#8080b0" }}>Åk {s.ar}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontSize: "13px", color: "#8080b0", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.8px" }}>Ämnesområde (Lgr22)</div>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {OMRADEN.map(o => (
                      <div key={o} className={`val-kort ${omrade === o ? "vald" : ""}`} onClick={() => setOmrade(o)}>
                        <span style={{ fontSize: "14px" }}>{o}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "13px", color: "#8080b0", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.8px" }}>Lektionstid</div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {ANTAL_LEKTIONER.map(t => (
                      <button key={t} className={`niva-knapp ${lektionstid === t ? "vald" : ""}`} onClick={() => setLektionstid(t)}>{t}</button>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between" }}>
                  <button className="knapp-sek" onClick={() => setSteg(1)}>← Tillbaka</button>
                  <button className="knapp-prim" disabled={!stadium || !omrade} onClick={() => setSteg(3)}>Nästa →</button>
                </div>
              </div>
            )}

            {/* STEG 3: Nivåer */}
            {steg === 3 && (
              <div className="kort" style={{ padding: "28px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "6px" }}>Elevernas nivåer</h2>
                <p style={{ color: "#8080b0", fontSize: "14px", marginBottom: "20px" }}>Välj de nivåer som finns i din grupp. Du kan välja flera.</p>
                <div style={{ display: "grid", gap: "10px" }}>
                  {NIVAER.map(n => (
                    <div key={n} className={`val-kort ${valdaNivaer.includes(n) ? "vald" : ""}`} onClick={() => toggleNiva(n)} style={{ justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: nivaFarg[n] }}/>
                        <span style={{ fontSize: "15px", fontWeight: 500 }}>{n}</span>
                      </div>
                      {valdaNivaer.includes(n) && <span style={{ color: "#e8b86d", fontSize: "18px" }}>✓</span>}
                    </div>
                  ))}
                </div>
                {valdaNivaer.length > 0 && (
                  <p style={{ marginTop: "14px", fontSize: "13px", color: "#8080b0" }}>
                    Valda nivåer: {valdaNivaer.join(", ")}
                  </p>
                )}
                <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between" }}>
                  <button className="knapp-sek" onClick={() => setSteg(2)}>← Tillbaka</button>
                  <button className="knapp-prim" disabled={valdaNivaer.length === 0} onClick={() => setSteg(4)}>Nästa →</button>
                </div>
              </div>
            )}

            {/* STEG 4: Sammanfattning + Generera */}
            {steg === 4 && (
              <div className="kort" style={{ padding: "28px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "6px" }}>Redo att generera</h2>
                <p style={{ color: "#8080b0", fontSize: "14px", marginBottom: "24px" }}>Kontrollera dina val innan du genererar lektionsplanen.</p>

                <div style={{ display: "grid", gap: "10px", marginBottom: "28px" }}>
                  {[
                    { label: "Modersmål", varde: sprakNamn },
                    { label: "Stadium", varde: `${stadium?.namn} (åk ${stadium?.ar})` },
                    { label: "Ämnesområde", varde: omrade },
                    { label: "Lektionstid", varde: lektionstid },
                    { label: "Elevnivåer", varde: valdaNivaer.join(", ") },
                  ].map(({ label, varde }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "rgba(255,255,255,0.04)", borderRadius: "10px" }}>
                      <span style={{ fontSize: "13px", color: "#8080b0" }}>{label}</span>
                      <span style={{ fontSize: "14px", fontWeight: 500, color: "#e8b86d" }}>{varde}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: "rgba(232,184,109,0.08)", border: "1px solid rgba(232,184,109,0.2)", borderRadius: "10px", padding: "14px", marginBottom: "24px" }}>
                  <p style={{ fontSize: "13px", color: "#c0a060", lineHeight: "1.6" }}>
                    Lektionsplanen genereras på <strong>svenska</strong> för dig som lärare och på <strong>{sprakNamn}</strong> för eleverna – redo att skriva ut.
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button className="knapp-sek" onClick={() => setSteg(3)}>← Tillbaka</button>
                  <button className="knapp-prim" onClick={genereraLektionsplan}>
                    Generera lektionsplan ✨
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
