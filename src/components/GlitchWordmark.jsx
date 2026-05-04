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

  if (!glitching) {
    return (
      <div style={{ ...baseStyle, position: 'relative' }}>
        <span style={{
          color: '#4169e1',
          textShadow: '3px 3px 0px #1a1a6e, 6px 6px 0px #0d0d4a, 1px 1px 0px rgba(255,255,255,0.1)',
        }}>
          PORTFOLIO
        </span>
      </div>
    )
  }

  return (
    <div style={{ ...baseStyle, position: 'relative', display: 'inline-block' }}>
      {/* Red channel */}
      <span style={{
        position: 'absolute',
        top: 0, left: 0,
        color: 'red',
        opacity: 0.75,
        transform: `translate(${o.r[0]}px, ${o.r[1]}px)`,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}>PORTFOLIO</span>
      {/* Green channel */}
      <span style={{
        position: 'absolute',
        top: 0, left: 0,
        color: '#00ff88',
        opacity: 0.75,
        transform: `translate(${o.g[0]}px, ${o.g[1]}px)`,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}>PORTFOLIO</span>
      {/* Blue channel */}
      <span style={{
        position: 'absolute',
        top: 0, left: 0,
        color: '#00cfff',
        opacity: 0.75,
        transform: `translate(${o.b[0]}px, ${o.b[1]}px)`,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}>PORTFOLIO</span>
      {/* Base — slightly faded during glitch */}
      <span style={{
        color: '#4169e1',
        opacity: 0.6,
        textShadow: '3px 3px 0px #1a1a6e',
      }}>PORTFOLIO</span>
    </div>
  )
}