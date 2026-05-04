import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Modal from './Modal'

// ── YOUR DATA ─────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the interactive portfolio AI for Loumel Luceño, a self-taught Filipino web developer operating under the studio name Noctirion Vale. Answer only based on the facts below. Be concise, direct, and honest. Never fabricate details. Keep responses under 120 words unless the question genuinely requires more.

ABOUT LOUMEL:
- Self-taught developer who pivoted into web development and within four months built and launched two fully functional SaaS products from scratch
- Not a vibe coder — uses AI deliberately as a pair-programmer for learning architectural patterns, with strict manual oversight over all logic, security, and system design
- Has a lot to learn and openly acknowledges it — currently seeking a mentorship-driven paid internship or junior role
- Background: 7 years running an online business, hospitality (Manila Pavilion), outbound sales (SINGTEL), and a Bachelor of Secondary Education degree
- Based in the Philippines
- Email: noctirionvale@gmail.com

STACK:
Frontend: React, JavaScript ES6+, HTML5, CSS3, React Router, Context API, Custom Hooks
Database & Auth: Supabase (PostgreSQL), RLS, Realtime, OAuth 2.0, JWT, SQL
Backend: Node.js, Vercel Serverless Functions, REST APIs, Cron Jobs, Webhooks
APIs: DeepSeek, Anthropic, OpenAI, Google Gemini, Google Cloud TTS, Google Vision AI, Dodo Payments
Tools: VS Code, Git, GitHub, Vercel CI/CD, npm, Browser DevTools

PROJECTS:
1. vAIbes (vaibes.pro) — LIVE — AI productivity tool with Google OAuth, tiered usage system, rate limiting, DeepSeek LLM + Google TTS + Google Vision integration, real-time DMs with image sharing, Study Mode with MediaSession API, full deployment pipeline
2. Knovia (knovia.site) — IN DEVELOPMENT — Competitive knowledge championship platform, AI-powered quiz engine with real-time web search, anti-cheat mechanisms, weekly brackets, leaderboards

AVAILABILITY:
- Open to work: YES
- Seeking: Mentorship-driven paid internship or junior role
- Rate: Open to discussion — priority is learning in a real team environment
- Contact: noctirionvale@gmail.com or use the SEND A MESSAGE button

