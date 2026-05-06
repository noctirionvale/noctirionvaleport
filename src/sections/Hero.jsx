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

// Helper to convert any YouTube URL to embed URL with controls
function getYouTubeEmbedUrl(url) {
  if (!url) return null
  let videoId = null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  let match = url.match(regExp)
  if (match && match[2]?.length === 11) {
    videoId = match[2]
  }
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

// Draggable, resizable video frame (desktop + mobile)
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

  const dragStart = useRef({ x: 0, y: 0 })
  const resizeStart = useRef({ w: 0, h: 0, startX: 0, startY: 0 })
  const headerRef = useRef(null)
  const resizeHandleRef = useRef(null)

  // Drag logic
  const startDrag = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
    const clientX = e.clientX ?? e.touches?.[0]?.clientX
    const clientY = e.clientY ?? e.touches?.[0]?.clientY
    if (!clientX || !clientY) return
    dragStart.current = { x: clientX - position.x, y: clientY - position.y }
  }, [position.x, position.y])

  const onDragMove = useCallback((e) => {
    if (!isDragging) return
    const clientX = e.clientX ?? e.touches?.[0]?.clientX
    const clientY = e.clientY ?? e.touches?.[0]?.clientY
    if (!clientX || !clientY) return
    setPosition({ x: clientX - dragStart.current.x, y: clientY - dragStart.current.y })
  }, [isDragging])

  const stopDrag = useCallback(() => setIsDragging(false), [])

  useEffect(() => {
    if (isDragging) {
      const opts = { passive: false }
      window.addEventListener('mousemove', onDragMove)
      window.addEventListener('mouseup', stopDrag)
      window.addEventListener('touchmove', onDragMove, opts)
      window.addEventListener('touchend', stopDrag)
      return () => {
        window.removeEventListener('mousemove', onDragMove)
        window.removeEventListener('mouseup', stopDrag)
        window.removeEventListener('touchmove', onDragMove)
        window.removeEventListener('touchend', stopDrag)
      }
    }
  }, [isDragging, onDragMove, stopDrag])

  // Resize logic
  const startResize = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    const clientX = e.clientX ?? e.touches?.[0]?.clientX
    const clientY = e.clientY ?? e.touches?.[0]?.clientY
    if (!clientX || !clientY) return
    resizeStart.current = { w: size.width, h: size.height, startX: clientX, startY: clientY }
  }, [size.width, size.height])

  const onResizeMove = useCallback((e) => {
    if (!isResizing) return
    const clientX = e.clientX ?? e.touches?.[0]?.clientX
    const clientY = e.clientY ?? e.touches?.[0]?.clientY
    if (!clientX || !clientY) return
    const deltaX = clientX - resizeStart.current.startX
    const deltaY = clientY - resizeStart.current.startY
    const newW = Math.max(mobile ? 240 : 280, resizeStart.current.w + deltaX)
    const newH = Math.max(mobile ? 135 : 160, resizeStart.current.h + deltaY)
    setSize({ width: newW, height: newH })
  }, [isResizing, mobile])

  const stopResize = useCallback(() => setIsResizing(false), [])

  useEffect(() => {
    if (isResizing) {
      const opts = { passive: false }
      window.addEventListener('mousemove', onResizeMove)
      window.addEventListener('mouseup', stopResize)
      window.addEventListener('touchmove', onResizeMove, opts)
      window.addEventListener('touchend', stopResize)
      return () => {
        window.removeEventListener('mousemove', onResizeMove)
        window.removeEventListener('mouseup', stopResize)
        window.removeEventListener('touchmove', onResizeMove)
        window.removeEventListener('touchend', stopResize)
      }
    }
  }, [isResizing, onResizeMove, stopResize])

  // Attach native touchstart for better handling
  useEffect(() => {
    if (!mobile) return
    const header = headerRef.current
    const handle = resizeHandleRef.current
    if (!header || !handle) return
    const touchStartHeader = (e) => { e.preventDefault(); startDrag(e) }
    const touchStartHandle = (e) => { e.preventDefault(); startResize(e) }
    header.addEventListener('touchstart', touchStartHeader, { passive: false })
    handle.addEventListener('touchstart', touchStartHandle, { passive: false })
    return () => {
      header.removeEventListener('touchstart', touchStartHeader)
      handle.removeEventListener('touchstart', touchStartHandle)
    }
  }, [mobile, startDrag, startResize])

  // Improved video source conversion
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

  const frameContent = () => (
    <div
      style={{
        border: '1px solid rgba(184,154,255,0.35)',
        borderRadius: '6px',
        background: 'rgba(7,9,31,0.85)',
        backdropFilter: 'blur(8px)',
        boxShadow: hovered
          ? '0 0 0 1px rgba(184,154,255,0.5), 0 8px 32px rgba(0,0,0,0.7)'
          : '0 0 0 1px rgba(184,154,255,0.15), 0 8px 32px rgba(0,0,0,0.5)',
        transition: 'box-shadow 0.3s',
        overflow: 'hidden',
        width: size.width,
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header (draggable) */}
      <div
        ref={headerRef}
        onMouseDown={startDrag}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '7px 12px',
          borderBottom: '1px solid rgba(184,154,255,0.15)',
          background: 'rgba(184,154,255,0.04)',
          cursor: 'grab',
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff4444', boxShadow: '0 0 6px #ff4444', animation: 'blink 1.4s infinite' }} />
          <span style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>LIVE</span>
        </div>
        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontStyle: 'italic', fontSize: '0.78rem', letterSpacing: '0.12em', color: 'rgba(184,154,255,0.7)', textTransform: 'uppercase' }}>{videoTitle}</span>
        {mobile && onClose && (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onClose()
            }}
            onTouchEnd={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onClose()
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              fontSize: '1.2rem',
              lineHeight: 1,
              padding: '4px 8px',
              zIndex: 20,
            }}
          >
            ✕
          </button>
        )}
        {!mobile && (
          <div style={{ display: 'flex', gap: '3px' }}>
            {[0,1,2].map(i => <span key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: i === 0 ? 'rgba(184,154,255,0.5)' : 'rgba(255,255,255,0.1)' }} />)}
          </div>
        )}
      </div>

      {/* Video iframe – now with full controls and pointer events auto */}
      <div style={{ position: 'relative', width: size.width, height: size.height, overflow: 'hidden' }}>
        <iframe
          key={videoUrl}
          width="100%"
          height="100%"
          src={videoUrl}
          title={videoTitle}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{ display: 'block', width: '100%', height: '100%' }}
        />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.08) 3px,rgba(0,0,0,0.08) 4px)' }} />
        <div style={{ position: 'absolute', top: 8, left: 8, width: 14, height: 14, borderTop: '1px solid rgba(184,154,255,0.6)', borderLeft: '1px solid rgba(184,154,255,0.6)' }} />
        <div style={{ position: 'absolute', bottom: 8, right: 8, width: 14, height: 14, borderBottom: '1px solid rgba(184,154,255,0.6)', borderRight: '1px solid rgba(184,154,255,0.6)' }} />
        {/* Resize handle */}
        <div
          ref={resizeHandleRef}
          onMouseDown={startResize}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: mobile ? 32 : 22,
            height: mobile ? 32 : 22,
            cursor: 'nw-resize',
            background: 'rgba(184,154,255,0.3)',
            borderTopLeftRadius: '6px',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: mobile ? '16px' : '11px',
            color: 'rgba(255,255,255,0.6)',
            pointerEvents: 'auto',
            touchAction: 'none',
          }}
        >
          ⤡
        </div>
      </div>

      {/* Footer – contains the clock */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 12px', borderTop: '1px solid rgba(184,154,255,0.1)', background: 'rgba(184,154,255,0.02)', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock />
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontStyle: 'italic', fontSize: '0.7rem', letterSpacing: '0.06em', color: 'rgba(184,154,255,0.55)' }}>i also watch livestream</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a href="https://www.vaibes.pro" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(184,154,255,0.6)', textDecoration: 'none' }}>vaibes.pro ↗</a>
          {!editMode ? (
            <button onClick={() => setEditMode(true)} style={{ background: 'none', border: 'none', color: 'rgba(184,154,255,0.5)', cursor: 'pointer', fontSize: '9px', fontFamily: 'monospace' }}>🎬 source</button>
          ) : (
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <input
                type="text"
                value={tempUrl}
                onChange={e => setTempUrl(e.target.value)}
                placeholder="Paste YouTube URL"
                style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(184,154,255,0.3)', borderRadius: '3px', padding: '2px 6px', fontSize: '9px', color: '#fff', width: '130px' }}
              />
              <button onClick={applyVideoSource} style={{ background: 'none', border: 'none', color: '#7fff7f', cursor: 'pointer', fontSize: '9px' }}>✓</button>
              <button onClick={() => setEditMode(false)} style={{ background: 'none', border: 'none', color: '#ff9999', cursor: 'pointer', fontSize: '9px' }}>✗</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // Desktop: absolutely positioned, always visible, no overlay
  if (!mobile) {
    return (
      <div style={{ position: 'relative', left: position.x, top: position.y, width: size.width, zIndex: 10 }}>
        {frameContent()}
        <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
      </div>
    )
  }

  // Mobile: absolutely positioned, no backdrop overlay (so navcard remains interactable)
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: position.y,
          left: position.x,
          width: size.width,
          zIndex: 1000,
          pointerEvents: 'auto',
        }}
      >
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

        <div style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.14)' }}>NV — 2026</div>
          <MiniClockReal />
          <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.14)' }}>PORTFOLIO v2</div>
        </div>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '4px 24px 0', width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(184,154,255,0.65)', border: '1px solid rgba(184,154,255,0.2)', borderRadius: '3px', padding: '3px 8px', marginBottom: '10px' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#7fff7f', boxShadow: '0 0 6px #7fff7f', flexShrink: 0 }} />
            OPEN TO WORK
          </div>
          <GlitchWordmark />
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.18em', color: '#fff', marginTop: '2px' }}>NOCTIRION VALE</div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.88rem', lineHeight: 1.4, color: 'var(--purple-light)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '10px', opacity: 0.8 }}>
            Building things people can use.<br />Still figuring out the rest.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center', marginTop: '12px' }}>
            {STACK_PILLS.map(s => <span key={s} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.62rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.32)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2px 9px' }}>{s}</span>)}
          </div>
        </div>

        {!mobileBirdcamOpen ? (
          <button
            onClick={() => setMobileBirdcamOpen(true)}
            style={{
              position: 'relative',
              zIndex: 2,
              marginTop: '20px',
              width: '88vw',
              padding: '10px 12px',
              background: 'rgba(7,9,31,0.85)',
              border: '1px solid rgba(184,154,255,0.35)',
              borderRadius: '8px',
              color: 'rgba(184,154,255,0.7)',
              fontFamily: "'Barlow Condensed',sans-serif",
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
          >
            🎥 Open Live Stream
          </button>
        ) : (
          <DraggableResizableBirdcam mobile={true} onClose={() => setMobileBirdcamOpen(false)} />
        )}

        <div style={{ position: 'relative', zIndex: 2, marginTop: '24px', marginBottom: '40px', width: '88vw', display: 'flex', justifyContent: 'center' }}>
          <NavCard mobileWidth="88vw" />
        </div>

        <div style={{ position: 'relative', zIndex: 2, marginTop: '16px', padding: '16px 20px 32px', display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {SOCIALS.map(s => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>{s.label}</a>)}
        </div>
      </div>
    )
  }

  // Desktop
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 clamp(24px,4vw,60px)', gap: '0 clamp(20px,3vw,48px)' }}>
      {BG}
      <div style={{ position: 'absolute', top: 18, left: 22, zIndex: 2, fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.14)' }}>NV — 2026</div>
      <div style={{ position: 'absolute', top: 18, right: 22, zIndex: 2, fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.14)' }}>PORTFOLIO v2</div>

      {/* LEFT */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(184,154,255,0.65)', border: '1px solid rgba(184,154,255,0.2)', borderRadius: '3px', padding: '4px 10px', width: 'fit-content' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7fff7f', boxShadow: '0 0 6px #7fff7f', flexShrink: 0 }} />
          OPEN TO WORK
        </div>
        <div>
          <GlitchWordmark />
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 'clamp(0.85rem,1.4vw,1.2rem)', letterSpacing: '0.18em', color: '#fff', marginTop: '4px' }}>NOCTIRION VALE</div>
        </div>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 'clamp(1rem,1.8vw,1.45rem)', lineHeight: 1.25, color: 'var(--purple-light)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Building things<br />people can use. Still<br />figuring out the rest.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
          {STACK_PILLS.map(s => <span key={s} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.38)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '3px 11px' }}>{s}</span>)}
        </div>
      </div>

      {/* CENTER */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center', marginTop: '-210px' }}>
        <NavCard />
      </div>

      {/* RIGHT */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', paddingTop: '32px', paddingBottom: '32px', gap: '24px' }}>
        <DraggableResizableBirdcam mobile={false} />
        <div style={{ display: 'flex', gap: '18px', paddingBottom: '4px' }}>
          {SOCIALS.map(s => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--purple-light)'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}>{s.label}</a>)}
        </div>
      </div>
    </div>
  )
}