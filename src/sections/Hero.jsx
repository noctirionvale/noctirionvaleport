import { useState, useEffect, useRef, useCallback } from 'react'
import NavCard from '../components/NavCard'
import Clock from '../components/Clock'
import GlitchWordmark from '../components/GlitchWordmark'
import useIsMobile from '../hooks/useIsMobile'

const SOCIALS = [
  { label: 'X',        href: 'https://x.com/NoctirionV42607' },
  { label: 'TIKTOK',   href: 'https://www.tiktok.com/@noctirionvale' },
  { label: 'FACEBOOK', href: 'https://www.facebook.com/share/1Cx1ADfbPn/' },
  { label: 'YOUTUBE',  href: 'https://www.youtube.com/@NoctirionVale' },
]

const STACK_PILLS = ['REACT', 'SUPABASE', 'VITE', 'VERCEL', 'NODE.JS', 'DEEPSEEK']

const BG = (
  <>
    <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(65,105,225,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(65,105,225,0.05) 1px,transparent 1px)`, backgroundSize: '54px 54px', zIndex: 0 }} />
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px)' }} />
    <div style={{ position: 'absolute', top: '38%', left: 0, width: '55%', height: '1px', background: 'linear-gradient(90deg,transparent,rgba(184,154,255,0.25) 40%,transparent)', zIndex: 0, pointerEvents: 'none' }} />
  </>
)

function MiniClockReal() {
  const [time, setTime] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id) }, [])
  const pad = n => String(n).padStart(2, '0')
  const hours = time.getHours()
  const h = hours % 12 || 12
  const ampm = hours >= 12 ? 'PM' : 'AM'
  return (
    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontStyle: 'italic', color: 'var(--purple-light)', fontSize: '0.85rem', letterSpacing: '0.08em', opacity: 0.7 }}>
      {h}:{pad(time.getMinutes())}:{pad(time.getSeconds())} {ampm}
    </div>
  )
}

function getYouTubeEmbedUrl(url) {
  if (!url) return null
  let videoId = null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  let match = url.match(regExp)
  if (match && match[2]?.length === 11) videoId = match[2]
  if (!videoId) {
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
    if (shortMatch) videoId = shortMatch[1]
  }
  if (!videoId && url.includes('/embed/')) {
    const embedMatch = url.match(/\/embed\/([^?&]+)/)
    if (embedMatch) videoId = embedMatch[1]
  }
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&loop=1&modestbranding=1`
  }
  return url
}

