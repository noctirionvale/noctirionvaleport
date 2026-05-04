import NavCard from '../components/NavCard'
import Clock from '../components/Clock'
import GlitchWordmark from '../components/GlitchWordmark'

const SOCIALS = [
  { label: 'X',        href: 'https://x.com/NoctirionV42607' },
  { label: 'TIKTOK',   href: 'https://www.tiktok.com/@noctirionvale' },
  { label: 'FACEBOOK', href: 'https://www.facebook.com/share/1Cx1ADfbPn/' },
  { label: 'YOUTUBE',  href: 'https://www.youtube.com/@NoctirionVale' },
]

const STACK_PILLS = ['REACT', 'SUPABASE', 'VITE', 'VERCEL', 'NODE.JS', 'DEEPSEEK']

export default function Hero() {
  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'hidden',
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      padding: '0 clamp(24px, 4vw, 60px)',
      gap: '0 clamp(20px, 3vw, 48px)',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(65,105,225,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(65,105,225,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '54px 54px', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)',
      }} />
      <div style={{
        position: 'absolute', top: '38%', left: 0,
        width: '55%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(184,154,255,0.25) 40%, transparent)',
        zIndex: 0, pointerEvents: 'none',
      }} />
      <div style={{ position: 'absolute', top: 18, left: 22, zIndex: 2, fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.14)' }}>NV — 2026</div>
      <div style={{ position: 'absolute', top: 18, right: 22, zIndex: 2, fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.14)' }}>PORTFOLIO v2</div>

      {/* LEFT */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em',
          color: 'rgba(184,154,255,0.65)', border: '1px solid rgba(184,154,255,0.2)',
          borderRadius: '3px', padding: '4px 10px', width: 'fit-content',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7fff7f', boxShadow: '0 0 6px #7fff7f', flexShrink: 0 }} />
          OPEN TO WORK
        </div>
        <div>
          <GlitchWordmark />
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 'clamp(0.85rem, 1.4vw, 1.2rem)', letterSpacing: '0.18em', color: '#fff', marginTop: '4px' }}>NOCTIRION VALE</div>
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 'clamp(1rem, 1.8vw, 1.45rem)', lineHeight: 1.25, color: 'var(--purple-light)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Building things<br />people can use. Still<br />figuring out the rest.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
          {STACK_PILLS.map(s => (
            <span key={s} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.38)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '3px 11px' }}>{s}</span>
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
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--purple-light)'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
            >{s.label}</a>
          ))}
        </div>
      </div>
    </div>
  )
}