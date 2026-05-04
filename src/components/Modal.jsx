import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(6,9,30,0.8)',
              backdropFilter: 'blur(8px)',
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative', zIndex: 10,
              background: 'linear-gradient(160deg, #0d1240 0%, #090c28 60%, #060920 100%)',
              border: '1px solid rgba(65,105,225,0.2)',
              borderRadius: '16px',
              padding: '48px',
              width: 'min(580px, 90vw)',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(65,105,225,0.1)',
            }}
          >
            {/* Corner accent lines */}
            <div style={{
              position: 'absolute', top: 16, left: 16,
              width: 24, height: 24,
              borderTop: '1px solid rgba(65,105,225,0.4)',
              borderLeft: '1px solid rgba(65,105,225,0.4)',
            }} />
            <div style={{
              position: 'absolute', top: 16, right: 16,
              width: 24, height: 24,
              borderTop: '1px solid rgba(65,105,225,0.4)',
              borderRight: '1px solid rgba(65,105,225,0.4)',
            }} />
            <div style={{
              position: 'absolute', bottom: 16, left: 16,
              width: 24, height: 24,
              borderBottom: '1px solid rgba(65,105,225,0.4)',
              borderLeft: '1px solid rgba(65,105,225,0.4)',
            }} />
            <div style={{
              position: 'absolute', bottom: 16, right: 16,
              width: 24, height: 24,
              borderBottom: '1px solid rgba(65,105,225,0.4)',
              borderRight: '1px solid rgba(65,105,225,0.4)',
            }} />

            <div style={{
              fontFamily: "'Righteous', cursive",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: '#4169e1',
              textShadow: '2px 2px 0px #1a1a6e',
              letterSpacing: '0.02em',
              marginBottom: '28px',
            }}>
              {title}
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}