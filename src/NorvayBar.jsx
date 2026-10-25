import { useState } from "react";
import "./NorvayBar.css";

// Sparar valet i kakan "norvay-tema" för alla Norvays verktyg (ett år). Bara ordet light eller dark.
function sparaTema(t) {
  const doman = /(^|\.)norvayapp\.se$/.test(location.hostname) ? "; domain=.norvayapp.se" : "";
  const saker = location.protocol === "https:" ? "; secure" : "";
  document.cookie = `norvay-tema=${t}; path=/; max-age=31536000; samesite=lax${saker}${doman}`;
}

// Månknappen: samma som på Norvays startsida. Läget sätts redan i index.html innan sidan ritas.
function TemaKnapp() {
  const [morkt, setMorkt] = useState(() => document.documentElement.getAttribute("data-theme") === "dark");
  function byt() {
    const nytt = morkt ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nytt);
    sparaTema(nytt);
    setMorkt(!morkt);
  }
  return (
    <button type="button" className="norvay-tema" onClick={byt} aria-pressed={morkt} aria-label={morkt ? "Byt till ljust läge" : "Byt till mörkt läge"}>
      {morkt ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
      )}
    </button>
  );
}

export default function NorvayBar() {
  return (
    <div className="norvay-bar">
      <a className="norvay-bar-back" href="https://norvayapp.se/#verktyg">← Alla verktyg</a>
      <span className="norvay-bar-right">
        <a className="norvay-bar-brand" href="https://norvayapp.se/" aria-label="Norvay startsida">
          <span className="norvay-bar-mark">N</span>
          <span>NORVAY</span>
        </a>
        <TemaKnapp />
      </span>
    </div>
  )
}

// Gemensam sidfot för Norvays verktyg
export function NorvayFooter() {
  return (
    <p className="norvay-footer">
      Ett verktyg från <a href="https://norvayapp.se">Norvay</a> · <a href="https://norvayapp.se/integritet">Integritet</a> · <a href="mailto:kontakt@norvayapp.se">kontakt@norvayapp.se</a> · <a className="norvay-stod" href="https://norvayapp.se/#stod" target="_blank" rel="noopener" aria-label="Stöd Norvay (öppnas i ny flik)">Stöd Norvay</a>
    </p>
  )
}
