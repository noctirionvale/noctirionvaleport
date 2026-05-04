import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

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
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '6px',
    padding: '12px 16px',
    color: '#fff',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <section id="contact" className="section-full" ref={ref} style={{
      background: '#06091e',
      borderTop: '1px solid rgba(65,105,225,0.12)',
    }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '80px 40px', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="display-3d" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', marginBottom: '12px' }}>
            SEND A MESSAGE
          </div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.95rem',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '40px',
          }}>
            Got something on your mind? Drop a line.
          </p>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              style={inputStyle}
              type="text"
              placeholder="Your name (optional)"
              value={form.name}
              onChange={set('name')}
            />
            <input
              style={inputStyle}
              type="email"
              placeholder="Your email (optional)"
              value={form.email}
              onChange={set('email')}
            />
            <textarea
              style={{ ...inputStyle, minHeight: '140px', resize: 'vertical' }}
              placeholder="Your message *"
              value={form.message}
              onChange={set('message')}
              required
            />
            <motion.button
              type="submit"
              disabled={status === 'sending' || status === 'sent'}
              whileHover={{ y: -3 }}
              whileTap={{ y: -1 }}
              style={{
                background: 'linear-gradient(135deg, var(--orange-hot), var(--orange-amber))',
                border: 'none',
                borderRadius: '6px',
                padding: '14px',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: '1.1rem',
                letterSpacing: '0.1em',
                color: '#1a0800',
                cursor: 'pointer',
                alignSelf: 'flex-start',
                paddingLeft: '40px',
                paddingRight: '40px',
              }}
            >
              {status === 'sending' ? 'SENDING...' : status === 'sent' ? 'SENT ✓' : 'SEND'}
            </motion.button>
            {status === 'error' && (
              <div style={{ color: '#ff7f7f', fontFamily: "'Barlow Condensed'", letterSpacing: '0.08em', fontSize: '0.85rem' }}>
                FAILED TO SEND — PLEASE TRY AGAIN
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  )
}
