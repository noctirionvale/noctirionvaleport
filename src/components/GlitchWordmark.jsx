import { useEffect, useRef, useState } from 'react'

export default function GlitchWordmark() {
  const [glitching, setGlitching] = useState(false)
  const [frame, setFrame] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    const schedule = () => {
      // fires every 6–10 seconds
      const delay = 6000 + Math.random() * 4000
      timerRef.current = setTimeout(() => {
        let f = 0
        const run = () => {
          setGlitching(true)
          setFrame(f)
          f++
          if (f < 6) {
            setTimeout(run, 60 + Math.random() * 40)
          } else {
            setGlitching(false)
            setFrame(0)
            schedule()
          }
        }
        run()
      }, delay)
    }
    schedule()
    return () => clearTimeout(timerRef.current)
  }, [])

  const offsets = [
    { r: [-3, 1], g: [3, -1], b: [0, 0] },
    { r: [4, -2], g: [-4, 2], b: [1, -1] },
    { r: [-2, 3], g: [2, -3], b: [-1, 1] },
    { r: [5, -1], g: [-5, 1], b: [0, 2] },
    { r: [-4, 2], g: [4, -2], b: [2, -2] },
    { r: [2, -3], g: [-2, 3], b: [-1, 1] },
  ]

  const o = offsets[frame] || offsets[0]

  const baseStyle = {
    fontFamily: "'Righteous', cursive",
    fontSize: 'clamp(3.5rem, 6.5vw, 7rem)',
    lineHeight: 1,
    letterSpacing: '0.01em',
    userSelect: 'none',
  }

  // Orange palette
  const orangeBase = '#ff8c00'       // vibrant orange
  const orangeDark = '#cc5500'       // deep burnt orange
  const orangeShadow = '#aa4400'

  if (!glitching) {
    return (
      <div style={{ ...baseStyle, position: 'relative' }}>
        <span style={{
          color: orangeBase,
          textShadow: `3px 3px 0px ${orangeDark}, 6px 6px 0px ${orangeShadow}, 1px 1px 0px rgba(255,255,255,0.15)`,
        }}>
          NOCTIRION VALE
        </span>
      </div>
    )
  }

  // Glitch channels: warm orange/red, greenish‑yellow, and a cooler orange/amber
  return (
    <div style={{ ...baseStyle, position: 'relative', display: 'inline-block' }}>
      {/* Red/Orange channel – aggressive glow */}
      <span style={{
        position: 'absolute',
        top: 0, left: 0,
        color: '#ff5500',
        opacity: 0.8,
        transform: `translate(${o.r[0]}px, ${o.r[1]}px)`,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}>NOCTIRION VALE</span>
      {/* Yellow/Amber channel – bright contrast */}
      <span style={{
        position: 'absolute',
        top: 0, left: 0,
        color: '#ffcc00',
        opacity: 0.75,
        transform: `translate(${o.g[0]}px, ${o.g[1]}px)`,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}>NOCTIRION VALE</span>
      {/* Deep orange/rust channel – adds depth */}
      <span style={{
        position: 'absolute',
        top: 0, left: 0,
        color: '#cc6600',
        opacity: 0.7,
        transform: `translate(${o.b[0]}px, ${o.b[1]}px)`,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}>NOCTIRION VALE</span>
      {/* Base – faded orange during glitch */}
      <span style={{
        color: orangeBase,
        opacity: 0.5,
        textShadow: `2px 2px 0px ${orangeDark}`,
      }}>NOCTIRION VALE</span>
    </div>
  )
}