WHAT HE BRINGS:
- Ships real products under real constraints
- Self-directed learner who documents and reflects
- Founder mindset — thinks about users, not just features
- Honest about skill gaps and committed to closing them
- Communicates clearly and asks precise questions
- Currently learning: TypeScript, testing fundamentals (Jest/RTL), system design, advanced SQL`

const VIBE_PROMPT = `You are a creative AI assistant for Loumel Luceño's portfolio (Noctirion Vale). When a visitor describes a vibe, mood, aesthetic, or project idea, you respond with:
1. Which of Loumel's skills or projects best match it
2. A 3-word aesthetic descriptor
3. A suggested color palette (3 hex codes with names)
Keep it punchy, creative, and under 100 words. Use a slightly playful tone.
Projects: vAIbes (AI productivity, dark/moody), Knovia (competitive/sharp/electric)`

const COLLAB_PROMPT = `You are a project scoping assistant for Loumel Luceño (Noctirion Vale). When a visitor describes what they want to build, respond with:
1. Suggested stack (based on Loumel's actual skills: React, Supabase, Node.js, Vercel, DeepSeek)
2. Complexity: Simple / Medium / Complex
3. Rough timeline estimate
4. One honest caveat or risk
End with exactly this line: "Interested? Hit SEND A MESSAGE to start the conversation."
Keep it under 120 words. Be direct and practical.`

const MODES = [
  { id: 'ask',   label: '🤖 ASK ME',  placeholder: 'Ask anything about Loumel...',         system: SYSTEM_PROMPT  },
  { id: 'vibe',  label: '🎨 VIBE',    placeholder: 'Describe a vibe or aesthetic...',       system: VIBE_PROMPT    },
  { id: 'build', label: '🔧 BUILD',   placeholder: 'Describe what you want to build...',    system: COLLAB_PROMPT  },
]

const HINTS = {
  ask:   ['Is he available?', 'What has he built?', 'What\'s his stack?'],
  vibe:  ['Dark & minimal', 'Playful dashboard', 'Cyberpunk SaaS'],
  build: ['A quiz platform', 'AI chat app', 'Real-time dashboard'],
}

// ── PROJECTS DATA ─────────────────────────────────────────────────
const PROJECTS = [
  {
    title: 'vAIbes',
    description: 'AI productivity tool with real-time DMs, background audio, Google OAuth, tiered usage, and three AI/cloud API integrations.',
    tech: ['React', 'Supabase', 'DeepSeek', 'Google TTS', 'Vercel'],
    link: 'https://www.vaibes.pro',
    status: 'live',
  },
  {
    title: 'Knovia',
    description: 'Competitive knowledge championship platform. AI-powered quiz engine, weekly brackets, leaderboards, anti-cheat mechanics.',
    tech: ['React', 'Supabase', 'Vercel'],
    link: null,
    status: 'soon',
  },
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

// ── MODAL CONTENTS ────────────────────────────────────────────────
function AboutContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {[
        "Self-taught developer who pivoted into web development and within four months built and launched two fully functional SaaS products from scratch. Operating under the studio name Noctirion Vale.",
        "Not a vibe coder — uses AI deliberately as a pair-programmer with strict manual oversight over all logic and security decisions.",
        "Has a lot to learn and openly acknowledges it. Currently seeking a mentorship-driven paid internship or junior role to learn industry best practices and build a lasting career in web development.",
        "Background spans 7 years of running an online business, hospitality, outbound sales, and a degree in Education — all of which shaped a founder mindset and user-first thinking.",
      ].map((p, i) => (
        <p key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: '1rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.65)' }}>{p}</p>
      ))}
    </div>
  )
}

function StacksContent() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {STACKS.map((s, i) => (
        <motion.div key={s.name}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06, duration: 0.3 }}
          style={{ background: 'rgba(65,105,225,0.08)', border: '1px solid rgba(65,105,225,0.22)', borderRadius: '6px', padding: '10px 18px' }}
        >
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.07em', color: '#fff' }}>{s.name}</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--purple-light)', opacity: 0.7, fontFamily: "'DM Sans', sans-serif", marginTop: '2px' }}>{s.category}</div>
        </motion.div>
      ))}
    </div>
  )
}

function ProjectsContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {PROJECTS.map((p, i) => {
        const isLive = p.status === 'live'
        const inner = (
          <motion.div key={p.title}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ x: isLive ? 4 : 0 }}
            style={{ background: 'rgba(255,100,0,0.06)', border: `1px solid ${isLive ? 'rgba(255,100,0,0.22)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '10px', padding: '20px 24px', opacity: isLive ? 1 : 0.6, cursor: isLive ? 'pointer' : 'default' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1.3rem', letterSpacing: '0.06em', color: '#fff' }}>{p.title}</div>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.12em', padding: '2px 8px', borderRadius: '3px', background: isLive ? 'rgba(127,255,127,0.12)' : 'rgba(255,255,255,0.08)', color: isLive ? '#7fff7f' : 'rgba(255,255,255,0.4)' }}>
                {isLive ? '● LIVE' : '◌ SOON'}
              </span>
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: '12px' }}>{p.description}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {p.tech.map(t => (
                <span key={t} style={{ fontSize: '0.7rem', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em', color: '#ff6a00', background: 'rgba(255,106,0,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{t}</span>
              ))}
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
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) { setStatus('sent'); setForm({ name: '', email: '', message: '' }); setTimeout(onClose, 2000) }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  const inp = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '11px 14px', color: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: '0.92rem', outline: 'none' }

  if (status === 'sent') return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '24px 0' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✓</div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.1em', color: '#7fff7f' }}>MESSAGE SENT TO LOU</div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>Closing in a moment...</div>
    </motion.div>
  )

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <input style={inp} type="text" placeholder="Your name (optional)" value={form.name} onChange={set('name')} />
      <input style={inp} type="email" placeholder="Your email (optional)" value={form.email} onChange={set('email')} />
      <textarea style={{ ...inp, minHeight: '120px', resize: 'vertical' }} placeholder="Your message *" value={form.message} onChange={set('message')} required />
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px' }}>
        <motion.button type="submit" disabled={status === 'sending'} whileHover={{ y: -2 }} whileTap={{ y: 0 }}
          style={{ background: 'linear-gradient(135deg, #ff4500, #ff8c00)', border: 'none', borderRadius: '6px', padding: '12px 36px', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1rem', letterSpacing: '0.1em', color: '#1a0800', cursor: 'pointer' }}>
          {status === 'sending' ? 'SENDING...' : 'SEND TO LOU'}
        </motion.button>
        {status === 'error' && <span style={{ color: '#ff7f7f', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.82rem', letterSpacing: '0.07em' }}>FAILED — TRY AGAIN</span>}
      </div>
    </form>
  )
}

// ── AI INPUT PANEL ────────────────────────────────────────────────
function AIPanel({ onOpenContact }) {
  const [mode, setMode] = useState('ask')
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPanel, setShowPanel] = useState(false)
  const inputRef = useRef(null)
  const currentMode = MODES.find(m => m.id === mode)

  const submit = async (text) => {
    const query = (text || input).trim()
    if (!query || loading) return
    setLoading(true)
    setShowPanel(true)
    setResponse('')

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, mode }),
      })
      const data = await res.json()
      if (data.reply) {
        // Typewriter effect
        let i = 0
        const chars = data.reply
        const typeNext = () => {
          if (i < chars.length) {
            setResponse(chars.slice(0, i + 1))
            i++
            setTimeout(typeNext, 12)
          } else {
            setLoading(false)
          }
        }
        typeNext()
      } else {
        setResponse('Something went wrong. Try again.')
        setLoading(false)
      }
    } catch {
      setResponse('Could not reach the server. Try again.')
      setLoading(false)
    }
    setInput('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
  }

  const handleHint = (hint) => {
    setInput(hint)
    submit(hint)
  }

  const modeColors = { ask: '#4169e1', vibe: '#b89aff', build: '#ff6a00' }
  const activeColor = modeColors[mode]

  return (
    <div style={{ position: 'relative' }}>
      {/* Mode tabs */}
      <div style={{ display: 'flex', borderTop: '1px solid rgba(0,0,0,0.2)' }}>
        {MODES.map((m) => (
          <button key={m.id} onClick={() => { setMode(m.id); setShowPanel(false); setResponse(''); setInput('') }}
            style={{
              flex: 1, padding: '8px 4px',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700, fontSize: '0.62rem',
              letterSpacing: '0.06em',
              border: 'none', cursor: 'pointer',
              background: mode === m.id ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.15)',
              color: mode === m.id ? '#fff' : 'rgba(255,255,255,0.4)',
              borderBottom: mode === m.id ? `2px solid ${activeColor}` : '2px solid transparent',
              transition: 'all 0.2s',
            }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ position: 'relative', display: 'flex', background: '#fff' }}>
        <input
          ref={inputRef}
          style={{ flex: 1, padding: '12px 14px', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.06em', border: 'none', outline: 'none', background: 'transparent', color: '#1a0800' }}
          placeholder={currentMode.placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
        />
        <button onClick={() => submit()}
          style={{ padding: '0 14px', background: 'transparent', border: 'none', cursor: 'pointer', color: loading ? '#ccc' : '#ff4500', fontSize: '1rem', fontWeight: 900 }}>
          {loading ? '...' : '↵'}
        </button>
      </div>

      {/* Hint chips — shown before first response */}
      <AnimatePresence>
        {!showPanel && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20, padding: '8px 10px', background: 'rgba(7,9,31,0.97)', borderTop: `2px solid ${activeColor}`, borderRadius: '0 0 12px 12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <div style={{ width: '100%', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.6rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', marginBottom: '2px' }}>TRY ASKING</div>
            {HINTS[mode].map(h => (
              <button key={h} onClick={() => handleHint(h)}
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.06em', padding: '4px 10px', borderRadius: '20px', border: `1px solid ${activeColor}40`, background: `${activeColor}12`, color: 'rgba(255,255,255,0.65)', cursor: 'pointer', transition: 'all 0.15s' }}>
                {h}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Response panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.95 }}
            style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20, background: 'rgba(7,9,31,0.98)', borderTop: `2px solid ${activeColor}`, borderRadius: '0 0 14px 14px', padding: '14px 16px 12px', maxHeight: '220px', overflowY: 'auto', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>

            {/* Mode label */}
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.6rem', letterSpacing: '0.14em', color: activeColor, marginBottom: '8px', opacity: 0.8 }}>
              {mode === 'ask' ? '🤖 PORTFOLIO AI' : mode === 'vibe' ? '🎨 VIBE CHECK' : '🔧 SCOPE REPORT'}
            </div>

            {/* Response text */}
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap' }}>
              {response || <span style={{ opacity: 0.4 }}>Thinking<span style={{ animation: 'blink 1s infinite' }}>...</span></span>}
            </div>

            {/* Action row */}
            {!loading && response && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button onClick={() => { setShowPanel(false); setResponse(''); inputRef.current?.focus() }}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.1em', padding: '5px 12px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                  ASK AGAIN
                </button>
                <button onClick={onOpenContact}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '0.65rem', letterSpacing: '0.1em', padding: '5px 12px', borderRadius: '4px', border: 'none', background: 'linear-gradient(135deg,#ff4500,#ff8c00)', color: '#1a0800', cursor: 'pointer' }}>
                  SEND TO LOU →
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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

export default function NavCard() {
  const [open, setOpen] = useState(null)

  return (
    <>
      <motion.div
        style={{ background: 'linear-gradient(180deg, #ff8c00 0%, #ff6a00 30%, #ff4500 60%, #c8720a 80%, #7a2e04 100%)', borderRadius: '18px', overflow: 'visible', boxShadow: '0 8px 40px rgba(255,80,0,0.35), 0 2px 8px rgba(0,0,0,0.6)', width: '260px', position: 'relative' }}
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
              style={{ display: 'block', width: '100%', padding: '15px 20px', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1.15rem', letterSpacing: '0.08em', textAlign: 'center', color: '#1a0800', border: 'none', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.18)', background: `linear-gradient(180deg, hsl(${24 - i * 6},100%,${62 - i * 6}%) 0%, hsl(${22 - i * 6},100%,${54 - i * 6}%) 100%)` }}>
              {item.label}
            </motion.button>
          ))}
          <AIPanel onOpenContact={() => setOpen('contact')} />
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