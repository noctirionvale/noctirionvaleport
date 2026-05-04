import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="section-full" ref={ref} style={{
      background: 'linear-gradient(180deg, var(--navy) 0%, #0c1135 100%)',
      borderTop: '1px solid rgba(65,105,225,0.12)',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 40px', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="display-3d" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', marginBottom: '32px' }}>
            ABOUT ME
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: '1.2rem',
            lineHeight: 1.75,
            color: 'rgba(255,255,255,0.6)',
            maxWidth: '640px',
          }}>
            {/* Content to be filled in later */}
            <span style={{ color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.06em' }}>
              — YOUR STORY GOES HERE —
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
