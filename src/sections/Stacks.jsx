import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const STACKS = [
  // Fill in your actual stacks
  { name: 'REACT', category: 'Frontend' },
  { name: 'NODE.JS', category: 'Backend' },
  { name: 'JAVASCRIPT', category: 'Language' },
  { name: 'TAILWIND', category: 'Styling' },
  { name: 'POSTGRESQL', category: 'Database' },
  { name: 'VERCEL', category: 'Deploy' },
]

export default function Stacks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="stacks" className="section-full" ref={ref} style={{
      background: '#080c28',
      borderTop: '1px solid rgba(65,105,225,0.12)',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 40px', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="display-3d" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', marginBottom: '40px' }}>
            STACKS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {STACKS.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                style={{
                  background: 'rgba(65,105,225,0.08)',
                  border: '1px solid rgba(65,105,225,0.2)',
                  borderRadius: '6px',
                  padding: '10px 20px',
                }}
              >
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  letterSpacing: '0.08em',
                  color: '#fff',
                }}>
                  {s.name}
                </div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.7rem',
                  color: 'var(--purple-light)',
                  opacity: 0.7,
                  marginTop: '2px',
                }}>
                  {s.category}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
