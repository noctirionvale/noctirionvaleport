import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const PROJECTS = [
  // Fill in your projects — { title, description, tech: [], link }
]

export default function Projects() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="projects" className="section-full" ref={ref} style={{
      background: 'linear-gradient(180deg, #080c28 0%, #0a0e2e 100%)',
      borderTop: '1px solid rgba(65,105,225,0.12)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 40px', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="display-3d" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', marginBottom: '48px' }}>
            PROJECTS
          </div>
          {PROJECTS.length === 0 ? (
            <div style={{
              color: 'rgba(255,255,255,0.2)',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '1.1rem',
              letterSpacing: '0.08em',
              fontStyle: 'italic',
            }}>
              — PROJECTS COMING SOON —
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {PROJECTS.map((p, i) => (
                <motion.a
                  key={p.title}
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    background: 'rgba(255,100,0,0.06)',
                    border: '1px solid rgba(255,100,0,0.2)',
                    borderRadius: '12px',
                    padding: '28px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800,
                    fontSize: '1.4rem',
                    letterSpacing: '0.06em',
                    color: '#fff',
                    marginBottom: '10px',
                  }}>
                    {p.title}
                  </div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.55)',
                    lineHeight: 1.6,
                    marginBottom: '16px',
                  }}>
                    {p.description}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {p.tech?.map(t => (
                      <span key={t} style={{
                        fontSize: '0.7rem',
                        fontFamily: "'Barlow Condensed', sans-serif",
                        letterSpacing: '0.08em',
                        color: 'var(--orange-warm)',
                        background: 'rgba(255,106,0,0.12)',
                        padding: '2px 8px',
                        borderRadius: '3px',
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
