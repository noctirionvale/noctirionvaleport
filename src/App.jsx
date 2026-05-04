import { useEffect, useRef, useState } from 'react'
import './index.css'
import Hero from './sections/Hero'
import CursorTrail from './components/CursorTrail'
import TouchRipple from './components/TouchRipple'

const isMobile = () => window.innerWidth <= 768 || 'ontouchstart' in window

export default function App() {
  const cursorRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [mobile, setMobile] = useState(isMobile())
  const pos = useRef({ x: -999, y: -999 })
  const raf = useRef(null)

  useEffect(() => {
    const onResize = () => setMobile(isMobile())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (mobile) return
    const move = (e) => { pos.current = { x: e.clientX, y: e.clientY } }
    const over = (e) => {
      const t = e.target
      setHovered(['BUTTON', 'A', 'INPUT', 'TEXTAREA'].includes(t.tagName))
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
  }, [mobile])

  return (
    <>
      {!mobile && (
        <div ref={cursorRef} className={`custom-cursor${hovered ? ' hovered' : ''}`} />
      )}
      {isMobile ? <TouchRipple /> : <CursorTrail />}
      <Hero mobile={mobile} />
    </>
  )
}