function DraggableResizableBirdcam({ mobile = false, onClose }) {
  const [size, setSize] = useState({ width: mobile ? 300 : 380, height: mobile ? 169 : 214 })
  const [position, setPosition] = useState({ x: mobile ? 20 : -20, y: mobile ? 80 : 60 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [videoUrl, setVideoUrl] = useState(
    'https://www.youtube.com/embed/B4-L2nfGcuE?autoplay=1&controls=1&loop=1&modestbranding=1'
  )
  const [videoTitle, setVideoTitle] = useState('Live Stream')
  const [tempUrl, setTempUrl] = useState('')

  const headerRef = useRef(null)
  const resizeHandleRef = useRef(null)
  const dragStart = useRef({ x: 0, y: 0 })
  const resizeStart = useRef({ w: 0, h: 0, startX: 0, startY: 0 })

  // ---------- Mouse drag (desktop) ----------
  const startDragMouse = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y }
  }, [position.x, position.y])

  const onDragMoveMouse = useCallback((e) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    })
  }, [isDragging])

  const stopDrag = useCallback(() => setIsDragging(false), [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onDragMoveMouse)
      window.addEventListener('mouseup', stopDrag)
      return () => {
        window.removeEventListener('mousemove', onDragMoveMouse)
        window.removeEventListener('mouseup', stopDrag)
      }
    }
  }, [isDragging, onDragMoveMouse, stopDrag])

  // ---------- Touch drag (mobile) – only on header ----------
  const startDragTouch = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
    const touch = e.touches[0]
    dragStart.current = { x: touch.clientX - position.x, y: touch.clientY - position.y }
  }, [position.x, position.y])

  const onDragMoveTouch = useCallback((e) => {
    if (!isDragging) return
    e.preventDefault()
    const touch = e.touches[0]
    setPosition({
      x: touch.clientX - dragStart.current.x,
      y: touch.clientY - dragStart.current.y,
    })
  }, [isDragging])

  const stopDragTouch = useCallback((e) => {
    setIsDragging(false)
    e.preventDefault()
  }, [])

  useEffect(() => {
    const header = headerRef.current
    if (!mobile || !header) return
    header.addEventListener('touchstart', startDragTouch, { passive: false })
    header.addEventListener('touchmove', onDragMoveTouch, { passive: false })
    header.addEventListener('touchend', stopDragTouch, { passive: false })
    return () => {
      header.removeEventListener('touchstart', startDragTouch)
      header.removeEventListener('touchmove', onDragMoveTouch)
      header.removeEventListener('touchend', stopDragTouch)
    }
  }, [mobile, startDragTouch, onDragMoveTouch, stopDragTouch])

  // ---------- Resize (mouse + touch) ----------
  const startResizeMouse = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    resizeStart.current = { w: size.width, h: size.height, startX: e.clientX, startY: e.clientY }
  }, [size.width, size.height])

  const onResizeMoveMouse = useCallback((e) => {
    if (!isResizing) return
    const deltaX = e.clientX - resizeStart.current.startX
    const deltaY = e.clientY - resizeStart.current.startY
    const newW = Math.max(mobile ? 240 : 280, resizeStart.current.w + deltaX)
    const newH = Math.max(mobile ? 135 : 160, resizeStart.current.h + deltaY)
    setSize({ width: newW, height: newH })
  }, [isResizing, mobile])

  const stopResizeMouse = useCallback(() => setIsResizing(false), [])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', onResizeMoveMouse)
      window.addEventListener('mouseup', stopResizeMouse)
      return () => {
        window.removeEventListener('mousemove', onResizeMoveMouse)
        window.removeEventListener('mouseup', stopResizeMouse)
      }
    }
  }, [isResizing, onResizeMoveMouse, stopResizeMouse])

  const startResizeTouch = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    const touch = e.touches[0]
    resizeStart.current = { w: size.width, h: size.height, startX: touch.clientX, startY: touch.clientY }
  }, [size.width, size.height])

  const onResizeMoveTouch = useCallback((e) => {
    if (!isResizing) return
    e.preventDefault()
    const touch = e.touches[0]
    const deltaX = touch.clientX - resizeStart.current.startX
    const deltaY = touch.clientY - resizeStart.current.startY
    const newW = Math.max(mobile ? 240 : 280, resizeStart.current.w + deltaX)
    const newH = Math.max(mobile ? 135 : 160, resizeStart.current.h + deltaY)
    setSize({ width: newW, height: newH })
  }, [isResizing, mobile])

  const stopResizeTouch = useCallback((e) => {
    setIsResizing(false)
    e.preventDefault()
  }, [])

  useEffect(() => {
    const handle = resizeHandleRef.current
    if (!mobile || !handle) return
    handle.addEventListener('touchstart', startResizeTouch, { passive: false })
    handle.addEventListener('touchmove', onResizeMoveTouch, { passive: false })
    handle.addEventListener('touchend', stopResizeTouch, { passive: false })
    return () => {
      handle.removeEventListener('touchstart', startResizeTouch)
      handle.removeEventListener('touchmove', onResizeMoveTouch)
      handle.removeEventListener('touchend', stopResizeTouch)
    }
  }, [mobile, startResizeTouch, onResizeMoveTouch, stopResizeTouch])

  const applyVideoSource = () => {
    if (!tempUrl.trim()) return
    const newEmbed = getYouTubeEmbedUrl(tempUrl.trim())
    if (!newEmbed || newEmbed === tempUrl.trim()) {
      alert('Invalid YouTube URL. Please provide a valid YouTube link (watch?v= or youtu.be).')
      return
    }
    setVideoUrl(newEmbed)
    setVideoTitle('Custom')
    setEditMode(false)
    setTempUrl('')
  }

  const resetPosition = () => {
    const defaultPos = mobile ? { x: 20, y: 80 } : { x: -20, y: 60 }
    setPosition(defaultPos)
  }

  const frameContent = () => (
    <div
      style={{
        border: `1px solid ${hovered ? 'rgba(255,140,0,0.6)' : 'rgba(255,140,0,0.3)'}`,
        borderRadius: '6px',
        background: 'rgba(7,9,31,0.85)',
        backdropFilter: 'blur(8px)',
        boxShadow: hovered
          ? '0 0 0 1px rgba(255,140,0,0.4), 0 8px 32px rgba(0,0,0,0.7)'
          : '0 0 0 1px rgba(255,140,0,0.2), 0 8px 32px rgba(0,0,0,0.5)',
        transition: 'box-shadow 0.3s, border-color 0.3s',
        overflow: 'hidden',
        width: size.width,
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header – draggable area */}
      <div
        ref={headerRef}
        onMouseDown={startDragMouse}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '7px 12px',
          borderBottom: `1px solid ${hovered ? 'rgba(255,140,0,0.4)' : 'rgba(255,140,0,0.2)'}`,
          background: 'rgba(255,140,0,0.04)',
          userSelect: 'none',
          cursor: 'grab',
          touchAction: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff4444', boxShadow: '0 0 6px #ff4444', animation: 'blink 1.4s infinite' }} />
          <span style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>LIVE</span>
        </div>
        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontStyle: 'italic', fontSize: '0.78rem', letterSpacing: '0.12em', color: 'rgba(255,140,0,0.8)', textTransform: 'uppercase' }}>View My Projects</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>⋮⋮</span>
          {mobile && onClose && (
            <button
              onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '1rem', padding: '0 4px' }}
            >
              ✕
            </button>
          )}
          {!mobile && (
            <div style={{ display: 'flex', gap: '3px' }}>
              {[0,1,2].map(i => <span key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: i === 0 ? 'rgba(255,140,0,0.6)' : 'rgba(255,255,255,0.1)' }} />)}
            </div>
          )}
        </div>
      </div>

      {/* Video iframe */}
      <div style={{ position: 'relative', width: size.width, height: size.height, overflow: 'hidden' }}>
        <iframe key={videoUrl} width="100%" height="100%" src={videoUrl} title={videoTitle} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style={{ display: 'block', width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.08) 3px,rgba(0,0,0,0.08) 4px)' }} />
        <div style={{ position: 'absolute', top: 8, left: 8, width: 14, height: 14, borderTop: '1px solid rgba(255,140,0,0.7)', borderLeft: '1px solid rgba(255,140,0,0.7)' }} />
        <div style={{ position: 'absolute', bottom: 8, right: 8, width: 14, height: 14, borderBottom: '1px solid rgba(255,140,0,0.7)', borderRight: '1px solid rgba(255,140,0,0.7)' }} />
        <div
          ref={resizeHandleRef}
          className="resize-handle"
          onMouseDown={startResizeMouse}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: mobile ? 32 : 22,
            height: mobile ? 32 : 22,
            cursor: 'nw-resize',
            background: 'rgba(255,140,0,0.4)',
            borderTopLeftRadius: '6px',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: mobile ? '16px' : '11px',
            color: 'rgba(255,255,255,0.8)',
            pointerEvents: 'auto',
          }}
        >
          ⤡
        </div>
      </div>

      {/* Footer – orange accents */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '38px' }}>
    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.08em', color: 'rgba(255,140,0,0.9)' }}>
      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </div>
    <div style={{ fontSize: '0.6rem', color: 'rgba(255,140,0,0.6)', fontFamily: 'monospace', letterSpacing: '0.05em', textAlign: 'left', marginLeft: '0px' }}>
      {new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
    </div>
  </div>
  <button
    onClick={resetPosition}
    onTouchEnd={(e) => { e.stopPropagation(); resetPosition(); }}
    style={{ background: 'none', border: 'none', color: 'rgba(255,140,0,0.6)', cursor: 'pointer', fontSize: '0.9rem', padding: '2px 4px' }}
    title="Reset position"
  >
    ⟳
  </button>
</div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a
            href="https://www.vaibes.pro"
            target="_blank"
            rel="noopener noreferrer"
            onTouchEnd={(e) => e.stopPropagation()}
            style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(255,140,0,0.6)', textDecoration: 'none', pointerEvents: 'auto' }}
          >
            vaibes.pro ↗
          </a>
          {!editMode ? (
            <button
              onTouchEnd={(e) => { e.stopPropagation(); setEditMode(true); }}
              onClick={() => setEditMode(true)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,140,0,0.5)', cursor: 'pointer', fontSize: '9px', fontFamily: 'monospace' }}
            >
              🎬 source
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <input
                type="text"
                value={tempUrl}
                onChange={e => setTempUrl(e.target.value)}
                placeholder="Paste YouTube URL"
                style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,140,0,0.3)', borderRadius: '3px', padding: '2px 6px', fontSize: '9px', color: '#fff', width: '130px', pointerEvents: 'auto' }}
              />
              <button
                onTouchEnd={(e) => { e.stopPropagation(); applyVideoSource(); }}
                onClick={applyVideoSource}
                style={{ background: 'none', border: 'none', color: '#7fff7f', cursor: 'pointer', fontSize: '9px' }}
              >
                ✓
              </button>
              <button
                onTouchEnd={(e) => { e.stopPropagation(); setEditMode(false); }}
                onClick={() => setEditMode(false)}
                style={{ background: 'none', border: 'none', color: '#ff9999', cursor: 'pointer', fontSize: '9px' }}
              >
                ✗
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (!mobile) {
    return (
      <div style={{ position: 'relative', left: position.x, top: position.y, width: size.width, zIndex: 10 }}>
        {frameContent()}
        <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
      </div>
    )
  }

  return (
    <>
      <div style={{ position: 'fixed', top: position.y, left: position.x, width: size.width, zIndex: 1000, pointerEvents: 'auto' }}>
        {frameContent()}
      </div>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </>
  )
}

export default function Hero() {
  const isMobile = useIsMobile()
  const [mobileBirdcamOpen, setMobileBirdcamOpen] = useState(false)

  if (isMobile) {
    return (
      <div style={{ width: '100vw', minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '180px', overflowX: 'hidden' }}>
        {BG}

        <div style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px 0 20px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.14)' }}>NV — 2026</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(184,154,255,0.65)', border: '1px solid rgba(184,154,255,0.2)', borderRadius: '3px', padding: '3px 8px' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#7fff7f', boxShadow: '0 0 6px #7fff7f' }} />
            OPEN TO WORK
          </div>
          <MiniClockReal />
        </div>

        <div style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', justifyContent: 'center', gap: '24px', padding: '8px 20px 12px 20px', borderBottom: '1px solid rgba(184,154,255,0.1)' }}>
          {SOCIALS.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
              {s.label}
            </a>
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', width: '100%' }}>
          <GlitchWordmark />
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.88rem', lineHeight: 1.4, color: 'var(--purple-light)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '10px', opacity: 0.8 }}>
            BUILDING THINGS<br />PEOPLE ACTUALLY USE.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center', marginTop: '12px' }}>
            {STACK_PILLS.map(s => <span key={s} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.62rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.32)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2px 9px' }}>{s}</span>)}
          </div>
        </div>

        {!mobileBirdcamOpen ? (
          <button onClick={() => setMobileBirdcamOpen(true)} style={{ position: 'relative', zIndex: 2, marginTop: '20px', width: '88vw', padding: '10px 12px', background: 'rgba(7,9,31,0.85)', border: '1px solid rgba(184,154,255,0.35)', borderRadius: '8px', color: 'rgba(184,154,255,0.7)', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.1em', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>🎥 Open Live Stream</button>
        ) : (
          <DraggableResizableBirdcam mobile={true} onClose={() => setMobileBirdcamOpen(false)} />
        )}

        <div style={{ position: 'relative', zIndex: 2, marginTop: '24px', marginBottom: '40px', width: '88vw', display: 'flex', justifyContent: 'center' }}>
          <NavCard mobileWidth="88vw" />
        </div>
      </div>
    )
  }

  // Desktop version
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 clamp(24px,4vw,60px)', gap: '0 clamp(20px,3vw,48px)' }}>
      {BG}
      <div style={{ position: 'absolute', top: 18, left: 22, zIndex: 2, fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.14)' }}>NV — 2026</div>
      <div style={{ position: 'absolute', top: 18, right: 22, zIndex: 2, fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.14)' }}>PORTFOLIO v2</div>

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(184,154,255,0.65)', border: '1px solid rgba(184,154,255,0.2)', borderRadius: '3px', padding: '4px 10px', width: 'fit-content' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7fff7f', boxShadow: '0 0 6px #7fff7f' }} />
          OPEN TO WORK
        </div>
        <div>
          <GlitchWordmark />
        </div>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 'clamp(1rem,1.8vw,1.45rem)', lineHeight: 1.25, color: 'var(--purple-light)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          BUILDING THINGS<br />PEOPLE ACTUALLY USE.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
          {STACK_PILLS.map(s => <span key={s} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.38)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '3px 11px' }}>{s}</span>)}
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center', marginTop: '-210px' }}>
        <NavCard />
      </div>

      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', paddingTop: '32px', paddingBottom: '32px', gap: '24px' }}>
        <DraggableResizableBirdcam mobile={false} />
        <div style={{ display: 'flex', gap: '18px', paddingBottom: '4px' }}>
          {SOCIALS.map(s => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--purple-light)'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}>{s.label}</a>)}
        </div>
      </div>
    </div>
  )
}