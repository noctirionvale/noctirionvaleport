import './index.css'
import Hero from './sections/Hero'
import About from './sections/About'
import Stacks from './sections/Stacks'
import Projects from './sections/Projects'
import Contact from './sections/Contact'

export default function App() {
  return (
    <main>
      <Hero />
      <About />
      <Stacks />
      <Projects />
      <Contact />
      <footer style={{
        background: '#06091e',
        borderTop: '1px solid rgba(65,105,225,0.1)',
        padding: '24px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: '0.8rem',
        letterSpacing: '0.1em',
        color: 'rgba(255,255,255,0.25)',
      }}>
        <span>NOCTIRION VALE</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </main>
  )
}