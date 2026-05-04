import { useState, useEffect } from 'react'

export default function Clock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const pad = n => String(n).padStart(2, '0')
  const h = pad(time.getHours())
  const m = pad(time.getMinutes())
  const s = pad(time.getSeconds())
  const year = time.getFullYear()
  const month = time.toLocaleString('en', { month: 'long' }).toUpperCase()
  const day = pad(time.getDate())
  return (
    <div style={{
      fontFamily: "'Barlow Condensed', sans-serif",
      fontWeight: 800,
      fontStyle: 'italic',
      color: 'var(--purple-light)',
      letterSpacing: '0.06em',
      lineHeight: 1.1,
      textAlign: 'right',
      userSelect: 'none',
    }}>
      <div style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.6rem)' }}>{h}:{m}:{s}</div>
      <div style={{ fontSize: '0.9rem', letterSpacing: '0.14em', marginTop: '-2px', opacity: 0.65 }}>
        {month} {day} — {year}
      </div>
    </div>
  )
}