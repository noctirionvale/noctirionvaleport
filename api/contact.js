import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const RECEIVE_EMAIL = process.env.CONTACT_EMAIL
const RATE_MAP = new Map()

function isRateLimited(ip) {
  const now = Date.now()
  const window = 60_000 // 1 minute
  const max = 3

  const entry = RATE_MAP.get(ip) || { count: 0, start: now }
  if (now - entry.start > window) {
    RATE_MAP.set(ip, { count: 1, start: now })
    return false
  }
  if (entry.count >= max) return true
  RATE_MAP.set(ip, { ...entry, count: entry.count + 1 })
  return false
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests — slow down' })
  }

  const { name, email, message } = req.body || {}

  if (!message || typeof message !== 'string' || message.trim().length < 2) {
    return res.status(400).json({ error: 'Message is required' })
  }
  if (message.trim().length > 5000) {
    return res.status(400).json({ error: 'Message too long' })
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  const safeName    = name?.slice(0, 100).trim() || null
  const safeEmail   = email?.slice(0, 200).trim() || null
  const safeMessage = message.trim()

  const subject = safeName
    ? `Portfolio message from ${safeName}`
    : 'New portfolio message'

  const html = `
    <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#07091f;color:#fff;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#ff4500,#ff8c00);padding:24px 32px;">
        <div style="font-size:22px;font-weight:800;letter-spacing:0.06em;color:#1a0800;">NOCTIRION VALE</div>
        <div style="font-size:12px;letter-spacing:0.14em;color:rgba(26,8,0,0.7);margin-top:4px;">PORTFOLIO — NEW MESSAGE</div>
      </div>
      <div style="padding:32px;">
        ${safeName  ? `<p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,0.45);letter-spacing:0.1em;">FROM</p><p style="margin:0 0 24px;font-size:16px;color:#fff;font-weight:500;">${safeName}</p>` : ''}
        ${safeEmail ? `<p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,0.45);letter-spacing:0.1em;">REPLY TO</p><p style="margin:0 0 24px;"><a href="mailto:${safeEmail}" style="color:#b89aff;font-size:16px;">${safeEmail}</a></p>` : ''}
        <p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,0.45);letter-spacing:0.1em;">MESSAGE</p>
        <div style="background:rgba(255,255,255,0.05);border-left:3px solid #ff6a00;border-radius:0 6px 6px 0;padding:16px 20px;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.85);">
          ${safeMessage.replace(/\n/g, '<br/>')}
        </div>
        <div style="margin-top:32px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:rgba(255,255,255,0.25);letter-spacing:0.1em;">
          Sent from noctirionvale.com · ${new Date().toUTCString()}
        </div>
      </div>
    </div>
  `

  try {
    await resend.emails.send({
      from: 'Noctirion Vale Portfolio <onboarding@resend.dev>',
      to: RECEIVE_EMAIL,
      subject,
      html,
      ...(safeEmail ? { replyTo: safeEmail } : {}),
    })
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('[contact] Resend error:', err?.message || err)
    return res.status(500).json({ error: 'Failed to send — try again later' })
  }
}