import { useState, useRef, useEffect } from "react";

const SPRAK = [
  { namn: "Arabiska", kod: "ar", flagga: "🇸🇦", sokord: ["ar", "arab"] },
  { namn: "Armeniska", kod: "hy", flagga: "🇦🇲" },
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

const NIVA_FARG = {
  "Nybörjare": "#2e7d32",
  "Grundnivå": "#1565c0",
  "Mellannivå": "#e65100",
  "Avancerad": "#880e4f",
  "Modersmålsnära": "#4a148c",
};

const STEG_LABELS = ["Språk", "Stadium", "Nivåer", "Generera"];

const LADDNINGS_STEG = [
  { text: "Analyserar Lgr22 kursplan…", ikon: "📚" },
  { text: "Skapar differentierade uppgifter…", ikon: "✏️" },
  { text: "Anpassar för dina elevnivåer…", ikon: "🎯" },
  { text: "Översätter material till målspråket…", ikon: "🌍" },
  { text: "Kopplar till lärandemål…", ikon: "📌" },
  { text: "Förbereder lektionsplanen…", ikon: "📋" },
  { text: "Nästan klar…", ikon: "✨" },
];

// ─── FEEDBACK MODAL ───────────────────────────────────────────────────────────
function FeedbackModal({ onClose, sprakNamn }) {
  const [svar, setSvar] = useState({
    stadium: "", frekvens: "",
    enkelhet: 0, tidsbesparing: 0, passning: 0,
    tvasprak: 0, lgr22: 0, nivaer: 0,
    spraktrogenhet: 0, guidning: 0, export_: 0,
    tidsvinst: "", rekommenderar: "",
    fungerade: "", saknas: "", ovrigt: ""
  });
  const [step, setStep] = useState("form");

  function set(k, v) { setSvar(p => ({ ...p, [k]: v })); }

  const ScaleRow = ({ label, field }) => (
    <div style={{display:"flex",alignItems:"center",gap:".5rem",padding:".45rem 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
      <span style={{flex:1,fontSize:".78rem",color:"#cccce8",lineHeight:1.4}}>{label}</span>
      <div style={{display:"flex",gap:".25rem",flexShrink:0}}>
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={() => set(field, n)}
            style={{width:28,height:28,borderRadius:"50%",
              border:`2px solid ${svar[field]===n?"#e8b86d":"rgba(255,255,255,0.15)"}`,
              background:svar[field]===n?"#e8b86d":"rgba(255,255,255,0.04)",
              color:svar[field]===n?"#1a1a2e":"#8080b0",
              cursor:"pointer",fontSize:".75rem",fontWeight:700,flexShrink:0}}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );

  const CheckRow = ({ label, field, options }) => (
    <div style={{marginBottom:".6rem"}}>
      {label && <p style={{margin:"0 0 .35rem",fontSize:".8rem",fontWeight:600,color:"#cccce8"}}>{label}</p>}
      <div style={{display:"flex",flexWrap:"wrap",gap:".3rem"}}>
        {options.map(opt => (
          <button key={opt} onClick={() => set(field, svar[field]===opt?"":opt)}
            style={{border:`2px solid ${svar[field]===opt?"#e8b86d":"rgba(255,255,255,0.15)"}`,
              borderRadius:50,padding:".25rem .75rem",
              background:svar[field]===opt?"rgba(232,184,109,0.15)":"rgba(255,255,255,0.04)",
              color:svar[field]===opt?"#e8b86d":"#8080b0",
              cursor:"pointer",fontFamily:"'DM Sans','Segoe UI',sans-serif",
              fontSize:".75rem",fontWeight:svar[field]===opt?700:400}}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  function skicka() {
    const rad = (label, val) => val ? `${label}: ${val}` : "";
    const skala = (label, val) => val ? `${label}: ${val}/5` : "";
    const body = [
      "=== OM DIG ===",
      rad("Stadium", svar.stadium),
      rad("Hur ofta digitala planeringsverktyg", svar.frekvens),
      "",
      "=== ANVÄNDBARHET (1-5) ===",
      skala("Enkelt att använda appen", svar.enkelhet),
      skala("Sparade tid i planeringen", svar.tidsbesparing),
      skala("Lektionsplanen passade min grupp", svar.passning),
      skala("Tvåspråkigt innehåll (svenska + målspråk)", svar.tvasprak),
      skala("Lgr22-kopplingen tydlig och relevant", svar.lgr22),
      skala("Differentieringen (nivåerna) användbar", svar.nivaer),
      "",
      "=== SPECIFIKA FUNKTIONER (1-5) ===",
      skala(`Språktrovärdighet på ${sprakNamn || "målspråket"}`, svar.spraktrogenhet),
      skala("Guidningen genom de 4 stegen", svar.guidning),
      skala("Kopiera- och skrivutfunktionen", svar.export_),
      rad("Tidsbesparing per lektionsplanering", svar.tidsvinst),
      rad("Skulle rekommendera appen", svar.rekommenderar),
      "",
      "=== ÖPPNA FRÅGOR ===",
      rad("Vad fungerade bäst", svar.fungerade),
      rad("Vad saknas eller kan förbättras", svar.saknas),
      rad("Övriga kommentarer", svar.ovrigt),
      "",
      `Tidpunkt: ${new Date().toLocaleString("sv-SE")}`,
    ].filter(r => r !== undefined).join("\n");

    const subject = encodeURIComponent("ModersmålsGuiden – Feedback från lärare");
    const bodyEncoded = encodeURIComponent(body);
    window.location.href = `mailto:mustafa.douglah@enkoping.se?subject=${subject}&body=${bodyEncoded}`;
    setStep("done");
  }

  const sectionStyle = {
    background:"linear-gradient(135deg,rgba(232,184,109,0.18),rgba(212,150,90,0.1))",
    border:"1px solid rgba(232,184,109,0.25)",
    borderRadius:8, padding:".45rem .9rem",
    marginBottom:".6rem", marginTop:".9rem"
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:9999,
        display:"flex",alignItems:"flex-start",justifyContent:"center",
        padding:"1rem",overflowY:"auto"}}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background:"linear-gradient(135deg,#1a1a2e,#16213e)",
        border:"1px solid rgba(232,184,109,0.2)",
        borderRadius:18,padding:"1.5rem",maxWidth:480,width:"100%",
        boxShadow:"0 12px 50px rgba(0,0,0,0.5)",
        fontFamily:"'DM Sans','Segoe UI',sans-serif",
        marginTop:"1rem",marginBottom:"1rem"
      }}>
        {step === "form" && <>
          {/* Rubrik */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1rem"}}>
            <div>
              <div style={{fontSize:"1.3rem",marginBottom:".2rem"}}>💬</div>
              <h3 style={{margin:0,color:"#e8b86d",fontSize:"1rem",fontWeight:700}}>Feedbackformulär</h3>
              <p style={{margin:".15rem 0 0",color:"#6060a0",fontSize:".73rem"}}>
                ModersmålsGuiden · Din feedback hjälper oss förbättra appen
              </p>
            </div>
            <button onClick={onClose}
              style={{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:"50%",
                width:30,height:30,cursor:"pointer",fontSize:".9rem",color:"#8080b0",flexShrink:0}}>✕</button>
          </div>

          {/* Sektion 1 */}
          <div style={sectionStyle}>
            <p style={{margin:0,color:"#e8b86d",fontWeight:700,fontSize:".82rem"}}>1. Om dig</p>
          </div>
          <CheckRow label="Vilket stadium undervisar du?" field="stadium"
            options={["Lågstadiet 1–3","Mellanstadiet 4–6","Högstadiet 7–9"]} />
          <CheckRow label="Hur ofta använder du digitala planeringsverktyg?" field="frekvens"
            options={["Dagligen","Varje vecka","Sällan"]} />

          {/* Sektion 2 */}
          <div style={sectionStyle}>
            <p style={{margin:0,color:"#e8b86d",fontWeight:700,fontSize:".82rem"}}>
              2. Användbarhet &nbsp;
              <span style={{fontWeight:400,fontSize:".72rem",opacity:.85}}>(1 = Inte alls · 5 = Mycket bra)</span>
            </p>
          </div>
          <ScaleRow label="Det var enkelt att använda appen" field="enkelhet" />
          <ScaleRow label="Appen sparade tid i min lektionsplanering" field="tidsbesparing" />
          <ScaleRow label="Lektionsplanen passade min elevgrupp" field="passning" />
          <ScaleRow label="Tvåspråkigt innehåll (svenska + målspråket) var användbart" field="tvasprak" />
          <ScaleRow label="Kopplingen till Lgr22 var tydlig och relevant" field="lgr22" />
          <ScaleRow label="Differentieringen (nivåerna) var pedagogiskt användbar" field="nivaer" />

          {/* Sektion 3 */}
          <div style={sectionStyle}>
            <p style={{margin:0,color:"#e8b86d",fontWeight:700,fontSize:".82rem"}}>
              3. Specifika funktioner &nbsp;
              <span style={{fontWeight:400,fontSize:".72rem",opacity:.85}}>(1–5)</span>
            </p>
          </div>
          <ScaleRow label={`Språktrovärdighet på ${sprakNamn || "målspråket"}`} field="spraktrogenhet" />
          <ScaleRow label="Guidningen genom de 4 stegen" field="guidning" />
          <ScaleRow label="Kopiera- och skrivutfunktionen" field="export_" />

          <CheckRow label="Hur lång tid sparar du per lektionsplanering?" field="tidsvinst"
            options={["Ingen","5–10 min","10–20 min","Mer än 20 min"]} />
          <CheckRow label="Skulle du rekommendera appen till en kollega?" field="rekommenderar"
            options={["Ja, definitivt","Troligtvis ja","Kanske","Nej"]} />

          {/* Sektion 4 */}
          <div style={sectionStyle}>
            <p style={{margin:0,color:"#e8b86d",fontWeight:700,fontSize:".82rem"}}>4. Öppna frågor</p>
          </div>

          <p style={{margin:"0 0 .3rem",fontSize:".8rem",fontWeight:600,color:"#cccce8"}}>Vad fungerade bäst?</p>
          <textarea value={svar.fungerade} onChange={e=>set("fungerade",e.target.value)}
            placeholder="Skriv gärna specifikt…" rows={2}
            style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.13)",
              borderRadius:8,padding:".55rem .75rem",color:"#e8e8f0",
              fontFamily:"'DM Sans','Segoe UI',sans-serif",fontSize:".8rem",
              resize:"none",boxSizing:"border-box",outline:"none",marginBottom:".6rem"}}/>

          <p style={{margin:"0 0 .3rem",fontSize:".8rem",fontWeight:600,color:"#cccce8"}}>Vad saknar du eller vad kan förbättras?</p>
          <textarea value={svar.saknas} onChange={e=>set("saknas",e.target.value)}
            placeholder="T.ex. funktioner, språk, innehåll, design…" rows={2}
            style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.13)",
              borderRadius:8,padding:".55rem .75rem",color:"#e8e8f0",
              fontFamily:"'DM Sans','Segoe UI',sans-serif",fontSize:".8rem",
              resize:"none",boxSizing:"border-box",outline:"none",marginBottom:".6rem"}}/>

          <p style={{margin:"0 0 .3rem",fontSize:".8rem",fontWeight:600,color:"#cccce8"}}>
            Övriga kommentarer <span style={{fontWeight:400,color:"#6060a0"}}>(valfritt)</span>
          </p>
          <textarea value={svar.ovrigt} onChange={e=>set("ovrigt",e.target.value)}
            rows={2}
            style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.13)",
              borderRadius:8,padding:".55rem .75rem",color:"#e8e8f0",
              fontFamily:"'DM Sans','Segoe UI',sans-serif",fontSize:".8rem",
              resize:"none",boxSizing:"border-box",outline:"none",marginBottom:".9rem"}}/>

          <div style={{display:"flex",gap:".5rem"}}>
            <button onClick={onClose}
              style={{flex:1,background:"transparent",border:"1px solid rgba(255,255,255,0.15)",
                borderRadius:50,padding:".6rem",cursor:"pointer",
                fontFamily:"'DM Sans','Segoe UI',sans-serif",fontSize:".8rem",color:"#8080b0"}}>
              Avbryt
            </button>
            <button onClick={skicka}
              style={{flex:2,background:"linear-gradient(135deg,#e8b86d,#d4965a)",color:"#1a1a2e",
                border:"none",borderRadius:50,padding:".6rem",cursor:"pointer",
                fontFamily:"'DM Sans','Segoe UI',sans-serif",fontSize:".82rem",fontWeight:700}}>
              Skicka feedback ✉️
            </button>
          </div>
        </>}

        {step === "done" && (
          <div style={{textAlign:"center",padding:"2rem 0"}}>
            <div style={{fontSize:"2.2rem",marginBottom:".6rem"}}>✅</div>
            <h3 style={{color:"#e8b86d",margin:"0 0 .4rem",fontSize:"1rem"}}>Tack för din feedback!</h3>
            <p style={{color:"#8080b0",fontSize:".82rem",margin:"0 0 1.4rem",lineHeight:1.6}}>
              Det hjälper oss att förbättra ModersmålsGuiden för alla lärare.
            </p>
            <button onClick={onClose}
              style={{background:"linear-gradient(135deg,#e8b86d,#d4965a)",color:"#1a1a2e",
                border:"none",borderRadius:50,padding:".6rem 2rem",
                cursor:"pointer",fontFamily:"'DM Sans','Segoe UI',sans-serif",
                fontSize:".83rem",fontWeight:700}}>
              Stäng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function exportText(resultat, sprakNamn, stadium, omrade, lektionstid) {
  let t = `MODERSMÅLSGUIDEN – Lgr22\n${"=".repeat(40)}\n`;
  t += `Språk: ${sprakNamn} | Stadium: ${stadium?.namn} | Område: ${omrade} | Tid: ${lektionstid}\n\n`;
  t += `TITEL\n${resultat.titel}\n${resultat.titelMalsprak}\n\n`;
  t += `LÄRANDEMÅL\n${resultat.malSvenska}\n\n`;
  t += `LGR22\n${resultat.lgr22}\n\n`;
  t += `DIFFERENTIERADE AKTIVITETER\n${"─".repeat(32)}\n`;
  resultat.nivaer?.forEach(n => {
    t += `\n${n.niva.toUpperCase()}\n`;
    t += `Aktivitet: ${n.aktivitetSvenska}\n`;
    t += `Uppgift: ${n.uppgiftSvenska}\n`;
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
  const [stadium, setStadium] = useState(null);
  const [omrade, setOmrade] = useState(null);
  const [valdaNivaer, setValdaNivaer] = useState([]);
  const [lektionstid, setLektionstid] = useState("45 min");
  const [laddning, setLaddning] = useState(false);
  const [laddningsSteg, setLaddningsSteg] = useState(0);
  const [resultat, setResultat] = useState(null);
  const [sprakvisning, setSprakvisning] = useState("svenska");
  const [sokterm, setSokterm] = useState("");
  const [copied, setCopied] = useState(false);
  const [aktivNiva, setAktivNiva] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const resultRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (laddning) {
      setLaddningsSteg(0);
      intervalRef.current = setInterval(() => {
        setLaddningsSteg(prev => (prev + 1) % LADDNINGS_STEG.length);
      }, 3500);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [laddning]);

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

    const prompt = `Du är modersmålslärare. Skapa en kort differentierad lektionsplan på svenska.

Språk: ${sprakNamn} | Stadium: ${stadium?.namn} (åk ${stadium?.ar}) | Område: ${omrade} | Tid: ${lektionstid}
Nivåer: ${valdaNivaer.join(", ")}

Svara ENDAST med JSON (inga backticks, inga förklaringar):
{
  "titel": "Kort lektionstitel på svenska",
  "titelMalsprak": "Titel på ${sprakNamn}",
  "malSvenska": "Lärandemål på svenska (1-2 meningar)",
  "malMalsprak": "Lärandemål på ${sprakNamn} (1-2 meningar)",
  "lgr22": "Relevant Lgr22-koppling för modersmål (1 mening)",
  "nivaer": [
    ${valdaNivaer.map(n => `{
      "niva": "${n}",
      "aktivitetSvenska": "Aktivitet för ${n}-nivå på svenska (2 meningar)",
      "aktivitetMalsprak": "Samma aktivitet på ${sprakNamn} (2 meningar)",
      "uppgiftSvenska": "En konkret uppgift för ${n}-nivå på svenska",
      "uppgiftMalsprak": "Samma uppgift på ${sprakNamn}",
      "stod": "Lärarstöd för ${n}-nivå (1 mening)"
    }`).join(",\n    ")}
  ],
  "avslutning": "Gemensam avslutning på svenska (1 mening)",
  "avslutningMalsprak": "Avslutning på ${sprakNamn} (1 mening)",
  "materialSvenska": "Behövligt material (kort)",
  "bedomning": "Formativ bedömningsidé kopplad till Lgr22 (1 mening)"
}`;

    try {
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Serverfel");
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResultat(parsed);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      console.error("API error:", e);
      setResultat({ fel: "Kunde inte generera lektionsplanen. Försök igen." });
    }
    setLaddning(false);
  }

  function resetAllt() {
    setSteg(1); setSprak(null); setAnnatSprak(""); setStadium(null);
    setOmrade(null); setValdaNivaer([]); setResultat(null);
    setSokterm(""); setCopied(false); setAktivNiva(null);
    window.scrollTo(0, 0);
  }

  function kopiera() {
    if (!resultat) return;
    navigator.clipboard.writeText(exportText(resultat, sprakNamn, stadium, omrade, lektionstid))
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  }

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
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .fade-up { animation: fadeUp .35s ease; }
        .fade-in { animation: fadeIn .5s ease; }
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
        .knapp-feedback { background: transparent; border: 1px solid rgba(232,184,109,0.4); color: #e8b86d; border-radius: 50px; padding: 10px 20px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all .2s; }
        .knapp-feedback:hover { background: rgba(232,184,109,0.1); }
        .val-kort { background: rgba(255,255,255,0.04); border: 1.5px solid rgba(255,255,255,0.09); border-radius: 12px; padding: 13px 16px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 10px; }
        .val-kort:hover { background: rgba(232,184,109,0.08); border-color: rgba(232,184,109,0.35); }
        .val-kort.vald { background: rgba(232,184,109,0.12); border-color: #e8b86d; }
        .tid-knapp { border: 2px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 9px 18px; cursor: pointer; transition: all 0.2s; font-size: 14px; background: rgba(255,255,255,0.04); color: #e8e8f0; font-family: inherit; }
        .tid-knapp:hover { border-color: rgba(232,184,109,0.4); }
        .tid-knapp.vald { background: rgba(232,184,109,0.18); border-color: #e8b86d; color: #e8b86d; font-weight: 700; }
        .tab-knapp { padding: 8px 18px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; font-family: inherit; }
        .tab-knapp.aktiv { background: #e8b86d; color: #1a1a2e; }
        .tab-knapp:not(.aktiv) { background: rgba(255,255,255,0.07); color: #8080b0; }
        .tab-knapp:not(.aktiv):hover { background: rgba(255,255,255,0.12); color: #e8e8f0; }
        .niva-tab { border: none; border-radius: 50px; padding: 7px 16px; cursor: pointer; font-size: 13px; font-weight: 700; transition: all 0.2s; font-family: inherit; }
        .niva-sektion { border-radius: 14px; padding: 20px; border-left: 4px solid; background: rgba(255,255,255,0.04); margin-bottom: 12px; }
        input[type="text"] { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.13); border-radius: 10px; padding: 10px 14px; color: #e8e8f0; font-size: 14px; outline: none; width: 100%; font-family: inherit; }
        input[type="text"]::placeholder { color: #505080; }
        input[type="text"]:focus { border-color: rgba(232,184,109,0.5); background: rgba(255,255,255,0.09); }
        .spinner { width: 52px; height: 52px; border: 3px solid rgba(232,184,109,0.12); border-top-color: #e8b86d; border-radius: 50%; animation: spin 0.9s linear infinite; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: #e8b86d; animation: pulse 1.2s ease infinite; }
        .steg-punkt { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.15); transition: all 0.3s; }
        .steg-punkt.aktiv { background: #e8b86d; width: 24px; border-radius: 4px; }
        .steg-punkt.klar { background: rgba(232,184,109,0.45); }
        .varning { background: rgba(232,184,109,0.07); border: 1px solid rgba(232,184,109,0.25); border-radius: 10px; padding: 11px 14px; margin-top: 12px; font-size: 13px; color: #e8b86d; line-height: 1.5; }
        .stat-box { background: rgba(255,255,255,0.05); border-radius: 10px; padding: 12px; text-align: center; }
        .chip { background: rgba(232,184,109,0.11); border: 1px solid rgba(232,184,109,0.22); border-radius: 6px; padding: 3px 10px; font-size: 12px; color: #e8b86d; display: inline-block; }
        .laddnings-text { animation: fadeIn 0.5s ease; }
        .progress-bar { height: 3px; background: rgba(232,184,109,0.15); border-radius: 2px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #e8b86d, #f5d69a); border-radius: 2px; transition: width 3.5s linear; }
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .niva-sektion { border: 1px solid #ddd !important; background: #fafafa !important; color: black !important; break-inside: avoid; }
          .kort { background: white !important; border: 1px solid #ddd !important; color: black !important; }
          p, span, div { color: black !important; }
        }
      `}</style>

      {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} sprakNamn={sprakNamn} />}

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
        <div style={{ marginTop: "12px" }}>
          <button onClick={() => setFeedbackOpen(true)}
            style={{
              background: "transparent",
              border: "1px solid rgba(232,184,109,0.3)",
              color: "#8080b0", borderRadius: "50px",
              padding: "6px 16px", fontSize: "12px",
              cursor: "pointer", fontFamily: "'DM Sans','Segoe UI',sans-serif",
              transition: "all .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(232,184,109,0.7)"; e.currentTarget.style.color="#e8b86d"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(232,184,109,0.3)"; e.currentTarget.style.color="#8080b0"; }}>
            💬 Lämna feedback
          </button>
        </div>
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

        {/* LADDNING */}
        {laddning && (
          <div style={{ textAlign: "center", padding: "60px 20px" }} className="fade-up">
            <div className="spinner" style={{ margin: "0 auto 28px" }} />
            <div style={{ fontSize: "2rem", marginBottom: "10px" }} className="laddnings-text">
              {LADDNINGS_STEG[laddningsSteg].ikon}
            </div>
            <p style={{ color: "#e8b86d", fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}
              className="laddnings-text" key={laddningsSteg}>
              {LADDNINGS_STEG[laddningsSteg].text}
            </p>
            <p style={{ color: "#5050a0", fontSize: "13px", marginBottom: "24px" }}>
              Detta tar vanligtvis 20–30 sekunder
            </p>
            <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "20px" }}>
              {LADDNINGS_STEG.map((_, i) => (
                <div key={i} style={{
                  width: i === laddningsSteg ? "20px" : "6px", height: "6px", borderRadius: "3px",
                  background: i <= laddningsSteg ? "#e8b86d" : "rgba(255,255,255,0.1)",
                  transition: "all 0.4s ease",
                }} />
              ))}
            </div>
            {valdaNivaer.length > 3 && (
              <p style={{ color: "#5050a0", fontSize: "12px" }}>
                {valdaNivaer.length} nivåer valda – kan ta upp till 40 sekunder
              </p>
            )}
          </div>
        )}

        {/* RESULTAT */}
        {resultat && !laddning && (
          <div ref={resultRef} className="fade-up">
            {resultat.fel ? (
              <div className="kort" style={{ padding: "36px", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "12px" }}>😔</div>
                <p style={{ color: "#ff6b6b", marginBottom: "16px", fontSize: "15px" }}>{resultat.fel}</p>
                <button className="knapp-sek" onClick={() => setResultat(null)}>Försök igen</button>
              </div>
            ) : (
              <>
                <div style={{
                  background: "linear-gradient(135deg, rgba(232,184,109,0.14), rgba(212,150,90,0.07))",
                  border: "1px solid rgba(232,184,109,0.22)",
                  borderRadius: "18px", padding: "24px", marginBottom: "14px",
                  position: "relative", overflow: "hidden",
                }} className="no-print">
                  <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(232,184,109,0.06)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
                    <div>
                      <div style={{ fontSize: "11px", color: "#8080b0", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "6px" }}>Lektionsplan · Lgr22</div>
                      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#e8b86d", marginBottom: "4px" }}>{resultat.titel}</h2>
                      <p style={{ color: "#a0a0c0", fontSize: "13px" }}>{resultat.titelMalsprak}</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button className="knapp-copy" onClick={kopiera}>{copied ? "✅ Kopierat!" : "📋 Kopiera"}</button>
                      <button className="knapp-print" onClick={() => window.print()}>🖨️ Skriv ut</button>
                      <button className="knapp-feedback" onClick={() => setFeedbackOpen(true)}>💬 Feedback</button>
                      <button className="knapp-prim" onClick={resetAllt}>Ny plan</button>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                    {[sprakNamn, stadium?.namn, omrade, lektionstid].map(tag => (
                      <span key={tag} className="chip">{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {[["Nivåer", valdaNivaer.length], ["Område", omrade?.split(" ")[0] + "…"], ["Tid", lektionstid]].map(([lb, v]) => (
                      <div key={lb} className="stat-box">
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "#e8b86d" }}>{v}</div>
                        <div style={{ fontSize: "11px", color: "#5050a0" }}>{lb}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "rgba(21,101,192,0.09)", border: "1px solid rgba(21,101,192,0.22)", borderRadius: "12px", padding: "14px 18px", marginBottom: "14px" }}>
                  <div style={{ fontSize: "11px", color: "#90caf9", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "5px" }}>📌 Lgr22-koppling</div>
                  <p style={{ fontSize: "13px", color: "#b0d4f8", lineHeight: "1.65", fontStyle: "italic" }}>{resultat.lgr22}</p>
                </div>

                <div className="kort" style={{ padding: "20px", marginBottom: "14px" }}>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }} className="no-print">
                    {["svenska", "malsprak"].map(v => (
                      <button key={v} className={`tab-knapp ${sprakvisning === v ? "aktiv" : ""}`} onClick={() => setSprakvisning(v)}>
                        {v === "svenska" ? "🇸🇪 Svenska" : `🌍 ${sprakNamn}`}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6060a0", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Lärandemål</div>
                  <p style={{ fontSize: "15px", lineHeight: "1.75", color: "#d0d0e8" }}>
                    {sprakvisning === "svenska" ? resultat.malSvenska : resultat.malMalsprak}
                  </p>
                </div>

                <div style={{ fontSize: "11px", color: "#5050a0", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Differentierade aktiviteter</div>
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

                {resultat.nivaer?.map((n, i) => (
                  (aktivNiva === null || aktivNiva === i) && (
                    <div key={i} className="niva-sektion fade-up" style={{ borderLeftColor: NIVA_FARG[n.niva] || "#888" }}>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: NIVA_FARG[n.niva] || "#e8e8f0", marginBottom: "12px" }}>{n.niva}</div>
                      <div style={{ marginBottom: "10px" }}>
                        <div style={{ fontSize: "11px", color: "#5050a0", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.8px" }}>Aktivitet</div>
                        <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#cccce8" }}>
                          {sprakvisning === "svenska" ? n.aktivitetSvenska : n.aktivitetMalsprak}
                        </p>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "11px", marginBottom: "10px" }}>
                        <div style={{ fontSize: "11px", color: "#5050a0", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.8px" }}>Uppgift</div>
                        <p style={{ fontSize: "13px", color: "#b0b0d0", fontStyle: "italic", lineHeight: "1.65" }}>
                          {sprakvisning === "svenska" ? n.uppgiftSvenska : n.uppgiftMalsprak}
                        </p>
                      </div>
                      <div style={{ fontSize: "12px", color: "#5050a0" }}>
                        <span style={{ color: "#6060a0" }}>Lärarstöd: </span>{n.stod}
                      </div>
                    </div>
                  )
                ))}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "4px" }}>
                  <div className="kort" style={{ padding: "16px" }}>
                    <div style={{ fontSize: "11px", color: "#6060a0", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Gemensam avslutning</div>
                    <p style={{ fontSize: "13px", color: "#b8b8d8", lineHeight: "1.65" }}>
                      {sprakvisning === "svenska" ? resultat.avslutning : resultat.avslutningMalsprak}
                    </p>
                  </div>
                  <div className="kort" style={{ padding: "16px" }}>
                    <div style={{ fontSize: "11px", color: "#6060a0", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Material</div>
                    <p style={{ fontSize: "13px", color: "#b8b8d8", lineHeight: "1.65" }}>{resultat.materialSvenska}</p>
                  </div>
                </div>
                <div className="kort" style={{ padding: "16px", marginTop: "12px" }}>
                  <div style={{ fontSize: "11px", color: "#6060a0", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Bedömning · formativ</div>
                  <p style={{ fontSize: "13px", color: "#b8b8d8", lineHeight: "1.65" }}>{resultat.bedomning}</p>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "22px", justifyContent: "center" }} className="no-print">
                  <button className="knapp-copy" onClick={kopiera}>{copied ? "✅ Kopierat!" : "📋 Kopiera text"}</button>
                  <button className="knapp-print" onClick={() => window.print()}>🖨️ Skriv ut</button>
                  <button className="knapp-feedback" onClick={() => setFeedbackOpen(true)}>💬 Feedback</button>
                  <button className="knapp-sek" onClick={genereraLektionsplan}>✨ Generera nytt</button>
                  <button className="knapp-prim" onClick={resetAllt}>🔄 Ny plan</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* FORMULÄR */}
        {!resultat && !laddning && (
          <div className="fade-up">
            {steg === 1 && (
              <div className="kort" style={{ padding: "28px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>Välj modersmål</h2>
                <p style={{ color: "#6060a0", fontSize: "13px", marginBottom: "18px" }}>Vilket språk undervisar du i?</p>
                <input type="text" placeholder="Sök eller skriv språk…" value={sokterm} onChange={e => setSokterm(e.target.value)} style={{ marginBottom: "14px" }} />
                {sokterm && filtrerade.length === 0 && (
                  <p style={{ fontSize: "13px", color: "#6060a0", marginBottom: "10px" }}>Inget språk hittades – välj "Annat språk" längst ned.</p>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px", maxHeight: "360px", overflowY: "auto", paddingRight: "4px" }}>
                  {filtrerade.map(s => (
                    <div key={s.kod} className={`val-kort ${sprak?.kod === s.kod ? "vald" : ""}`} onClick={() => setSprak(s)}>
                      <span style={{ fontSize: "18px" }}>{s.flagga}</span>
                      <span style={{ fontSize: "13px", fontWeight: 500 }}>{s.namn}</span>
                      {sprak?.kod === s.kod && <span style={{ marginLeft: "auto", color: "#e8b86d" }}>✓</span>}
                    </div>
                  ))}
                </div>
                {sprak?.kod === "other" && (
                  <input type="text" placeholder="Ange språkets namn…" value={annatSprak} onChange={e => setAnnatSprak(e.target.value)} style={{ marginTop: "12px" }} />
                )}
                {sprak && (
                  <div style={{ marginTop: "12px", padding: "10px 14px", background: "rgba(232,184,109,0.08)", borderRadius: "10px", fontSize: "13px", color: "#e8b86d" }}>
                    ✓ Valt språk: <strong>{sprakNamn}</strong>
                  </div>
                )}
                <div style={{ marginTop: "22px", display: "flex", justifyContent: "flex-end" }}>
                  <button className="knapp-prim" disabled={!sprak || (sprak.kod === "other" && !annatSprak)} onClick={() => setSteg(2)}>Fortsätt →</button>
                </div>
              </div>
            )}

            {steg === 2 && (
              <div className="kort" style={{ padding: "28px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>Stadium och ämnesområde</h2>
                <p style={{ color: "#6060a0", fontSize: "13px", marginBottom: "20px" }}>Vilken grupp och vad ska ni arbeta med?</p>
                <div style={{ marginBottom: "22px" }}>
                  <div style={{ fontSize: "11px", color: "#6060a0", marginBottom: "9px", textTransform: "uppercase", letterSpacing: "0.9px" }}>Stadium</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "7px" }}>
                    {STADIER.map(s => (
                      <div key={s.namn} className={`val-kort ${stadium?.namn === s.namn ? "vald" : ""}`} onClick={() => setStadium(s)} style={{ flexDirection: "column", alignItems: "flex-start" }}>
                        <span style={{ fontWeight: 600, fontSize: "14px" }}>{s.namn}</span>
                        <span style={{ fontSize: "11px", color: "#6060a0" }}>Åk {s.ar}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: "22px" }}>
                  <div style={{ fontSize: "11px", color: "#6060a0", marginBottom: "9px", textTransform: "uppercase", letterSpacing: "0.9px" }}>Ämnesområde (Lgr22)</div>
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
                  <div style={{ fontSize: "11px", color: "#6060a0", marginBottom: "9px", textTransform: "uppercase", letterSpacing: "0.9px" }}>Lektionstid</div>
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

            {steg === 3 && (
              <div className="kort" style={{ padding: "28px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>Elevernas nivåer</h2>
                <p style={{ color: "#6060a0", fontSize: "13px", marginBottom: "18px" }}>Välj de nivåer som finns i din grupp.</p>
                <div style={{ display: "grid", gap: "9px" }}>
                  {NIVAER.map(n => (
                    <div key={n} className={`val-kort ${valdaNivaer.includes(n) ? "vald" : ""}`} onClick={() => toggleNiva(n)} style={{ justifyContent: "space-between" }}>
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
                  <div className="varning">⚠️ Du har valt {valdaNivaer.length} nivåer – kan ta upp till 40–50 sekunder.</div>
                )}
                <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between" }}>
                  <button className="knapp-sek" onClick={() => setSteg(2)}>← Tillbaka</button>
                  <button className="knapp-prim" disabled={valdaNivaer.length === 0} onClick={() => setSteg(4)}>Fortsätt →</button>
                </div>
              </div>
            )}

            {steg === 4 && (
              <div className="kort" style={{ padding: "28px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>Redo att generera</h2>
                <p style={{ color: "#6060a0", fontSize: "13px", marginBottom: "22px" }}>Kontrollera dina val.</p>
                <div style={{ display: "grid", gap: "8px", marginBottom: "22px" }}>
                  {[
                    { label: "Modersmål", varde: sprakNamn, ikon: "🌍" },
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
                    Planen genereras på <strong style={{ color: "#e8b86d" }}>svenska</strong> och <strong style={{ color: "#e8b86d" }}>{sprakNamn}</strong> – redo att skriva ut.
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
