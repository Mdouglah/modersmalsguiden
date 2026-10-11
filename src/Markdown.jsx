// Visar AI-svar med riktiga rubriker, fetstil och listor i stället för tecknen # och **.
// Ingen extern kod behövs. Allt byggs som vanliga React-element (inget dangerouslySetInnerHTML).
import React from 'react'

const BORDER = 'color-mix(in srgb, currentColor 25%, transparent)'

function inline(text, nyckel) {
  const delar = String(text).split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`)/g).filter((d) => d !== '')
  return delar.map((d, i) => {
    const k = `${nyckel}-${i}`
    if (/^\*\*[^*]+\*\*$/.test(d)) return <strong key={k}>{d.slice(2, -2)}</strong>
    if (/^\*[^*\s][^*]*\*$/.test(d)) return <em key={k}>{d.slice(1, -1)}</em>
    if (/^`[^`]+`$/.test(d)) return <code key={k}>{d.slice(1, -1)}</code>
    return <React.Fragment key={k}>{d}</React.Fragment>
  })
}

function rensaRubrik(t) {
  return t.replace(/\*\*/g, '').replace(/\s*#+\s*$/, '').trim()
}

function celler(rad) {
  return rad.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim())
}

export default function Markdown({ text, style }) {
  const rader = String(text || '').replace(/\r\n/g, '\n').split('\n')
  const block = []
  let i = 0
  let n = 0

  while (i < rader.length) {
    const rad = rader[i]
    const k = `b${n++}`

    if (rad.trim() === '') { i++; continue }

    if (/^\s*([-*_])\1{2,}\s*$/.test(rad)) {
      block.push(<hr key={k} style={{ border: 0, borderTop: `1px solid ${BORDER}`, margin: '14px 0' }} />)
      i++; continue
    }

    const rub = rad.match(/^\s*(#{1,6})\s+(.*)$/)
    if (rub) {
      const niva = rub[1].length
      const storlek = niva === 1 ? '1.25em' : niva === 2 ? '1.15em' : '1.05em'
      block.push(
        <div key={k} role="heading" aria-level={Math.min(niva + 2, 6)} style={{ fontWeight: 700, fontSize: storlek, margin: '16px 0 6px', lineHeight: 1.3 }}>
          {inline(rensaRubrik(rub[2]), k)}
        </div>
      )
      i++; continue
    }

    if (/^\s*\|/.test(rad)) {
      const tabell = []
      while (i < rader.length && /^\s*\|/.test(rader[i])) { tabell.push(rader[i]); i++ }
      const data = tabell.filter((r) => !/^\s*\|?[\s:|-]+\|?\s*$/.test(r) || !/-/.test(r))
      const [huvud, ...resten] = data
      block.push(
        <div key={k} style={{ overflowX: 'auto', margin: '10px 0' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.95em' }}>
            <thead><tr>{celler(huvud).map((c, ci) => <th key={ci} style={{ textAlign: 'left', padding: '6px 8px', border: `1px solid ${BORDER}` }}>{inline(c, `${k}h${ci}`)}</th>)}</tr></thead>
            <tbody>{resten.map((r, ri) => <tr key={ri}>{celler(r).map((c, ci) => <td key={ci} style={{ padding: '6px 8px', border: `1px solid ${BORDER}`, verticalAlign: 'top' }}>{inline(c, `${k}r${ri}c${ci}`)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )
      continue
    }

    if (/^\s*[-*•]\s+/.test(rad)) {
      const punkter = []
      while (i < rader.length && /^\s*[-*•]\s+/.test(rader[i])) { punkter.push(rader[i].replace(/^\s*[-*•]\s+/, '')); i++ }
      block.push(<ul key={k} style={{ margin: '6px 0', paddingLeft: 22 }}>{punkter.map((p, pi) => <li key={pi} style={{ margin: '3px 0' }}>{inline(p, `${k}-${pi}`)}</li>)}</ul>)
      continue
    }

    if (/^\s*\d+[.)]\s+/.test(rad)) {
      const punkter = []
      while (i < rader.length && /^\s*\d+[.)]\s+/.test(rader[i])) { punkter.push(rader[i].replace(/^\s*\d+[.)]\s+/, '')); i++ }
      block.push(<ol key={k} style={{ margin: '6px 0', paddingLeft: 24 }}>{punkter.map((p, pi) => <li key={pi} style={{ margin: '3px 0' }}>{inline(p, `${k}-${pi}`)}</li>)}</ol>)
      continue
    }

    const stycke = []
    while (
      i < rader.length && rader[i].trim() !== '' &&
      !/^\s*(#{1,6}\s|[-*•]\s|\d+[.)]\s|\|)/.test(rader[i]) &&
      !/^\s*([-*_])\1{2,}\s*$/.test(rader[i])
    ) { stycke.push(rader[i]); i++ }
    block.push(
      <p key={k} style={{ margin: '6px 0', lineHeight: 1.6 }}>
        {stycke.map((r, ri) => <React.Fragment key={ri}>{ri > 0 && <br />}{inline(r, `${k}-${ri}`)}</React.Fragment>)}
      </p>
    )
  }

  return <div style={style}>{block}</div>
}

// Ren text utan markeringar, för kopieringsknappen (till exempel när läraren klistrar in i Word).
export function tillText(text) {
  return String(text || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((r) => !/^\s*([-*_])\1{2,}\s*$/.test(r) && !(/^\s*\|[\s:|-]+\|?\s*$/.test(r) && /-/.test(r)))
    .map((r) =>
      r
        .replace(/^\s*#{1,6}\s+/, '')
        .replace(/^\s*[-*•]\s+/, '• ')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1$2')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/^\s*\|/, '')
        .replace(/\|\s*$/, '')
        .replace(/\s*\|\s*/g, '   ')
    )
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
