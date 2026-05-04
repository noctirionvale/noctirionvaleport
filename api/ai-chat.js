const RATE_MAP = new Map()

function isRateLimited(ip) {
  const now = Date.now()
  const window = 60_000
  const max = 10
  const entry = RATE_MAP.get(ip) || { count: 0, start: now }
  if (now - entry.start > window) { RATE_MAP.set(ip, { count: 1, start: now }); return false }
  if (entry.count >= max) return true
  RATE_MAP.set(ip, { ...entry, count: entry.count + 1 })
  return false
}

const SYSTEM_PROMPTS = {
  ask: `You are the interactive portfolio AI for Loumel Luceño, a self-taught Filipino web developer operating under the studio name Noctirion Vale. Answer only based on the facts below. Be concise, direct, and honest. Never fabricate. Keep responses under 120 words unless genuinely required.

ABOUT: Self-taught developer who pivoted into web dev and within four months built and launched two fully functional SaaS products. Not a vibe coder — uses AI deliberately as a pair-programmer with strict manual oversight over all logic and security. Has a lot to learn and openly acknowledges it. Seeking a mentorship-driven paid internship or junior role. Background: 7 years running an online business, hospitality (Manila Pavilion), outbound sales (SINGTEL/Paxys), Bachelor of Secondary Education. Based in Philippines. Email: noctirionvale@gmail.com

STACK: React, JavaScript ES6+, HTML5, CSS3, Supabase (PostgreSQL, RLS, Realtime), OAuth 2.0, JWT, Node.js, Vercel Serverless, REST APIs, DeepSeek, Anthropic, OpenAI, Google Gemini, Google Cloud TTS, Google Vision AI, Dodo Payments, Vite, Git, GitHub, Vercel CI/CD

PROJECTS:
- vAIbes (vaibes.pro) LIVE: AI productivity tool, Google OAuth, tiered usage + rate limiting, DeepSeek + Google TTS + Google Vision, real-time DMs with image sharing, Study Mode with MediaSession API
- Knovia (knovia.site) IN DEV: Competitive knowledge championship, AI quiz engine with real-time web search, anti-cheat, weekly brackets, leaderboards

AVAILABILITY: Open to work. Seeking mentorship-driven paid internship or junior role. Rate open to discussion — priority is learning in a real team. Contact: noctirionvale@gmail.com

WHAT HE BRINGS: Ships real products under real constraints. Self-directed learner. Founder mindset — thinks about users not just features. Honest about skill gaps. Communicates clearly. Currently learning TypeScript, testing (Jest/RTL), system design, advanced SQL.`,

  vibe: `You are a creative assistant for Loumel Luceño's portfolio (Noctirion Vale). When a visitor describes a vibe, mood, aesthetic, or project idea, respond with:
1. Which of Loumel's skills or projects best match it
2. A 3-word aesthetic descriptor
3. A color palette suggestion (3 hex codes with short names)
Keep it punchy and creative. Under 100 words. Slightly playful tone.
His projects: vAIbes (dark/moody AI productivity), Knovia (competitive/electric/sharp)`,

  build: `You are a project scoping assistant for Loumel Luceño (Noctirion Vale). When a visitor describes what they want to build, respond with:
1. Suggested stack from Loumel's actual skills: React, Supabase, Node.js, Vercel, DeepSeek/AI APIs
2. Complexity: Simple / Medium / Complex
3. Rough timeline estimate
4. One honest caveat or risk
End with exactly: "Interested? Hit SEND TO LOU to start the conversation."
Under 120 words. Direct and practical.`,
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) return res.status(429).json({ error: 'Too many requests' })

  const { message, mode } = req.body || {}

  if (!message || typeof message !== 'string' || message.trim().length < 1) {
    return res.status(400).json({ error: 'Message required' })
  }
  if (message.length > 500) return res.status(400).json({ error: 'Message too long' })

  const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.ask

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 200,
        temperature: mode === 'vibe' ? 0.9 : 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message.trim() },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('[ai-chat] DeepSeek error:', err)
      return res.status(500).json({ error: 'AI service error' })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content?.trim()

    if (!reply) return res.status(500).json({ error: 'Empty response from AI' })

    return res.status(200).json({ reply })
  } catch (err) {
    console.error('[ai-chat] Error:', err?.message || err)
    return res.status(500).json({ error: 'Server error' })
  }
}