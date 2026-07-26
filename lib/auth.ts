// Admin session tokens: signed with HMAC-SHA256 using Web Crypto so the same
// code verifies in both the Node runtime (server actions) and the Edge runtime
// (proxy.ts). No external deps.

export const ADMIN_COOKIE = 'mb_admin_session'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days

const enc = new TextEncoder()

// TextEncoder / atob decoders can produce Uint8Array<ArrayBufferLike>; Web Crypto
// wants a plain BufferSource. Copy into a fresh ArrayBuffer-backed view.
function buf(bytes: Uint8Array): ArrayBuffer {
  const out = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(out).set(bytes)
  return out
}

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET
  if (!s) throw new Error('ADMIN_SESSION_SECRET is not set')
  return s
}

function b64urlEncode(bytes: Uint8Array): string {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64urlDecode(str: string): Uint8Array {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4))
  const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/') + pad)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    buf(enc.encode(getSecret())),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

/** Create a signed session token for the given admin username. */
export async function createSessionToken(username: string): Promise<string> {
  const payload = { u: username, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }
  const payloadB64 = b64urlEncode(enc.encode(JSON.stringify(payload)))
  const key = await hmacKey()
  const sig = await crypto.subtle.sign('HMAC', key, buf(enc.encode(payloadB64)))
  return `${payloadB64}.${b64urlEncode(new Uint8Array(sig))}`
}

/** Verify a session token; returns the username if valid & unexpired, else null. */
export async function verifySessionToken(token: string | undefined | null): Promise<string | null> {
  if (!token || !token.includes('.')) return null
  const [payloadB64, sigB64] = token.split('.')
  try {
    const key = await hmacKey()
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      buf(b64urlDecode(sigB64)),
      buf(enc.encode(payloadB64)),
    )
    if (!valid) return null
    const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(payloadB64)))
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return null
    return typeof payload.u === 'string' ? payload.u : null
  } catch {
    return null
  }
}

/** Constant-time-ish credential check against env vars. */
export function checkCredentials(username: string, password: string): boolean {
  const u = process.env.ADMIN_USERNAME || ''
  const p = process.env.ADMIN_PASSWORD || ''
  if (!u || !p) return false
  // Length-independent compare
  const a = enc.encode(username)
  const b = enc.encode(u)
  const c = enc.encode(password)
  const d = enc.encode(p)
  let diff = a.length ^ b.length
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a[i] || 0) ^ (b[i] || 0)
  let diff2 = c.length ^ d.length
  for (let i = 0; i < Math.max(c.length, d.length); i++) diff2 |= (c[i] || 0) ^ (d[i] || 0)
  return diff === 0 && diff2 === 0
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS
