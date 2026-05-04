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

function SocialRow({ justify = 'flex-end' }) {
  return (
    <div style={{ display: 'flex', gap: '16px', justifyContent: justify }}>
      {SOCIALS.map(s => (
        <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
          style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => e.target.style.color = 'var(--purple-light)'}
          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}>
          {s.label}
        </a>
      ))}
    </div>
  )
}

function MobileHero() {
  return (
    <div style={{ width: '100vw', minHeight: '100vh', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 0 120px' }}>
      {BG}

      {/* Top bar */}
      <div style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.14)' }}>NV — 2026</div>
        {/* Mini clock */}
        <MiniClock />
        <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.14)' }}>PORTFOLIO v2</div>
      </div>

      {/* Wordmark area */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '8px 20px 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(184,154,255,0.65)', border: '1px solid rgba(184,154,255,0.2)', borderRadius: '3px', padding: '3px 8px', marginBottom: '10px' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#7fff7f', boxShadow: '0 0 6px #7fff7f', flexShrink: 0 }} />
          OPEN TO WORK
        </div>
        <GlitchWordmark />
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.18em', color: '#fff', marginTop: '2px' }}>NOCTIRION VALE</div>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.3, color: 'var(--purple-light)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '10px', opacity: 0.8 }}>
          Building things people can use.<br />Still figuring out the rest.
        </div>
        {/* Stack pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center', marginTop: '12px' }}>
          {STACK_PILLS.map(s => (
            <span key={s} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.62rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.32)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2px 9px' }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Nav card */}
      <div style={{ position: 'relative', zIndex: 2, marginTop: '28px', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <NavCard />
      </div>

      {/* Socials bottom */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10, padding: '14px 20px', background: 'linear-gradient(0deg,rgba(7,9,31,0.95) 60%,transparent)', display: 'flex', justifyContent: 'center' }}>
        <SocialRow justify="center" />
      </div>
    </div>
  )
}

function MiniClock() {
  const [time, setTime] = useState(new Date())
  const { useState: us, useEffect: ue } = { useState, useEffect: require_useEffect() }

  function require_useEffect() {
    const { useEffect } = require('react') // won't work — use inline
    return useEffect
  }
  return null
}

// Simple inline mini clock
import { useState, useEffect } from 'react'
function MiniClockReal() {
  const [time, setTime] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id) }, [])
  const pad = n => String(n).padStart(2, '0')
  return (
    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontStyle: 'italic', color: 'var(--purple-light)', fontSize: '0.85rem', letterSpacing: '0.08em', opacity: 0.7 }}>
      {pad(time.getHours())}:{pad(time.getMinutes())}:{pad(time.getSeconds())}
    </div>
  )
}

export default function Hero() {
  const isMobile = useIsMobile()

  if (isMobile) return <MobileHeroFull />
  return <DesktopHero />
}

function MobileHeroFull() {
  return (
    <div style={{ width: '100vw', minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '80px' }}>
      {BG}

      {/* Top bar */}
      <div style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.14)' }}>NV — 2026</div>
        <MiniClockReal />
        <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.14)' }}>PORTFOLIO v2</div>
      </div>

      {/* Header content */}
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
          {STACK_PILLS.map(s => (
            <span key={s} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.62rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.32)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2px 9px' }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Nav card */}
      <div style={{ position: 'relative', zIndex: 2, marginTop: '24px', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <NavCard />
      </div>

      {/* Fixed social bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10, padding: '12px 20px 16px', background: 'linear-gradient(0deg,rgba(7,9,31,1) 50%,transparent)', display: 'flex', justifyContent: 'center', gap: '20px' }}>
        {SOCIALS.map(s => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
            {s.label}
          </a>
        ))}
      </div>
    </div>
  )
}

function DesktopHero() {
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
          {STACK_PILLS.map(s => (
            <span key={s} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.38)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '3px 11px' }}>{s}</span>
          ))}
        </div>
      </div>

      {/* CENTER */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center' }}>
        <NavCard />
      </div>

      {/* RIGHT */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', paddingTop: '32px', paddingBottom: '32px' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Clock />
        </div>
        <div style={{ display: 'flex', gap: '18px', paddingBottom: '4px' }}>
          {SOCIALS.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--purple-light)'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}>
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}