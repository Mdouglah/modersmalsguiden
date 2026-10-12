import "./NorvayBar.css";

export default function NorvayBar() {
  return (
    <div className="norvay-bar">
      <a className="norvay-bar-back" href="https://norvayapp.se/#verktyg">← Alla verktyg</a>
      <a className="norvay-bar-brand" href="https://norvayapp.se/" aria-label="Norvay startsida">
        <span className="norvay-bar-mark">N</span>
        <span>NORVAY</span>
      </a>
    </div>
  )
}
