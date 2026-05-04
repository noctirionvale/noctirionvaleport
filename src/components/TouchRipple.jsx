import { useEffect, useRef } from 'react'

export default function TouchRipple() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let ripples = []
    let raf

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const addRipple = (x, y) => {
      ripples.push({ x, y, r: 0, maxR: 80 + Math.random() * 40, life: 1, color: Math.random() > 0.5 ? [255, 106, 0] : [184, 154, 255] })
    }

    const onTouch = (e) => {
      for (const t of e.touches) addRipple(t.clientX, t.clientY)
    }
    const onTap = (e) => addRipple(e.clientX, e.clientY)

    window.addEventListener('touchstart', onTouch, { passive: true })
    window.addEventListener('click', onTap)

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ripples = ripples.filter(r => r.life > 0)
      for (const r of ripples) {
        r.r += 3.5
        r.life = Math.max(0, 1 - r.r / r.maxR)
        ctx.beginPath()
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${r.color[0]},${r.color[1]},${r.color[2]},${r.life * 0.5})`
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('click', onTap)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }} />
}