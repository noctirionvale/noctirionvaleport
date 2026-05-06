import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Modal from './Modal'
import useIsMobile from '../hooks/useIsMobile'

const SYSTEM_PROMPTS = {
  ask: `You are the interactive portfolio AI for Loumel Luceño, a self-taught Filipino web developer (Noctirion Vale). Answer only from these facts. Be concise, direct, honest. Max 120 words.

ABOUT: Self-taught, pivoted into web dev, built 2 SaaS products in 4 months. Not a vibe coder — uses AI deliberately as pair-programmer with manual oversight. Openly acknowledges he has a lot to learn. Seeking mentorship-driven paid internship or junior role. Background: 7yr online business, hospitality (Manila Pavilion), outbound sales (SINGTEL/Paxys), BSEd degree. Philippines. Email: noctirionvale@gmail.com

STACK: React, JavaScript ES6+, HTML5, CSS3, Supabase (PostgreSQL/RLS/Realtime), OAuth 2.0, JWT, Node.js, Vercel Serverless, DeepSeek, Anthropic, OpenAI, Google Gemini, Google Cloud TTS, Google Vision AI, Dodo Payments, Vite, Git, GitHub

PROJECTS:
- vAIbes (vaibes.pro) LIVE: AI productivity, Google OAuth, tiered usage, rate limiting, DeepSeek+TTS+Vision, real-time DMs, Study Mode/MediaSession
- Knovia (knovia.site) IN DEV: Knowledge championship, AI quiz engine, anti-cheat, weekly brackets, leaderboards

AVAILABILITY: Open to work. Wants mentorship-driven paid internship or junior role. Rate open to discussion. Contact: noctirionvale@gmail.com

STRENGTHS: Ships real products under constraints. Founder mindset. Honest about gaps. Clear communicator. Learning: TypeScript, Jest/RTL, system design, advanced SQL.`,

  vibe: `You are a creative assistant for Loumel Luceño's portfolio (Noctirion Vale). When visitor describes a vibe/mood/aesthetic, respond with:
1. Which of Loumel's skills or projects match
2. A 3-word aesthetic descriptor
3. Color palette: 3 hex codes with names
Punchy, creative, under 100 words. Slightly playful.
Projects: vAIbes (dark/moody AI), Knovia (competitive/electric/sharp)`,

  build: `You are a project scoping assistant for Loumel Luceño (Noctirion Vale). For any project idea, respond with:
1. Stack from Loumel's skills: React, Supabase, Node.js, Vercel, DeepSeek/AI
2. Complexity: Simple/Medium/Complex
3. Timeline estimate
4. One honest caveat
End with exactly: "Interested? Hit SEND TO LOU to start the conversation."
Under 120 words. Direct.`,
}

const MODES = [
  { id: 'ask',   label: '🤖 ASK ME',  placeholder: 'Ask anything about Loumel...'      },
  { id: 'vibe',  label: '🎨 VIBE',    placeholder: 'Describe a vibe or aesthetic...'   },
  { id: 'build', label: '🔧 BUILD',   placeholder: 'Describe what you want to build...' },
]

const HINTS = {
  ask:   ['Is he available?', 'What has he built?', 'What\'s his stack?'],
  vibe:  ['Dark & minimal', 'Playful dashboard', 'Cyberpunk SaaS'],
  build: ['A quiz platform', 'AI chat app', 'Real-time dashboard'],
}

const PROJECTS = [
  { title: 'vAIbes', description: 'AI productivity tool with Google OAuth, tiered usage, real-time DMs, Study Mode, and three AI/cloud API integrations.', tech: ['React', 'Supabase', 'DeepSeek', 'Google TTS', 'Vercel'], link: 'https://www.vaibes.pro', status: 'live' },
  { title: 'Knovia', description: 'Competitive knowledge championship. AI quiz engine, weekly brackets, leaderboards, anti-cheat mechanics.', tech: ['React', 'Supabase', 'Vercel'], link: null, status: 'soon' },
]

const STACKS = [
  { name: 'React',      category: 'Frontend'  },
  { name: 'JavaScript', category: 'Language'  },
  { name: 'Tailwind',   category: 'Styling'   },
  { name: 'Supabase',   category: 'Database'  },
  { name: 'Vite',       category: 'Tooling'   },
  { name: 'Vercel',     category: 'Deploy'    },
  { name: 'DeepSeek',   category: 'AI / LLM'  },
  { name: 'Node.js',    category: 'Runtime'   },
]

function AboutContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {[
        "Self-taught developer who pivoted into web development and within four months built and launched two fully functional SaaS products from scratch.",
        "Not a vibe coder — uses AI deliberately as a pair-programmer with strict manual oversight over all logic and security decisions.",
        "Has a lot to learn and openly acknowledges it. Seeking a mentorship-driven paid internship or junior role.",
        "Background spans 7 years of running an online business, hospitality, outbound sales, and a degree in Education — all shaping a founder mindset and user-first thinking.",
      ].map((p, i) => (
        <p key={i} style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 300, fontSize: '0.98rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.65)' }}>{p}</p>
      ))}
    </div>
  )
}

function StacksContent() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {STACKS.map((s, i) => (
        <motion.div key={s.name} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
          style={{ background: 'rgba(65,105,225,0.08)', border: '1px solid rgba(65,105,225,0.22)', borderRadius: '6px', padding: '10px 18px' }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.07em', color: '#fff' }}>{s.name}</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--purple-light)', opacity: 0.7, fontFamily: "'DM Sans',sans-serif", marginTop: '2px' }}>{s.category}</div>
        </motion.div>
      ))}
    </div>
  )
}

function ProjectsContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {PROJECTS.map((p, i) => {
        const isLive = p.status === 'live'
        const inner = (
          <motion.div key={p.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ x: isLive ? 4 : 0 }}
            style={{ background: 'rgba(255,100,0,0.06)', border: `1px solid ${isLive ? 'rgba(255,100,0,0.22)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '10px', padding: '20px 24px', opacity: isLive ? 1 : 0.6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: '1.3rem', letterSpacing: '0.06em', color: '#fff' }}>{p.title}</div>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.12em', padding: '2px 8px', borderRadius: '3px', background: isLive ? 'rgba(127,255,127,0.12)' : 'rgba(255,255,255,0.08)', color: isLive ? '#7fff7f' : 'rgba(255,255,255,0.4)' }}>
                {isLive ? '● LIVE' : '◌ SOON'}
              </span>
            </div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: '12px' }}>{p.description}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {p.tech.map(t => <span key={t} style={{ fontSize: '0.7rem', fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: '0.08em', color: '#ff6a00', background: 'rgba(255,106,0,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{t}</span>)}
            </div>
          </motion.div>
        )
        return isLive
          ? <a key={p.title} href={p.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{inner}</a>
          : <div key={p.title}>{inner}</div>
      })}
    </div>
  )
}

function ContactContent({ onClose }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.message.trim()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) { setStatus('sent'); setForm({ name: '', email: '', message: '' }); setTimeout(onClose, 2000) }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  const inp = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '11px 14px', color: '#fff', fontFamily: "'DM Sans',sans-serif", fontSize: '0.92rem', outline: 'none' }

  if (status === 'sent') return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '24px 0' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✓</div>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.1em', color: '#7fff7f' }}>MESSAGE SENT TO LOU</div>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>Closing...</div>
    </motion.div>
  )

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <input style={inp} type="text" placeholder="Your name (optional)" value={form.name} onChange={set('name')} />
      <input style={inp} type="email" placeholder="Your email (optional)" value={form.email} onChange={set('email')} />
      <textarea style={{ ...inp, minHeight: '120px', resize: 'vertical' }} placeholder="Your message *" value={form.message} onChange={set('message')} required />
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px' }}>
        <motion.button type="submit" disabled={status === 'sending'} whileHover={{ y: -2 }} whileTap={{ y: 0 }}
          style={{ background: 'linear-gradient(135deg,#ff4500,#ff8c00)', border: 'none', borderRadius: '6px', padding: '12px 36px', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: '1rem', letterSpacing: '0.1em', color: '#1a0800', cursor: 'pointer' }}>
          {status === 'sending' ? 'SENDING...' : 'SEND TO LOU'}
        </motion.button>
        {status === 'error' && <span style={{ color: '#ff7f7f', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.82rem', letterSpacing: '0.07em' }}>FAILED — TRY AGAIN</span>}
      </div>
    </form>
  )
}

// ── AI PANEL (inline desktop / bottom sheet mobile) ───────────────
function AIPanel({ onOpenContact, isMobile }) {
  const [mode, setMode] = useState('ask')
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPanel, setShowPanel] = useState(false)
  const [hoveredMode, setHoveredMode] = useState(null)
  const inputRef = useRef(null)
  const currentMode = MODES.find(m => m.id === mode)
  const modeColors = { ask: '#4169e1', vibe: '#b89aff', build: '#ff6a00' }
  const activeColor = modeColors[mode]
  const previewMode = hoveredMode || mode
  const previewColor = modeColors[previewMode]

  const submit = async (text) => {
    const query = (text || input).trim()
    if (!query || loading) return
    setLoading(true)
    setShowPanel(true)
    setResponse('')
    try {
      const res = await fetch('/api/ai-chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: query, mode }) })
      const data = await res.json()
      if (data.reply) {
        let i = 0
        const rawReply = data.reply.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/^\d+\.\s/gm, '').trim()
        const chars = rawReply
        const typeNext = () => {
          if (i < chars.length) { setResponse(chars.slice(0, i + 1)); i++; setTimeout(typeNext, 12) }
          else setLoading(false)
        }
        typeNext()
      } else { setResponse('Something went wrong. Try again.'); setLoading(false) }
    } catch { setResponse('Could not reach the server. Try again.'); setLoading(false) }
    setInput('')
  }

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }
  const handleHint = (hint) => { setInput(hint); submit(hint) }

  const responsePanel = (
    <div style={{ background: 'rgba(7,9,31,0.98)', borderTop: `2px solid ${activeColor}`, padding: '14px 16px 12px', overflowY: 'auto', maxHeight: isMobile ? '50vh' : '220px' }}>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.6rem', letterSpacing: '0.14em', color: activeColor, marginBottom: '8px', opacity: 0.8 }}>
        {mode === 'ask' ? '🤖 PORTFOLIO AI' : mode === 'vibe' ? '🎨 VIBE CHECK' : '🔧 SCOPE REPORT'}
      </div>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.82)', whiteSpace: 'pre-wrap' }}>
        {response || <span style={{ opacity: 0.4 }}>Thinking...</span>}
      </div>
      {!loading && response && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '10px', paddingBottom: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={() => { setShowPanel(false); setResponse(''); inputRef.current?.focus() }}
            style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.1em', padding: '6px 14px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
            ASK AGAIN
          </button>
          <button onClick={onOpenContact}
            style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: '0.65rem', letterSpacing: '0.1em', padding: '6px 14px', borderRadius: '4px', border: 'none', background: 'linear-gradient(135deg,#ff4500,#ff8c00)', color: '#1a0800', cursor: 'pointer' }}>
            SEND TO LOU →
          </button>
        </motion.div>
      )}
    </div>
  )

  const hintPanel = (
    <motion.div
      key={previewMode}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      style={{ padding: '8px 10px', background: 'rgba(7,9,31,0.97)', borderTop: `2px solid ${previewColor}`, display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      <div style={{ width: '100%', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.6rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', marginBottom: '2px' }}>
        {previewMode === 'ask' ? 'TRY ASKING' : previewMode === 'vibe' ? 'TRY A VIBE' : 'TRY DESCRIBING'}
      </div>
      {HINTS[previewMode].map(h => (
        <button key={h} onClick={() => { setMode(previewMode); handleHint(h) }}
          style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.06em', padding: '4px 10px', borderRadius: '20px', border: `1px solid ${previewColor}40`, background: `${previewColor}12`, color: 'rgba(255,255,255,0.65)', cursor: 'pointer' }}>
          {h}
        </button>
      ))}
    </motion.div>
  )

  return (
    <>
      {/* Mode tabs */}
      <div style={{ display: 'flex', borderTop: '1px solid rgba(0,0,0,0.2)' }}>
        {MODES.map(m => (
          <button key={m.id}
            onClick={() => { setMode(m.id); setShowPanel(false); setResponse(''); setInput(''); setHoveredMode(null) }}
            onMouseEnter={() => { if (!showPanel) setHoveredMode(m.id) }}
            onMouseLeave={() => setHoveredMode(null)}
            style={{ flex: 1, padding: '8px 4px', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.06em', border: 'none', cursor: 'pointer', background: (hoveredMode === m.id || (!hoveredMode && mode === m.id)) ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.15)', color: (hoveredMode === m.id || (!hoveredMode && mode === m.id)) ? '#fff' : 'rgba(255,255,255,0.4)', borderBottom: `2px solid ${(hoveredMode === m.id || (!hoveredMode && mode === m.id)) ? modeColors[m.id] : 'transparent'}`, transition: 'all 0.15s' }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', background: '#fff' }}>
        <input ref={inputRef}
          style={{ flex: 1, padding: '12px 14px', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.06em', border: 'none', outline: 'none', background: 'transparent', color: '#1a0800' }}
          placeholder={currentMode.placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
        />
        <button onClick={() => submit()}
          style={{ padding: '0 14px', background: 'transparent', border: 'none', cursor: 'pointer', color: loading ? '#ccc' : '#ff4500', fontSize: '1.1rem', fontWeight: 900 }}>
          {loading ? '·' : '↵'}
        </button>
      </div>

      {/* Desktop inline panels */}
      {!isMobile && (
        <AnimatePresence>
          {!showPanel && (
            <motion.div key="hints" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20, borderRadius: '0 0 14px 14px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
              {hintPanel}
            </motion.div>
          )}
          {showPanel && (
            <motion.div key="response" initial={{ opacity: 0, y: -6, scaleY: 0.95 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20, borderRadius: '0 0 14px 14px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
              {responsePanel}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Mobile bottom sheet */}
      {isMobile && (
        <AnimatePresence>
          {(showPanel || true) && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: showPanel ? 0 : '100%' }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, borderRadius: '20px 20px 0 0', overflow: 'hidden', boxShadow: '0 -8px 60px rgba(0,0,0,0.7)', paddingBottom: '0' }}>
              {/* Sheet handle */}
              <div style={{ background: 'rgba(7,9,31,0.98)', padding: '10px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: 32, height: 1 }} />
                <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
                <button onClick={() => { setShowPanel(false); setResponse('') }}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: 28, height: 28, color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              </div>
              {!showPanel ? hintPanel : responsePanel}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Mobile hint chips — shown inline below input on mobile */}
      {isMobile && !showPanel && (
        <div style={{ background: 'rgba(7,9,31,0.97)', borderTop: `2px solid ${activeColor}`, padding: '8px 10px 100px', display: 'flex', flexWrap: 'wrap', gap: '6px', borderRadius: '0 0 14px 14px' }}>
          <div style={{ width: '100%', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.6rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', marginBottom: '2px' }}>TRY ASKING</div>
          {HINTS[mode].map(h => (
            <button key={h} onClick={() => handleHint(h)}
              style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.06em', padding: '4px 10px', borderRadius: '20px', border: `1px solid ${activeColor}40`, background: `${activeColor}12`, color: 'rgba(255,255,255,0.65)', cursor: 'pointer' }}>
              {h}
            </button>
          ))}
        </div>
      )}
    </>
  )
}

// ── MAIN NAVCARD ──────────────────────────────────────────────────
const NAV = [
  { label: 'ABOUT ME',  id: 'about'    },
  { label: 'STACKS',    id: 'stacks'   },
  { label: 'PROJECTS',  id: 'projects' },
  { label: 'CONTACT',   id: 'contact'  },
]

const MODAL_CONTENT = {
  about:    { title: 'ABOUT ME',       Content: AboutContent    },
  stacks:   { title: 'STACKS',         Content: StacksContent   },
  projects: { title: 'PROJECTS',       Content: ProjectsContent },
  contact:  { title: 'SEND A MESSAGE', Content: ContactContent  },
}

export default function NavCard({ mobileWidth }) {
  const [open, setOpen] = useState(null)
  const isMobile = useIsMobile()
  const cardWidth = isMobile ? (mobileWidth || '88vw') : '260px'

  return (
    <>
      <motion.div
        style={{ background: 'linear-gradient(180deg,#ff8c00 0%,#ff6a00 30%,#ff4500 60%,#c8720a 80%,#7a2e04 100%)', borderRadius: '18px', overflow: 'visible', boxShadow: '0 8px 40px rgba(255,80,0,0.35),0 2px 8px rgba(0,0,0,0.6)', width: cardWidth, maxWidth: '420px', position: 'relative' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div style={{ borderRadius: '18px', overflow: 'hidden' }}>
          {NAV.map((item, i) => (
            <motion.button key={item.id} onClick={() => setOpen(item.id)}
              whileHover={{ y: -3, filter: 'brightness(1.12)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{ display: 'block', width: '100%', padding: isMobile ? '16px 20px' : '15px 20px', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: isMobile ? '1.25rem' : '1.15rem', letterSpacing: '0.08em', textAlign: 'center', color: '#1a0800', border: 'none', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.18)', background: `linear-gradient(180deg,hsl(${24 - i * 6},100%,${62 - i * 6}%) 0%,hsl(${22 - i * 6},100%,${54 - i * 6}%) 100%)` }}>
              {item.label}
            </motion.button>
          ))}
          <AIPanel onOpenContact={() => setOpen('contact')} isMobile={isMobile} />
        </div>
      </motion.div>

      {Object.entries(MODAL_CONTENT).map(([id, { title, Content }]) => (
        <Modal key={id} open={open === id} onClose={() => setOpen(null)} title={title}>
          <Content onClose={() => setOpen(null)} />
        </Modal>
      ))}
    </>
  )
}