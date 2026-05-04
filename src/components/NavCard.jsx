import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Modal from './Modal'

const ABOUT = {
  paragraphs: [
    "Self-taught developer building products people actually use. Operating under the studio name Noctirion Vale.",
    "Still figuring out the rest.",
  ]
}

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

const PROJECTS = [
  {
    title: 'vAIbes',
    description: 'AI-powered vibes platform. Real-time DMs, background audio, and user feedback tools.',
    tech: ['React', 'Supabase', 'Vercel', 'DeepSeek'],
    link: 'https://www.vaibes.pro',
    status: 'live',
  },
  {
    title: 'Knovia',
    description: 'Competitive knowledge championship platform. Quiz rooms, real-time chat, leaderboards, weekly brackets.',
    tech: ['React', 'Supabase', 'Vercel'],
    link: null,
    status: 'soon',
  },
]

const NAV = [
  { label: 'ABOUT ME',       id: 'about'    },
  { label: 'STACKS',         id: 'stacks'   },
  { label: 'PROJECTS',       id: 'projects' },
  { label: 'SEND A MESSAGE', id: 'contact'  },
]

function AboutContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {ABOUT.paragraphs.map((p, i) => (
        <p key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: '1.05rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.65)' }}>{p}</p>
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
        const card = (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ x: isLive ? 4 : 0 }}
            style={{
              display: 'block', textDecoration: 'none',
              background: 'rgba(255,100,0,0.06)',
              border: `1px solid ${isLive ? 'rgba(255,100,0,0.22)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '10px', padding: '20px 24px',
              opacity: isLive ? 1 : 0.6,
              cursor: isLive ? 'pointer' : 'default',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1.3rem', letterSpacing: '0.06em', color: '#fff' }}>{p.title}</div>
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                fontSize: '0.65rem', letterSpacing: '0.12em',
                padding: '2px 8px', borderRadius: '3px',
                background: isLive ? 'rgba(127,255,127,0.12)' : 'rgba(255,255,255,0.08)',
                color: isLive ? '#7fff7f' : 'rgba(255,255,255,0.4)',
              }}>
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
          ? <a key={p.title} href={p.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{card}</a>
          : <div key={p.title}>{card}</div>
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
      if (res.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', message: '' })
        setTimeout(onClose, 2000)
      } else {
        const data = await res.json().catch(() => ({}))
        setStatus(data.error || 'error')
      }
    } catch { setStatus('error') }
  }

  const inp = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
    padding: '11px 14px', color: '#fff',
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.92rem', outline: 'none',
  }

  if (status === 'sent') return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      style={{ textAlign: 'center', padding: '24px 0' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✓</div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.1em', color: '#7fff7f' }}>MESSAGE SENT</div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>Closing in a moment...</div>
    </motion.div>
  )

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <input style={inp} type="text" placeholder="Your name (optional)" value={form.name} onChange={set('name')} />
      <input style={inp} type="email" placeholder="Your email (optional)" value={form.email} onChange={set('email')} />
      <textarea style={{ ...inp, minHeight: '120px', resize: 'vertical' }}
        placeholder="Your message *" value={form.message} onChange={set('message')} required />
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px' }}>
        <motion.button type="submit" disabled={status === 'sending'}
          whileHover={{ y: -2 }} whileTap={{ y: 0 }}
          style={{ background: 'linear-gradient(135deg, #ff4500, #ff8c00)', border: 'none', borderRadius: '6px', padding: '12px 36px', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1rem', letterSpacing: '0.1em', color: '#1a0800', cursor: 'pointer' }}
        >
          {status === 'sending' ? 'SENDING...' : 'SEND'}
        </motion.button>
        {status && status !== 'sending' && status !== 'sent' && (
          <span style={{ color: '#ff7f7f', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.82rem', letterSpacing: '0.07em' }}>
            FAILED — TRY AGAIN
          </span>
        )}
      </div>
    </form>
  )
}

function QuickSend() {
  const [msg, setMsg] = useState('')
  const [status, setStatus] = useState(null)

  const send = async (e) => {
    e.preventDefault()
    if (!msg.trim() || status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      })
      if (res.ok) {
        setStatus('sent'); setMsg('')
        setTimeout(() => setStatus(null), 2500)
      } else { setStatus('error'); setTimeout(() => setStatus(null), 2500) }
    } catch { setStatus('error'); setTimeout(() => setStatus(null), 2500) }
  }

  return (
    <div style={{ position: 'relative' }}>
      <form onSubmit={send}>
        <input
          style={{ width: '100%', padding: '13px 16px', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1rem', letterSpacing: '0.08em', border: 'none', outline: 'none', background: '#fff', color: status === 'sent' ? '#2a8a2a' : '#1a0800' }}
          type="text"
          placeholder={status === 'sent' ? 'SENT ✓' : status === 'error' ? 'FAILED — RETRY' : 'TYPE HERE'}
          value={msg}
          onChange={e => setMsg(e.target.value)}
          disabled={status === 'sending' || status === 'sent'}
        />
      </form>
      <AnimatePresence>
        {status === 'sending' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', bottom: '-22px', left: 0, right: 0, textAlign: 'center', fontSize: '0.7rem', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.1em', color: '#ffd070' }}
          >SENDING...</motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

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
        style={{ background: 'linear-gradient(180deg, #ff8c00 0%, #ff6a00 30%, #ff4500 60%, #c8720a 80%, #7a2e04 100%)', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(255,80,0,0.35), 0 2px 8px rgba(0,0,0,0.6)', width: '260px' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {NAV.map((item, i) => (
          <motion.button key={item.id} onClick={() => setOpen(item.id)}
            whileHover={{ y: -3, filter: 'brightness(1.12)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{ display: 'block', width: '100%', padding: '15px 20px', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1.15rem', letterSpacing: '0.08em', textAlign: 'center', color: '#1a0800', border: 'none', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.18)', background: `linear-gradient(180deg, hsl(${24 - i * 6}, 100%, ${62 - i * 6}%) 0%, hsl(${22 - i * 6}, 100%, ${54 - i * 6}%) 100%)` }}
          >
            {item.label}
          </motion.button>
        ))}
        <QuickSend />
      </motion.div>

      {Object.entries(MODAL_CONTENT).map(([id, { title, Content }]) => (
        <Modal key={id} open={open === id} onClose={() => setOpen(null)} title={title}>
          <Content onClose={() => setOpen(null)} />
        </Modal>
      ))}
    </>
  )
}