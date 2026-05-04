import { useEffect, useRef, useState } from 'react'
import './index.css'
import Hero from './sections/Hero'
import CursorTrail from './components/CursorTrail'

export default function App() {
  const cursorRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const pos = useRef({ x: -999, y: -999 })
  const raf = useRef(null)

  useEffect(() => {
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }
    const over = (e) => {
      const t = e.target
      if (t.tagName === 'BUTTON' || t.tagName === 'A' || t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') {
        setHovered(true)
      } else {
        setHovered(false)
      }
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)

    const tick = () => {
      if (cursorRef.current) {
        cursorRef.current.style.left = pos.current.x + 'px'
        cursorRef.current.style.top = pos.current.y + 'px'
      }
      raf.current = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className={`custom-cursor${hovered ? ' hovered' : ''}`} />
      <CursorTrail />
      <Hero />
    </>
  )
}